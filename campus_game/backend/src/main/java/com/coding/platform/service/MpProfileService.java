package com.coding.platform.service;

import com.coding.platform.exception.BusinessException;
import com.coding.platform.entity.MpPlayer;
import com.coding.platform.entity.User;
import com.coding.platform.mapper.MpPlayerMapper;
import com.coding.platform.mapper.UserMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Supplier;

/**
 * 二期模块 6「个人中心」（任务书 §10）。
 *
 * 两个视图对应两份数据（§10.2）：
 * <ul>
 *   <li>{@link #me} —— 自己看自己：全部字段 + 可编辑标记 + 数据统计；</li>
 *   <li>{@link #card} —— 别人看我：**服务端白名单裁剪**，只交出 nickname / look / bio /
 *       college / grade / tags / online / lastSeen 这几个键。多一个都不给（§6.2 / §10.6 红线 2）——
 *       前端隐藏能被改请求绕过去，服务端不返回的字段，抓包也抓不到。</li>
 * </ul>
 *
 * 昵称为什么锁死（§10.3）：公告与私聊存的是**当时的署名**，昵称一改，历史公告就变成
 * "一个曾经叫过别的名字的人"发的，公告栏的可信度没了。所以 {@link #save} 根本不读请求里的
 * 昵称，{@code user.nickname} 也从这条路径改不动。
 */
@Slf4j
@Service
public class MpProfileService {

    /** 学院下拉（不做自由输入，避免"计算机学院 / 计院 / CS"三种写法，§10.3）。 */
    public static final List<String> COLLEGES = Collections.unmodifiableList(Arrays.asList(
            "计算机与信息技术学院", "电子信息工程学院", "自动化与电气工程学院",
            "机械与电子控制工程学院", "交通运输学院", "土木建筑工程学院", "环境学院",
            "经济管理学院", "理学院", "语言与传播学院", "法学院", "马克思主义学院",
            "国际教育学院", "其他"));

    /** 年级下拉：大一~大四 / 硕士 / 博士。 */
    public static final List<String> GRADES = Collections.unmodifiableList(Arrays.asList(
            "大一", "大二", "大三", "大四", "硕士", "博士", "其他"));

    static final int BIO_MAX = 40;
    static final int TAG_MAX = 5;
    static final int TAG_LEN_MAX = 6;

    /** 在线判定窗口：网关每次心跳都刷 {@code mp_presence.last_seen}，90 秒没动静就当离线。 */
    private static final long ONLINE_WINDOW_SECONDS = 90;

    private static final Set<String> HAIR = new LinkedHashSet<String>(
            Arrays.asList("short", "mid", "long", "ponytail", "bun", "curly"));
    private static final Set<String> EYE = new LinkedHashSet<String>(Arrays.asList("round", "narrow", "dot"));
    private static final Set<String> ACC = new LinkedHashSet<String>(Arrays.asList("none", "glasses", "cap", "scarf"));

    /** §8.4 那七个字段的出厂值，与前端 `mp/look.js` 的 `LK_DEF` 逐字相同。 */
    private static final Map<String, String> LK_DEF = lkDef();

    @Autowired
    private MpPlayerMapper playerMapper;

    @Autowired
    private UserMapper userMapper;

    private final ObjectMapper json = new ObjectMapper();

    /** 自己看自己：全部字段 + 可编辑标记 + 只自己可见的数据统计。 */
    public Map<String, Object> me(Long userId) {
        User user = requireUser(userId);
        MpPlayer row = rowOf(userId, user);
        LocalDateTime lastSeen = rowLastSeen(userId);

        Map<String, Object> out = new LinkedHashMap<String, Object>();
        out.put("userId", userId);
        out.put("nickname", nicknameOf(user));
        out.put("look", parseLook(row.getLookJson()));
        out.put("bio", orEmpty(row.getBio()));
        out.put("college", orEmpty(row.getCollege()));
        out.put("grade", orEmpty(row.getGrade()));
        out.put("tags", parseTags(row.getTags()));
        out.put("editable", editable());
        out.put("limits", limits());
        out.put("colleges", COLLEGES);
        out.put("grades", GRADES);
        Map<String, Object> stats = new LinkedHashMap<String, Object>();
        stats.put("announcements", countOrZero(new Supplier<Integer>() {
            public Integer get() { return playerMapper.countAnnouncements(userId); }
        }, "announcements"));
        stats.put("chatPeers", countOrZero(new Supplier<Integer>() {
            public Integer get() { return playerMapper.countChatPeers(userId); }
        }, "chatPeers"));
        out.put("stats", stats);
        out.put("online", isOnline(lastSeen));
        out.put("lastSeen", epochMillis(lastSeen));
        return out;
    }

