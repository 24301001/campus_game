package com.coding.platform.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.coding.platform.dto.AgentPlanDTO;
import com.coding.platform.entity.AgentPlan;
import com.coding.platform.entity.AgentPlanItem;
import com.coding.platform.entity.Problem;
import com.coding.platform.entity.SubmitRecord;
import com.coding.platform.entity.Tag;
import com.coding.platform.exception.BusinessException;
import com.coding.platform.mapper.AgentPlanItemMapper;
import com.coding.platform.mapper.AgentPlanMapper;
import com.coding.platform.utils.StatsUtil;
import com.coding.platform.vo.AgentAnalysisVO;
import com.coding.platform.vo.AgentPlanVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 题单生成器：不是「再给你一道题」，而是一份按你情况排好的计划。
 * <p>
 * 编排口径：薄弱标签加权 + 排除已通过 + 难度不跳档（顺序按难度递增切块，天的难度边界最多升一档）。
 * 生成过程完全确定、可解释——每题一句入选理由；大模型只负责把摘要写顺。
 */
@Service
public class AgentPlanService {

    @Autowired
    private AgentPlanMapper planMapper;

    @Autowired
    private AgentPlanItemMapper planItemMapper;

    @Autowired
    private ProblemService problemService;

    @Autowired
    private TagService tagService;

    @Autowired
    private SubmitRecordService submitRecordService;

    @Autowired
    private AgentAnalysisService analysisService;

