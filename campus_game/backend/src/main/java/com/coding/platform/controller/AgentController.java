package com.coding.platform.controller;

import com.coding.platform.common.Result;
import com.coding.platform.dto.AgentChatDTO;
import com.coding.platform.dto.AgentEventDTO;
import com.coding.platform.dto.AgentPlanDTO;
import com.coding.platform.dto.AgentSolveDTO;
import com.coding.platform.entity.AgentMessage;
import com.coding.platform.entity.AgentSession;
import com.coding.platform.exception.BusinessException;
import com.coding.platform.service.AgentLlmClient;
import com.coding.platform.service.AgentService;
import com.coding.platform.service.AgentWatchService;
import com.coding.platform.vo.AgentAnalysisVO;
import com.coding.platform.vo.AgentChatVO;
import com.coding.platform.vo.AgentEventVO;
import com.coding.platform.vo.AgentPlanVO;
import com.coding.platform.vo.AgentSolveVO;
import com.coding.platform.vo.WrongProblemVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 算法哥：竞赛刷题 · 在线判题 · 学情教练型智能体。
 * <p>
 * 所有接口都要求登录——账号是「记忆归属」的前提，有了 user_id 刷题记录才挂在同一个人身上。
 */
@RestController
@RequestMapping("/agent")
public class AgentController {

    @Autowired
    private AgentService agentService;

    @Autowired
    private AgentWatchService watchService;

    @Autowired
    private AgentLlmClient llmClient;

    @GetMapping("/status")
    public Result<Map<String, Object>> status() {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("llmReady", llmClient.available());
        data.put("model", llmClient.available() ? llmClient.getModel() : null);
        return Result.success(data);
    }

    @GetMapping("/sessions")
    public Result<List<AgentSession>> listSessions(Authentication authentication) {
        return Result.success(agentService.listSessions(requireUser(authentication)));
    }

    @PostMapping("/session")
    public Result<AgentSession> createSession(Authentication authentication,
                                             @RequestParam(required = false) String title) {
        return Result.success(agentService.createSession(requireUser(authentication), title));
    }

    @DeleteMapping("/session/{id}")
    public Result<Void> deleteSession(Authentication authentication, @PathVariable Long id) {
        agentService.deleteSession(requireUser(authentication), id);
        return Result.success();
    }

    /** 算法哥对当前账号的长期记忆（每个账号各一份，互相看不到） */
    @GetMapping("/memory")
    public Result<String> memory(Authentication authentication) {
        return Result.success(agentService.getMemory(requireUser(authentication)));
    }

    /** 让他忘掉对这个账号的记忆 */
    @DeleteMapping("/memory")
    public Result<Void> clearMemory(Authentication authentication) {
        agentService.clearMemory(requireUser(authentication));
        return Result.success();
    }

    @GetMapping("/messages")
    public Result<List<AgentMessage>> listMessages(Authentication authentication, @RequestParam Long sessionId) {
        return Result.success(agentService.listMessages(requireUser(authentication), sessionId));
    }

    @PostMapping("/chat")
    public Result<AgentChatVO> chat(Authentication authentication, @Valid @RequestBody AgentChatDTO dto) {
        return Result.success(agentService.chat(requireUser(authentication), dto));
    }

    /** 他不会这题、让你直接写：返回一份完整代码，前端会在编辑器里逐字敲出来 */
    @PostMapping("/solve")
    public Result<AgentSolveVO> solve(Authentication authentication, @RequestBody AgentSolveDTO dto) {
        return Result.success(agentService.solve(requireUser(authentication), dto));
    }

    /**
     * 实时观察：前端把「你干了什么」报上来，算法哥决定要不要开口。
     * 快通道——毫秒级返回一句模板台词。
     */
    @PostMapping("/event")
    public Result<AgentEventVO> onEvent(Authentication authentication, @Valid @RequestBody AgentEventDTO dto) {
        return Result.success(watchService.onEvent(requireUser(authentication), dto));
    }

    /** 慢通道：值得细讲的事件（AC / WA / 连续 WA）再走一次大模型，返回一句话点评 */
    @PostMapping("/event/follow")
    public Result<String> followEvent(Authentication authentication,
                                      @RequestBody Map<String, Object> body) {
        Long userId = requireUser(authentication);
        String type = String.valueOf(body.get("type"));
        Long problemId = body.get("problemId") == null ? null : Long.valueOf(String.valueOf(body.get("problemId")));
        return Result.success(agentService.commentEvent(userId, type, problemId));
    }

    @GetMapping("/analysis")
    public Result<AgentAnalysisVO> analysis(Authentication authentication) {
        return Result.success(agentService.analyze(requireUser(authentication)));
    }

    @GetMapping("/daily")
    public Result<AgentChatVO> daily(Authentication authentication) {
        return Result.success(agentService.daily(requireUser(authentication)));
    }

    @GetMapping("/rank")
    public Result<AgentChatVO> rank(Authentication authentication) {
        return Result.success(agentService.rank(requireUser(authentication)));
    }

    @GetMapping("/plan/latest")
    public Result<AgentPlanVO> latestPlan(Authentication authentication) {
        return Result.success(agentService.latestPlan(requireUser(authentication)));
    }

    @PostMapping("/plan")
    public Result<AgentPlanVO> createPlan(Authentication authentication,
                                          @RequestBody(required = false) AgentPlanDTO dto) {
        return Result.success(agentService.createPlan(requireUser(authentication), dto));
    }

    @PostMapping("/plan/item/{id}/done")
    public Result<Void> markPlanItem(Authentication authentication, @PathVariable Long id,
                                     @RequestParam(defaultValue = "true") Boolean done) {
        agentService.markPlanItem(requireUser(authentication), id, done);
        return Result.success();
    }

    /** 错题本：提交过、但一直没 AC 的题。聊天卡片和个人主页的「错题本」共用这一份数据 */
    @GetMapping("/wrong-problems")
    public Result<List<WrongProblemVO>> wrongProblems(Authentication authentication) {
        return Result.success(agentService.wrongProblems(requireUser(authentication)));
    }

    private Long requireUser(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new BusinessException(401, "先登录再来找我——我认人，不认匿名");
        }
        return (Long) authentication.getPrincipal();
    }

}
