import 'dart:convert';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:http/http.dart' as http;
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../app/constants.dart';
import '../models/message_model.dart';

part 'chat_service.g.dart';

/// Provider for chat service
@riverpod
ChatService chatService(ChatServiceRef ref) {
  return ChatService(FirebaseFirestore.instance);
}

/// Service for handling chat operations
class ChatService {
  /// Default constructor
  ChatService(this._firestore);

  final FirebaseFirestore _firestore;

  // Get user conversations collection reference
  CollectionReference<Map<String, dynamic>> _getUserConversationsCollection(String userId) {
    return _firestore
        .collection(AppConstants.usersCollection)
        .doc(userId)
        .collection(AppConstants.conversationsCollection);
  }

  // Get messages collection reference for a conversation
  CollectionReference<Map<String, dynamic>> _getMessagesCollection(String conversationId) {
    return _firestore
        .collection(AppConstants.conversationsCollection)
        .doc(conversationId)
        .collection(AppConstants.messagesCollection);
  }

  /// Get all conversations for a user
  Future<List<Conversation>> getConversations(String userId) async {
    try {
      final snapshot = await _getUserConversationsCollection(userId)
          .orderBy('updatedAt', descending: true)
          .get();
      
      return snapshot.docs
          .map((doc) => Conversation.fromJson(doc.data()))
          .toList();
    } catch (e) {
      print('Error getting conversations: $e');
      throw Exception('Failed to get conversations: $e');
    }
  }

  /// Get a specific conversation
  Future<Conversation?> getConversation(String userId, String conversationId) async {
    try {
      final doc = await _getUserConversationsCollection(userId)
          .doc(conversationId)
          .get();
      
      if (!doc.exists) {
        return null;
      }
      
      return Conversation.fromJson(doc.data()!);
    } catch (e) {
      print('Error getting conversation: $e');
      throw Exception('Failed to get conversation: $e');
    }
  }

  /// Create a new conversation
  Future<Conversation> createConversation(
    String userId,
    String title, {
    String chatType = 'therapist',
  }) async {
    try {
      // Create a new conversation
      final conversation = Conversation.create(
        title: title,
        userId: userId,
        chatType: chatType,
      );
      
      // Create a batch to ensure atomic operations
      final batch = _firestore.batch();
      
      // Set in conversations collection
      final conversationRef = _firestore
          .collection(AppConstants.conversationsCollection)
          .doc(conversation.id);
      batch.set(conversationRef, conversation.toJson());
      
      // Set reference in user's conversations
      final userConversationRef = _getUserConversationsCollection(userId)
          .doc(conversation.id);
      batch.set(userConversationRef, conversation.toJson());
      
      // Commit the batch
      await batch.commit();
      
      print('✅ [CHAT] Conversation ${conversation.id} created successfully for user $userId');
      
      return conversation;
    } catch (e) {
      print('Error creating conversation: $e');
      throw Exception('Failed to create conversation: $e');
    }
  }

  /// Update a conversation
  Future<void> updateConversation(String userId, Conversation conversation) async {
    try {
      final updatedConversation = conversation.copyWith(
        updatedAt: DateTime.now(),
      );
      
      final batch = _firestore.batch();
      
      // Update in conversations collection
      final convRef = _firestore
          .collection(AppConstants.conversationsCollection)
          .doc(conversation.id);
      batch.update(convRef, updatedConversation.toJson());
      
      // Update in user's conversations
      final userConvRef = _getUserConversationsCollection(userId)
          .doc(conversation.id);
      batch.update(userConvRef, updatedConversation.toJson());
      
      await batch.commit();
    } catch (e) {
      print('Error updating conversation: $e');
      throw Exception('Failed to update conversation: $e');
    }
  }

  /// Delete a conversation
  Future<void> deleteConversation(String userId, String conversationId) async {
    try {
      // Delete from user's conversations
      await _getUserConversationsCollection(userId)
          .doc(conversationId)
          .delete();
      
      print('✅ [CHAT] Conversation $conversationId deleted successfully for user $userId');
      
      // Note: We don't delete from main conversations collection to preserve messages
      // for other users if it's a shared conversation
    } catch (e) {
      print('Error deleting conversation: $e');
      throw Exception('Failed to delete conversation: $e');
    }
  }

