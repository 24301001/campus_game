package com.coding.platform.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class VerifyEmailDTO {

    @NotBlank(message = "验证链接不能为空")
    private String code;
}
