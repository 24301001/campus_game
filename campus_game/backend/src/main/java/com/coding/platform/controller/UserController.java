package com.coding.platform.controller;

import com.coding.platform.common.Result;
import com.coding.platform.entity.User;
import com.coding.platform.service.UserService;
import com.coding.platform.vo.UserStatsVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/info")
    public Result<User> getUserInfo(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        User user = userService.getUserById(userId);
        user.setPassword(null);
        return Result.success(user);
    }

    @PutMapping("/update")
    public Result<Void> updateUser(Authentication authentication, @RequestBody User user) {
        Long userId = (Long) authentication.getPrincipal();
        user.setId(userId);
        userService.updateUser(user);
        return Result.success();
    }

    @PostMapping("/password")
    public Result<Void> updatePassword(Authentication authentication, @RequestBody Map<String, String> params) {
        Long userId = (Long) authentication.getPrincipal();
        String oldPassword = params.get("oldPassword");
        String newPassword = params.get("newPassword");
        userService.updatePassword(userId, oldPassword, newPassword);
        return Result.success();
    }

    @GetMapping("/stats")
    public Result<UserStatsVO> getUserStats(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        UserStatsVO stats = userService.getUserStats(userId);
        return Result.success(stats);
    }

}
