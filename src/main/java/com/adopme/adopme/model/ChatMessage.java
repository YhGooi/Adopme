package com.adopme.adopme.model;

import jakarta.persistence.*;

import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "chat_messages")
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sender;
    private String recipient;
    private String content;
    private LocalDateTime timestamp;

    @Column(name = "is_read", nullable = false)
    private boolean read = false; // Default to unread

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }
}
