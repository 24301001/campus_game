package com.coding.platform.service.impl;

import cn.hutool.core.util.IdUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.coding.platform.dto.SendVerificationEmailDTO;
import com.coding.platform.entity.EmailVerification;
import com.coding.platform.entity.User;
import com.coding.platform.exception.BusinessException;
import com.coding.platform.mapper.EmailVerificationMapper;
import com.coding.platform.service.EmailService;
import com.coding.platform.service.UserService;
import com.coding.platform.vo.VerificationStatusVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private EmailVerificationMapper emailVerificationMapper;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${email.verification.expiration-minutes:10}")
    private Integer expirationMinutes;

    @Value("${email.verification.frontend-url:http://localhost:3000/verify-email}")
    private String frontendUrl;

    @Override
    public void sendVerificationEmail(SendVerificationEmailDTO dto) {
        // 检查邮箱域名 - 只允许北京交通大学邮箱
        String domain = dto.getEmail().substring(dto.getEmail().lastIndexOf("@") + 1);
        if (!"bjtu.edu.cn".equalsIgnoreCase(domain)) {
            throw new BusinessException("仅允许北京交通大学邮箱注册（@bjtu.edu.cn）");
        }

        // 检查用户名是否已存在
        LambdaQueryWrapper<User> userWrapper = new LambdaQueryWrapper<>();
        userWrapper.eq(User::getUsername, dto.getUsername());
        if (userService.count(userWrapper) > 0) {
            throw new BusinessException("用户名已存在");
        }

        // 检查邮箱是否已被注册
        LambdaQueryWrapper<User> emailWrapper = new LambdaQueryWrapper<>();
        emailWrapper.eq(User::getEmail, dto.getEmail());
        if (userService.count(emailWrapper) > 0) {
            throw new BusinessException("该邮箱已被注册");
        }

        // 生成验证链接
        String verificationCode = IdUtil.fastSimpleUUID();

        // 保存验证记录
        EmailVerification verification = new EmailVerification();
        verification.setEmail(dto.getEmail());
        verification.setVerificationCode(verificationCode);
        verification.setUsername(dto.getUsername());
        verification.setPassword(dto.getPassword());
        verification.setNickname(dto.getNickname() != null ? dto.getNickname() : dto.getUsername());
        verification.setStatus(0);
        verification.setExpireTime(LocalDateTime.now().plusMinutes(expirationMinutes));
        verification.setCreateTime(LocalDateTime.now());
        emailVerificationMapper.insert(verification);

        // 发送邮件
        String subject = "在线编程平台 - 邮箱验证";
        String content = "尊敬的用户：\n\n" +
                "请点击以下链接完成邮箱验证：\n" +
                frontendUrl + "?code=" + verificationCode + "\n\n" +
                "链接有效期为" + expirationMinutes + "分钟，请尽快完成验证。\n\n" +
                "如果这不是您本人的操作，请忽略此邮件。\n\n" +
                "此致\n" +
                "在线编程平台";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(dto.getEmail());
        message.setSubject(subject);
        message.setText(content);

        try {
            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
            throw new BusinessException("邮件发送失败，请检查邮箱配置：" + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void verifyEmail(String code) {
        // 查询验证记录
        LambdaQueryWrapper<EmailVerification> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(EmailVerification::getVerificationCode, code);
        EmailVerification verification = emailVerificationMapper.selectOne(wrapper);

        if (verification == null) {
            throw new BusinessException("验证链接无效");
        }

        if (verification.getStatus() == 1) {
            throw new BusinessException("该邮箱已完成验证");
        }

        if (LocalDateTime.now().isAfter(verification.getExpireTime())) {
            throw new BusinessException("验证链接已过期，请重新发送验证邮件");
        }

        // 创建用户
        User user = new User();
        user.setUsername(verification.getUsername());
        user.setPassword(passwordEncoder.encode(verification.getPassword()));
        user.setEmail(verification.getEmail());
        user.setNickname(verification.getNickname());
        user.setRole("USER");
        user.setStatus(1);
        user.setTotalProblems(0);
        user.setAcceptedProblems(0);
        userService.save(user);

        // 更新验证记录状态
        verification.setStatus(1);
        verification.setUpdateTime(LocalDateTime.now());
        emailVerificationMapper.updateById(verification);
    }

    @Override
    public VerificationStatusVO checkVerificationStatus(String email) {
        VerificationStatusVO vo = new VerificationStatusVO();
        
        // 先检查用户是否已创建
        LambdaQueryWrapper<User> userWrapper = new LambdaQueryWrapper<>();
        userWrapper.eq(User::getEmail, email);
        if (userService.count(userWrapper) > 0) {
            vo.setVerified(true);
            vo.setMessage("验证成功");
            return vo;
        }
        
        // 检查验证记录
        LambdaQueryWrapper<EmailVerification> verificationWrapper = new LambdaQueryWrapper<>();
        verificationWrapper.eq(EmailVerification::getEmail, email);
        verificationWrapper.orderByDesc(EmailVerification::getCreateTime);
        verificationWrapper.last("LIMIT 1");
        EmailVerification verification = emailVerificationMapper.selectOne(verificationWrapper);
        
        if (verification == null) {
            vo.setVerified(false);
            vo.setMessage("未找到验证记录");
            return vo;
        }
        
        if (verification.getStatus() == 1) {
            vo.setVerified(true);
            vo.setMessage("验证成功");
            return vo;
        }
        
        if (LocalDateTime.now().isAfter(verification.getExpireTime())) {
            vo.setVerified(false);
            vo.setMessage("验证链接已过期，请重新发送");
            return vo;
        }
        
        vo.setVerified(false);
        vo.setMessage("等待验证");
        return vo;
    }
}
