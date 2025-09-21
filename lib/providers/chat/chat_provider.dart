import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:flutter/foundation.dart';
import 'dart:async';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:uuid/uuid.dart';
import 'package:flutter/material.dart';
import 'package:riverpod/riverpod.dart';
import 'package:lifesyncaiapp/models/chat/message.dart';
import 'package:lifesyncaiapp/services/chat/chat_service.dart';
import 'package:lifesyncaiapp/services/chat/chat_persistence_service.dart';

import '../../app/constants.dart';
import '../../services/chat_prompt_service.dart';

part 'chat_provider.g.dart';

/// Chat type enumeration
enum ChatType {
  /// Therapist mode for mental health support
  therapist,
  
  /// Symptom checker mode for health analysis
  symptomChecker
}

/// State for the chat
class ChatState {
  /// Constructor
  ChatState({
    this.messages = const [],
    this.isAiTyping = false,
    this.error,
    this.currentConversationId,
    this.chatType = ChatType.therapist,
    this.isLoading = false,
    this.pendingUserMessage,
    this.prepopulatedMessage,
    this.conversations = const [],
  });

  /// List of messages in the conversation
  final List<Message> messages;

  /// Whether the AI is currently typing (generating a response)
  final bool isAiTyping;

  /// Any error that occurred
  final String? error;

  /// ID of the current conversation
  final String? currentConversationId;
  
  /// Type of chat (therapist, symptom_checker, etc.)
  final ChatType chatType;

  /// Whether the chat is currently loading
  final bool isLoading;
  
  /// Message that is prepared but not yet sent
  final String? pendingUserMessage;

  /// Message that is prepopulated to be sent when the chat screen opens
  final String? prepopulatedMessage;
  
  /// List of available conversations
  final List<Conversation> conversations;

  /// Create a copy of this state with some updated fields
  ChatState copyWith({
    List<Message>? messages,
    bool? isAiTyping,
    String? error,
    String? currentConversationId,
    ChatType? chatType,
    bool? isLoading,
    String? pendingUserMessage,
    String? prepopulatedMessage,
    List<Conversation>? conversations,
  }) {
    return ChatState(
      messages: messages ?? this.messages,
      isAiTyping: isAiTyping ?? this.isAiTyping,
      error: error,
      currentConversationId: currentConversationId ?? this.currentConversationId,
      chatType: chatType ?? this.chatType,
      isLoading: isLoading ?? this.isLoading,
      pendingUserMessage: pendingUserMessage,
      prepopulatedMessage: prepopulatedMessage,
      conversations: conversations ?? this.conversations,
    );
  }
}

/// Provider for chat functionality
@Riverpod(keepAlive: true)
class ChatNotifier extends _$ChatNotifier {
  late final ChatService _chatService;
  late final ChatPersistenceService _persistenceService;
  final Uuid _uuid = const Uuid();
  bool _initialized = false;

  @override
  ChatState build() {
    _chatService = ref.watch(chatServiceProvider);
    _persistenceService = ref.watch(chatPersistenceServiceProvider);
    
    // Initialize with empty state
    final initialState = ChatState(
      messages: [],
      isLoading: false,
      chatType: ChatType.therapist,
      conversations: [],
    );
    
    // Load saved conversations
    _loadSavedConversations();
    
    return initialState;
  }
  
