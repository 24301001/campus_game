package com.coding.platform.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.coding.platform.entity.Tag;

import java.util.List;

public interface TagService extends IService<Tag> {

    List<Tag> getTagsByProblemId(Long problemId);

}