    /**
     * 保存档案。入参只认 {@code bio / college / grade / tags / look} 五个键，
     * 昵称、账号、角色、邮箱一律不从这里走（§10.7 验收第 2 条）。
     */
    public Map<String, Object> save(Long userId, Map<String, Object> body) {
        User user = requireUser(userId);
        Map<String, Object> input = body == null
                ? Collections.<String, Object>emptyMap() : body;

        String bio = cleanBio(input.get("bio"));
        String college = cleanChoice(input.get("college"), COLLEGES, "学院");
        String grade = cleanChoice(input.get("grade"), GRADES, "年级");
        String tags = dump(cleanTags(input.get("tags")));

        MpPlayer row = rowOf(userId, user);
        /* 配方可以只改一两个字段（试衣间那三个下拉就是分别改的），所以以库里那份为底。 */
        Object lookInput = input.get("look");
        if (lookInput != null) row.setLookJson(dump(normalize(lookInput, parseLook(row.getLookJson()))));
        row.setBio(bio);
        row.setCollege(college);
        row.setGrade(grade);
        row.setTags(tags);
        playerMapper.upsertProfile(row);

        /* 一期那个个人主页读的是 `user.bio`；两边写同一个值，免得同一个人两张脸上说两种话。 */
        if (!bio.equals(orEmpty(user.getBio()))) {
            User patch = new User();
            patch.setId(userId);
            patch.setBio(bio);
            userMapper.updateById(patch);
        }
        return me(userId);
    }

    /**
     * 别人看的缩略主页：**白名单裁剪**。
     * 这张卡片里没有数据统计、没有四向预览、没有任何可编辑入口（§10.5），
     * 也没有学号 / 邮箱 / 真实姓名 —— 那些字段压根不在表里（§10.6 红线 1）。
     */
    public Map<String, Object> card(Long viewerId, Long targetUserId) {
        User target = userMapper.selectById(targetUserId);
        if (target == null) throw new BusinessException("玩家不存在");
        MpPlayer row = rowOf(targetUserId, target);
        LocalDateTime lastSeen = rowLastSeen(targetUserId);

        Map<String, Object> out = new LinkedHashMap<String, Object>();
        out.put("userId", targetUserId);
        out.put("nickname", nicknameOf(target));
        out.put("look", parseLook(row.getLookJson()));
        out.put("bio", orEmpty(row.getBio()));
        out.put("college", orEmpty(row.getCollege()));
        out.put("grade", orEmpty(row.getGrade()));
        out.put("tags", parseTags(row.getTags()));
        out.put("online", isOnline(lastSeen));
        out.put("lastSeen", epochMillis(lastSeen));
        out.put("self", viewerId != null && viewerId.equals(targetUserId));
        return out;
    }

    /* --- 落库与回落 --------------------------------------------------- */

    private User requireUser(Long userId) {
        User user = userMapper.selectById(userId);
        if (user == null) throw new BusinessException("用户不存在");
        return user;
    }

