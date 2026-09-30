package com.coding.platform.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompileResultVO {

    private String status;
    private String message;
    private String output;
    private String expectedOutput;
    private Integer timeUsed;
    private Integer memoryUsed;

}
