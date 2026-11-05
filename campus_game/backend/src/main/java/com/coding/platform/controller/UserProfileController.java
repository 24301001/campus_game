package com.coding.platform.controller;

import com.coding.platform.common.Result;
import com.coding.platform.service.UserProfileService;
import com.coding.platform.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;
    private final JwtUtil jwtUtil;

    @GetMapping("/{userId}")
    public Result<?> getUserProfile(
            @PathVariable Long userId,
            @RequestHeader(value = "Authorization", required = false) String token) {
        
        Long currentUserId = null;
        if (token != null && !token.isEmpty()) {
            try {
                currentUserId = jwtUtil.getUserIdFromToken(token.replace("Bearer ", ""));
            } catch (Exception e) {
                // ignore
            }
        }
        
        return userProfileService.getUserProfile(userId, currentUserId);
    }

    @PostMapping("/follow/{targetUserId}")
    public Result<String> followUser(
            @PathVariable Long targetUserId,
            @RequestHeader("Authorization") String token) {
        
        Long followerId = jwtUtil.getUserIdFromToken(token.replace("Bearer ", ""));
        return userProfileService.followUser(followerId, targetUserId);
    }

    @PostMapping("/view/{problemId}")
    public Result<String> recordView(
            @PathVariable Long problemId,
            @RequestHeader("Authorization") String token) {
        
        Long userId = jwtUtil.getUserIdFromToken(token.replace("Bearer ", ""));
        return userProfileService.recordView(userId, problemId);
    }

    @PostMapping("/comment/like/{noteId}")
    public Result<String> likeComment(
            @PathVariable Long noteId,
            @RequestHeader("Authorization") String token) {
        
        Long userId = jwtUtil.getUserIdFromToken(token.replace("Bearer ", ""));
        return userProfileService.likeComment(userId, noteId);
    }

    @GetMapping("/rankings")
    public Result<Map<String, Object>> getRankings(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer size) {
        
        Map<String, Object> result = new HashMap<>();
        result.put("list", userProfileService.getRankings(page, size).getData());
        result.put("page", page);
        result.put("size", size);
        
        return Result.success(result);
    }
}