import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:flutter/foundation.dart';
import 'package:uuid/uuid.dart';

part 'message_model.freezed.dart';
part 'message_model.g.dart';

/// Message sender types
enum MessageSender {
  /// User sent the message
  user,
  
  /// AI assistant sent the message
  assistant,
  
  /// System message
  system
}

/// Message status for tracking delivery and read status
enum MessageStatus {
  /// Message is sending
  sending,
  
  /// Message sent successfully
  sent,
  
  /// Message delivered to recipient
  delivered,
  
  /// Message read by recipient
  read,
  
  /// Error sending message
  error
}

/// Model representing a chat message
@freezed
class Message with _$Message {
  /// Default constructor
  const factory Message({
    required String id,
    required String content,
    required MessageSender sender,
    required DateTime timestamp,
    String? conversationId,
    String? userId,
    @Default(MessageStatus.sent) MessageStatus status,
    Map<String, dynamic>? metadata,
  }) = _Message;

  /// Constructor to create message from json
  factory Message.fromJson(Map<String, dynamic> json) =>
      _$MessageFromJson(json);
      
  /// Create a new message with auto-generated ID
  factory Message.create({
    required String content,
    required MessageSender sender,
    String? conversationId,
    String? userId,
    Map<String, dynamic>? metadata,
    MessageStatus status = MessageStatus.sending,
  }) {
    return Message(
      id: const Uuid().v4(),
      content: content,
      sender: sender,
      timestamp: DateTime.now(),
      conversationId: conversationId,
      userId: userId,
      status: status,
      metadata: metadata,
    );
  }
  
  /// Create a system message
  factory Message.system({
    required String content,
    String? conversationId,
    String? userId,
  }) {
    return Message.create(
      content: content,
      sender: MessageSender.system,
      conversationId: conversationId,
      userId: userId,
      status: MessageStatus.delivered,
    );
  }
}

/// Model representing a conversation
@freezed
class Conversation with _$Conversation {
  /// Default constructor
  const factory Conversation({
    required String id,
    required String title,
    required DateTime createdAt,
    DateTime? updatedAt,
    String? userId,
    @Default(false) bool isFavorite,
    @Default('therapist') String chatType,
    String? lastMessage,
    Map<String, dynamic>? metadata,
  }) = _Conversation;

  /// Constructor to create conversation from json
  factory Conversation.fromJson(Map<String, dynamic> json) =>
      _$ConversationFromJson(json);
      
  /// Create a new conversation with auto-generated ID
  factory Conversation.create({
    required String title,
    String? userId,
    String chatType = 'therapist',
    String? lastMessage,
    Map<String, dynamic>? metadata,
  }) {
    final now = DateTime.now();
    return Conversation(
      id: const Uuid().v4(),
      title: title,
      createdAt: now,
      updatedAt: now,
      userId: userId,
      chatType: chatType,
      lastMessage: lastMessage,
      metadata: metadata,
    );
  }
} 