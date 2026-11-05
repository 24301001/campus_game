package com.coding.platform.service;

import cn.hutool.core.util.StrUtil;
import cn.hutool.http.HttpRequest;
import cn.hutool.http.HttpResponse;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.coding.platform.exception.BusinessException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * 算法哥的大模型客户端（OpenAI 兼容协议）。
 * <p>
 * 只负责「把话说好」这一件事——判题、统计、题单全部走确定性逻辑，
 * 大模型不参与任何结论的产生，只负责把结论讲成人话。
 */
@Slf4j
@Component
public class AgentLlmClient {

    /** 例：https://api.deepseek.com 或 https://dashscope.aliyuncs.com/compatible-mode */
    @Value("${agent.llm.base-url:}")
    private String baseUrl;

    @Value("${agent.llm.api-key:}")
    private String apiKey;

    @Value("${agent.llm.model:}")
    private String model;

    @Value("${agent.llm.temperature:0.6}")
    private Double temperature;

    @Value("${agent.llm.timeout:60000}")
    private Integer timeout;

    public boolean available() {
        return StrUtil.isNotBlank(baseUrl) && StrUtil.isNotBlank(apiKey) && StrUtil.isNotBlank(model);
    }

    public String getModel() {
        return model;
    }

    /**
     * @param systemPrompt 人格与铁律
     * @param messages     多轮对话，元素形如 {"role":"user","content":"..."}
     * @return 模型回复；未配置时返回 null
     */
    public String chat(String systemPrompt, List<Map<String, String>> messages) {
        if (!available()) {
            return null;
        }

        JSONArray messageArray = new JSONArray();
        if (StrUtil.isNotBlank(systemPrompt)) {
            JSONObject system = new JSONObject();
            system.set("role", "system");
            system.set("content", systemPrompt);
            messageArray.add(system);
        }
        for (Map<String, String> message : messages) {
            JSONObject item = new JSONObject();
            item.set("role", message.get("role"));
            item.set("content", message.get("content"));
            messageArray.add(item);
        }

        JSONObject body = new JSONObject();
        body.set("model", model);
        body.set("messages", messageArray);
        body.set("temperature", temperature);
        body.set("stream", false);

        String url = resolveUrl();
        try (HttpResponse response = HttpRequest.post(url)
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .body(body.toString())
                .timeout(timeout)
                .execute()) {

            String raw = response.body();
            if (!response.isOk()) {
                log.error("算法哥调用大模型失败：status={}, body={}", response.getStatus(), raw);
                throw new BusinessException("算法哥暂时联系不上大模型（HTTP " + response.getStatus()
                        + "），检查一下 application.yml 里 agent.llm 的配置");
            }

            JSONObject json = JSONUtil.parseObj(raw);
            JSONArray choices = json.getJSONArray("choices");
            if (choices == null || choices.isEmpty()) {
                log.error("算法哥拿到的大模型响应不含 choices：{}", raw);
                throw new BusinessException("大模型没有返回内容");
            }

            JSONObject message = choices.getJSONObject(0).getJSONObject("message");
            String content = message.getStr("content");
            if (StrUtil.isBlank(content)) {
                // 推理类模型有时把内容放在 reasoning_content
                content = message.getStr("reasoning_content");
            }
            if (StrUtil.isBlank(content)) {
                throw new BusinessException("大模型返回了空内容，换个说法再问一次");
            }
            return content.trim();

        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("算法哥调用大模型异常", e);
            throw new BusinessException("算法哥调用大模型出错：" + e.getMessage());
        }
    }

    private String resolveUrl() {
        String url = baseUrl.trim();
        if (url.endsWith("/chat/completions")) {
            return url;
        }
        if (url.endsWith("/")) {
            url = url.substring(0, url.length() - 1);
        }
        return url.endsWith("/v1") ? url + "/chat/completions" : url + "/v1/chat/completions";
    }

}
