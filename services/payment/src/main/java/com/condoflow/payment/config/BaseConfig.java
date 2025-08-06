package com.condoflow.payment.config;

import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration
@EnableJpaAuditing
@EnableDiscoveryClient
@EnableFeignClients(
        basePackages = {
                "com.condoflow.payment.apartment",
                "com.condoflow.payment.resident"
        }
)
public class BaseConfig {
}
