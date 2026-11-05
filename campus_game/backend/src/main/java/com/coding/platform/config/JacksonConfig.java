package com.coding.platform.config;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

@Configuration
public class JacksonConfig {

    @Bean
    public Jackson2ObjectMapperBuilder jackson2ObjectMapperBuilder() {
        Jackson2ObjectMapperBuilder builder = new Jackson2ObjectMapperBuilder();
        builder.propertyNamingStrategy(PropertyNamingStrategies.LOWER_CAMEL_CASE);
        // 时间一律输出 ISO 字符串（2026-06-15T13:09:16），不要输出 [2026,6,15,...] 这种数组。
        // 前端到处是 new Date(时间)，拿到数组会解析成 Invalid Date / NaN-NaN（加入时间、最近通过都栽在这）。
        builder.featuresToDisable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        return builder;
    }

}
