package com.coding.platform.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.coding.platform.common.Result;
import com.coding.platform.entity.*;
import com.coding.platform.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private ProblemService problemService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private SubmitRecordService submitRecordService;

    @GetMapping("/user/list")
    public Result<IPage<User>> getUserList(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String keyword) {
        Page<User> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        if (keyword != null) {
            wrapper.like(User::getUsername, keyword).or().like(User::getNickname, keyword);
        }
        wrapper.orderByDesc(User::getCreateTime);
        IPage<User> result = userService.page(page, wrapper);
        result.getRecords().forEach(user -> user.setPassword(null));
        return Result.success(result);
    }

    @PutMapping("/user/status")
    public Result<Void> updateUserStatus(@RequestParam Long userId, @RequestParam Integer status) {
        User user = userService.getById(userId);
        user.setStatus(status);
        userService.updateById(user);
        return Result.success();
    }

    @GetMapping("/problem/list")
    public Result<IPage<Problem>> getProblemList(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        Page<Problem> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<Problem> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByDesc(Problem::getCreateTime);
        IPage<Problem> result = problemService.page(page, wrapper);
        return Result.success(result);
    }

    @PostMapping("/problem/add")
    public Result<Void> addProblem(@RequestBody Problem problem) {
        problemService.save(problem);
        return Result.success();
    }

    @PutMapping("/problem/update")
    public Result<Void> updateProblem(@RequestBody Problem problem) {
        problemService.updateById(problem);
        return Result.success();
    }

    @DeleteMapping("/problem/delete")
    public Result<Void> deleteProblem(@RequestParam Long id) {
        problemService.removeById(id);
        return Result.success();
    }

    @GetMapping("/category/list")
    public Result<IPage<Category>> getCategoryList(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        Page<Category> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<Category> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByAsc(Category::getSortOrder);
        IPage<Category> result = categoryService.page(page, wrapper);
        return Result.success(result);
    }

    @PostMapping("/category/add")
    public Result<Void> addCategory(@RequestBody Category category) {
        categoryService.save(category);
        return Result.success();
    }

    @PutMapping("/category/update")
    public Result<Void> updateCategory(@RequestBody Category category) {
        categoryService.updateById(category);
        return Result.success();
    }

    @DeleteMapping("/category/delete")
    public Result<Void> deleteCategory(@RequestParam Long id) {
        categoryService.removeById(id);
        return Result.success();
    }

    @GetMapping("/submit/list")
    public Result<IPage<SubmitRecord>> getSubmitList(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Long problemId) {
        Page<SubmitRecord> page = new Page<>(pageNum, pageSize);
        IPage<SubmitRecord> result = submitRecordService.getRecordPage(page, userId, problemId, null);
        return Result.success(result);
    }

}
