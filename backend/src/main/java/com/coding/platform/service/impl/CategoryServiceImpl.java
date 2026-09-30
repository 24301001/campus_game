package com.coding.platform.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.coding.platform.entity.Category;
import com.coding.platform.mapper.CategoryMapper;
import com.coding.platform.service.CategoryService;
import org.springframework.stereotype.Service;

@Service
public class CategoryServiceImpl extends ServiceImpl<CategoryMapper, Category> implements CategoryService {

}
