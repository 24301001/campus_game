package com.coding.platform.vo;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
public class UserStatsVO {
    private Long userId;
    private String username;
    private String nickname;
    private String avatar;
    private String gender;
    private String ipAddress;
    private String bio;
    /** 加入时间（个人主页要显示，之前漏了这个字段，页面上一直是空的） */
    private LocalDateTime createTime;
    
    private Integer score;
    private Integer rank;
    private Integer totalUsers;
    
    private Integer totalProblems;
    private Integer acceptedProblems;
    private Integer totalSubmittedProblems;
    
    private Integer easyCount;
    private Integer mediumCount;
    private Integer hardCount;
    
    private Integer totalProblemsInDB;
    private Integer easyProblemsInDB;
    private Integer mediumProblemsInDB;
    private Integer hardProblemsInDB;
    
    private Integer viewCount;
    private Integer likeCount;
    
    private Integer followersCount;
    private Integer followingCount;
    private Boolean isFollowing;
    
    private Double accuracyRate;
    
    private List<RecentSubmissionVO> recentSubmissions;
    private List<FavoriteProblemVO> favoriteProblems;
    private List<UserCommentVO> comments;
    
    private Map<String, Double> categoryStats;
    private List<DailyActivityVO> yearlyActivity;
    private List<BadgeVO> badges;
    
    @Data
    public static class BadgeVO {
        private String id;
        private String name;
        private String description;
        private String icon;
        private Boolean unlocked;
        private LocalDateTime unlockTime;
    }
    
    @Data
    public static class RecentSubmissionVO {
        private Long problemId;
        private String title;
        private String difficulty;
        private LocalDateTime submitTime;
        private String status;
    }
    
    @Data
    public static class FavoriteProblemVO {
        private Long problemId;
        private String title;
        private String difficulty;
        private LocalDateTime collectTime;
    }
    
    @Data
    public static class UserCommentVO {
        private Long noteId;
        private Long problemId;
        private String problemTitle;
        private String content;
        private Integer likeCount;
        private LocalDateTime createTime;
    }
    
    @Data
    public static class DailyActivityVO {
        private String date;
        private Integer count;
    }
}