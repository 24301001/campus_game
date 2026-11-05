package com.coding.platform.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.coding.platform.entity.SubmitRecord;
import com.coding.platform.mapper.SubmitRecordMapper;
import com.coding.platform.service.SubmitRecordService;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class SubmitRecordServiceImpl extends ServiceImpl<SubmitRecordMapper, SubmitRecord> implements SubmitRecordService {

    @Override
    public IPage<SubmitRecord> getRecordPage(Page<SubmitRecord> page, Long userId, Long problemId, String status) {
        LambdaQueryWrapper<SubmitRecord> wrapper = new LambdaQueryWrapper<>();
        
        if (userId != null) {
            wrapper.eq(SubmitRecord::getUserId, userId);
        }
        
        if (problemId != null) {
            wrapper.eq(SubmitRecord::getProblemId, problemId);
        }
        
        if (StringUtils.hasText(status)) {
            wrapper.eq(SubmitRecord::getStatus, status);
        }
        
        wrapper.orderByDesc(SubmitRecord::getCreateTime);
        return page(page, wrapper);
    }

}
