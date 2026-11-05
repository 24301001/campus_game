package com.coding.platform.service;

import com.coding.platform.entity.MpTicket;
import com.coding.platform.entity.User;
import com.coding.platform.mapper.MpTicketMapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 一次登录通四家（任务书 §3.1.3）。
 *
 * 主站验完主票，替玩家向三家 NPC 服务领各自的票，再把这些票写成**路径限定的
 * HttpOnly Cookie**。地图是走 3000 的同源代理加载 iframe 的，浏览器自动按路径带上
 * 对应那张 ⇒ 抽屉里直接是已登录状态，四家都不会再弹自己的登录框（§3.1.2）。
 *
 * 各家服务读哪张 cookie 由**它自己**的代码决定（老丁 {@code ld_t}、阿姨
 * {@code aunt_session}、学霸姐 {@code xbg_token}），所以这里种的名字必须和它一致，
 * 不能照任务书 §4.1 那张示意表里的 {@code cmr_t} 写 —— 名字错了服务认不出票，
 * 表现就是 HUD 上那句「没登进去」。
 */
@Slf4j
@Service
public class MpExchangeService {

    /** 一家 NPC 的换票坐标。地址就是 §4.2 端口表，和 vite.config 的代理一一对应。 */
    private static final class Peer {
        final String service;
        final String baseUrl;
        final String cookieName;
        final String cookiePath;

        Peer(String service, String baseUrl, String cookieName, String cookiePath) {
            this.service = service;
            this.baseUrl = baseUrl;
            this.cookieName = cookieName;
            this.cookiePath = cookiePath;
        }
    }

    private static final List<Peer> PEERS = Arrays.asList(
            new Peer("xbg", "http://127.0.0.1:8010", "xbg_token", "/xbg"),
            new Peer("ld", "http://127.0.0.1:8000", "ld_t", "/ld"),
            new Peer("cmr", "http://127.0.0.1:8020", "aunt_session", "/cmr"));

    /** 票的寿命。各家签的票本身是 30 天，这里刻意缩短：过期后地图会自己再来换一次。 */
    private static final long TICKET_TTL_HOURS = 12;

    /** 服务间共享密钥。没配就等于内部通道没开，一次票也换不到（见 {@link #exchange}）。 */
    @Value("${campus.mp.internal-secret:}")
    private String internalSecret;

    @Autowired
    private MpTicketMapper ticketMapper;

    private final RestTemplate http;
    private final ObjectMapper json = new ObjectMapper();

    public MpExchangeService() {
        // 超时是必须的：地图那边不 await 这次换票，但也不能让一个卡死的邻居
        // 把 8081 的工作线程全占住。
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(1500);
        factory.setReadTimeout(4000);
        this.http = new RestTemplate(factory);
    }

    /**
     * 替 {@code user} 向三家领票。
     *
     * @param headers 往这个对象里塞 {@code Set-Cookie}，由控制器发给浏览器
     * @return 每家的结果：{@code ok} / {@code down}（没配密钥也算 down），
     *         给前端和 {@code mp_ticket} 表看，不参与放行判断
     */
    public Map<String, String> exchange(User user, HttpHeaders headers) {
        Map<String, String> status = new LinkedHashMap<>();
        if (internalSecret == null || internalSecret.isEmpty()) {
            log.warn("campus.mp.internal-secret 没配，四家的票一张也换不到；"
                    + "启动器（启动像素校园.bat）会设 CAMPUS_INTERNAL_SECRET");
        }
        for (Peer peer : PEERS) {
            String ticket = fetchTicket(peer, user);
            if (ticket == null) {
                status.put(peer.service, "down");
                continue;
            }
            status.put(peer.service, "ok");
            remember(user.getId(), peer.service, ticket);
            headers.add(HttpHeaders.SET_COOKIE, buildCookie(peer, ticket));
        }
        return status;
    }

    /** 登出时把票作废：拿存着的票回头叫各家自己清会话，再把票仓那一行删掉（§9.2 铁律 4）。 */
    public void revoke(Long userId, HttpHeaders headers) {
        for (MpTicket row : ticketMapper.findByUser(userId)) {
            Peer peer = peerOf(row.getService());
            if (peer == null) continue;
            HttpHeaders outbound = new HttpHeaders();
            outbound.set(HttpHeaders.COOKIE, peer.cookieName + "=" + row.getTicket());
            if (internalSecret != null && !internalSecret.isEmpty()) {
                outbound.set("X-Campus-Internal", internalSecret);
            }
            try {
                http.postForEntity(peer.baseUrl + "/api/logout",
                        new HttpEntity<Void>(outbound), String.class);
            } catch (RestClientException e) {
                // 那家没在跑就没法替它清会话；票反正已经从 mp_ticket 删了，
                // 它的会话只能等自己过期。
                log.warn("通知 {} 作废票失败：{}", peer.service, e.getMessage());
            }
            headers.add(HttpHeaders.SET_COOKIE, expireCookie(peer));
        }
        ticketMapper.deleteByUser(userId);
    }

    private String fetchTicket(Peer peer, User user) {
        if (internalSecret == null || internalSecret.isEmpty()) return null;
        Map<String, Object> body = new HashMap<>();
        body.put("nickname", nicknameOf(user));
        body.put("campus_user_id", user.getId());
        HttpHeaders outbound = new HttpHeaders();
        outbound.setContentType(MediaType.APPLICATION_JSON);
        outbound.set("X-Campus-Internal", internalSecret);
        try {
            ResponseEntity<String> response = http.postForEntity(
                    peer.baseUrl + "/api/host-ticket", new HttpEntity<>(body, outbound), String.class);
            String token = json.readTree(response.getBody()).path("token").asText(null);
            if (token == null || token.isEmpty()) {
                log.warn("{} 的 host-ticket 没回 token 字段", peer.service);
                return null;
            }
            return token;
        } catch (Exception e) {
            // 403/503（密钥不对、那家没开内部通道）和连不上都归到这里：
            // 换不到票不是故障，地图会照实说「XX 没登进去」。
            log.warn("向 {} 换票失败：{}", peer.service, e.getMessage());
            return null;
        }
    }

    private void remember(Long userId, String service, String ticket) {
        MpTicket row = new MpTicket();
        row.setUserId(userId);
        row.setService(service);
        row.setTicket(ticket);
        row.setExpiresAt(LocalDateTime.now().plusHours(TICKET_TTL_HOURS));
        ticketMapper.upsert(row);
    }

    private static Peer peerOf(String service) {
        for (Peer peer : PEERS) {
            if (peer.service.equals(service)) return peer;
        }
        return null;
    }

    private static String nicknameOf(User user) {
        String nickname = user.getNickname();
        return (nickname == null || nickname.trim().isEmpty()) ? user.getUsername() : nickname.trim();
    }

    /**
     * 路径限定是关键：{@code /xbg} 的票不能串到 {@code /ld} 去。
     * 没写 {@code Secure} —— 本地是 http，加了浏览器直接不收这张 cookie。
     */
    private static String buildCookie(Peer peer, String ticket) {
        return ResponseCookie.from(peer.cookieName, ticket)
                .path(peer.cookiePath)
                .httpOnly(true)
                .sameSite("Lax")
                .maxAge(Duration.ofHours(TICKET_TTL_HOURS))
                .build().toString();
    }

    private static String expireCookie(Peer peer) {
        return ResponseCookie.from(peer.cookieName, "")
                .path(peer.cookiePath)
                .httpOnly(true)
                .sameSite("Lax")
                .maxAge(0)
                .build().toString();
    }
}
