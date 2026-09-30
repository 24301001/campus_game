package com.coding.platform.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class CompileDTO {

    @NotNull(message = "题目ID不能为空")
    private Long problemId;

    @NotBlank(message = "代码不能为空")
    private String code;

    private String language = "JAVA";

}
