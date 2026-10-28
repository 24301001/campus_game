package com.coding.platform.config;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.coding.platform.entity.User;
import com.coding.platform.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

// @Component 暂时禁用，避免密码加密问题
public class DataInitConfig implements CommandLineRunner {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 初始化管理员账号
        LambdaQueryWrapper<User> adminWrapper = new LambdaQueryWrapper<>();
        adminWrapper.eq(User::getUsername, "admin");
        if (userMapper.selectOne(adminWrapper) == null) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEmail("admin@example.com");
            admin.setNickname("管理员");
            admin.setRole("ADMIN");
            admin.setStatus(1);
            admin.setTotalProblems(0);
            admin.setAcceptedProblems(0);
            userMapper.insert(admin);
            System.out.println("初始化管理员账号完成: admin/admin123");
        }

        // 初始化普通用户账号
        LambdaQueryWrapper<User> userWrapper = new LambdaQueryWrapper<>();
        userWrapper.eq(User::getUsername, "user");
        if (userMapper.selectOne(userWrapper) == null) {
            User user = new User();
            user.setUsername("user");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setEmail("user@example.com");
            user.setNickname("普通用户");
            user.setRole("USER");
            user.setStatus(1);
            user.setTotalProblems(0);
            user.setAcceptedProblems(0);
            userMapper.insert(user);
            System.out.println("初始化普通用户账号完成: user/user123");
        }
    }
}
