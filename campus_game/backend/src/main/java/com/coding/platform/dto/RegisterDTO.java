package com.coding.platform.dto;

import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Data
public class RegisterDTO {

    /**
     * 二期注册只收「昵称 + 密码」（任务书 §3.1.1），所以这里**不再要求** username。
     * 字段留着是给一期 SPA 那张注册页用的：它填的是登录名。
     * 两个都没填的校验放在 {@code UserServiceImpl.register} —— 那儿才知道该拿哪个当账号。
     */
    private String username;

    @NotBlank(message = "密码不能为空")
    private String password;

    @Email(message = "邮箱格式不正确")
    private String email;

    private String nickname;

}
