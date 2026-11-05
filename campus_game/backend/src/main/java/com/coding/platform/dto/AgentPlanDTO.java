package com.coding.platform.dto;

import lombok.Data;

@Data
public class AgentPlanDTO {

    /** 备赛 / 面试 / 补短板 / 保持手感 */
    private String goal;

    /** 每天几题 */
    private Integer dailyCount;

    /** 练多少天 */
    private Integer days;

}
