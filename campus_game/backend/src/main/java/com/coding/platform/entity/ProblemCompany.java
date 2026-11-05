package com.coding.platform.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 题目-企业关联（一道题可被多家公司考，一家公司有多道题）
 */
@Data
@TableName("problem_company")
public class ProblemCompany implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long problemId;

    private Long companyId;

    private LocalDateTime createTime;

}