  /// Toggle favorite status of a conversation
  Future<void> toggleFavorite(String userId, String conversationId) async {
    try {
      // Get current state
      final doc = await _getUserConversationsCollection(userId)
          .doc(conversationId)
          .get();
      
      if (!doc.exists) {
        throw Exception('Conversation not found');
      }
      
      final conversation = Conversation.fromJson(doc.data()!);
      final isFavorite = !conversation.isFavorite;
      
      // Update in user's conversations
      await _getUserConversationsCollection(userId)
          .doc(conversationId)
          .update({
        'isFavorite': isFavorite,
      });
      
      // Update in main collection
      await _firestore
          .collection(AppConstants.conversationsCollection)
          .doc(conversationId)
          .update({
        'isFavorite': isFavorite,
      });

      print('✅ [CHAT] Conversation $conversationId favorite status updated to: $isFavorite');
    } catch (e) {
      print('Error toggling favorite: $e');
      throw Exception('Failed to toggle favorite: $e');
    }
  }

  /// Get all messages for a conversation
  Future<List<Message>> getMessages(String conversationId) async {
    try {
      final snapshot = await _getMessagesCollection(conversationId)
          .orderBy('timestamp', descending: true)
          .get();
      
      return snapshot.docs
          .map((doc) => Message.fromJson(doc.data()))
          .toList();
    } catch (e) {
      print('Error getting messages: $e');
      throw Exception('Failed to get messages: $e');
    }
  }

  /// Send a message in a conversation
  Future<Message> sendMessage(
    String userId,
    String conversationId,
    String content, {
    bool isSystemMessage = false,
    bool isAiMessage = false,
  }) async {
    try {
      final sender = isSystemMessage
          ? MessageSender.system
          : isAiMessage
              ? MessageSender.assistant
              : MessageSender.user;
      
      // Create message with userId field to comply with Firestore rules
      final message = Message.create(
        content: content,
        sender: sender,
        conversationId: conversationId,
        userId: userId, // Add userId to message
        status: MessageStatus.sent,
      );
      
      // Add to messages collection
      await _getMessagesCollection(conversationId)
          .doc(message.id)
          .set(message.toJson());
      
      // Update conversation timestamp
      await _firestore
          .collection(AppConstants.conversationsCollection)
          .doc(conversationId)
          .update({
        'updatedAt': FieldValue.serverTimestamp(),
        'lastMessage': content.length > 50 ? '${content.substring(0, 47)}...' : content,
      });
      
      // Update in user's conversations
      await _getUserConversationsCollection(userId)
          .doc(conversationId)
          .update({
        'updatedAt': FieldValue.serverTimestamp(),
        'lastMessage': content.length > 50 ? '${content.substring(0, 47)}...' : content,
      });
      
      print('✅ [CHAT] Message ${message.id} sent successfully in conversation $conversationId');
      
      return message;
    } catch (e) {
      print('Error sending message: $e');
      throw Exception('Failed to send message: $e');
    }
  }

