package com.adopme.adopme.service;

import com.adopme.adopme.model.ChatMessage;
import com.adopme.adopme.repository.ChatMessageRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatMessageService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    public ChatMessage save(ChatMessage chatMessage) {
        return chatMessageRepository.save(chatMessage);
    }

    public List<ChatMessage> getChatHistory(String sender, String recipient) {
        return chatMessageRepository.findBySenderAndRecipientOrRecipientAndSenderOrderByTimestampAsc(
                sender, recipient, sender, recipient);
    }

    public void markMessagesAsRead(String sender, String recipient) {
        List<ChatMessage> unreadMessages = chatMessageRepository.findBySenderAndRecipientOrRecipientAndSenderOrderByTimestampAsc(
                sender, recipient, sender, recipient);

        for (ChatMessage message : unreadMessages) {
            if (message.getSender().equals(sender) && !message.isRead()) {
                message.setRead(true);
                chatMessageRepository.save(message);
            }
        }
    }

    public long getUnreadCount(String sender, String recipient) {
        List<ChatMessage> messages = chatMessageRepository.findBySenderAndRecipientOrRecipientAndSenderOrderByTimestampAsc(
                sender, recipient, sender, recipient);

        return messages.stream()
                .filter(msg -> msg.getSender().equals(sender) && !msg.isRead())
                .count();
    }
}
