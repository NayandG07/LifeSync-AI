import 'package:freezed_annotation/freezed_annotation.dart';

part 'chat_message.freezed.dart';
part 'chat_message.g.dart';

/// Enum representing the sender of a message
enum MessageSender {
  /// The user
  user,
  
  /// The AI assistant
  ai,
  
  /// System message
  system
}

/// Enum for message status
enum MessageStatus {
  /// Message is sending
  sending,
  
  /// Message has been sent
  sent,
  
  /// Message has been delivered
  delivered,
  
  /// Message has been seen
  seen,
  
  /// Message failed to send
  failed
}

/// A chat message in the application
@freezed
class ChatMessage with _$ChatMessage {
  /// Factory constructor for creating a ChatMessage
  const factory ChatMessage({
    /// Unique identifier for the message
    required String id,
    
    /// Who sent the message
    required MessageSender sender,
    
    /// The content of the message
    required String content,
    
    /// When the message was sent
    required DateTime timestamp,
    
    /// The status of the message
    @Default(MessageStatus.sent) MessageStatus status,
    
    /// Reference to the conversation this message belongs to
    String? conversationId,
    
    /// Any media attachments to this message
    @Default([]) List<String> attachments,
  }) = _ChatMessage;
  
  /// Create a new user message
  factory ChatMessage.user({
    required String content,
    String? conversationId,
  }) {
    return ChatMessage(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      sender: MessageSender.user,
      content: content,
      timestamp: DateTime.now(),
      conversationId: conversationId,
    );
  }
  
  /// Create a new AI message
  factory ChatMessage.ai({
    required String content,
    String? conversationId,
  }) {
    return ChatMessage(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      sender: MessageSender.ai,
      content: content,
      timestamp: DateTime.now(),
      conversationId: conversationId,
    );
  }
  
  /// Create a new system message
  factory ChatMessage.system({
    required String content,
    String? conversationId,
  }) {
    return ChatMessage(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      sender: MessageSender.system,
      content: content,
      timestamp: DateTime.now(),
      conversationId: conversationId,
    );
  }
  
  /// Create from JSON
  factory ChatMessage.fromJson(Map<String, dynamic> json) => 
      _$ChatMessageFromJson(json);
} 