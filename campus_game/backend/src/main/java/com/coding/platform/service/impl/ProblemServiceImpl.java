package com.coding.platform.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.coding.platform.entity.Company;
import com.coding.platform.entity.Problem;
import com.coding.platform.entity.ProblemCompany;
import com.coding.platform.entity.ProblemTag;
import com.coding.platform.entity.Tag;
import com.coding.platform.mapper.CompanyMapper;
import com.coding.platform.mapper.ProblemCompanyMapper;
import com.coding.platform.mapper.ProblemMapper;
import com.coding.platform.mapper.ProblemTagMapper;
import com.coding.platform.service.ProblemService;
import com.coding.platform.service.TagService;
import com.coding.platform.vo.ProblemSimilarVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProblemServiceImpl extends ServiceImpl<ProblemMapper, Problem> implements ProblemService {

    @Autowired
    private ProblemTagMapper problemTagMapper;

    @Autowired
    private ProblemCompanyMapper problemCompanyMapper;

    @Autowired
    private CompanyMapper companyMapper;

    @Autowired
    private TagService tagService;

    @Override
    public IPage<Problem> getProblemPage(Page<Problem> page, Long categoryId, String difficulty, String keyword,
                                         List<Long> tagIds, Long companyId) {
        LambdaQueryWrapper<Problem> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Problem::getStatus, 1);
        
        if (categoryId != null) {
            wrapper.eq(Problem::getCategoryId, categoryId);
        }
        
        if (StringUtils.hasText(difficulty)) {
            wrapper.eq(Problem::getDifficulty, difficulty);
        }
        
        if (StringUtils.hasText(keyword)) {
            wrapper.like(Problem::getTitle, keyword);
        }
        
        // 多标签筛选 - 交集筛选（必须包含所有选择的标签）
        if (tagIds != null && !tagIds.isEmpty()) {
            LambdaQueryWrapper<ProblemTag> ptWrapper = new LambdaQueryWrapper<>();
            ptWrapper.in(ProblemTag::getTagId, tagIds);
            List<ProblemTag> problemTags = problemTagMapper.selectList(ptWrapper);
            
            // 统计每个 problem_id 出现的次数
            java.util.Map<Long, Long> countMap = problemTags.stream()
                .collect(Collectors.groupingBy(ProblemTag::getProblemId, Collectors.counting()));
            
            // 只保留出现次数等于 tagIds.size() 的 problem_id（即包含所有标签的）
            List<Long> problemIds = countMap.entrySet().stream()
                .filter(entry -> entry.getValue() == tagIds.size())
                .map(java.util.Map.Entry::getKey)
                .collect(Collectors.toList());
            
            if (!problemIds.isEmpty()) {
                wrapper.in(Problem::getId, problemIds);
            } else {
                wrapper.eq(Problem::getId, -1); // 无匹配
            }
        }
        
        // 企业题库：筛出被该企业收录的题
        if (companyId != null) {
            LambdaQueryWrapper<ProblemCompany> pcWrapper = new LambdaQueryWrapper<>();
            pcWrapper.eq(ProblemCompany::getCompanyId, companyId);
            List<Long> companyProblemIds = problemCompanyMapper.selectList(pcWrapper).stream()
                .map(ProblemCompany::getProblemId)
                .collect(Collectors.toList());
            if (!companyProblemIds.isEmpty()) {
                wrapper.in(Problem::getId, companyProblemIds);
            } else {
                wrapper.eq(Problem::getId, -1); // 无匹配
            }
        }

        wrapper.orderByAsc(Problem::getId);
        IPage<Problem> result = page(page, wrapper);

        // 填充标签和企业
        for (Problem problem : result.getRecords()) {
            List<Tag> tags = tagService.getTagsByProblemId(problem.getId());
            problem.setTags(tags);
            problem.setCompanies(getCompaniesByProblemId(problem.getId()));
        }

        return result;
    }

    @Override
    public List<ProblemSimilarVO> getSimilarProblems(Long problemId) {
        return baseMapper.selectSimilarProblems(problemId);
    }

    /** 这道题被哪些企业收录过 */
    private List<Company> getCompaniesByProblemId(Long problemId) {
        LambdaQueryWrapper<ProblemCompany> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ProblemCompany::getProblemId, problemId);
        List<Long> companyIds = problemCompanyMapper.selectList(wrapper).stream()
            .map(ProblemCompany::getCompanyId)
            .collect(Collectors.toList());
        if (companyIds.isEmpty()) {
            return java.util.Collections.emptyList();
        }
        return companyMapper.selectBatchIds(companyIds);
    }

    @Override
    public Problem getProblemDetail(Long id) {
        Problem problem = getById(id);
        if (problem != null) {
            List<Tag> tags = tagService.getTagsByProblemId(id);
            problem.setTags(tags);
            problem.setCompanies(getCompaniesByProblemId(id));
        }
        return problem;
    }

}
