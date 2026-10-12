package com.coding.platform.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.coding.platform.common.Result;
import com.coding.platform.entity.*;
import com.coding.platform.mapper.*;
import com.coding.platform.vo.UserStatsVO;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserProfileService extends ServiceImpl<UserMapper, User> {

    private final FollowMapper followMapper;
    private final ProblemViewMapper problemViewMapper;
    private final CommentLikeMapper commentLikeMapper;
    private final NoteMapper noteMapper;
    private final SubmitRecordMapper submitRecordMapper;
    private final CollectMapper collectMapper;
    private final ProblemMapper problemMapper;
    private final CategoryMapper categoryMapper;

    public Result<UserStatsVO> getUserProfile(Long targetUserId, Long currentUserId) {
        User targetUser = getById(targetUserId);
        if (targetUser == null) {
            return Result.error("用户不存在");
        }

        UserStatsVO vo = new UserStatsVO();
        
        vo.setUserId(targetUser.getId());
        vo.setUsername(targetUser.getUsername());
        vo.setNickname(targetUser.getNickname());
        vo.setAvatar(targetUser.getAvatar());
        vo.setGender(targetUser.getGender());
        vo.setIpAddress(targetUser.getIpAddress());
        vo.setBio(targetUser.getBio());
        vo.setCreateTime(targetUser.getCreateTime());
        
        vo.setScore(targetUser.getScore() != null ? targetUser.getScore() : 0);
        vo.setViewCount(targetUser.getViewCount() != null ? targetUser.getViewCount() : 0);
        vo.setLikeCount(targetUser.getLikeCount() != null ? targetUser.getLikeCount() : 0);
        vo.setFollowersCount(targetUser.getFollowersCount() != null ? targetUser.getFollowersCount() : 0);
        vo.setFollowingCount(targetUser.getFollowingCount() != null ? targetUser.getFollowingCount() : 0);
        
        Long totalProblemsInDB = problemMapper.selectCount(new LambdaQueryWrapper<Problem>().eq(Problem::getStatus, 1));
        vo.setTotalProblemsInDB(totalProblemsInDB.intValue());
        
        Long easyInDB = problemMapper.selectCount(new LambdaQueryWrapper<Problem>().eq(Problem::getStatus, 1).eq(Problem::getDifficulty, "EASY"));
        Long mediumInDB = problemMapper.selectCount(new LambdaQueryWrapper<Problem>().eq(Problem::getStatus, 1).eq(Problem::getDifficulty, "MEDIUM"));
        Long hardInDB = problemMapper.selectCount(new LambdaQueryWrapper<Problem>().eq(Problem::getStatus, 1).eq(Problem::getDifficulty, "HARD"));
        vo.setEasyProblemsInDB(easyInDB.intValue());
        vo.setMediumProblemsInDB(mediumInDB.intValue());
        vo.setHardProblemsInDB(hardInDB.intValue());
        
        Map<String, Integer> userAcceptedStats = getUserAcceptedStatsByDifficulty(targetUserId);
        vo.setAcceptedProblems(userAcceptedStats.get("total"));
        
        Map<String, Integer> userSubmittedStats = getUserSubmittedStatsByDifficulty(targetUserId);
        vo.setEasyCount(userSubmittedStats.get("EASY"));
        vo.setMediumCount(userSubmittedStats.get("MEDIUM"));
        vo.setHardCount(userSubmittedStats.get("HARD"));
        vo.setTotalProblems(totalProblemsInDB.intValue());
        
        int totalSubmitted = getTotalSubmittedProblems(targetUserId);
        vo.setTotalSubmittedProblems(totalSubmitted);
        
        if (vo.getTotalProblems() > 0) {
            vo.setAccuracyRate(Math.round(vo.getAcceptedProblems() * 100.0 / vo.getTotalProblems() * 100) / 100.0);
        } else {
            vo.setAccuracyRate(0.0);
        }
        
        if (currentUserId != null && !currentUserId.equals(targetUserId)) {
            LambdaQueryWrapper<Follow> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(Follow::getFollowerId, currentUserId)
                  .eq(Follow::getFollowingId, targetUserId);
            vo.setIsFollowing(followMapper.selectCount(wrapper) > 0);
        } else {
            vo.setIsFollowing(null);
        }
        
        int rank = calculateRank(targetUserId);
        vo.setRank(rank);
        
        long totalUsers = count(new LambdaQueryWrapper<>());
        vo.setTotalUsers((int) totalUsers);
        
        vo.setRecentSubmissions(getRecentSubmissions(targetUserId));
        vo.setFavoriteProblems(getFavoriteProblems(targetUserId));
        vo.setComments(getUserComments(targetUserId));
        vo.setCategoryStats(getCategoryStats(targetUserId));
        vo.setYearlyActivity(getYearlyActivity(targetUserId));
        vo.setBadges(getUserBadges(targetUserId));

        return Result.success(vo);
    }
    
    private int calculateRank(Long userId) {
        List<User> users = list(new LambdaQueryWrapper<User>()
                .orderByDesc(User::getAcceptedProblems)
                .last("LIMIT 10000"));
        
        for (int i = 0; i < users.size(); i++) {
            if (users.get(i).getId().equals(userId)) {
                return i + 1;
            }
        }
        return (int) (count(new LambdaQueryWrapper<>()) + 1);
    }
    
    private Map<String, Integer> getUserAcceptedStatsByDifficulty(Long userId) {
        Map<String, Integer> stats = new HashMap<>();
        stats.put("total", 0);
        stats.put("EASY", 0);
        stats.put("MEDIUM", 0);
        stats.put("HARD", 0);
        
        LambdaQueryWrapper<SubmitRecord> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SubmitRecord::getUserId, userId)
              .eq(SubmitRecord::getStatus, "ACCEPTED");
        
        List<SubmitRecord> records = submitRecordMapper.selectList(wrapper);
        
        Set<Long> acceptedProblemIds = new HashSet<>();
        for (SubmitRecord record : records) {
            if (!acceptedProblemIds.contains(record.getProblemId())) {
                acceptedProblemIds.add(record.getProblemId());
                Problem problem = problemMapper.selectById(record.getProblemId());
                if (problem != null && problem.getDifficulty() != null) {
                    String difficulty = problem.getDifficulty();
                    stats.merge(difficulty, 1, Integer::sum);
                    stats.merge("total", 1, Integer::sum);
                }
            }
        }
        
        return stats;
    }
    
    private Map<String, Integer> getUserSubmittedStatsByDifficulty(Long userId) {
        Map<String, Integer> stats = new HashMap<>();
        stats.put("total", 0);
        stats.put("EASY", 0);
        stats.put("MEDIUM", 0);
        stats.put("HARD", 0);
        
        LambdaQueryWrapper<SubmitRecord> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SubmitRecord::getUserId, userId);
        
        List<SubmitRecord> records = submitRecordMapper.selectList(wrapper);
        
        Set<Long> submittedProblemIds = new HashSet<>();
        for (SubmitRecord record : records) {
            if (!submittedProblemIds.contains(record.getProblemId())) {
                submittedProblemIds.add(record.getProblemId());
                Problem problem = problemMapper.selectById(record.getProblemId());
                if (problem != null && problem.getDifficulty() != null) {
                    String difficulty = problem.getDifficulty();
                    stats.merge(difficulty, 1, Integer::sum);
                    stats.merge("total", 1, Integer::sum);
                }
            }
        }
        
        return stats;
    }
    
    private int getTotalSubmittedProblems(Long userId) {
        LambdaQueryWrapper<SubmitRecord> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SubmitRecord::getUserId, userId);
        
        List<SubmitRecord> records = submitRecordMapper.selectList(wrapper);
        
        Set<Long> uniqueProblemIds = new HashSet<>();
        for (SubmitRecord record : records) {
            uniqueProblemIds.add(record.getProblemId());
        }
        
        return uniqueProblemIds.size();
    }

    private List<UserStatsVO.RecentSubmissionVO> getRecentSubmissions(Long userId) {
        LambdaQueryWrapper<SubmitRecord> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SubmitRecord::getUserId, userId)
              .eq(SubmitRecord::getStatus, "ACCEPTED")
              .orderByDesc(SubmitRecord::getCreateTime);
        
        List<SubmitRecord> records = submitRecordMapper.selectList(wrapper);
        
        Set<Long> seenProblemIds = new HashSet<>();
        List<UserStatsVO.RecentSubmissionVO> result = new ArrayList<>();
        
        for (SubmitRecord record : records) {
            if (seenProblemIds.contains(record.getProblemId())) {
                continue;
            }
            seenProblemIds.add(record.getProblemId());
            
            UserStatsVO.RecentSubmissionVO vo = new UserStatsVO.RecentSubmissionVO();
            vo.setProblemId(record.getProblemId());
            
            Problem problem = problemMapper.selectById(record.getProblemId());
            if (problem != null) {
                vo.setTitle(problem.getTitle());
                vo.setDifficulty(problem.getDifficulty());
            }
            vo.setSubmitTime(record.getCreateTime());
            vo.setStatus(record.getStatus());
            
            result.add(vo);
            
            if (result.size() >= 20) {
                break;
            }
        }
        
        return result;
    }

    private List<UserStatsVO.FavoriteProblemVO> getFavoriteProblems(Long userId) {
        LambdaQueryWrapper<Collect> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Collect::getUserId, userId)
              .orderByDesc(Collect::getCreateTime);
        
        List<Collect> collects = collectMapper.selectList(wrapper);
        
        Set<Long> seenProblemIds = new HashSet<>();
        List<UserStatsVO.FavoriteProblemVO> result = new ArrayList<>();
        
        for (Collect collect : collects) {
            if (seenProblemIds.contains(collect.getProblemId())) {
                continue;
            }
            seenProblemIds.add(collect.getProblemId());
            
            UserStatsVO.FavoriteProblemVO vo = new UserStatsVO.FavoriteProblemVO();
            vo.setProblemId(collect.getProblemId());
            
            Problem problem = problemMapper.selectById(collect.getProblemId());
            if (problem != null) {
                vo.setTitle(problem.getTitle());
                vo.setDifficulty(problem.getDifficulty());
            }
            vo.setCollectTime(collect.getCreateTime());
            result.add(vo);
        }
        
        return result;
    }

    private List<UserStatsVO.UserCommentVO> getUserComments(Long userId) {
        LambdaQueryWrapper<Note> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Note::getUserId, userId)
              .orderByDesc(Note::getCreateTime);
        
        List<Note> notes = noteMapper.selectList(wrapper);
        
        Set<Long> seenNoteIds = new HashSet<>();
        List<UserStatsVO.UserCommentVO> result = new ArrayList<>();
        
        for (Note note : notes) {
            if (seenNoteIds.contains(note.getId())) {
                continue;
            }
            seenNoteIds.add(note.getId());
            
            UserStatsVO.UserCommentVO vo = new UserStatsVO.UserCommentVO();
            vo.setNoteId(note.getId());
            vo.setProblemId(note.getProblemId());
            vo.setContent(note.getContent());
            vo.setLikeCount(note.getLikeCount() != null ? note.getLikeCount() : 0);
            vo.setCreateTime(note.getCreateTime());
            
            Problem problem = problemMapper.selectById(note.getProblemId());
            if (problem != null) {
                vo.setProblemTitle(problem.getTitle());
            }
            result.add(vo);
        }
        
        return result;
    }

    private Map<String, Double> getCategoryStats(Long userId) {
        Map<String, Double> stats = new LinkedHashMap<>();
        
        List<Category> categories = categoryMapper.selectList(new LambdaQueryWrapper<>());
        
        LambdaQueryWrapper<SubmitRecord> allWrapper = new LambdaQueryWrapper<>();
        allWrapper.eq(SubmitRecord::getUserId, userId);
        List<SubmitRecord> allRecords = submitRecordMapper.selectList(allWrapper);
        
        Map<Long, Set<Long>> submittedByCategory = new HashMap<>();
        Map<Long, Set<Long>> acceptedByCategory = new HashMap<>();
        
        for (Category category : categories) {
            submittedByCategory.put(category.getId(), new HashSet<>());
            acceptedByCategory.put(category.getId(), new HashSet<>());
        }
        
        for (SubmitRecord record : allRecords) {
            Problem problem = problemMapper.selectById(record.getProblemId());
            if (problem != null && problem.getCategoryId() != null) {
                Long catId = problem.getCategoryId();
                if (submittedByCategory.containsKey(catId)) {
                    submittedByCategory.get(catId).add(record.getProblemId());
                    if ("ACCEPTED".equals(record.getStatus())) {
                        acceptedByCategory.get(catId).add(record.getProblemId());
                    }
                }
            }
        }
        
        for (Category category : categories) {
            Set<Long> submitted = submittedByCategory.get(category.getId());
            Set<Long> accepted = acceptedByCategory.get(category.getId());
            
            if (submitted.isEmpty()) {
                stats.put(category.getName(), 0.0);
            } else {
                double rate = Math.round((double) accepted.size() / submitted.size() * 100.0 * 10) / 10.0;
                stats.put(category.getName(), rate);
            }
        }
        
        return stats;
    }

    private List<UserStatsVO.DailyActivityVO> getYearlyActivity(Long userId) {
        LocalDateTime oneYearAgo = LocalDateTime.now().minusYears(1);
        
        LambdaQueryWrapper<SubmitRecord> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SubmitRecord::getUserId, userId)
              .ge(SubmitRecord::getCreateTime, oneYearAgo);
        
        List<SubmitRecord> records = submitRecordMapper.selectList(wrapper);
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        
        Map<String, Long> grouped = records.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getCreateTime().format(formatter),
                        Collectors.counting()
                ));
        
        return grouped.entrySet().stream()
                .map(entry -> {
                    UserStatsVO.DailyActivityVO vo = new UserStatsVO.DailyActivityVO();
                    vo.setDate(entry.getKey());
                    vo.setCount(entry.getValue().intValue());
                    return vo;
                })
                .sorted(Comparator.comparing(UserStatsVO.DailyActivityVO::getDate))
                .collect(Collectors.toList());
    }

    @Transactional
    public Result<String> followUser(Long followerId, Long followingId) {
        if (followerId.equals(followingId)) {
            return Result.error("不能关注自己");
        }
        
        User followingUser = getById(followingId);
        if (followingUser == null) {
            return Result.error("目标用户不存在");
        }
        
        LambdaQueryWrapper<Follow> existWrapper = new LambdaQueryWrapper<>();
        existWrapper.eq(Follow::getFollowerId, followerId)
                   .eq(Follow::getFollowingId, followingId);
        
        if (followMapper.selectCount(existWrapper) > 0) {
            followMapper.delete(existWrapper);
            
            if (followingUser.getFollowersCount() != null && followingUser.getFollowersCount() > 0) {
                followingUser.setFollowersCount(followingUser.getFollowersCount() - 1);
            }
            updateById(followingUser);
            
            return Result.success(null, "取消关注成功");
        } else {
            Follow follow = new Follow();
            follow.setFollowerId(followerId);
            follow.setFollowingId(followingId);
            follow.setCreateTime(LocalDateTime.now());
            followMapper.insert(follow);
            
            followingUser.setFollowersCount(
                (followingUser.getFollowersCount() != null ? followingUser.getFollowersCount() : 0) + 1
            );
            updateById(followingUser);
            
            return Result.success(null, "关注成功");
        }
    }

    @Transactional
    public Result<String> recordView(Long userId, Long problemId) {
        ProblemView view = new ProblemView();
        view.setUserId(userId);
        view.setProblemId(problemId);
        view.setViewTime(LocalDateTime.now());
        problemViewMapper.insert(view);
        
        User user = getById(userId);
        if (user != null) {
            user.setViewCount((user.getViewCount() != null ? user.getViewCount() : 0) + 1);
            updateById(user);
        }
        
        return Result.success();
    }

    @Transactional
    public Result<String> likeComment(Long userId, Long noteId) {
        LambdaQueryWrapper<CommentLike> existWrapper = new LambdaQueryWrapper<>();
        existWrapper.eq(CommentLike::getUserId, userId)
                   .eq(CommentLike::getNoteId, noteId);
        
        Note note = noteMapper.selectById(noteId);
        if (note == null) {
            return Result.error("评论不存在");
        }
        
        if (commentLikeMapper.selectCount(existWrapper) > 0) {
            commentLikeMapper.delete(existWrapper);
            
            if (note.getLikeCount() != null && note.getLikeCount() > 0) {
                note.setLikeCount(note.getLikeCount() - 1);
            }
            noteMapper.updateById(note);
            
            User commentUser = getById(note.getUserId());
            if (commentUser != null && commentUser.getLikeCount() != null && commentUser.getLikeCount() > 0) {
                commentUser.setLikeCount(commentUser.getLikeCount() - 1);
                updateById(commentUser);
            }
            
            return Result.success(null, "取消点赞");
        } else {
            CommentLike like = new CommentLike();
            like.setUserId(userId);
            like.setNoteId(noteId);
            like.setCreateTime(LocalDateTime.now());
            commentLikeMapper.insert(like);
            
            note.setLikeCount((note.getLikeCount() != null ? note.getLikeCount() : 0) + 1);
            noteMapper.updateById(note);
            
            User commentUser = getById(note.getUserId());
            if (commentUser != null) {
                commentUser.setLikeCount(
                    (commentUser.getLikeCount() != null ? commentUser.getLikeCount() : 0) + 1
                );
                updateById(commentUser);
            }
            
            return Result.success(null, "点赞成功");
        }
    }

    public Result<List<Map<String, Object>>> getRankings(Integer page, Integer size) {
        page = (page == null || page < 1) ? 1 : page;
        size = (size == null || size < 1) ? 20 : size;
        size = Math.min(size, 100);
        
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByDesc(User::getAcceptedProblems)
              .eq(User::getStatus, 1)
              .last("LIMIT " + ((page - 1) * size) + ", " + size);
        
        List<User> users = list(wrapper);
        
        List<Map<String, Object>> result = new ArrayList<>();
        int baseRank = (page - 1) * size + 1;
        
        for (int i = 0; i < users.size(); i++) {
            User user = users.get(i);
            Map<String, Object> item = new HashMap<>();
            item.put("rank", baseRank + i);
            item.put("userId", user.getId());
            item.put("username", user.getUsername());
            item.put("nickname", user.getNickname());
            item.put("avatar", user.getAvatar());
            item.put("score", user.getScore() != null ? user.getScore() : 0);
            item.put("acceptedProblems", user.getAcceptedProblems() != null ? user.getAcceptedProblems() : 0);
            result.add(item);
        }
        
        return Result.success(result);
    }

    private List<UserStatsVO.BadgeVO> getUserBadges(Long userId) {
        List<UserStatsVO.BadgeVO> badges = new ArrayList<>();
        
        UserStatsVO.BadgeVO journeyStart = new UserStatsVO.BadgeVO();
        journeyStart.setId("journey_start");
        journeyStart.setName("征途开始");
        journeyStart.setDescription("开启编程之旅的第一步");
        journeyStart.setIcon("🚀");
        journeyStart.setUnlocked(true);
        journeyStart.setUnlockTime(null);
        badges.add(journeyStart);

        UserStatsVO.BadgeVO persistence = new UserStatsVO.BadgeVO();
        persistence.setId("persistence_3days");
        persistence.setName("持之以恒");
        persistence.setDescription("连续3天提交题目");
        persistence.setIcon("🔥");
        
        boolean hasConsecutive3Days = checkConsecutiveSubmissionDays(userId, 3);
        persistence.setUnlocked(hasConsecutive3Days);
        if (hasConsecutive3Days) {
            persistence.setUnlockTime(LocalDateTime.now());
        } else {
            persistence.setUnlockTime(null);
        }
        badges.add(persistence);
        
        return badges;
    }

    private boolean checkConsecutiveSubmissionDays(Long userId, int requiredDays) {
        LocalDateTime startDate = LocalDateTime.now().minusDays(requiredDays + 7);
        
        LambdaQueryWrapper<SubmitRecord> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SubmitRecord::getUserId, userId)
              .ge(SubmitRecord::getCreateTime, startDate)
              .orderByAsc(SubmitRecord::getCreateTime);
        
        List<SubmitRecord> records = submitRecordMapper.selectList(wrapper);
        
        if (records.isEmpty()) return false;
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        Set<String> submitDates = new LinkedHashSet<>();
        for (SubmitRecord record : records) {
            submitDates.add(record.getCreateTime().format(formatter));
        }
        
        List<String> sortedDates = new ArrayList<>(submitDates);
        
        int consecutiveCount = 1;
        LocalDate prevDate = LocalDate.parse(sortedDates.get(0));
        
        for (int i = 1; i < sortedDates.size(); i++) {
            LocalDate currentDate = LocalDate.parse(sortedDates.get(i));
            if (currentDate.isEqual(prevDate.plusDays(1))) {
                consecutiveCount++;
                if (consecutiveCount >= requiredDays) return true;
            } else if (!currentDate.isEqual(prevDate)) {
                consecutiveCount = 1;
            }
            prevDate = currentDate;
        }
        
        return consecutiveCount >= requiredDays;
    }
}