    @Transactional
    public AgentPlanVO buildPlan(Long userId, AgentPlanDTO dto) {
        int days = dto != null && dto.getDays() != null ? clamp(dto.getDays(), 1, 30) : 7;
        int dailyCount = dto != null && dto.getDailyCount() != null ? clamp(dto.getDailyCount(), 1, 8) : 3;
        String goal = dto != null && dto.getGoal() != null && !dto.getGoal().trim().isEmpty()
                ? dto.getGoal().trim() : "补短板";

        AgentAnalysisVO analysis = analysisService.analyze(userId);
        List<String> weakTags = analysis.getWeakTags();

        Set<Long> solvedIds = loadSolvedProblemIds(userId);
        Set<Long> attemptedIds = loadAttemptedProblemIds(userId);

        List<Problem> candidates = problemService.list(new LambdaQueryWrapper<Problem>()
                        .eq(Problem::getStatus, 1)
                        .orderByAsc(Problem::getId))
                .stream()
                .filter(problem -> !solvedIds.contains(problem.getId()))
                .collect(Collectors.toList());

        if (candidates.isEmpty()) {
            return emptyPlan(goal, days, dailyCount,
                    "题库里已经没有你没做过的题了——你已经把能刷的都刷完了，换我来出题吧。");
        }

        // 候选带上标签与「薄弱/没做过/做过没过」三个信号
        List<Candidate> pool = new ArrayList<>();
        for (Problem problem : candidates) {
            Candidate candidate = new Candidate();
            candidate.problem = problem;
            candidate.difficultyRank = difficultyRank(problem.getDifficulty());
            candidate.tags = tagService.getTagsByProblemId(problem.getId());
            candidate.tagNames = candidate.tags.stream().map(Tag::getName).collect(Collectors.toList());
            candidate.weakHit = candidate.tagNames.stream().anyMatch(weakTags::contains);
            candidate.attemptedButNotSolved = attemptedIds.contains(problem.getId());
            pool.add(candidate);
        }

        int totalItems = days * dailyCount;
        // 难度配额：40% 简单 / 40% 中等 / 剩下的困难（不够的从后面顺延），
        // 保证难度递进、不跳档，也不至于整份题单都卡在简单档
        int easyQuota = (int) Math.ceil(totalItems * 0.4);
        int mediumQuota = (int) Math.ceil(totalItems * 0.8);

        List<Candidate> picked = new ArrayList<>();
        picked.addAll(take(pool, 0, easyQuota));
        picked.addAll(take(pool, 1, mediumQuota - picked.size()));
        picked.addAll(take(pool, 2, totalItems - picked.size()));
        // 还有缺口（某一档题不够）就从剩余里继续补，仍然保持难度顺序
        if (picked.size() < totalItems) {
            List<Candidate> rest = new ArrayList<>(pool);
            rest.removeAll(picked);
            rest.sort(candidateComparator());
            for (Candidate candidate : rest) {
                if (picked.size() >= totalItems) {
                    break;
                }
                picked.add(candidate);
            }
        }
        // 最终仍按难度递增排列 —— 这就是「难度不跳档」
        picked.sort(candidateComparator());

        if (picked.isEmpty()) {
            return emptyPlan(goal, days, dailyCount, "暂时排不出题单：候选题目不够。");
        }

        int actualDays = (int) Math.ceil(picked.size() / (double) dailyCount);

        AgentPlan plan = new AgentPlan();
        plan.setUserId(userId);
        plan.setGoal(goal);
        plan.setDailyCount(dailyCount);
        plan.setDays(actualDays);
        plan.setSummary(buildSummary(goal, actualDays, dailyCount, picked, weakTags));
        plan.setCreateTime(LocalDateTime.now());
        plan.setUpdateTime(LocalDateTime.now());
        planMapper.insert(plan);

        List<AgentPlanVO.DayVO> dayList = new ArrayList<>();
        for (int day = 0; day < actualDays; day++) {
            AgentPlanVO.DayVO dayVO = new AgentPlanVO.DayVO();
            dayVO.setDayIndex(day + 1);
            List<AgentPlanVO.ItemVO> items = new ArrayList<>();
            for (int order = 0; order < dailyCount; order++) {
                int index = day * dailyCount + order;
                if (index >= picked.size()) {
                    break;
                }
                Candidate candidate = picked.get(index);

                AgentPlanItem item = new AgentPlanItem();
                item.setPlanId(plan.getId());
                item.setUserId(userId);
                item.setDayIndex(day + 1);
                item.setOrderIndex(order + 1);
                item.setProblemId(candidate.problem.getId());
                item.setReason(buildReason(candidate, weakTags));
                item.setDone(0);
                item.setCreateTime(LocalDateTime.now());
                planItemMapper.insert(item);

                AgentPlanVO.ItemVO itemVO = new AgentPlanVO.ItemVO();
                itemVO.setItemId(item.getId());
                itemVO.setProblemId(candidate.problem.getId());
                itemVO.setTitle(candidate.problem.getTitle());
                itemVO.setDifficulty(candidate.problem.getDifficulty());
                itemVO.setTags(candidate.tagNames);
                itemVO.setReason(item.getReason());
                itemVO.setDone(false);
                items.add(itemVO);
            }
            dayVO.setItems(items);
            dayVO.setFocus(buildDayFocus(items, weakTags));
            dayList.add(dayVO);
        }

        AgentPlanVO vo = toVO(plan, dayList);
        vo.setSummary(plan.getSummary());
        return vo;
    }

    public AgentPlanVO getLatestPlan(Long userId) {
        AgentPlan plan = planMapper.selectOne(new LambdaQueryWrapper<AgentPlan>()
                .eq(AgentPlan::getUserId, userId)
                .orderByDesc(AgentPlan::getId)
                .last("LIMIT 1"));
        if (plan == null) {
            return null;
        }
        List<AgentPlanItem> items = planItemMapper.selectList(new LambdaQueryWrapper<AgentPlanItem>()
                .eq(AgentPlanItem::getPlanId, plan.getId())
                .orderByAsc(AgentPlanItem::getDayIndex)
                .orderByAsc(AgentPlanItem::getOrderIndex));
        return toVO(plan, buildDayListFromItems(items));
    }

