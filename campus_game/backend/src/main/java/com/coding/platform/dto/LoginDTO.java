package com.coding.platform.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class LoginDTO {

    /**
     * 账号。二期定案（任务书 §3.1.1）是「昵称 + 密码」，但一期的 SPA 和地图上的预设按钮
     * 发的是 {@code username}，所以两个字段都收，服务端按「先登录名、后昵称」找人。
     */
    private String username;

    private String nickname;

    @NotBlank(message = "密码不能为空")
    private String password;

}
