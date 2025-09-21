import 'dart:convert';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:http/http.dart' as http;

import '../app/constants.dart';

part 'health_tips_provider.g.dart';

/// Model for health tip
class HealthTip {
  /// Constructor
  HealthTip({
    required this.title,
    required this.content,
    this.category = 'General',
    this.icon = Icons.tips_and_updates_outlined,
  });

  /// Title of the health tip
  final String title;

  /// Content of the health tip
  final String content;

  /// Category of the health tip
  final String category;

  /// Icon to display with the tip
  final IconData icon;

  /// Create a copy with modifications
  HealthTip copyWith({
    String? title,
    String? content,
    String? category,
    IconData? icon,
  }) {
    return HealthTip(
      title: title ?? this.title,
      content: content ?? this.content,
      category: category ?? this.category,
      icon: icon ?? this.icon,
    );
  }
  
  /// Create from JSON
  factory HealthTip.fromJson(Map<String, dynamic> json) {
    return HealthTip(
      title: json['title'] as String,
      content: json['content'] as String,
      category: json['category'] as String? ?? 'General',
    );
  }
  
  /// Convert to JSON
  Map<String, dynamic> toJson() {
    return {
      'title': title,
      'content': content,
      'category': category,
    };
  }
}

/// State for health tips
class HealthTipsState {
  /// Constructor
  HealthTipsState({
    required this.currentTip,
    this.isLoading = false,
    this.error,
  });

  /// Current health tip
  final HealthTip currentTip;
  
  /// Loading state
  final bool isLoading;
  
  /// Error message
  final String? error;

  /// Create a copy with modifications
  HealthTipsState copyWith({
    HealthTip? currentTip,
    bool? isLoading,
    String? error,
  }) {
    return HealthTipsState(
      currentTip: currentTip ?? this.currentTip,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

/// Default health tip when API call fails
final _defaultHealthTip = HealthTip(
  title: 'Stay Hydrated',
  content: 'Drinking enough water helps maintain energy levels and supports cognitive function. Aim for at least 8 glasses of water per day.',
  category: 'Hydration',
);

/// Provider for the current health tip that automatically refreshes
@riverpod
HealthTip currentHealthTip(CurrentHealthTipRef ref) {
  // Get the current health tip from the provider
  final healthTipsState = ref.watch(healthTipsProviderProvider);
  return healthTipsState.currentTip;
}

/// Provider for health tips
@riverpod
class HealthTipsProvider extends _$HealthTipsProvider {
  @override
  HealthTipsState build() {
    // Fetch a health tip on initial build
    _fetchHealthTip();
    
    return HealthTipsState(
      currentTip: _defaultHealthTip,
      isLoading: true,
    );
  }

  /// Fetch a health tip from the Gemini API
  Future<void> _fetchHealthTip() async {
    try {
      state = state.copyWith(isLoading: true, error: null);
      
      final url = Uri.parse(AppConstants.symptomCheckerApiUrl);
      
      // Prepare the prompt for Gemini
      final payload = {
        'contents': [
          {
            'parts': [
              {
                'text': 'Generate a random health and wellness tip with a title and content. The tip should be concise and practical. Format as JSON with fields "title" and "content". Respond with only the JSON object and limit the content to 80 words.',
              }
            ]
          }
        ],
        'generationConfig': {
          'temperature': 0.7,
          'maxOutputTokens': 256,
          'topP': 0.8,
          'topK': 40
        }
      };
      
      // Make the API call
      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode(payload),
      );
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        
        // Extract the text from the response
        final text = data['candidates'][0]['content']['parts'][0]['text'];
        
        try {
          // Try to parse the JSON content
          final jsonStart = text.indexOf('{');
          final jsonEnd = text.lastIndexOf('}') + 1;
          final jsonContent = text.substring(jsonStart, jsonEnd);
          
          final Map<String, dynamic> tipData = jsonDecode(jsonContent);
          
          // Create a health tip from the data
          final healthTip = HealthTip(
            title: tipData['title'],
            content: tipData['content'],
            category: tipData['category'] ?? 'Wellness',
          );
          
          state = state.copyWith(
            currentTip: healthTip,
            isLoading: false,
          );
        } catch (e) {
          // If we can't parse the JSON, create a health tip from the raw text
          final lines = text.split('\n');
          String title = 'Health Tip';
          String content = text;
          
          if (lines.length > 1) {
            title = lines[0].replaceAll('"', '').replaceAll(':', '').trim();
            content = lines.sublist(1).join('\n').trim();
          }
          
          state = state.copyWith(
            currentTip: HealthTip(
              title: title,
              content: content,
            ),
            isLoading: false,
          );
        }
      } else {
        state = state.copyWith(
          error: 'Failed to fetch health tip: ${response.statusCode}',
          isLoading: false,
        );
      }
    } catch (e) {
      debugPrint('Error fetching health tip: $e');
      state = state.copyWith(
        error: e.toString(),
        isLoading: false,
      );
    }
  }

  /// Refresh the health tip
  Future<void> refreshHealthTip() async {
    await _fetchHealthTip();
  }
} 