  /// Get AI response for a conversation
  Future<Message> getAIResponse(
      String userId,
      String conversationId,
      List<Message> messages,
      Conversation conversation) async {
    try {
      print('[AICHAT] Starting getAIResponse for chatType: ${conversation.chatType}');
      
      // Create placeholder message with userId
      final aiMessage = Message.create(
        content: 'Thinking...',
        sender: MessageSender.assistant,
        conversationId: conversationId,
        userId: userId, // Add userId for security rules
        status: MessageStatus.sending,
      );
      
      // Add placeholder message to Firestore
      await _getMessagesCollection(conversation.id)
          .doc(aiMessage.id)
          .set(aiMessage.toJson());
      
      print('✅ [AICHAT] Placeholder message ${aiMessage.id} saved to Firestore');
      
      // Prepare message history for the API
      final recentMessages = messages.take(10).toList(); // Take most recent 10 messages
      print('[AICHAT] Preparing ${recentMessages.length} messages for API');
      
      final List<Map<String, dynamic>> formattedMessages = recentMessages
          .map((msg) => {
                'role': msg.sender == MessageSender.user ? 'user' : 'model',
                'parts': [
                  {'text': msg.content}
                ]
              })
          .toList();
      
      // Reverse list to get oldest first (required by Gemini API)
      final reversedMessages = formattedMessages.reversed.toList();
      
      // Select the appropriate API URL based on chat type
      final apiUrl = conversation.chatType == 'symptom_checker'
          ? AppConstants.symptomCheckerApiUrl
          : AppConstants.chatbotApiUrl;
      
      print('[AICHAT] Using API URL: $apiUrl');

      // Create request payload
      final payload = {
        'contents': reversedMessages,
        'generationConfig': {
          'temperature': conversation.chatType == 'symptom_checker' ? 0.4 : 0.8,
          'topK': 40,
          'topP': conversation.chatType == 'symptom_checker' ? 0.9 : 0.95,
          'maxOutputTokens': conversation.chatType == 'symptom_checker' ? 1024 : 2048,
        },
        'safetySettings': [
          {
            'category': 'HARM_CATEGORY_HARASSMENT',
            'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            'category': 'HARM_CATEGORY_HATE_SPEECH',
            'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            'category': 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            'category': 'HARM_CATEGORY_DANGEROUS_CONTENT',
            'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      };
      
      // Call the Gemini API directly
      print('[AICHAT] Sending request to Gemini API');
      final response = await http.post(
        Uri.parse(apiUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(payload),
      );
      
      print('[AICHAT] Received response with status code: ${response.statusCode}');
      
      if (response.statusCode == 200) {
        // Parse the Gemini API response
        print('[AICHAT] Parsing successful response');
        final jsonResponse = jsonDecode(response.body);
        
        String aiResponse = '';
        // Extract text from the Gemini response format
        if (jsonResponse['candidates'] != null && 
            jsonResponse['candidates'].isNotEmpty && 
            jsonResponse['candidates'][0]['content'] != null &&
            jsonResponse['candidates'][0]['content']['parts'] != null &&
            jsonResponse['candidates'][0]['content']['parts'].isNotEmpty) {
          
          aiResponse = jsonResponse['candidates'][0]['content']['parts'][0]['text'];
          print('[AICHAT] Successfully extracted response text (${aiResponse.length} characters)');
        } else {
          aiResponse = 'I apologize, but I encountered an issue processing your request. Please try again later.';
          print('[AICHAT] Failed to extract text from response: ${response.body}');
        }
        
        // Update the placeholder message with the actual response
        final updatedMessage = aiMessage.copyWith(
          content: aiResponse,
          status: MessageStatus.delivered,
        );
        
        await _getMessagesCollection(conversation.id)
            .doc(aiMessage.id)
            .update(updatedMessage.toJson());
        
        print('✅ [AICHAT] AI message ${aiMessage.id} updated with response');
        
        // Update conversation's updatedAt timestamp and lastMessage
        final batch = _firestore.batch();
        final convRef = _firestore
            .collection(AppConstants.conversationsCollection)
            .doc(conversation.id);
        final userConvRef = _getUserConversationsCollection(userId)
            .doc(conversation.id);
        
        final lastMessagePreview = aiResponse.length > 50 
            ? '${aiResponse.substring(0, 47)}...' 
            : aiResponse;
            
        final updates = {
          'updatedAt': FieldValue.serverTimestamp(),
          'lastMessage': lastMessagePreview,
        };
        batch.update(convRef, updates);
        batch.update(userConvRef, updates);
        await batch.commit();
        
        print('✅ [AICHAT] Conversation ${conversation.id} metadata updated');
        
        return updatedMessage;
      } else {
        // Handle error
        print('[AICHAT] Error response: ${response.statusCode}');
        print('[AICHAT] Error body: ${response.body}');
        
        final errorResponse = 'Sorry, I was unable to respond at this time. Please try again later. (Error ${response.statusCode})';
        final updatedMessage = aiMessage.copyWith(
          content: errorResponse,
          status: MessageStatus.error,
        );
        
        await _getMessagesCollection(conversation.id)
            .doc(aiMessage.id)
            .update(updatedMessage.toJson());
        
        print('✅ [AICHAT] AI message ${aiMessage.id} updated with error response');
        
        return updatedMessage;
      }
    } catch (e) {
      print('[AICHAT] Exception in getAIResponse: $e');
      throw Exception('Failed to get AI response: $e');
    }
  }

  /// Get conversation preview (for displaying in chat list)
  Future<Map<String, dynamic>> getConversationPreviews(String userId) async {
    try {
      final conversations = await getConversations(userId);
      final previews = <String, Map<String, dynamic>>{};
      
      for (final conversation in conversations) {
        final messages = await getMessages(conversation.id);
        final lastMessage = messages.isNotEmpty ? messages.first : null;
        
        previews[conversation.id] = {
          'conversation': conversation,
          'lastMessage': lastMessage,
          'unreadCount': messages.where((m) => 
              m.sender == MessageSender.assistant && 
              m.status != MessageStatus.read
          ).length,
        };
      }
      
      return {'previews': previews};
    } catch (e) {
      print('Error getting conversation previews: $e');
      throw Exception('Failed to get conversation previews: $e');
    }
  }
  
  /// Mark conversation as read
  Future<void> markConversationAsRead(String conversationId) async {
    try {
      // Update all unread messages
      final batch = _firestore.batch();
      final unreadMessages = await _getMessagesCollection(conversationId)
          .where('status', isEqualTo: MessageStatus.delivered.name)
          .get();
      
      for (final doc in unreadMessages.docs) {
        batch.update(doc.reference, {
          'status': MessageStatus.read.name,
        });
      }
      
      await batch.commit();
    } catch (e) {
      print('Error marking conversation as read: $e');
    }
  }
} 