    /**
     * 档案行。人可能只登录过主站、从没进过地图 ⇒ {@code mp_player} 里没这行，
     * 这里只造一个空对象，写的时候由 {@link MpPlayerMapper#upsertProfile} 补一行
     * （那一条 INSERT 里带了 NOT NULL 的 nickname / look_json 出厂值）。
     */
    private MpPlayer rowOf(Long userId, User user) {
        MpPlayer row = playerMapper.findByUser(userId);
        if (row == null) row = new MpPlayer();
        row.setUserId(userId);
        row.setNickname(nicknameOf(user));
        if (row.getLookJson() == null || row.getLookJson().trim().isEmpty()) {
            row.setLookJson(dump(lookOf(LK_DEF)));
        }
        if (row.getTags() == null) row.setTags("[]");
        if (row.getBio() == null) row.setBio("");
        if (row.getCollege() == null) row.setCollege("");
        if (row.getGrade() == null) row.setGrade("");
        return row;
    }

    private LocalDateTime rowLastSeen(Long userId) {
        try {
            return playerMapper.findLastSeen(userId);
        } catch (Exception e) {
            log.warn("读 mp_presence 失败：{}", e.getMessage());
            return null;
        }
    }

    private int countOrZero(Supplier<Integer> count, String what) {
        try {
            Integer value = count.get();
            return value == null ? 0 : value;
        } catch (Exception e) {
            /* 「我的数据」只是给自己看的一行小字，统计口径出问题不该整个面板打不开。 */
            log.warn("统计 {} 失败：{}", what, e.getMessage());
            return 0;
        }
    }

    /* --- 校验：长度按**码点**算，一个 emoji 不算两个字 ------------------ */

    private static String cleanBio(Object value) {
        String bio = scrub(value == null ? "" : String.valueOf(value)).trim();
        if (bio.codePointCount(0, bio.length()) > BIO_MAX) {
            throw new BusinessException("签名最多 " + BIO_MAX + " 字");
        }
        return bio;
    }

    private static String cleanChoice(Object value, List<String> allowed, String label) {
        String picked = clean(value == null ? "" : String.valueOf(value));
        if (picked.isEmpty()) return "";
        if (!allowed.contains(picked)) throw new BusinessException(label + "不在可选范围内");
        return picked;
    }

    private List<String> cleanTags(Object value) {
        List<String> list = new ArrayList<String>();
        if (value == null) return list;
        if (!(value instanceof Iterable)) {
            throw new BusinessException("兴趣标签格式不对");
        }
        for (Object item : (Iterable<?>) value) {
            String tag = clean(item == null ? "" : String.valueOf(item));
            if (tag.isEmpty()) continue;
            if (tag.codePointCount(0, tag.length()) > TAG_LEN_MAX) {
                throw new BusinessException("每个兴趣标签最多 " + TAG_LEN_MAX + " 字");
            }
            if (!list.contains(tag)) list.add(tag);
        }
        if (list.size() > TAG_MAX) throw new BusinessException("兴趣标签最多 " + TAG_MAX + " 个");
        return list;
    }

    /* --- 形象配方：§8.4 七个字段重新拼一遍，多余字段直接丢 --------------
       别人客户端会照这份配方画小人，所以**不能把任意 JSON 原样存进库**。 */

    private Map<String, Object> normalize(Object value, Map<String, Object> base) {
        if (!(value instanceof Map)) throw new BusinessException("形象配方格式不对");
        Map<String, Object> src = (Map<String, Object>) value;
        Map<String, Object> out = new LinkedHashMap<String, Object>(base);
        out.put("skin", hexOr(src.get("skin"), LK_DEF.get("skin")));
        out.put("hairColor", hexOr(src.get("hairColor"), LK_DEF.get("hairColor")));
        out.put("cloth", hexOr(src.get("cloth"), LK_DEF.get("cloth")));
        out.put("pants", hexOr(src.get("pants"), LK_DEF.get("pants")));
        out.put("hairStyle", oneOf(src.get("hairStyle"), HAIR, LK_DEF.get("hairStyle")));
        out.put("eye", oneOf(src.get("eye"), EYE, LK_DEF.get("eye")));
        out.put("acc", oneOf(src.get("acc"), ACC, LK_DEF.get("acc")));
        return out;
    }