  Future<void> _loadSavedConversations() async {
    if (_initialized) return;
    
    try {
      // Load the list of conversations
      final conversations = await _persistenceService.loadConversations();
      
      // Get the current conversation ID
      final currentConversationId = await _persistenceService.getCurrentConversationId();
      
      if (currentConversationId != null) {
        // Load messages for the current conversation
        final messages = await _persistenceService.loadMessagesForConversation(currentConversationId);
        final chatType = await _persistenceService.getChatTypeForConversation(currentConversationId) ?? ChatType.therapist;
        
        state = state.copyWith(
          messages: messages,
          conversations: conversations,
          currentConversationId: currentConversationId,
          chatType: chatType,
        );
      } else if (conversations.isNotEmpty) {
        // Use the most recent conversation
        final mostRecentConversation = conversations.first;
        final messages = await _persistenceService.loadMessagesForConversation(mostRecentConversation.id);
        final chatType = await _persistenceService.getChatTypeForConversation(mostRecentConversation.id) ?? ChatType.therapist;
        
        state = state.copyWith(
          messages: messages,
          conversations: conversations,
          currentConversationId: mostRecentConversation.id,
          chatType: chatType,
        );
      } else {
        // No conversations found, create a new one
        state = state.copyWith(
          conversations: conversations,
        );
        
        createNewChat();
      }
      
      _initialized = true;
    } catch (e) {
      state = state.copyWith(
        error: 'Failed to load chat history: ${e.toString()}',
      );
    }
  }

  /// Set the chat type
  void setChatType(ChatType chatType) {
    print('Setting chat type to: $chatType');
    
    // Create a copy of the current state with the new chat type
    state = state.copyWith(chatType: chatType);
    
    // Save chat type for current conversation
    if (state.currentConversationId != null) {
      _persistenceService.saveChatTypeForConversation(state.currentConversationId!, chatType);
    }
    
    // Add welcome message if empty
    if (state.messages.isEmpty) {
      _addWelcomeMessage(chatType);
    }
  }

  /// Prepopulate a message to be sent when the chat screen opens
  void prepopulateMessage(String message) {
    state = state.copyWith(prepopulatedMessage: message);
  }

  /// Clear the current chat
  void clearChat() {
    if (state.currentConversationId != null) {
      // Create a new chat
      createNewChat();
    } else {
      // Just clear the messages
      state = state.copyWith(
        messages: [],
        isLoading: false,
        error: null,
      );
      
      // Add the welcome message after clearing
      _addWelcomeMessage(state.chatType);
    }
  }
  
  /// Create a new chat
  void createNewChat() {
    final String newConversationId = _uuid.v4();
    final DateTime now = DateTime.now();
    
    // Create the new conversation object
    final newConversation = Conversation(
      id: newConversationId,
      title: 'New Chat',
      createdAt: now,
      updatedAt: now,
      chatType: 'therapist',
    );
    
    // Update the state
    state = state.copyWith(
      messages: [],
      isLoading: false,
      error: null,
      currentConversationId: newConversationId,
      chatType: ChatType.therapist,
      conversations: [newConversation, ...state.conversations],
    );
    
    // Save the new conversation
    _persistenceService.saveConversation(newConversation);
    _persistenceService.saveCurrentConversationId(newConversationId);
    
    // Add welcome message
    _addWelcomeMessage(ChatType.therapist);
  }

  /// Prepares the chat for a symptom consultation with provided symptom data
  void prepareSymptomConsultation(String symptomData) {
    // Set the chat type to symptom checker
    setChatType(ChatType.symptomChecker);
    
    // Store the symptom data as a pending message to be sent
    // when the chat screen is opened
    state = state.copyWith(
      pendingUserMessage: symptomData,
    );
  }

