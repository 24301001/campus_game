package com.coding.platform.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.coding.platform.entity.Collect;

public interface CollectService extends IService<Collect> {

    void collect(Long userId, Long problemId);

    void cancelCollect(Long userId, Long problemId);

    boolean isCollected(Long userId, Long problemId);

    IPage<Collect> getCollectPage(Page<Collect> page, Long userId);

}
