package com.coding.platform.config;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.coding.platform.entity.User;
import com.coding.platform.mapper.UserMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * 启动时把账号表收拾成「明文不落库」的样子（任务书 §5.1）。
 *
 * 一期这份文件是被注释掉 {@code @Component} 的，理由写着"避免密码加密问题"——
 * 因为那时 {@code SecurityConfig} 用的是 NoOpPasswordEncoder，一加密，
 * 库里 {@code admin}/{@code user} 那两行垃圾口令就对不上了，演示账号直接登不进去。
 * 二期改成 bcrypt，所以这个初始化器反过来承担两件事：
 * 把历史明文行补成 bcrypt、把两个演示账号的口令种成界面上写的那两个。
 */
@Slf4j
@Component
public class DataInitConfig implements CommandLineRunner {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        ensureDemoAccount("admin", "admin123", "管理员", "ADMIN");
        ensureDemoAccount("user", "user123", "普通用户", "USER");
        hashLegacyPlaintextPasswords();
    }

    /**
     * 演示账号：缺就插，口令不是 bcrypt 就补成界面上写的那个。
     *
     * ⚠️ 只在存的值明显是垃圾/明文时才覆盖 —— 用户真在个人中心改过口令的话
     * （那已经是 bcrypt），重启不能把它悄悄打回 {@code admin123}。
     */
    private void ensureDemoAccount(String username, String defaultPassword,
                                   String nickname, String role) {
        User user = userMapper.selectOne(new LambdaQueryWrapper<User>()
                .eq(User::getUsername, username));
        if (user == null) {
            User fresh = new User();
            fresh.setUsername(username);
            fresh.setPassword(passwordEncoder.encode(defaultPassword));
            fresh.setNickname(nickname);
            fresh.setRole(role);
            fresh.setStatus(1);
            fresh.setTotalProblems(0);
            fresh.setAcceptedProblems(0);
            userMapper.insert(fresh);
            log.info("演示账号已初始化: {}", username);
        } else if (!isBcrypt(user.getPassword())) {
            user.setPassword(passwordEncoder.encode(defaultPassword));
            userMapper.updateById(user);
            log.info("演示账号 {} 存的不是 bcrypt 口令，已按界面上的默认口令重置", username);
        }
    }

    /** 一期 dump 里剩下的明文口令逐行补成 bcrypt，补完整个库就只有 bcrypt 一种形态。 */
    private void hashLegacyPlaintextPasswords() {
        List<User> rows = userMapper.selectList(new LambdaQueryWrapper<User>()
                .isNotNull(User::getPassword));
        int fixed = 0;
        for (User row : rows) {
            if (isBcrypt(row.getPassword())) continue;
            row.setPassword(passwordEncoder.encode(row.getPassword()));
            userMapper.updateById(row);
            fixed++;
        }
        if (fixed > 0) log.info("已把 {} 行历史明文口令补成 bcrypt", fixed);
    }

    private static boolean isBcrypt(String stored) {
        return stored != null && stored.startsWith("$2");
    }
}
