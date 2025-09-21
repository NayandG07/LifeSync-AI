import 'dart:convert';
import 'package:riverpod/riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../models/chat/message.dart';
import '../../providers/chat/chat_provider.dart';
import 'package:uuid/uuid.dart';

class ChatPersistenceService {
  static const String _conversationsListKey = 'conversations_list';
  static const String _currentConversationKey = 'current_conversation';
  static const String _messagesKeyPrefix = 'chat_messages_';
  static const String _chatTypeKeyPrefix = 'chat_type_';
  
  /// Save messages for a specific conversation
  Future<void> saveMessagesForConversation(
    String conversationId, 
    List<Message> messages,
    ChatType chatType,
  ) async {
    if (messages.isEmpty) return;
    
    try {
      final prefs = await SharedPreferences.getInstance();
      
      // Convert messages to JSON
      final messagesJson = messages.map((msg) => {
        'id': msg.id,
        'content': msg.content,
        'type': msg.type.index,
        'timestamp': msg.timestamp.millisecondsSinceEpoch,
      }).toList();
      
      // Save messages for this conversation
      await prefs.setString('$_messagesKeyPrefix$conversationId', jsonEncode(messagesJson));
      
      // Save chat type for this conversation
      await prefs.setInt('$_chatTypeKeyPrefix$conversationId', chatType.index);
    } catch (e) {
      print('Error saving chat messages: $e');
    }
  }
  
  /// Load messages for a specific conversation
  Future<List<Message>> loadMessagesForConversation(String conversationId) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      
      final chatMessagesJson = prefs.getString('$_messagesKeyPrefix$conversationId');
      
      if (chatMessagesJson == null) {
        return <Message>[];
      }
      
      final List<dynamic> messagesData = jsonDecode(chatMessagesJson);
      final messages = messagesData.map((msgData) => Message(
        id: msgData['id'],
        content: msgData['content'],
        type: MessageType.values[msgData['type']],
        timestamp: DateTime.fromMillisecondsSinceEpoch(msgData['timestamp']),
      )).toList();
      