  Future<void> sendMessage(String content) async {
    if (content.trim().isEmpty) return;

    // Generate a unique ID for the conversation if it doesn't exist yet
    String conversationId = state.currentConversationId ?? _uuid.v4();
    if (state.currentConversationId == null) {
      state = state.copyWith(currentConversationId: conversationId);
      
      // Create a new conversation if we don't have an ID yet
      final newConversation = Conversation(
        id: conversationId,
        title: content.length > 20 ? '${content.substring(0, 20)}...' : content,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
        chatType: state.chatType == ChatType.therapist ? 'therapist' : 'symptom_checker',
      );
      
      // Add the new conversation to the list
      state = state.copyWith(
        conversations: [newConversation, ...state.conversations],
      );
      
      _persistenceService.saveConversation(newConversation);
      _persistenceService.saveCurrentConversationId(conversationId);
    }

    final userMessage = Message(
      id: _uuid.v4(),
      content: content,
      type: MessageType.user,
      timestamp: DateTime.now(),
    );

    state = state.copyWith(
      messages: [...state.messages, userMessage],
      isLoading: true,
      error: null,
      pendingUserMessage: null, // Clear any pending message
    );
    
    // Save message
    _persistenceService.saveMessagesForConversation(
      state.currentConversationId!,
      state.messages,
      state.chatType,
    );
    
    // Update conversation title if it's the first message
    if (state.messages.length == 2) { // Welcome message + first user message
      _updateConversationTitle(content);
    }
    
    // Update conversation timestamp
    _updateConversationTimestamp(state.currentConversationId!);

    try {
      final response = await _chatService.sendMessage(
        content,
        state.messages,
        state.chatType,
      );

      final assistantMessage = Message(
        id: _uuid.v4(),
        content: response,
        type: MessageType.assistant,
        timestamp: DateTime.now(),
      );

      state = state.copyWith(
        messages: [...state.messages, assistantMessage],
        isLoading: false,
      );
      
      // Save after getting assistant response
      _persistenceService.saveMessagesForConversation(
        state.currentConversationId!,
        state.messages,
        state.chatType,
      );
      
      // Update message count
      _updateConversationMessageCount(state.currentConversationId!, state.messages.length);
    } catch (e) {
      // Create a system message to indicate the error
      final errorMessage = Message(
        id: _uuid.v4(),
        content: "There was an error connecting to the AI service. Please try again later.",
        type: MessageType.system,
        timestamp: DateTime.now(),
      );
      
      state = state.copyWith(
        messages: [...state.messages, errorMessage],
        isLoading: false,
        error: e.toString(),
      );
      
      // Still save the conversation even with the error
      _persistenceService.saveMessagesForConversation(
        state.currentConversationId!,
        state.messages,
        state.chatType,
      );
    }
  }

  void _addWelcomeMessage(ChatType chatType) {
    if (state.messages.isEmpty) {
      final welcomeMessage = Message(
        id: _uuid.v4(),
        content: chatType == ChatType.therapist 
            ? "Hello! I'm your personal LifeSync AI assistant. How can I help you today?"
            : "I'm your symptom analyzer. Tell me about your symptoms, and I'll try to help.",
        type: MessageType.assistant,
        timestamp: DateTime.now(),
      );
      
      state = state.copyWith(
        messages: [welcomeMessage],
      );
      
      if (state.currentConversationId != null) {
        _persistenceService.saveMessagesForConversation(
          state.currentConversationId!,
          state.messages,
          chatType,
        );
      }
    }
  }
  
  /// Load all available conversations
  Future<void> loadConversations() async {
    try {
      final conversations = await _persistenceService.loadConversations();
      state = state.copyWith(conversations: conversations);
    } catch (e) {
      state = state.copyWith(
        error: 'Failed to load conversations: ${e.toString()}',
      );
    }
  }
  
  /// Set the active conversation
  void setConversation(String conversationId) async {
    try {
      // Load messages for this conversation
      final messages = await _persistenceService.loadMessagesForConversation(conversationId);
      final chatType = await _persistenceService.getChatTypeForConversation(conversationId) ?? ChatType.therapist;
      
      state = state.copyWith(
        currentConversationId: conversationId,
        messages: messages,
        chatType: chatType,
        isLoading: false,
        error: null,
      );
      
      // Save the current conversation ID
      _persistenceService.saveCurrentConversationId(conversationId);
    } catch (e) {
      state = state.copyWith(
        error: 'Failed to load conversation: ${e.toString()}',
      );
    }
  }
  
