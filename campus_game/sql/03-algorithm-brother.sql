-- ============================================================
-- 算法哥（第五个智能体）相关表
-- 依赖：00-init.sql（user / problem / submit_record）、add_tags_simple.sql（tag / problem_tag）
-- 说明：账号沿用已有的 user 表与 JWT 登录，不另起账号体系。
--      user_id 是「记忆归属」的前提——刷题记录、对话、题单都挂在同一个人身上。
-- ============================================================
USE coding_platform;

-- 会话：一次「和算法哥聊一段」
CREATE TABLE IF NOT EXISTS agent_session (
  id          BIGINT       NOT NULL AUTO_INCREMENT COMMENT '会话ID',
  user_id     BIGINT       NOT NULL COMMENT '归属用户',
  title       VARCHAR(100) NOT NULL DEFAULT '新的对话' COMMENT '会话标题',
  create_time DATETIME     DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_agent_session_user (user_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT ='算法哥对话会话';

-- 消息：对话内容。「记忆隔离」体现在这里——只按 user_id 查得到自己的对话
CREATE TABLE IF NOT EXISTS agent_message (
  id          BIGINT      NOT NULL AUTO_INCREMENT COMMENT '消息ID',
  session_id  BIGINT      NOT NULL COMMENT '所属会话',
  user_id     BIGINT      NOT NULL COMMENT '归属用户',
  role        VARCHAR(16) NOT NULL COMMENT 'user / assistant',
  content     TEXT        COMMENT '消息内容（Markdown）',
  intent      VARCHAR(32) DEFAULT NULL COMMENT '该轮被识别出的意图',
  create_time DATETIME    DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_agent_message_session (session_id, id),
  KEY idx_agent_message_user (user_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT ='算法哥对话消息';

-- 分级提示使用记录：记录卡在哪一档（学情分析的原料之一）
CREATE TABLE IF NOT EXISTS agent_hint_log (
  id          BIGINT   NOT NULL AUTO_INCREMENT,
  user_id     BIGINT   NOT NULL,
  problem_id  BIGINT   NOT NULL,
  level       TINYINT  NOT NULL COMMENT '提示档位 1~4',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_agent_hint_user_problem (user_id, problem_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT ='算法哥分级提示使用记录';

-- 题单：按画像 + 目标 + 预算动态生成的计划（同一班两个人拿到的题单不一样）
CREATE TABLE IF NOT EXISTS agent_plan (
  id          BIGINT       NOT NULL AUTO_INCREMENT,
  user_id     BIGINT       NOT NULL,
  goal        VARCHAR(32)  DEFAULT '补短板' COMMENT '备赛 / 面试 / 补短板 / 保持手感',
  daily_count INT          DEFAULT 3 COMMENT '每天几题',
  days        INT          DEFAULT 7 COMMENT '练多少天',
  summary     VARCHAR(500) DEFAULT NULL COMMENT '题单摘要',
  create_time DATETIME     DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_agent_plan_user (user_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT ='算法哥题单';

-- 题单条目：第几天、第几题、为什么给他这道
CREATE TABLE IF NOT EXISTS agent_plan_item (
  id          BIGINT       NOT NULL AUTO_INCREMENT,
  plan_id     BIGINT       NOT NULL,
  user_id     BIGINT       NOT NULL,
  day_index   INT          NOT NULL COMMENT '第几天，从 1 开始',
  order_index INT          NOT NULL COMMENT '当天第几题，从 1 开始',
  problem_id  BIGINT       NOT NULL,
  reason      VARCHAR(255) DEFAULT NULL COMMENT '入选理由',
  done        TINYINT      DEFAULT 0 COMMENT '是否已完成',
  create_time DATETIME     DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_agent_plan_item_plan (plan_id, day_index, order_index)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT ='算法哥题单条目';
