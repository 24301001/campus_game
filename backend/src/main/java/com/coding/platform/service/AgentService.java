package com.coding.platform.service;

import com.coding.platform.dto.AgentChatDTO;
import com.coding.platform.dto.AgentPlanDTO;
import com.coding.platform.dto.AgentSolveDTO;
import com.coding.platform.entity.AgentMessage;
import com.coding.platform.entity.AgentSession;
import com.coding.platform.vo.AgentAnalysisVO;
import com.coding.platform.vo.AgentChatVO;
import com.coding.platform.vo.AgentSolveVO;
import com.coding.platform.vo.AgentPlanVO;
import com.coding.platform.vo.WrongProblemVO;

import java.util.List;

/**
 * 算法哥：竞赛刷题 · 在线判题 · 学情教练型智能体。
 * <p>
 * 分工：判题、统计、题单、排名全部走确定性逻辑（SQL + 算法），
 * 大模型只负责把结论讲成人话、把思路拆成台阶。
 */
public interface AgentService {

    List<AgentSession> listSessions(Long userId);

    AgentSession createSession(Long userId, String title);

    void deleteSession(Long userId, Long sessionId);

    List<AgentMessage> listMessages(Long userId, Long sessionId);

    AgentChatVO chat(Long userId, AgentChatDTO dto);

    AgentAnalysisVO analyze(Long userId);

    AgentChatVO daily(Long userId);

    AgentChatVO rank(Long userId);

    AgentPlanVO createPlan(Long userId, AgentPlanDTO dto);

    AgentPlanVO latestPlan(Long userId);

    void markPlanItem(Long userId, Long itemId, Boolean done);

    /**
     * 观察层的慢通道：对一次操作做「一句话点评」（走大模型）。
     * 模板快通道负责秒回，这里负责把话说得像人——但同样要短，因为它是气泡里的台词。
     * 大模型没接上时返回 null，前端保留快通道那句。
     */
    String commentEvent(Long userId, String type, Long problemId);

    /** 他不会这题、让你直接写时用：返回一份完整可提交的代码，前端会一个字符一个字符敲进编辑器 */
    AgentSolveVO solve(Long userId, AgentSolveDTO dto);

    /**
     * 算法哥对这个账号的长期记忆（自然语言要点）。
     * <p>
     * 会话本身已经按 userId 隔离，所以「不同账号看不到对方的历史」是靠隔离保证的；
     * 这里给的是跨会话的那部分——换了新对话，他也还记得你常用什么语言、老在哪类题上栽跟头。
     * 没有记忆时返回空字符串。
     */
    String getMemory(Long userId);

    /** 让算法哥忘掉对这个账号的记忆（只清当前账号，不动别人） */
    void clearMemory(Long userId);

    /** 错题本：他提交过、但至今没 AC 过的题（已经攻克的不算） */
    List<WrongProblemVO> wrongProblems(Long userId);

}
