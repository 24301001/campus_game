package com.coding.platform.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.coding.platform.entity.SubmitRecord;

public interface SubmitRecordService extends IService<SubmitRecord> {

    IPage<SubmitRecord> getRecordPage(Page<SubmitRecord> page, Long userId, Long problemId, String status);

}
