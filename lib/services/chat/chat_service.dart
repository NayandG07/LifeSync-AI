import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:riverpod/riverpod.dart';
import '../../models/chat/message.dart';
import '../../providers/chat/chat_provider.dart';
import '../../app/constants.dart';
import '../../services/chat_prompt_service.dart';

class ChatService {
  /// Constructor with dependencies
  ChatService(this._promptService);
  
  /// Chat prompt service
  final ChatPromptService _promptService;

  /// Send a message to the Gemini API based on chat type
  Future<String> sendMessage(String content, List<Message> previousMessages, ChatType chatType) async {
    try {
      // Select the appropriate API URL based on chat type
      final apiUrl = chatType == ChatType.therapist 
          ? AppConstants.chatbotApiUrl 
          : AppConstants.symptomCheckerApiUrl;
      
      // Get system prompt from the prompt service
      final systemPrompt = _promptService.getSystemPrompt(chatType);
      
      // Format the messages for Gemini API
      final List<Map<String, dynamic>> contents = [];
      
      // Add system prompt as first message
      contents.add({
        "role": "user",
        "parts": [{"text": "You are an AI assistant with the following instructions: $systemPrompt. Please follow these instructions in all your responses."}]
      });
      
      // Add AI acknowledgment of the system prompt
      contents.add({
        "role": "model",
        "parts": [{"text": "I understand. I'll act according to those instructions."}]
      });
      
      // Add conversation history
      for (int i = 0; i < previousMessages.length; i++) {
        final msg = previousMessages[i];
        // Skip system messages
        if (msg.type == MessageType.system) continue;
        
        contents.add({
          "role": msg.type == MessageType.user ? "user" : "model",
          "parts": [{"text": msg.content}]
        });
      }
      
      // Add the current user message
      contents.add({
        "role": "user",
        "parts": [{"text": content}]
      });
      
      // Create the request payload for Gemini API with model-specific configs
      final Map<String, dynamic> generationConfig;
      
      // Optimize settings based on the model being used
      if (chatType == ChatType.therapist) {
        // For Gemini 1.5 Pro - Use higher creativity for therapy 
        generationConfig = {
          "temperature": 0.8,
          "topK": 40,
          "topP": 0.95,
          "maxOutputTokens": 2048, // Increased for more detailed responses
          "responseMimeType": "text/plain",
        };
      } else {
        // For Gemini 1.5 Flash - More precise for medical topics
        generationConfig = {
          "temperature": 0.4, // Lower temperature for more factual responses
          "topK": 40,
          "topP": 0.9,
          "maxOutputTokens": 1024,
          "responseMimeType": "text/plain",
        };
      }
      
      final payload = {
        "contents": contents,
        "generationConfig": generationConfig,
        "safetySettings": [
          {
            "category": "HARM_CATEGORY_HARASSMENT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            "category": "HARM_CATEGORY_HATE_SPEECH",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      };

      // Send request to Gemini API
      final response = await http.post(
        Uri.parse(apiUrl),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode(payload),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        
        // Extract the text from the Gemini response
        if (data['candidates'] != null && 
            data['candidates'].isNotEmpty && 
            data['candidates'][0]['content'] != null &&
            data['candidates'][0]['content']['parts'] != null &&
            data['candidates'][0]['content']['parts'].isNotEmpty) {
          return data['candidates'][0]['content']['parts'][0]['text'];
        } else {
          throw Exception('Invalid response format from API');
        }
      } else {
        // Handle HTTP error
        final errorBody = response.body;
        print('API Error: ${response.statusCode} - $errorBody');
        throw Exception('Failed to get response: HTTP ${response.statusCode}');
      }
    } catch (e) {
      print('Error calling API: $e');
      throw Exception('Failed to connect to the AI service: $e');
    }
  }
}

final chatServiceProvider = Provider<ChatService>((ref) {
  final promptService = ref.watch(chatPromptServiceProvider);
  return ChatService(promptService);
}); 