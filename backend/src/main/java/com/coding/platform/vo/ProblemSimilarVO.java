package com.coding.platform.vo;

import lombok.Data;

/**
 * 相似题目：题目详情页的「相似题目」和算法哥推荐的「类似题」共用。
 */
@Data
public class ProblemSimilarVO {

    private Long id;

    private String title;

    private String difficulty;

    private String category;

    /** 为什么说它像：同标签/同分类/难度相同 */
    private String reason;
}
