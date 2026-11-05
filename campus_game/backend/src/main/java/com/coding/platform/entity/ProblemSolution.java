package com.coding.platform.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 题目-参考答案（多语言）。
 * <p>
 * 每一行都是一份「提交判题机验证过能 AC」的答案，算法哥代写时直接把它取出来给用户，
 * 不再让大模型现编——现编的代码经常因为样例题面读错而跑出错误结果。
 * <p>
 * language 除五种编程语言外，还有两种特殊值：
 * SQL   —— SQL 题的答案；TEXT —— 八股文概念题的讲解（都不是可运行的代码）。
 */
@Data
@TableName("problem_solution")
public class ProblemSolution implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long problemId;

    /** JAVA / CPP / C / PYTHON / JAVASCRIPT / SQL / TEXT */
    private String language;

    /** 完整可提交的代码；SQL、TEXT 两类这里放 SQL 语句或讲解正文 */
    private String code;

    /** 交给他之前顺嘴说的一句台词 */
    private String note;

    /** 是否已提交验证通过：1 是 */
    private Integer verified;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;

}
