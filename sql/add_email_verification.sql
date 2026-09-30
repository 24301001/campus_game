-- 创建邮箱验证表
CREATE TABLE IF NOT EXISTS `email_verification` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
  `email` VARCHAR(100) NOT NULL COMMENT '邮箱',
  `verification_code` VARCHAR(100) NOT NULL COMMENT '验证码',
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `password` VARCHAR(255) NOT NULL COMMENT '密码（未加密）',
  `nickname` VARCHAR(50) COMMENT '昵称',
  `status` INT NOT NULL DEFAULT 0 COMMENT '状态：0-未验证，1-已验证',
  `expire_time` DATETIME NOT NULL COMMENT '过期时间',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_verification_code` (`verification_code`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='邮箱验证表';
