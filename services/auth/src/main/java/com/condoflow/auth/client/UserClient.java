package com.condoflow.auth.client;

import com.condoflow.auth.auth.dto.UserRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
        name = "user-service",
        url  = "${feign.client.user-service.url}"
)
public interface UserClient {

    @GetMapping("/users/document/exists/{document}")
    Boolean existsByDocument(@PathVariable("document") String document);

    @GetMapping("/users/register")
    ResponseEntity<Long> registerUser(@RequestBody UserRequest userRequest);
}
