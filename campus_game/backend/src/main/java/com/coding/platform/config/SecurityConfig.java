package com.coding.platform.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        // 任务书 §5.1「明文永不落库」。一期这里是 NoOpPasswordEncoder（直接比明文），
        // 换过来之前库里那些明文口令由 DataInitConfig 启动时一次性补成 bcrypt。
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
                // 二期模块 6：个人中心三条口必须带主票。
                // ⚠️ 必须排在下面那条 permitAll 的 `/profile/**` **之前** —— 谁先匹配谁说话，
                //    写反了就等于 `/api/profile/me` 谁都能翻，别人的学院年级一抓一大把。
                .antMatchers("/profile/me", "/profile/card/**").authenticated()
                .antMatchers("/auth/**", "/problem/**", "/problems/**", "/category/list", "/tag/**", "/company/**", "/judge/**", "/submit/**", "/collect/**", "/note/**", "/profile/**", "/agent/**", "/uploads/**", "/api/uploads/**").permitAll()
                .antMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
                .and()
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }

}
