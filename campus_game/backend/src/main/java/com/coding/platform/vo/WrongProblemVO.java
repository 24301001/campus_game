package com.coding.platform.vo;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 错题本里的一道题：提交过、但至今没有 AC 的题。
 * <p>
 * 只用「没过」这一条标准——他已经攻克的题不算错题，翻出来只会浪费他时间。
 */
@Data
public class WrongProblemVO {

    private Long id;

    private String title;

    private String difficulty;

    private String category;

    /** 在这道题上失败了几次 */
    private Integer failCount;

    /** 最近一次是什么结果（WA / CE / TLE / RE） */
    private String lastStatus;

    private LocalDateTime lastTime;
}
