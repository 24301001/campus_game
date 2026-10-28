package com.coding.platform.controller;

import com.coding.platform.common.Result;
import com.coding.platform.service.MpProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * 二期模块 6「个人中心」的 HTTP 接口（任务书 §6.2「个人中心」那张表）。
 *
 * 低频、点开才拉一次，所以走 HTTP 不走 WebSocket —— 联机网关那边只管位置、私聊、公告
 * 这些高频消息，档案是主站的事（§4.3）。
 *
 * ⚠️ 路径为什么是 {@code /profile/card/{userId}} 而不是 §6.2 写的 {@code /profile/{userId}}：
 * 一期已经有 {@code UserProfileController} 占着 {@code GET /profile/{userId}}（刷题平台的那个
 * 主页要读做题统计），两条规则撞在一起会直接"Ambiguous mapping"起不来。
 * 字面量 {@code /me} 与 {@code /card/**} 比模板优先，所以这三条都归本控制器，互不打架。
 */
@RestController
@RequestMapping("/profile")
public class MpProfileController {

    @Autowired
    private MpProfileService profileService;

    /** 自己的完整档案：全部字段 + 可编辑标记 + 只自己可见的数据统计。 */
    @GetMapping("/me")
    public Result<Map<String, Object>> me(Authentication authentication) {
        return Result.success(profileService.me(userId(authentication)));
    }

    /** 改签名 / 学院 / 年级 / 兴趣 / 形象。昵称不在这个接口的能力范围内（§10.3）。 */
    @PutMapping("/me")
    public Result<Map<String, Object>> save(Authentication authentication,
                                            @RequestBody Map<String, Object> body) {
        return Result.success(profileService.save(userId(authentication), body));
    }

    /**
     * 看别人的缩略主页。⭐ 裁剪在服务端做（§6.2 / §10.6 红线 2）——
     * 这里返回的每一个键都是白名单里的，抓包也抓不到别的东西。
     */
    @GetMapping("/card/{userId}")
    public Result<Map<String, Object>> card(Authentication authentication,
                                            @PathVariable("userId") Long targetUserId) {
        Long viewer = authentication == null ? null : userId(authentication);
        return Result.success(profileService.card(viewer, targetUserId));
    }

    /** {@code Authentication.getPrincipal()} 就是 JWT 里那个 user_id（与其余控制器同一口径）。 */
    private static Long userId(Authentication authentication) {
        Object principal = authentication == null ? null : authentication.getPrincipal();
        return principal instanceof Long ? (Long) principal : Long.valueOf(String.valueOf(principal));
    }
}
