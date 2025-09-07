package com.condoflow.expense.config;

import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration
@EnableDiscoveryClient
@EnableJpaAuditing
@EnableFeignClients(
        basePackages = {}
)
public class BaseConfig {
}