    @Transactional
    public void markItemDone(Long userId, Long itemId, boolean done) {
        AgentPlanItem item = planItemMapper.selectById(itemId);
        if (item == null || !userId.equals(item.getUserId())) {
            throw new BusinessException("题单条目不存在");
        }
        item.setDone(done ? 1 : 0);
        planItemMapper.updateById(item);
    }

    // ------------------------------------------------------------------ 内部实现

    private List<AgentPlanVO.DayVO> buildDayListFromItems(List<AgentPlanItem> items) {
        Map<Long, Problem> problemCache = new HashMap<>();
        Map<Integer, List<AgentPlanVO.ItemVO>> grouped = new HashMap<>();
        for (AgentPlanItem item : items) {
            Problem problem = problemCache.computeIfAbsent(item.getProblemId(), problemService::getById);
            AgentPlanVO.ItemVO vo = new AgentPlanVO.ItemVO();
            vo.setItemId(item.getId());
            vo.setProblemId(item.getProblemId());
            if (problem != null) {
                vo.setTitle(problem.getTitle());
                vo.setDifficulty(problem.getDifficulty());
            }
            vo.setTags(tagService.getTagsByProblemId(item.getProblemId())
                    .stream().map(Tag::getName).collect(Collectors.toList()));
            vo.setReason(item.getReason());
            vo.setDone(item.getDone() != null && item.getDone() == 1);
            grouped.computeIfAbsent(item.getDayIndex(), key -> new ArrayList<>()).add(vo);
        }

        List<AgentPlanVO.DayVO> dayList = new ArrayList<>();
        for (Map.Entry<Integer, List<AgentPlanVO.ItemVO>> entry : grouped.entrySet()) {
            AgentPlanVO.DayVO dayVO = new AgentPlanVO.DayVO();
            dayVO.setDayIndex(entry.getKey());
            dayVO.setItems(entry.getValue());
            dayVO.setFocus(buildDayFocus(entry.getValue(), new ArrayList<>()));
            dayList.add(dayVO);
        }
        dayList.sort(Comparator.comparing(AgentPlanVO.DayVO::getDayIndex));
        return dayList;
    }

    private AgentPlanVO toVO(AgentPlan plan, List<AgentPlanVO.DayVO> dayList) {
        AgentPlanVO vo = new AgentPlanVO();
        vo.setId(plan.getId());
        vo.setGoal(plan.getGoal());
        vo.setDailyCount(plan.getDailyCount());
        vo.setDays(plan.getDays());
        vo.setSummary(plan.getSummary());
        vo.setDayList(dayList);
        return vo;
    }

    private AgentPlanVO emptyPlan(String goal, int days, int dailyCount, String summary) {
        AgentPlanVO vo = new AgentPlanVO();
        vo.setGoal(goal);
        vo.setDays(days);
        vo.setDailyCount(dailyCount);
        vo.setSummary(summary);
        vo.setDayList(new ArrayList<>());
        return vo;
    }

    private List<Candidate> take(List<Candidate> pool, int difficultyRank, int quota) {
        List<Candidate> result = new ArrayList<>();
        if (quota <= 0) {
            return result;
        }
        List<Candidate> bucket = pool.stream()
                .filter(candidate -> candidate.difficultyRank == difficultyRank)
                .filter(candidate -> !candidate.used)
                .sorted(candidateComparator())
                .collect(Collectors.toList());
        for (Candidate candidate : bucket) {
            if (result.size() >= quota) {
                break;
            }
            candidate.used = true;
            result.add(candidate);
        }
        return result;
    }

    private Comparator<Candidate> candidateComparator() {
        // 薄弱标签优先 → 做过但没过的优先 → 难度 → 题号
        return Comparator
                .comparing((Candidate candidate) -> candidate.weakHit ? 0 : 1)
                .thenComparing(candidate -> candidate.attemptedButNotSolved ? 0 : 1)
                .thenComparingInt(candidate -> candidate.difficultyRank)
                .thenComparingLong(candidate -> candidate.problem.getId());
    }

