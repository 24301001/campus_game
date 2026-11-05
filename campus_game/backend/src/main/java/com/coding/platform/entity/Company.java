package com.coding.platform.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 热门企业（企业题库的维度）
 */
@Data
@TableName("company")
public class Company implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    /** 企业名称 */
    private String name;

    /** 英文名 */
    private String nameEn;

    /** 面试考察侧重 */
    private String description;

    private Integer sortOrder;

    private Integer status;

    private LocalDateTime createTime;

    /** 该企业在题库里的真实题目数（不落库，查询时统计） */
    @TableField(exist = false)
    private Integer problemCount;

}
