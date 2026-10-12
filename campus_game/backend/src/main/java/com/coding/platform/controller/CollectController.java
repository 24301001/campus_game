package com.coding.platform.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.coding.platform.common.Result;
import com.coding.platform.entity.Collect;
import com.coding.platform.service.CollectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/collect")
public class CollectController {

    @Autowired
    private CollectService collectService;

    @PostMapping("/add")
    public Result<Void> collect(Authentication authentication, @RequestParam Long problemId) {
        Long userId = (Long) authentication.getPrincipal();
        collectService.collect(userId, problemId);
        return Result.success();
    }

    @DeleteMapping("/remove")
    public Result<Void> cancelCollect(Authentication authentication, @RequestParam Long problemId) {
        Long userId = (Long) authentication.getPrincipal();
        collectService.cancelCollect(userId, problemId);
        return Result.success();
    }

    @GetMapping("/check")
    public Result<Boolean> isCollected(Authentication authentication, @RequestParam Long problemId) {
        Long userId = (Long) authentication.getPrincipal();
        boolean collected = collectService.isCollected(userId, problemId);
        return Result.success(collected);
    }

    @GetMapping("/list")
    public Result<IPage<Collect>> getCollectList(
            Authentication authentication,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        Long userId = (Long) authentication.getPrincipal();
        Page<Collect> page = new Page<>(pageNum, pageSize);
        IPage<Collect> result = collectService.getCollectPage(page, userId);
        return Result.success(result);
    }

}
