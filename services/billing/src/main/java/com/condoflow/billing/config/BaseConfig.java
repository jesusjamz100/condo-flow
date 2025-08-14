package com.condoflow.billing.config;

import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration
@EnableJpaAuditing
@EnableDiscoveryClient
@EnableFeignClients(
        basePackages = {
                "com.condoflow.billing.expense",
                "com.condoflow.billing.apartment",
                "com.condoflow.billing.payment"
        }
)
public class BaseConfig {
}
