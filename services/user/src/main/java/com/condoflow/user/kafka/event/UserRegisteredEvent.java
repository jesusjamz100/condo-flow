package com.condoflow.user.kafka.event;

import java.time.Instant;

public record UserRegisteredEvent (
        Long userId,
        Instant timestamp
) {
}
