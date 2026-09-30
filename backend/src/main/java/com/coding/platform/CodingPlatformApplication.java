package com.coding.platform;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.coding.platform.mapper")
public class CodingPlatformApplication {

    public static void main(String[] args) {
        SpringApplication.run(CodingPlatformApplication.class, args);
    }

}
