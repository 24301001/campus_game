package com.coding.platform.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.coding.platform.entity.Company;

import java.util.List;

public interface CompanyService extends IService<Company> {

    /**
     * 热门企业列表，带上各企业在题库里的真实题目数
     *
     * @param keyword 企业名关键词，可空
     */
    List<Company> listWithCount(String keyword);

}
