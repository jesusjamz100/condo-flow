package com.condoflow.user.kafka;

import com.condoflow.user.kafka.event.UserDeletedEvent;
import com.condoflow.user.kafka.event.UserRegisteredEvent;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@Data
@AllArgsConstructor
public class UserEventProducer {

    private final KafkaTemplate<String, Object> kafka;
    private final String topic = "user-events";

    public void sendUserRegistered(Long userId) {
        UserRegisteredEvent ev = new UserRegisteredEvent(userId, Instant.now());
        kafka.send(topic, userId.toString(), ev);
    }

    public void sendUserDeleted(Long userId) {
        UserDeletedEvent ev = new UserDeletedEvent(userId, Instant.now());
        kafka.send(topic, userId.toString(), ev);
    }
}
