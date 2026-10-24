package com.coding.platform.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.coding.platform.dto.LoginDTO;
import com.coding.platform.dto.RegisterDTO;
import com.coding.platform.entity.Problem;
import com.coding.platform.entity.SubmitRecord;
import com.coding.platform.entity.User;
import com.coding.platform.exception.BusinessException;
import com.coding.platform.mapper.ProblemMapper;
import com.coding.platform.mapper.SubmitRecordMapper;
import com.coding.platform.mapper.UserMapper;
import com.coding.platform.service.UserService;
import com.coding.platform.utils.JwtUtil;
import com.coding.platform.vo.LoginVO;
import com.coding.platform.vo.UserStatsVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private SubmitRecordMapper submitRecordMapper;

    @Autowired
    private ProblemMapper problemMapper;

    private static String trim(String s) {
        return s == null ? "" : s.trim();
    }

    private static String firstNotBlank(String a, String b) {
        String x = trim(a);
        if (!x.isEmpty()) return x;
        String y = trim(b);
        return y.isEmpty() ? null : y;
    }

    /** 二期登录名就是昵称（§3.1.1），所以先按 username 找、找不到再按 nickname 找。
     *  两列各自唯一（{@code uk_username} / {@code uk_nickname}），单列查不会撞多行。 */
    private User findByAccount(String account) {
        User byName = getOne(new LambdaQueryWrapper<User>().eq(User::getUsername, account));
        return byName != null ? byName
                : getOne(new LambdaQueryWrapper<User>().eq(User::getNickname, account));
    }

    @Override
    public LoginVO login(LoginDTO loginDTO) {
        String account = firstNotBlank(loginDTO.getUsername(), loginDTO.getNickname());
        if (account == null) {
            throw new BusinessException("昵称不能为空");
        }
        User user = findByAccount(account);

        if (user == null) {
            throw new BusinessException("用户不存在");
        }

        if (user.getStatus() == 0) {
            throw new BusinessException("用户已被禁用");
        }

        // 一期那两个"测试账号口令写死在代码里"的口子已经拿掉：
        // admin / user 的真实 bcrypt 口令由 DataInitConfig 在启动时种进库，
        // 判口令只走 passwordEncoder 这一条路。
        if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            throw new BusinessException("密码错误");
        }
        
        String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole());
        
        return new LoginVO(token, user.getId(), user.getUsername(), user.getNickname(), user.getRole());
    }

    @Override
    public void register(RegisterDTO registerDTO) {
        String nickname = trim(registerDTO.getNickname());
        String username = trim(registerDTO.getUsername());
        /* 二期注册只有昵称这一个输入框，登录名跟它同值（见 sql/14-multiplayer.sql 的说明）；
           一期 SPA 那张注册页反过来只填登录名，所以两个方向都要兜住。 */
        if (nickname.isEmpty()) nickname = username;
        if (username.isEmpty()) username = nickname;

        if (nickname.isEmpty()) {
            throw new BusinessException("昵称不能为空");
        }
        if (nickname.length() < 2 || nickname.length() > 16) {
            throw new BusinessException("昵称要 2~16 个字");
        }
        if (registerDTO.getPassword() == null || registerDTO.getPassword().length() < 8) {
            throw new BusinessException("密码至少 8 位");
        }

        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUsername, username).or().eq(User::getNickname, nickname);
        if (count(wrapper) > 0) {
            throw new BusinessException("该昵称已被使用");
        }
        
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        user.setEmail(registerDTO.getEmail());
        user.setNickname(nickname);
        user.setRole("USER");
        user.setStatus(1);
        user.setTotalProblems(0);
        user.setAcceptedProblems(0);
        
        save(user);
    }

    @Override
    public User getUserById(Long id) {
        return getById(id);
    }

    @Override
    public void updateUser(User user) {
        updateById(user);
    }

    @Override
    public void updatePassword(Long userId, String oldPassword, String newPassword) {
        User user = getById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        
        boolean oldPasswordMatch = passwordEncoder.matches(oldPassword, user.getPassword());

        if (!oldPasswordMatch) {
            throw new BusinessException("原密码错误");
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        updateById(user);
    }

    @Override
    public UserStatsVO getUserStats(Long userId) {
        User user = getById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }

        UserStatsVO stats = new UserStatsVO();
        stats.setTotalProblems(user.getTotalProblems() != null ? user.getTotalProblems() : 0);
        stats.setAcceptedProblems(user.getAcceptedProblems() != null ? user.getAcceptedProblems() : 0);
        
        if (user.getTotalProblems() != null && user.getTotalProblems() > 0) {
            stats.setAccuracyRate(Math.round(user.getAcceptedProblems() * 100.0 / user.getTotalProblems() * 100) / 100.0);
        } else {
            stats.setAccuracyRate(0.0);
        }

        // 获取用户的提交记录
        List<SubmitRecord> submissions = new ArrayList<>();
        try {
            LambdaQueryWrapper<SubmitRecord> submitWrapper = new LambdaQueryWrapper<>();
            submitWrapper.eq(SubmitRecord::getUserId, userId);
            submitWrapper.orderByAsc(SubmitRecord::getCreateTime);
            submissions = submitRecordMapper.selectList(submitWrapper);
        } catch (Exception e) {
            // 即使获取提交记录失败，也继续返回统计数据
        }

        return stats;
    }

}
