package com.coding.platform.controller;

import com.coding.platform.common.Result;
import com.coding.platform.entity.Company;
import com.coding.platform.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/company")
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    /**
     * 热门企业列表
     *
     * @param keyword 企业名关键词，可空（支持中文名和英文名）
     */
    @GetMapping("/list")
    public Result<List<Company>> getCompanyList(@RequestParam(required = false) String keyword) {
        return Result.success(companyService.listWithCount(keyword));
    }

}
