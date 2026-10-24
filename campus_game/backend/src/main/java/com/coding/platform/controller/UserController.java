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

    /**
     * 改资料。
     *
     * ⚠️ 二期 §10.3 把昵称锁死了：公告与私聊存的是**当时的署名**，昵称一改，历史公告
     * 就变成"一个曾经叫过别的名字的人"发的。所以这里两件事：
     *   ① 想改昵称 —— 直接拒（任务书 §10.7 验收第 2 条要求的就是这个行为）；
     *   ② 登录名 / 密码 / 角色 / 状态 —— 不报错也不理会，字段当场抹掉，
     *      因为这三样各有各的接口（注册、改密、管理后台），从这条路走过去就是越权。
     */
    @PutMapping("/update")
    public Result<Void> updateUser(Authentication authentication, @RequestBody User user) {
        Long userId = (Long) authentication.getPrincipal();
        User current = userService.getUserById(userId);
        if (current == null) {
            return Result.error("用户不存在");
        }
        String incoming = user.getNickname();
        if (incoming != null && !incoming.trim().isEmpty()
                && !incoming.trim().equals(nicknameOf(current))) {
            return Result.error("昵称是注册时填的登录名，不能修改");
        }
        user.setId(userId);
        user.setUsername(null);
        user.setNickname(null);
        user.setPassword(null);
        user.setRole(null);
        user.setStatus(null);
        userService.updateUser(user);
        return Result.success();
    }

    private static String nicknameOf(User user) {
        String nickname = user.getNickname();
        if (nickname == null || nickname.trim().isEmpty()) return String.valueOf(user.getUsername());
        return nickname.trim();
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
