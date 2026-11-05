package com.coding.platform.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.coding.platform.dto.LoginDTO;
import com.coding.platform.dto.RegisterDTO;
import com.coding.platform.entity.User;
import com.coding.platform.vo.LoginVO;
import com.coding.platform.vo.UserStatsVO;

public interface UserService extends IService<User> {

    LoginVO login(LoginDTO loginDTO);

    void register(RegisterDTO registerDTO);

    User getUserById(Long id);

    void updateUser(User user);

    void updatePassword(Long userId, String oldPassword, String newPassword);

    UserStatsVO getUserStats(Long userId);

}
