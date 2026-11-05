CREATE TABLE IF NOT EXISTS email_verification (
  id BIGINT NOT NULL AUTO_INCREMENT,
  email VARCHAR(100) NOT NULL,
  verification_code VARCHAR(100) NOT NULL,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  nickname VARCHAR(50),
  status INT NOT NULL DEFAULT 0,
  expire_time DATETIME NOT NULL,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_verification_code (verification_code),
  KEY idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