    /** 库里的 look_json 可能是半截 JSON、老数据、甚至空串 ⇒ 一律回落出厂配方，绝不抛。 */
    private Map<String, Object> parseLook(String raw) {
        Map<String, Object> out = new LinkedHashMap<String, Object>(LK_DEF);
        if (raw == null || raw.trim().isEmpty()) return out;
        try {
            Object parsed = json.readValue(raw, Object.class);
            if (parsed instanceof Map) out.putAll(normalize(parsed, out));
        } catch (Exception e) {
            /* 坏 JSON 就当没配过形象，画默认那张脸。 */
        }
        return out;
    }

    @SuppressWarnings("unchecked")
    private List<String> parseTags(String raw) {
        List<String> out = new ArrayList<String>();
        if (raw == null || raw.trim().isEmpty()) return out;
        try {
            Object parsed = json.readValue(raw, new TypeReference<List<Object>>() { });
            for (Object item : (List<Object>) parsed) {
                String tag = clean(item == null ? "" : String.valueOf(item));
                if (!tag.isEmpty() && !out.contains(tag)) out.add(tag);
            }
        } catch (Exception e) {
            return out;
        }
        return out;
    }

    private String dump(Object value) {
        try {
            return json.writeValueAsString(value);
        } catch (Exception e) {
            return "[]";
        }
    }

    /* --- 小工具 ------------------------------------------------------- */

    private static Map<String, String> lkDef() {
        Map<String, String> out = new LinkedHashMap<String, String>();
        out.put("skin", "#e9bb92");
        out.put("hairStyle", "short");
        out.put("hairColor", "#241d1a");
        out.put("eye", "round");
        out.put("cloth", "#3f6ea8");
        out.put("pants", "#454c5a");
        out.put("acc", "none");
        return out;
    }

    private static Map<String, Object> lookOf(Map<String, String> def) {
        return new LinkedHashMap<String, Object>(def);
    }

    private static Map<String, Object> editable() {
        Map<String, Object> out = new LinkedHashMap<String, Object>();
        out.put("nickname", false);          // 🔒 注册名
        out.put("bio", true);
        out.put("college", true);
        out.put("grade", true);
        out.put("tags", true);
        out.put("look", true);
        return out;
    }

    private static Map<String, Object> limits() {
        Map<String, Object> out = new LinkedHashMap<String, Object>();
        out.put("bio", BIO_MAX);
        out.put("tags", TAG_MAX);
        out.put("tagLen", TAG_LEN_MAX);
        return out;
    }

    private static String hexOr(Object value, String fallback) {
        String s = clean(value == null ? "" : String.valueOf(value));
        return s.matches("^#[0-9a-fA-F]{6}$") ? s.toLowerCase() : fallback;
    }

    private static String oneOf(Object value, Set<String> allowed, String fallback) {
        String s = clean(value == null ? "" : String.valueOf(value)).toLowerCase();
        return allowed.contains(s) ? s : fallback;
    }

    private static boolean isOnline(LocalDateTime lastSeen) {
        if (lastSeen == null) return false;
        return Duration.between(lastSeen, LocalDateTime.now()).getSeconds() < ONLINE_WINDOW_SECONDS;
    }

    private static long epochMillis(LocalDateTime time) {
        if (time == null) return 0;
        return time.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
    }

    private static String clean(String s) {
        return s == null ? "" : s.replaceAll("[\\r\\n\\t]+", " ").trim();
    }

    /** 控制字符一律去掉；全角空格与全角括号换成半角，省得公告栏里出现两种宽度。 */
    private static String scrub(String s) {
        StringBuilder out = new StringBuilder(s.length());
        for (int i = 0; i < s.length(); ) {
            int cp = s.codePointAt(i);
            i += Character.charCount(cp);
            if (Character.isISOControl(cp)) continue;
            if (cp == '　') out.append(' ');
            else out.appendCodePoint(cp);
        }
        return out.toString();
    }

    private static String orEmpty(String s) { return s == null ? "" : s; }

    private static String nicknameOf(User user) {
        String nickname = orEmpty(user.getNickname()).trim();
        return nickname.isEmpty() ? orEmpty(user.getUsername()) : nickname;
    }
}
