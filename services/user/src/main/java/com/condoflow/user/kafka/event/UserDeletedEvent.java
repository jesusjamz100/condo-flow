package com.condoflow.user.kafka.event;

import java.time.Instant;

public record UserDeletedEvent(
        Long userId,
        Instant now
) {
}
