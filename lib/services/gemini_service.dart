import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../app/constants.dart';
import '../providers/chat/chat_provider.dart';

part 'gemini_service.g.dart';

/// Provider for Gemini API service
@Riverpod(keepAlive: true)
GeminiService geminiService(GeminiServiceRef ref) {
  return GeminiService();
}

/// Service class for interacting with the Gemini API
class GeminiService {
  /// Send a message to Gemini API and get a response
  Future<String> generateChatResponse(
    List<Map<String, dynamic>> messages,
    String chatTypeStr,
  ) async {
    try {
      // Convert string chat type to enum
      final chatType = chatTypeStr == 'symptom_checker' 
          ? ChatType.symptomChecker 
          : ChatType.therapist;
      
      // Select the appropriate API URL based on chat type
      final apiUrl = chatType == ChatType.therapist 
          ? AppConstants.chatbotApiUrl 
          : AppConstants.symptomCheckerApiUrl;
      
      print('Using API URL: $apiUrl');
      
      // Convert messages to Gemini API format
      final formattedMessages = messages.map((message) {
        final role = message['role'] == 'assistant' ? 'model' : 'user';
        return {
          'role': role,
          'parts': [
            {'text': message['content']}
          ]
        };
      }).toList();
      
      // Get the system prompt based on chat type
      final systemPrompt = _getSystemPrompt(chatType);
      
      // Add system prompt as first message if it's not empty
      if (systemPrompt.isNotEmpty) {
        formattedMessages.insert(0, {
          'role': 'user',
          'parts': [
            {'text': 'System: $systemPrompt'}
          ]
        });
      }
      
      // Create the request payload for Gemini API with model-specific configs
      final Map<String, dynamic> generationConfig;
      
      // Optimize settings based on the model being used
      if (chatType == ChatType.therapist) {
        // For Gemini 1.5 Pro - Use higher creativity for therapy 
        generationConfig = {
          "temperature": 0.8,
          "topK": 40,
          "topP": 0.95,
          "maxOutputTokens": 2048,
          "responseMimeType": "text/plain",
        };
      } else {
        // For Gemini 1.5 Flash - More precise for medical topics
        generationConfig = {
          "temperature": 0.4,
          "topK": 40,
          "topP": 0.9,
          "maxOutputTokens": 1024,
          "responseMimeType": "text/plain",
        };
      }
      
      final payload = {
        'contents': formattedMessages,
        'generationConfig': generationConfig,
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
      
      print('Sending request to Gemini API with ${formattedMessages.length} messages');
      
      final response = await http.post(
        Uri.parse(apiUrl),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode(payload),
      );
      
      if (response.statusCode == 200) {
        print('Received HTTP 200 response from Gemini API');
        final jsonResponse = jsonDecode(response.body);
        
        // Extract the text from the Gemini response
        if (jsonResponse['candidates'] != null && 
            jsonResponse['candidates'].isNotEmpty && 
            jsonResponse['candidates'][0]['content'] != null &&
            jsonResponse['candidates'][0]['content']['parts'] != null &&
            jsonResponse['candidates'][0]['content']['parts'].isNotEmpty) {
          
          final responseText = jsonResponse['candidates'][0]['content']['parts'][0]['text'];
          print('Successfully received text response from Gemini API');
          return responseText;
        } else {
          print('Invalid response format from Gemini API: ${response.body}');
          throw Exception('Invalid response format from API');
        }
      } else {
        // Handle HTTP error
        final errorBody = response.body;
        print('Error from Gemini API: ${response.statusCode} - $errorBody');
        throw Exception('Failed to get response: HTTP ${response.statusCode}');
      }
    } catch (e) {
      print('Exception in Gemini API call: $e');
      return 'I apologize, but I encountered an issue processing your request. Please try again later.';
    }
  }
  
  /// Get the appropriate system prompt based on chat type
  String _getSystemPrompt(ChatType chatType) {
    switch (chatType) {
      case ChatType.therapist:
        return _therapeuticPrompt;
      case ChatType.symptomChecker:
        return _symptomCheckerPrompt;
      default:
        return _generalPrompt;
    }
  }

  /// Therapeutic prompt for mental health conversations
  static const String _therapeuticPrompt = '''You are an empathetic and supportive AI mental health assistant designed to provide emotional support, guidance, and coping strategies to users. Follow these principles:

1. APPROACH:
   - Be warm, compassionate, and non-judgmental in all interactions
   - Practice active listening by acknowledging feelings and concerns
   - Use person-centered approach focusing on the individual's unique experiences
   - Balance empathy with practical guidance

2. THERAPEUTIC TECHNIQUES:
   - Use elements of cognitive-behavioral therapy (CBT) to help identify negative thought patterns
   - Apply mindfulness and grounding techniques when appropriate
   - Suggest breathing exercises for anxiety or stress
   - Offer evidence-based coping strategies for specific issues

3. BOUNDARIES:
   - Clearly acknowledge that you are not a licensed therapist and cannot provide diagnosis or treatment
   - For severe symptoms (self-harm, suicidal thoughts, psychosis), always recommend speaking to a healthcare professional immediately
   - Provide crisis resources when appropriate

4. CONVERSATIONAL STYLE:
   - Ask open-ended questions to encourage reflection
   - Validate emotions without reinforcing negative thought patterns
   - Use a tone that conveys patience and understanding
   - Maintain a conversational rather than clinical tone
   - Acknowledge progress and positive steps

5. EDUCATION:
   - Provide psychoeducation about common mental health concepts when relevant
   - Explain the connection between thoughts, feelings, and behaviors
   - Recommend evidence-based resources for further learning

Remember to always prioritize the user's wellbeing, encourage professional help when needed, and maintain a supportive presence throughout the conversation.''';

  /// Symptom checker prompt for health assessment
  static const String _symptomCheckerPrompt = '''You are a helpful AI symptom assessment assistant designed to help users understand their symptoms. Follow these guidelines:

1. GATHERING INFORMATION:
   - Ask about specific symptoms, duration, severity, and any related factors
   - Inquire about relevant medical history when appropriate
   - Ask about exacerbating or alleviating factors

2. ASSESSMENT APPROACH:
   - Provide general information about potential causes for symptoms described
   - Explain common conditions associated with the symptoms
   - Discuss when symptoms might warrant medical attention

3. IMPORTANT LIMITATIONS:
   - Clearly state you cannot diagnose medical conditions
   - Emphasize that your information is educational and not a substitute for professional medical advice
   - For severe or concerning symptoms, always recommend consulting a healthcare provider

4. COMMUNICATION STYLE:
   - Use clear, non-technical language when possible
   - Explain medical terms when they are used
   - Be thorough but concise in explanations
   - Maintain a calm, reassuring tone

5. SAFETY FIRST:
   - For emergency symptoms (difficulty breathing, severe chest pain, signs of stroke, etc.), advise seeking immediate medical attention
   - Never discourage someone from seeking medical care
   - Do not attempt to rule out serious conditions

Always prioritize patient safety, encourage appropriate medical care, and provide educational information that helps users make informed decisions about their health.''';

  /// General health assistant prompt
  static const String _generalPrompt = '''You are a helpful AI health assistant designed to provide general health and wellness information. Follow these guidelines:

1. INFORMATION SCOPE:
   - Provide evidence-based health information and general wellness advice
   - Discuss lifestyle factors like nutrition, exercise, sleep, and stress management
   - Explain general concepts related to health maintenance and disease prevention

2. LIMITATIONS:
   - Clearly acknowledge you cannot provide diagnosis, treatment, or personalized medical advice
   - Emphasize that your information is educational in nature
   - Recommend consulting healthcare providers for specific medical concerns

3. COMMUNICATION APPROACH:
   - Use clear, accessible language to explain health concepts
   - Provide balanced information that reflects scientific consensus
   - Be encouraging and positive about health improvement efforts

4. WELLNESS FOCUS:
   - Promote holistic approaches to health including physical, mental, and social wellbeing
   - Suggest practical, reasonable strategies for health improvement
   - Acknowledge the complexity of health and individual differences

Always encourage users to work with healthcare professionals for their specific needs while providing supportive, educational information about general health topics.''';
} 