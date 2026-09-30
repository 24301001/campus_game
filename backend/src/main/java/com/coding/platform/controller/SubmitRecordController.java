package com.coding.platform.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.coding.platform.common.Result;
import com.coding.platform.entity.SubmitRecord;
import com.coding.platform.service.SubmitRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/submit")
public class SubmitRecordController {

    @Autowired
    private SubmitRecordService submitRecordService;

    @GetMapping("/list")
    public Result<IPage<SubmitRecord>> getSubmitList(
            Authentication authentication,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) Long problemId,
            @RequestParam(required = false) String status) {
        Long userId = (Long) authentication.getPrincipal();
        Page<SubmitRecord> page = new Page<>(pageNum, pageSize);
        IPage<SubmitRecord> result = submitRecordService.getRecordPage(page, userId, problemId, status);
        return Result.success(result);
    }

    @GetMapping("/detail/{id}")
    public Result<SubmitRecord> getSubmitDetail(@PathVariable Long id) {
        SubmitRecord record = submitRecordService.getById(id);
        return Result.success(record);
    }

}
