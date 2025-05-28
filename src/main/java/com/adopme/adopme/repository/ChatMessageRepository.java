package com.adopme.adopme.repository;

import com.adopme.adopme.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    /**
     * Finds chat messages between two users, regardless of the order of sender and
     * recipient.
     *
     * @param sender1    The first sender's username.
     * @param recipient1 The first recipient's username.
     * @param sender2    The second sender's username (same as recipient1).
     * @param recipient2 The second recipient's username (same as sender1).
     * @return A list of chat messages ordered by date and timestamp in ascending
     *         order.
     */
    List<ChatMessage> findBySenderAndRecipientOrRecipientAndSenderOrderByTimestampAsc(
            String sender1, String recipient1, String sender2, String recipient2);
}