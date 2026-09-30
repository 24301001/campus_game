package com.coding.platform.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.coding.platform.entity.ProblemTag;
import com.coding.platform.entity.Tag;
import com.coding.platform.mapper.ProblemTagMapper;
import com.coding.platform.mapper.TagMapper;
import com.coding.platform.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TagServiceImpl extends ServiceImpl<TagMapper, Tag> implements TagService {

    @Autowired
    private ProblemTagMapper problemTagMapper;

    @Override
    public List<Tag> getTagsByProblemId(Long problemId) {
        LambdaQueryWrapper<ProblemTag> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ProblemTag::getProblemId, problemId);
        List<ProblemTag> problemTags = problemTagMapper.selectList(wrapper);
        
        List<Long> tagIds = problemTags.stream().map(ProblemTag::getTagId).collect(Collectors.toList());
        if (tagIds.isEmpty()) {
            return Collections.emptyList();
        }
        
        return listByIds(tagIds);
    }

}
