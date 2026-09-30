package com.coding.platform.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.coding.platform.entity.Company;
import com.coding.platform.entity.ProblemCompany;
import com.coding.platform.mapper.CompanyMapper;
import com.coding.platform.mapper.ProblemCompanyMapper;
import com.coding.platform.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
public class CompanyServiceImpl extends ServiceImpl<CompanyMapper, Company> implements CompanyService {

    @Autowired
    private ProblemCompanyMapper problemCompanyMapper;

    @Override
    public List<Company> listWithCount(String keyword) {
        LambdaQueryWrapper<Company> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Company::getStatus, 1);
        if (StringUtils.hasText(keyword)) {
            String kw = keyword.trim();
            wrapper.and(w -> w.like(Company::getName, kw).or().like(Company::getNameEn, kw));
        }
        wrapper.orderByAsc(Company::getSortOrder);
        List<Company> companies = list(wrapper);

        // 题目数按关联表实时统计，不做冗余字段，保证和题库筛出来的一致
        for (Company company : companies) {
            LambdaQueryWrapper<ProblemCompany> countWrapper = new LambdaQueryWrapper<>();
            countWrapper.eq(ProblemCompany::getCompanyId, company.getId());
            company.setProblemCount(problemCompanyMapper.selectCount(countWrapper).intValue());
        }
        return companies;
    }

}
