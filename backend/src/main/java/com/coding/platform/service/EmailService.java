package com.coding.platform.service;

import com.coding.platform.dto.SendVerificationEmailDTO;
import com.coding.platform.vo.VerificationStatusVO;

public interface EmailService {

    void sendVerificationEmail(SendVerificationEmailDTO dto);

    void verifyEmail(String code);

    VerificationStatusVO checkVerificationStatus(String email);
}
