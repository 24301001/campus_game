package com.coding.platform.controller;

import com.coding.platform.common.Result;
import com.coding.platform.dto.LoginDTO;
import com.coding.platform.dto.RegisterDTO;
import com.coding.platform.dto.SendVerificationEmailDTO;
import com.coding.platform.dto.VerifyEmailDTO;
import com.coding.platform.service.EmailService;
import com.coding.platform.service.UserService;
import com.coding.platform.vo.LoginVO;
import com.coding.platform.vo.VerificationStatusVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/login")
    public Result<LoginVO> login(@Valid @RequestBody LoginDTO loginDTO) {
        LoginVO loginVO = userService.login(loginDTO);
        return Result.success(loginVO);
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
