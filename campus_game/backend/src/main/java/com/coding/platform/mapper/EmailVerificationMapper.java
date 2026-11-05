package com.coding.platform.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.coding.platform.entity.EmailVerification;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface EmailVerificationMapper extends BaseMapper<EmailVerification> {

}