    private String buildReason(Candidate candidate, List<String> weakTags) {
        StringBuilder sb = new StringBuilder();
        String hitTag = candidate.tagNames.stream().filter(weakTags::contains).findFirst().orElse(null);
        if (hitTag != null) {
            sb.append("薄弱标签「").append(hitTag).append("」");
        } else if (!candidate.tagNames.isEmpty()) {
            sb.append("标签「").append(candidate.tagNames.get(0)).append("」");
        } else {
            sb.append("综合训练");
        }
        sb.append(candidate.attemptedButNotSolved ? " + 上次没过，回去把它收掉" : " + 你还没做过");
        sb.append(" + ").append(difficultyCn(candidate.problem.getDifficulty())).append("，难度递进不跳档");
        return sb.toString();
    }

    private String buildDayFocus(List<AgentPlanVO.ItemVO> items, List<String> weakTags) {
        if (items.isEmpty()) {
            return "休息";
        }
        for (AgentPlanVO.ItemVO item : items) {
            if (item.getTags() != null) {
                for (String tag : item.getTags()) {
                    if (weakTags.contains(tag)) {
                        return "重点补「" + tag + "」";
                    }
                }
            }
        }
        boolean allEasy = items.stream().allMatch(item -> "EASY".equals(item.getDifficulty()));
        if (allEasy) {
            return "打地基";
        }
        boolean hasHard = items.stream().anyMatch(item -> "HARD".equals(item.getDifficulty()));
        return hasHard ? "上强度" : "难度递进";
    }

    private String buildSummary(String goal, int days, int dailyCount, List<Candidate> picked,
                                List<String> weakTags) {
        Set<String> difficultyPath = new java.util.LinkedHashSet<>();
        for (Candidate candidate : picked) {
            difficultyPath.add(candidate.problem.getDifficulty());
        }
        String weakPart = weakTags.isEmpty() ? "均衡覆盖" : String.join("」「", weakTags);
        return "按你的画像排了 " + days + " 天 × 每天 " + dailyCount + " 题（目标：" + goal + "）："
                + "优先补「" + weakPart + "」这些标签，排除你已经通过过的题，"
                + "难度按 " + String.join(" → ", difficultyPath.stream().map(this::difficultyCn).collect(Collectors.toList()))
                + " 递进，不跳档。做完一天可以让我重算。";
    }

    private Set<Long> loadSolvedProblemIds(Long userId) {
        return submitRecordService.list(new LambdaQueryWrapper<SubmitRecord>()
                        .eq(SubmitRecord::getUserId, userId)
                        .eq(SubmitRecord::getStatus, "ACCEPTED"))
                .stream().map(SubmitRecord::getProblemId).collect(Collectors.toSet());
    }

    private Set<Long> loadAttemptedProblemIds(Long userId) {
        return new HashSet<>(submitRecordService.list(new LambdaQueryWrapper<SubmitRecord>()
                        .eq(SubmitRecord::getUserId, userId))
                .stream().map(SubmitRecord::getProblemId).collect(Collectors.toSet()));
    }

    private int difficultyRank(String difficulty) {
        if ("HARD".equals(difficulty)) {
            return 2;
        }
        if ("MEDIUM".equals(difficulty)) {
            return 1;
        }
        return 0;
    }

    private String difficultyCn(String difficulty) {
        if ("HARD".equals(difficulty)) {
            return "困难";
        }
        if ("MEDIUM".equals(difficulty)) {
            return "中等";
        }
        return "简单";
    }

    private int clamp(int value, int min, int max) {
        return Math.max(min, Math.min(max, value));
    }

    private static class Candidate {
        private Problem problem;
        private List<Tag> tags;
        private List<String> tagNames;
        private int difficultyRank;
        private boolean weakHit;
        private boolean attemptedButNotSolved;
        private boolean used;
    }

}
