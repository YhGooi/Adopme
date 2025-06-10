import React, { useState, useEffect } from 'react';
import { useAuthStore, user_details } from '../store/auth.store';
import { Client } from '@stomp/stompjs';
import '/src/css/shared/messaging.css';

interface Message {
    id?: number;
    sender: string;
    recipient: string;
    content: string;
    timestamp: string;
    read: boolean;
}

const Messaging = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [contacts, setContacts] = useState<string[]>([]);
    const [unreadCounts, setUnreadCounts] = useState<{ [key: string]: number }>({});
    const userStore = user_details((state) => state) as any;
    const authStore = useAuthStore((state) => state) as any;
    const [stompClient, setStompClient] = useState<Client | null>(null);

    useEffect(() => {
        const messagesList = document.querySelector('.messages-list');
        if (messagesList) {
            messagesList.scrollTop = messagesList.scrollHeight;
        }
    }, [messages]);    const markMessagesAsRead = async (sender: string) => {
        if (!userStore.email) return;
        
        try {
            await fetch(`http://localhost:8080/messages/read/${sender}/${userStore.email}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            // Update local message read status
            setMessages(prev => 
                prev.map(msg => 
                    msg.sender === sender ? { ...msg, read: true } : msg
                )
            );
            
            // Clear unread count for this sender
            setUnreadCounts(prev => ({ ...prev, [sender]: 0 }));
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    };

    const handleUserSelect = async (contact: string) => {
        setSelectedUser(contact);
        try {
            const response = await fetch(`http://localhost:8080/messages/${userStore.email}/${contact}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setMessages(Array.isArray(data) ? data : []);
            
            // Mark messages from this contact as read
            await markMessagesAsRead(contact);
            
        } catch (error) {
            console.error('Error fetching messages:', error);
            setMessages([]);
        }
    };

    useEffect(() => {
        if (!userStore.token || !userStore.email) {
            console.error('No authentication token or username available');
            return;
        }
        const client = new Client({
            brokerURL: 'ws://localhost:8080/ws',
            connectHeaders: {
                Authorization: `Bearer ${userStore.token}`
            },
            debug: (str) => {
                console.log('STOMP Debug:', str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            webSocketFactory: () => {
                const socket = new WebSocket('ws://localhost:8080/ws');
                socket.onclose = (event) => {
                    console.log('WebSocket Connection Closed:', event);
                };
                socket.onerror = (event) => {
                    console.error('WebSocket Error:', event);
                };
                return socket;
            },
            onConnect: () => {
                console.log('Connected to WebSocket');
                client.subscribe(`/user/${userStore.email}/queue/private`, async (message) => {
                    try {
                        const receivedMessage = JSON.parse(message.body);                        const isFromSelectedUser = selectedUser === receivedMessage.sender;
                        
                        // Mark message as read if it's from the currently selected user
                        receivedMessage.read = isFromSelectedUser;
                        
                        setMessages(prev => [...prev, receivedMessage]);
                        
                        if (!isFromSelectedUser) {
                            // Get updated unread count from server
                            try {
                                const countResponse = await fetch(`http://localhost:8080/messages/unread/${receivedMessage.sender}/${userStore.email}`, {
                                    headers: {
                                        'Authorization': `Bearer ${authStore.token}`,
                                        'Content-Type': 'application/json'
                                    }
                                });
                                if (countResponse.ok) {
                                    const unreadCount = await countResponse.json();
                                    setUnreadCounts(prev => ({
                                        ...prev,
                                        [receivedMessage.sender]: unreadCount
                                    }));
                                }
                            } catch (error) {
                                console.error('Error fetching updated unread count:', error);
                            }
                        } else {
                            // If message is from selected user, mark it as read immediately
                            await markMessagesAsRead(receivedMessage.sender);
                        }
                    } catch (error) {
                        console.error('Error parsing message:', error);
                    }
                });
                fetchContacts();
            },
            onStompError: (frame) => {
                console.error('STOMP error:', frame.headers['message']);
                console.error('Additional details:', frame.body);
            },
            onWebSocketClose: (event) => {
                console.log('WebSocket Connection Closed:', event);
                // Attempt to reconnect after a delay
                setTimeout(() => {
                    if (!client.active) {
                        //console.log('Attempting to reconnect...');
                        client.activate();
                    }
                }, 5000);
            }
        });

        try {
            //console.log('Activating WebSocket connection...');
            client.activate();
            setStompClient(client);
        } catch (error) {
            console.error('Error activating WebSocket client:', error);
        }

        return () => {
            if (client && client.active) {
                //console.log('Cleaning up WebSocket connection...');
                client.deactivate();
            }
        };
    }, [userStore.email, userStore.token]);

    const fetchContacts = async () => {
        try {
            const response = await fetch('http://localhost:8080/user/contacts', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authStore.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (Array.isArray(data)) {
                setContacts(data);
                // Fetch unread counts for each contact
                await Promise.all(data.map(async (contact) => {
                    try {
                        const countResponse = await fetch(`http://localhost:8080/messages/unread/${contact}/${userStore.email}`, {
                            headers: {
                                'Authorization': `Bearer ${authStore.token}`,
                                'Content-Type': 'application/json'
                            }
                        });
                        if (countResponse.ok) {
                            const unreadCount = await countResponse.json();
                            setUnreadCounts(prev => ({
                                ...prev,
                                [contact]: unreadCount
                            }));
                        }
                    } catch (error) {
                        console.error(`Error fetching unread count for ${contact}:`, error);
                    }
                }));
            } else {
                console.error('Expected array of contacts but received:', data);
                setContacts([]);
            }
        } catch (error) {
            console.error('Error fetching contacts:', error);
            setContacts([]);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedUser || !stompClient) {
            return;
        }
        try {
            const message = {
                sender: userStore.email,
                recipient: selectedUser,
                content: newMessage,
                timestamp: new Date().toISOString(),
                read: false
            };
            
            stompClient.publish({
                destination: '/app/chat.private',
                body: JSON.stringify(message),
                headers: {
                    'Authorization': `Bearer ${userStore.token}`
                }
            });
            
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
            <div className="messaging-container">
                <div className="contacts-list">
                    <h2>Contacts</h2>
                    <div className="contacts-scroll">                        {Array.isArray(contacts) && contacts.length > 0 ? (
                            contacts.map((contact) => (
                                <div
                                    key={contact}
                                    className={`contact-item ${selectedUser === contact ? 'selected' : ''}`}
                                    onClick={() => handleUserSelect(contact)}
                                >
                                    <span className="contact-name">{contact}</span>
                                    {unreadCounts[contact] > 0 && (
                                        <span className="unread-count">{unreadCounts[contact]}</span>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="no-contacts">No contacts available</div>
                        )}
                    </div>
                </div>

                <div className="chat-area">
                    {selectedUser ? (
                        <>
                            <div className="chat-header">
                                <h2>Chat with {selectedUser}</h2>
                            </div>
                            <div className="messages-list">
                                {messages.length > 0 ? (
                                    messages.map((message, index) => (
                                        <div
                                            key={`${message.id || index}-${message.timestamp}`}
                                            className={`message ${message.sender === userStore.email ? 'sent' : 'received'}`}
                                        >
                                            <div className="message-content">
                                                {message.content.length > 1000
                                                    ? `${message.content.substring(0, 1000)}...`
                                                    : message.content
                                                }
                                            </div>
                                            <div className="message-timestamp">
                                                {new Date(message.timestamp).toLocaleDateString()} {new Date(message.timestamp).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-messages">No messages yet</div>
                                )}
                            </div>
                            <div className="message-input-container">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                    placeholder="Type a message..."
                                    className="message-input"
                                />
                                <button
                                    onClick={sendMessage}
                                    className="send-button"
                                    disabled={!newMessage.trim()}
                                >
                                    Send
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="no-chat-selected">
                            <p>Select a contact to start messaging</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

export default Messaging;