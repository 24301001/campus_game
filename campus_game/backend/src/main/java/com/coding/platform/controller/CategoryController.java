package com.coding.platform.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.coding.platform.common.Result;
import com.coding.platform.entity.Category;
import com.coding.platform.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/category")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping("/list")
    public Result<List<Category>> getCategoryList() {
        LambdaQueryWrapper<Category> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByAsc(Category::getSortOrder);
        List<Category> list = categoryService.list(wrapper);
        return Result.success(list);
    }

}
