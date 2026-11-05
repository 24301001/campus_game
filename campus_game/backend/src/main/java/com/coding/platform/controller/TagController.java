package com.coding.platform.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.coding.platform.common.Result;
import com.coding.platform.entity.Tag;
import com.coding.platform.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tag")
public class TagController {

    @Autowired
    private TagService tagService;

    @GetMapping("/list")
    public Result<List<Tag>> getTagList() {
        LambdaQueryWrapper<Tag> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByAsc(Tag::getSortOrder);
        List<Tag> list = tagService.list(wrapper);
        return Result.success(list);
    }

}
