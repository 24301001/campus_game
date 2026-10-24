package com.coding.platform.controller;

import com.coding.platform.common.Result;
import com.coding.platform.dto.LoginDTO;
import com.coding.platform.dto.RegisterDTO;
import com.coding.platform.dto.SendVerificationEmailDTO;
import com.coding.platform.dto.VerifyEmailDTO;
import com.coding.platform.entity.User;
import com.coding.platform.service.EmailService;
import com.coding.platform.service.MpExchangeService;
import com.coding.platform.service.UserService;
import com.coding.platform.utils.JwtUtil;
import com.coding.platform.vo.LoginVO;
import com.coding.platform.vo.VerificationStatusVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private MpExchangeService mpExchangeService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public Result<LoginVO> login(@Valid @RequestBody LoginDTO loginDTO) {
        LoginVO loginVO = userService.login(loginDTO);
        return Result.success(loginVO);
    }

    /**
     * 一次登录通四家（任务书 §3.1.3、§6.2）。地图在主站登录成功后打一次，
     * 换回来的三张票以**路径限定的 HttpOnly Cookie** 下发，iframe 自己看不见也改不了。
     *
     * 认的是主票（{@code Authorization: Bearer}），不是 Spring Security 的会话——
     * {@code /auth/**} 在 SecurityConfig 里是 permitAll 的，所以这里自己解 JWT。
     */
    @PostMapping("/exchange")
    public ResponseEntity<Result<Map<String, String>>> exchange(HttpServletRequest request) {
        Long userId = jwtUtil.getUserIdFromToken(bearerToken(request));
        User user = userId == null ? null : userService.getUserById(userId);
        if (user == null) {
            return ResponseEntity.status(401).body(Result.error(401, "主票无效，请重新登录"));
        }
        HttpHeaders headers = new HttpHeaders();
        Map<String, String> status = mpExchangeService.exchange(user, headers);
        return ResponseEntity.ok().headers(headers).body(Result.success(status));
    }

    /**
     * 登出：主票由浏览器那份 localStorage 里作废，四家的票在这里作废
     * （§9.2 铁律 4「一次登出全退，不留残票」）。主票没解出来也要回 200 ——
     * 人都已经走了，没必要跟前端计较一张过期的票。
     */
    @PostMapping("/logout")
    public ResponseEntity<Result<Void>> logout(HttpServletRequest request) {
        Long userId = jwtUtil.getUserIdFromToken(bearerToken(request));
        HttpHeaders headers = new HttpHeaders();
        if (userId != null) {
            mpExchangeService.revoke(userId, headers);
        }
        return ResponseEntity.ok().headers(headers).body(Result.success());
    }

    private static String bearerToken(HttpServletRequest request) {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        return header != null && header.startsWith("Bearer ") ? header.substring(7).trim() : "";
    }

    @Deprecated
    @PostMapping("/register")
    public Result<Void> register(@Valid @RequestBody RegisterDTO registerDTO) {
        userService.register(registerDTO);
        return Result.success();
    }

    @PostMapping("/send-verification-email")
    public Result<Void> sendVerificationEmail(@Valid @RequestBody SendVerificationEmailDTO dto) {
        emailService.sendVerificationEmail(dto);
        return Result.success();
    }

    @PostMapping("/verify-email")
    public Result<Void> verifyEmail(@Valid @RequestBody VerifyEmailDTO dto) {
        emailService.verifyEmail(dto.getCode());
        return Result.success();
    }

    @GetMapping("/check-verification-status")
    public Result<VerificationStatusVO> checkVerificationStatus(@RequestParam String email) {
        VerificationStatusVO vo = emailService.checkVerificationStatus(email);
        return Result.success(vo);
    }
}
