package com.coding.platform.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("user")
public class User implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    private String username;

    private String password;

    private String email;

    private String nickname;

    private String avatar;

    private String gender;

    private String ipAddress;

    private String role;

    private Integer status;

    private Integer totalProblems;

    private Integer acceptedProblems;

    private Integer score;

    private Integer easyCount;

    private Integer mediumCount;

    private Integer hardCount;

    private Integer viewCount;

    private Integer likeCount;

    private Integer followersCount;

    private Integer followingCount;

    private String bio;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;
}