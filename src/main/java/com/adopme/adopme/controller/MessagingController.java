package com.adopme.adopme.controller;

import com.adopme.adopme.model.ChatMessage;
import com.adopme.adopme.service.ChatMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.stereotype.Controller;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;

@Controller
@CrossOrigin(origins = "*") // Configure according to your frontend URL
public class MessagingController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatMessageService chatMessageService;

    @MessageMapping("/chat.private")
    public void sendPrivateMessage(@Payload ChatMessage chatMessage) {
        try {
            // Save message to database
            ChatMessage savedMessage = chatMessageService.save(chatMessage);

            // Send to recipient
            messagingTemplate.convertAndSendToUser(
                    savedMessage.getRecipient(),
                    "/queue/private",
                    savedMessage);

            // Send back to sender
            messagingTemplate.convertAndSendToUser(
                    savedMessage.getSender(),
                    "/queue/private",
                    savedMessage);

            System.out.println("Message sent: " + savedMessage); // Debug log
        } catch (Exception e) {
            // System.err("Error sending message: " + e.getMessage());
        }
    }

    @GetMapping("/messages/{sender}/{recipient}")
    @ResponseBody
    public ResponseEntity<List<ChatMessage>> getChatHistory(
            @PathVariable String sender,
            @PathVariable String recipient) {
        try {
            List<ChatMessage> messages = chatMessageService.getChatHistory(sender, recipient);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}