  /// Clear the current conversation selection (but don't delete it)
  void clearCurrentConversation() {
    state = state.copyWith(
      currentConversationId: null,
      messages: [],
    );
    
    _persistenceService.saveCurrentConversationId(null);
  }
  
  /// Toggle favorite status for a conversation
  void toggleFavorite(String conversationId) {
    final index = state.conversations.indexWhere((c) => c.id == conversationId);
    if (index >= 0) {
      final conversation = state.conversations[index];
      final updatedConversation = conversation.copyWith(
        isFavorite: !conversation.isFavorite,
      );
      
      final updatedConversations = List<Conversation>.from(state.conversations);
      updatedConversations[index] = updatedConversation;
      
      state = state.copyWith(conversations: updatedConversations);
      
      // Save the updated conversation
      _persistenceService.saveConversation(updatedConversation);
    }
  }
  
  /// Delete a conversation
  void deleteConversation(String conversationId) async {
    // Remove from state
    final updatedConversations = state.conversations.where((c) => c.id != conversationId).toList();
    state = state.copyWith(conversations: updatedConversations);
    
    // If we're deleting the current conversation, clear it
    if (state.currentConversationId == conversationId) {
      state = state.copyWith(
        currentConversationId: null,
        messages: [],
      );
      
      // If we have other conversations, select the first one
      if (updatedConversations.isNotEmpty) {
        setConversation(updatedConversations.first.id);
      } else {
        // No conversations left, create a new one
        createNewChat();
      }
    }
    
    // Delete from persistence
    await _persistenceService.deleteConversation(conversationId);
  }
  
  /// Delete all conversations
  Future<void> deleteAllConversations() async {
    // Clear state
    state = state.copyWith(
      conversations: [],
      currentConversationId: null,
      messages: [],
    );
    
    // Delete from persistence
    await _persistenceService.deleteAllConversations();
    
    // Create a new chat
    createNewChat();
  }
  
  // Helper methods for updating conversation metadata
  
  void _updateConversationTitle(String content) {
    final conversationId = state.currentConversationId;
    if (conversationId == null) return;
    
    final index = state.conversations.indexWhere((c) => c.id == conversationId);
    if (index >= 0) {
      final conversation = state.conversations[index];
      
      // Create a title from the first message (max 30 chars)
      final title = content.length > 30 ? '${content.substring(0, 30)}...' : content;
      
      final updatedConversation = conversation.copyWith(
        title: title,
      );
      
      final updatedConversations = List<Conversation>.from(state.conversations);
      updatedConversations[index] = updatedConversation;
      
      state = state.copyWith(conversations: updatedConversations);
      
      // Save the updated conversation
      _persistenceService.saveConversation(updatedConversation);
    }
  }
  
  void _updateConversationTimestamp(String conversationId) {
    final index = state.conversations.indexWhere((c) => c.id == conversationId);
    if (index >= 0) {
      final conversation = state.conversations[index];
      final updatedConversation = conversation.copyWith(
        updatedAt: DateTime.now(),
      );
      
      final updatedConversations = List<Conversation>.from(state.conversations);
      updatedConversations[index] = updatedConversation;
      
      state = state.copyWith(conversations: updatedConversations);
      
      // Save the updated conversation
      _persistenceService.saveConversation(updatedConversation);
    }
  }
  
  void _updateConversationMessageCount(String conversationId, int count) {
    final index = state.conversations.indexWhere((c) => c.id == conversationId);
    if (index >= 0) {
      final conversation = state.conversations[index];
      final updatedConversation = conversation.copyWith(
        messageCount: count,
      );
      
      final updatedConversations = List<Conversation>.from(state.conversations);
      updatedConversations[index] = updatedConversation;
      
      state = state.copyWith(conversations: updatedConversations);
      
      // Save the updated conversation
      _persistenceService.saveConversation(updatedConversation);
    }
  }
}

// Provider to access the chat notifier
final chatProvider = chatNotifierProvider; 