package com.coding.platform.vo;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * 题单：有序、可解释、可重算
 */
@Data
public class AgentPlanVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    /** 备赛 / 面试 / 补短板 / 保持手感 */
    private String goal;

    private Integer dailyCount;

    private Integer days;

    private String summary;

    private List<DayVO> dayList;

    @Data
    public static class DayVO implements Serializable {

        private static final long serialVersionUID = 1L;

        private Integer dayIndex;

        private String focus;

        private List<ItemVO> items;
    }

    @Data
    public static class ItemVO implements Serializable {

        private static final long serialVersionUID = 1L;

        private Long itemId;

        private Long problemId;

        private String title;

        private String difficulty;

        private List<String> tags;

        /** 为什么给他这道 */
        private String reason;

        private Boolean done;
    }

}
