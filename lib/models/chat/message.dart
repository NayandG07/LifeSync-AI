import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:flutter/foundation.dart';

part 'message.freezed.dart';
part 'message.g.dart';

/// Message types
enum MessageType {
  /// User sent the message
  user,
  
  /// AI assistant sent the message
  assistant,
  
  /// System message
  system
}

/// A class representing a chat message
@freezed
class Message with _$Message {
  /// Default constructor
  const factory Message({
    /// The content of the message
    required String content,
    
    /// The type of message (user, assistant, system)
    required MessageType type,
    
    /// When the message was sent
    required DateTime timestamp,
    
    /// Optional unique ID
    String? id,
  }) = _Message;
  
  /// Create from JSON
  factory Message.fromJson(Map<String, dynamic> json) => _$MessageFromJson(json);
}

/// Represents a conversation in the chat history
class Conversation {
  /// Constructor
  Conversation({
    required this.id,
    required this.title,
    required this.createdAt,
    this.updatedAt,
    this.isFavorite = false,
    this.chatType = 'therapist',
    this.messageCount = 0,
  });

  /// Unique identifier for the conversation
  final String id;
  
  /// Title of the conversation
  final String title;
  
  /// When the conversation was created
  final DateTime createdAt;
  
  /// When the conversation was last updated
  final DateTime? updatedAt;
  
  /// Whether the conversation is marked as a favorite
  final bool isFavorite;
  
  /// Type of chat (therapist, symptom_checker, etc.)
  final String chatType;
  
  /// Number of messages in the conversation
  final int messageCount;
  
  /// Convert to map for storage
  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'title': title,
      'createdAt': createdAt.millisecondsSinceEpoch,
      'updatedAt': updatedAt?.millisecondsSinceEpoch,
      'isFavorite': isFavorite,
      'chatType': chatType,
      'messageCount': messageCount,
    };
  }
  
  /// Create from map (from storage)
  factory Conversation.fromMap(Map<String, dynamic> map) {
    return Conversation(
      id: map['id'] as String,
      title: map['title'] as String,
      createdAt: DateTime.fromMillisecondsSinceEpoch(map['createdAt'] as int),
      updatedAt: map['updatedAt'] != null 
          ? DateTime.fromMillisecondsSinceEpoch(map['updatedAt'] as int) 
          : null,
      isFavorite: map['isFavorite'] as bool? ?? false,
      chatType: map['chatType'] as String? ?? 'therapist',
      messageCount: map['messageCount'] as int? ?? 0,
    );
  }
  
  /// Create a copy with updated fields
  Conversation copyWith({
    String? id,
    String? title,
    DateTime? createdAt,
    DateTime? updatedAt,
    bool? isFavorite,
    String? chatType,
    int? messageCount,
  }) {
    return Conversation(
      id: id ?? this.id,
      title: title ?? this.title,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      isFavorite: isFavorite ?? this.isFavorite,
      chatType: chatType ?? this.chatType,
      messageCount: messageCount ?? this.messageCount,
    );
  }
} 