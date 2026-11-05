package com.coding.platform.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("note")
public class Note implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;

    private Long problemId;

    private String content;

    private Long parentId;

    private Integer likeCount;

    private String ipAddress;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;
}