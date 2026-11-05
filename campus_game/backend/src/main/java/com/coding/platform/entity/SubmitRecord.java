package com.coding.platform.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("submit_record")
public class SubmitRecord implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;

    private Long problemId;

    private String code;

    private String language;

    private String status;

    private Integer timeUsed;

    private Integer memoryUsed;

    private String errorMessage;

    private String output;

    private String expectedOutput;

    private LocalDateTime createTime;

}
