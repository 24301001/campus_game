package com.coding.platform.service;

import cn.hutool.core.util.StrUtil;
import cn.hutool.http.HttpRequest;
import cn.hutool.http.HttpResponse;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 算法哥的「联网」通道（可选）。
 * <p>
 * 找类似题这件事，题库里已经事先挂好了同类型题（problem_similar 表），不联网也能用。
 * 这里只做一层补充：配了搜索 key 就再去网上翻几条相关题解/题目一起给他；
 * 没配 key、或者搜索服务抽风，一律静默返回空——绝不打断主流程。
 * <p>
 * 默认对接 Serper（https://google.serper.dev/search，POST {"q":...,"num":...}，Header X-API-KEY），
 * 换别家只要返回 {organic:[{title,link,snippet}]} 这个形状就能直接用，
 * 否则改 search() 里的解析即可。
 */
@Slf4j
@Component
public class AgentSearchClient {

    @Value("${agent.search.api-key:}")
    private String apiKey;

    @Value("${agent.search.endpoint:https://google.serper.dev/search}")
    private String endpoint;

    @Value("${agent.search.timeout:8000}")
    private Integer timeout;

    /** 配了 key 才算能联网 */
    public boolean available() {
        return StrUtil.isNotBlank(apiKey);
    }

    /**
     * 联网搜索。任何异常都吞掉并返回空 list。
     *
     * @return 每条是 {title, link, snippet}；没联网或搜不到时是空 list
     */
    public List<Map<String, String>> search(String query, int count) {
        List<Map<String, String>> results = new ArrayList<>();
        if (!available() || StrUtil.isBlank(query) || count <= 0) {
            return results;
        }
        try {
            JSONObject body = new JSONObject();
            body.set("q", query);
            body.set("num", count);
            body.set("gl", "cn");
            body.set("hl", "zh-cn");

            try (HttpResponse response = HttpRequest.post(endpoint)
                    .header("X-API-KEY", apiKey)
                    .header("Content-Type", "application/json")
                    .body(body.toString())
                    .timeout(timeout)
                    .execute()) {

                if (!response.isOk()) {
                    log.warn("算法哥联网搜索失败：status={}, body={}", response.getStatus(), response.body());
                    return results;
                }

                JSONArray organic = JSONUtil.parseObj(response.body()).getJSONArray("organic");
                if (organic == null) {
                    return results;
                }
                for (Object item : organic) {
                    if (!(item instanceof JSONObject)) {
                        continue;
                    }
                    JSONObject row = (JSONObject) item;
                    String title = row.getStr("title");
                    String link = row.getStr("link");
                    if (StrUtil.isBlank(title) || StrUtil.isBlank(link)) {
                        continue;
                    }
                    Map<String, String> hit = new LinkedHashMap<>();
                    hit.put("title", title);
                    hit.put("link", link);
                    hit.put("snippet", StrUtil.blankToDefault(row.getStr("snippet"), ""));
                    results.add(hit);
                    if (results.size() >= count) {
                        break;
                    }
                }
            }
        } catch (Exception e) {
            log.warn("算法哥联网搜索出错，退回题库内相似题：{}", e.getMessage());
        }
        return results;
    }
}
