package com.coding.platform.mapper;

import com.coding.platform.entity.MpPlayer;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDateTime;

/**
 * {@code mp_player} 的读写（二期模块 6「个人中心」）。
 *
 * 这张表由**两个人**写：8090 网关写走位与形象（{@code last_x/last_y/last_scene/look_json}），
 * 8081 写档案（{@code bio/college/grade/tags}）。所以这里用一条
 * {@code INSERT ... ON DUPLICATE KEY UPDATE}，两边各更新自己那几列，互不覆盖。
 */
@Mapper
public interface MpPlayerMapper {

    @Select("SELECT user_id AS userId, nickname, look_json AS lookJson, bio, college, grade, tags, "
            + "privacy_json AS privacyJson, "
            + "last_x AS lastX, last_y AS lastY, last_scene AS lastScene, updated_at AS updatedAt "
            + "FROM mp_player WHERE user_id = #{userId}")
    MpPlayer findByUser(@Param("userId") Long userId);

    /**
     * 建档 / 改档。{@code nickname} 与 {@code look_json} 由服务层从账号表和库里现值填好再传进来
     * —— 服务层总是先 {@link #findByUser} 读出这一行，没带 look 就把库里那份原样写回，
     * 所以这里带上 {@code look_json} 不会把网关刚存的那张脸冲掉。
     *
     * ⚠️ 形象必须能从这里走：试衣间「就这个样子」那条路是发给 8090 网关的，
     *    而**单机模式（没连上网关）时那条路不通**（§7.7），个人中心里换的形象就存不下。
     *    走位三列（{@code last_x/last_y/last_scene}）不在这里更新，那是网关的事。
     */
    @Insert("INSERT INTO mp_player(user_id, nickname, look_json, bio, college, grade, tags, privacy_json) "
            + "VALUES(#{userId}, #{nickname}, #{lookJson}, #{bio}, #{college}, #{grade}, #{tags}, #{privacyJson}) "
            + "ON DUPLICATE KEY UPDATE look_json = VALUES(look_json), "
            + "bio = VALUES(bio), college = VALUES(college), "
            + "grade = VALUES(grade), tags = VALUES(tags), "
            + "privacy_json = VALUES(privacy_json)")
    int upsertProfile(MpPlayer player);

    /** 「我的数据」：发过几条公告（软删的不算，§10.3）。 */
    @Select("SELECT COUNT(*) FROM mp_announcement WHERE user_id = #{userId} AND deleted = 0")
    int countAnnouncements(@Param("userId") Long userId);

    /** 「我的数据」：和几个人说过话（双向去重成一个数）。 */
    @Select("SELECT COUNT(DISTINCT CASE WHEN from_user = #{userId} THEN to_user ELSE from_user END) "
            + "FROM mp_message WHERE from_user = #{userId} OR to_user = #{userId}")
    int countChatPeers(@Param("userId") Long userId);

    /** 最后活跃时刻（{@code mp_presence} 心跳时刷新）。没这行 ⇒ null，当离线处理。 */
    @Select("SELECT last_seen FROM mp_presence WHERE user_id = #{userId}")
    LocalDateTime findLastSeen(@Param("userId") Long userId);
}
