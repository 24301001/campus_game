package com.coding.platform.mapper;

import com.coding.platform.entity.MpTicket;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * {@code mp_ticket} 的读写。这张表是 (user_id, service) 复合主键，
 * MyBatis-Plus 的 {@code BaseMapper} 按单列主键假设干活（{@code updateById}/{@code deleteById}
 * 都会找不到 id 列），所以这里不继承它，直接写三条够用的语句。
 */
@Mapper
public interface MpTicketMapper {

    @Select("SELECT user_id AS userId, service, ticket, expires_at AS expiresAt "
            + "FROM mp_ticket WHERE user_id = #{userId}")
    List<MpTicket> findByUser(@Param("userId") Long userId);

    /** 同一个人对同一家只有一行：换到新手票就覆盖旧的。 */
    @Insert("INSERT INTO mp_ticket(user_id, service, ticket, expires_at) "
            + "VALUES(#{userId}, #{service}, #{ticket}, #{expiresAt}) "
            + "ON DUPLICATE KEY UPDATE ticket = VALUES(ticket), expires_at = VALUES(expires_at)")
    int upsert(MpTicket ticket);

    @Delete("DELETE FROM mp_ticket WHERE user_id = #{userId}")
    int deleteByUser(@Param("userId") Long userId);
}
