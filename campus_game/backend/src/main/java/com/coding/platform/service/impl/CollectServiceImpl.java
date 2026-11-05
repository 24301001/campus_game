package com.coding.platform.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.coding.platform.entity.Collect;
import com.coding.platform.exception.BusinessException;
import com.coding.platform.mapper.CollectMapper;
import com.coding.platform.service.CollectService;
import org.springframework.stereotype.Service;

@Service
public class CollectServiceImpl extends ServiceImpl<CollectMapper, Collect> implements CollectService {

    @Override
    public void collect(Long userId, Long problemId) {
        if (isCollected(userId, problemId)) {
            throw new BusinessException("已经收藏过该题目");
        }
        
        Collect collect = new Collect();
        collect.setUserId(userId);
        collect.setProblemId(problemId);
        save(collect);
    }

    @Override
    public void cancelCollect(Long userId, Long problemId) {
        LambdaQueryWrapper<Collect> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Collect::getUserId, userId);
        wrapper.eq(Collect::getProblemId, problemId);
        remove(wrapper);
    }

    @Override
    public boolean isCollected(Long userId, Long problemId) {
        LambdaQueryWrapper<Collect> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Collect::getUserId, userId);
        wrapper.eq(Collect::getProblemId, problemId);
        return count(wrapper) > 0;
    }

    @Override
    public IPage<Collect> getCollectPage(Page<Collect> page, Long userId) {
        LambdaQueryWrapper<Collect> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Collect::getUserId, userId);
        wrapper.orderByDesc(Collect::getCreateTime);
        return page(page, wrapper);
    }

}
