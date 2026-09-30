package com.coding.platform.utils;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * 聚合查询结果（Map）的取值工具：
 * MySQL 的 COUNT/SUM 在不同驱动下会返回 Long / BigInteger / BigDecimal，
 * 这里统一收口，避免每个调用点都写一遍类型判断。
 */
public final class StatsUtil {

    private StatsUtil() {
    }

    public static long asLong(Object value) {
        if (value == null) {
            return 0L;
        }
        if (value instanceof BigDecimal) {
            return ((BigDecimal) value).longValue();
        }
        if (value instanceof Number) {
            return ((Number) value).longValue();
        }
        try {
            return Long.parseLong(value.toString());
        } catch (NumberFormatException e) {
            return 0L;
        }
    }

    public static int asInt(Object value) {
        return (int) asLong(value);
    }

    public static double asDouble(Object value) {
        if (value == null) {
            return 0D;
        }
        if (value instanceof BigDecimal) {
            return ((BigDecimal) value).doubleValue();
        }
        if (value instanceof Number) {
            return ((Number) value).doubleValue();
        }
        try {
            return Double.parseDouble(value.toString());
        } catch (NumberFormatException e) {
            return 0D;
        }
    }

    /** 百分比，保留一位小数 */
    public static double rate(long part, long total) {
        if (total <= 0) {
            return 0D;
        }
        return BigDecimal.valueOf(part * 100.0 / total)
                .setScale(1, RoundingMode.HALF_UP)
                .doubleValue();
    }

}