      return messages;
    } catch (e) {
      print('Error loading chat messages: $e');
      return <Message>[];
    }
  }
  
  /// Get the chat type for a specific conversation
  Future<ChatType?> getChatTypeForConversation(String conversationId) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      
      final chatTypeIndex = prefs.getInt('$_chatTypeKeyPrefix$conversationId');
      
      if (chatTypeIndex == null) {
        return null;
      }
      
      return ChatType.values[chatTypeIndex];
    } catch (e) {
      print('Error loading chat type: $e');
      return null;
    }
  }
  
  /// Save the chat type for a specific conversation
  Future<void> saveChatTypeForConversation(String conversationId, ChatType chatType) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setInt('$_chatTypeKeyPrefix$conversationId', chatType.index);
    } catch (e) {
      print('Error saving chat type: $e');
    }
  }
  
  /// Save a conversation to the list of conversations
  Future<void> saveConversation(Conversation conversation) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      
      // Get existing conversations
      List<Conversation> conversations = await loadConversations();
      
      // Remove any existing conversation with the same ID
      conversations.removeWhere((c) => c.id == conversation.id);
      
      // Add the new/updated conversation to the beginning of the list
      conversations.insert(0, conversation);
      
      // Convert to JSON
      final conversationsJson = conversations.map((c) => c.toMap()).toList();
      
      // Save the updated list
      await prefs.setString(_conversationsListKey, jsonEncode(conversationsJson));
    } catch (e) {
      print('Error saving conversation: $e');
    }
  }
  
  /// Load all conversations
  Future<List<Conversation>> loadConversations() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      
      final conversationsJson = prefs.getString(_conversationsListKey);
      
      if (conversationsJson == null) {
        return <Conversation>[];
      }
      
      final List<dynamic> conversationsData = jsonDecode(conversationsJson);
      
      // Sort by updated time (most recent first)
      final conversations = conversationsData
          .map((data) => Conversation.fromMap(data))
          .toList()
          ..sort((a, b) => 
            (b.updatedAt ?? b.createdAt).compareTo(a.updatedAt ?? a.createdAt)
          );
      
      return conversations;
    } catch (e) {
      print('Error loading conversations: $e');
      return <Conversation>[];
    }
  }
  
  /// Save the ID of the current conversation
  Future<void> saveCurrentConversationId(String? conversationId) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      
      if (conversationId == null) {
        await prefs.remove(_currentConversationKey);
      } else {
        await prefs.setString(_currentConversationKey, conversationId);
      }
    } catch (e) {
      print('Error saving current conversation ID: $e');
    }
  }
  
  /// Get the ID of the current conversation
  Future<String?> getCurrentConversationId() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return prefs.getString(_currentConversationKey);
    } catch (e) {
      print('Error getting current conversation ID: $e');
      return null;
    }
  }
  
  /// Delete a conversation and its messages
  Future<void> deleteConversation(String conversationId) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      
      // Remove messages for this conversation
      await prefs.remove('$_messagesKeyPrefix$conversationId');
      
      // Remove chat type for this conversation
      await prefs.remove('$_chatTypeKeyPrefix$conversationId');
      
      // Remove from conversations list
      List<Conversation> conversations = await loadConversations();
      conversations.removeWhere((c) => c.id == conversationId);
      
      // Convert to JSON and save
      final conversationsJson = conversations.map((c) => c.toMap()).toList();
      await prefs.setString(_conversationsListKey, jsonEncode(conversationsJson));
      
      // If this was the current conversation, clear that reference
      final currentConversationId = await getCurrentConversationId();
      if (currentConversationId == conversationId) {
        await saveCurrentConversationId(null);
      }
    } catch (e) {
      print('Error deleting conversation: $e');
    }
  }
  
  /// Delete all conversations and messages
  Future<void> deleteAllConversations() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      
      // Get all keys
      final keys = prefs.getKeys();
      
      // Delete all message and chat type keys
      for (final key in keys) {
        if (key.startsWith(_messagesKeyPrefix) || key.startsWith(_chatTypeKeyPrefix)) {
          await prefs.remove(key);
        }
      }
      
      // Clear conversations list
      await prefs.remove(_conversationsListKey);
      
      // Clear current conversation reference
      await prefs.remove(_currentConversationKey);
    } catch (e) {
      print('Error deleting all conversations: $e');
    }
  }
  
  /// Legacy method for backward compatibility
  Future<Map<String, dynamic>> loadChatData() async {
    try {
      // Get current conversation ID
      final currentId = await getCurrentConversationId();
      
      if (currentId != null) {
        final messages = await loadMessagesForConversation(currentId);
        final chatType = await getChatTypeForConversation(currentId);
        
        return {
          'messages': messages,
          'chatType': chatType ?? ChatType.therapist,
        };
      }
      
      return {
        'messages': <Message>[],
        'chatType': ChatType.therapist,
      };
    } catch (e) {
      print('Error in legacy loadChatData: $e');
      return {
        'messages': <Message>[],
        'chatType': ChatType.therapist,
      };
    }
  }
  
  /// Legacy method for backward compatibility
  Future<void> saveMessages(List<Message> messages, ChatType chatType) async {
    try {
      final currentId = await getCurrentConversationId();
      
      if (currentId != null) {
        await saveMessagesForConversation(currentId, messages, chatType);
      } else {
        // Create a new conversation
        final String newId = const Uuid().v4();
        await saveCurrentConversationId(newId);
        await saveMessagesForConversation(newId, messages, chatType);
        
        // Create a conversation object
        final conversation = Conversation(
          id: newId,
          title: 'Chat',
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
          chatType: chatType == ChatType.therapist ? 'therapist' : 'symptom_checker',
          messageCount: messages.length,
        );
        
        await saveConversation(conversation);
      }
    } catch (e) {
      print('Error in legacy saveMessages: $e');
    }
  }
  
  /// Legacy method for backward compatibility
  Future<void> clearChatHistory() async {
    try {
      final currentId = await getCurrentConversationId();
      
      if (currentId != null) {
        await deleteConversation(currentId);
      }
    } catch (e) {
      print('Error in legacy clearChatHistory: $e');
    }
  }
}

final chatPersistenceServiceProvider = Provider<ChatPersistenceService>((ref) {
  return ChatPersistenceService();
}); 