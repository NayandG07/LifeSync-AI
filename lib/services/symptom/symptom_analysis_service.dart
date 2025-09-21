import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:math' as math;
import 'package:http/http.dart' as http;
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:uuid/uuid.dart';

import '../../models/symptom/symptom_model.dart';
import '../../app/constants.dart';

part 'symptom_analysis_service.g.dart';

/// Provider for the symptom analysis service
@riverpod
SymptomAnalysisService symptomAnalysisService(SymptomAnalysisServiceRef ref) {
  return SymptomAnalysisService();
}

/// Service for analyzing symptoms using Gemini API
class SymptomAnalysisService {
  /// Analyze symptoms and return possible conditions and recommendations
  Future<SymptomAnalysisResult> analyzeSymptoms(List<Symptom> symptoms) async {
    try {
      // Format symptoms for the prompt
      final symptomsText = symptoms.map((s) {
        final severityText = _getSeverityText(s.severity);
        final durationText = '${s.durationValue} ${_getDurationText(s.duration, s.durationValue)}';
        return '- ${s.name} (Severity: $severityText, Duration: $durationText${s.notes != null ? ', Notes: ${s.notes}' : ''})';
      }).join('\n');
      
      // Create the prompt for Gemini API - updated to support both data formats
      final prompt = '''
I need you to analyze the following symptoms as a medical AI assistant:

$symptomsText

Please provide your analysis in the following JSON format:
{
  "conditions": [
    {
      "name": "Condition name",
      "description": "Brief description of the condition",
      "confidence": 75,
      "severity": "mild"
    }
  ],
  "remedies": [
    {
      "type": "home",
      "title": "Remedy title",
      "description": "Description of the remedy"
    }
  ],
  "overallSeverity": "mild",
  "shouldSeeDoctor": true,
  "specialistRecommendation": "Type of doctor to see, like Cardiologist, Neurologist, etc.",
  "disclaimer": "Medical disclaimer text"
}

Important guidelines:
1. Severity must be one of: "mild", "moderate", "severe", or "emergency"
2. Remedy type must be one of: "home", "otc", or "professional"
3. Confidence must be a number between 0 and 100
4. MUST provide BETWEEN 2-4 possible conditions, listing them in order of likelihood - never return just one condition
5. Overall severity should indicate the general seriousness of the symptoms
6. shouldSeeDoctor MUST be included as a boolean (true/false) indicating if medical attention is advised
7. specialistRecommendation MUST specify the most appropriate medical specialist for the symptoms when shouldSeeDoctor is true
8. Include at least one home remedy when appropriate, but also professional advice when needed
9. Return ONLY the JSON with no surrounding text, code blocks, or explanations.

Based on the symptoms, provide multiple potential conditions (2-4) and recommended remedies in this exact JSON format.''';

      // Prepare the request body
      final Map<String, dynamic> requestBody = {
        'contents': [
          {
            'parts': [
              {'text': prompt}
            ]
          }
        ],
        'generationConfig': {
          'temperature': 0.2,
          'topK': 40,
          'topP': 0.95,
          'maxOutputTokens': 1024,
          'stopSequences': []
        },
        'safetySettings': [
          {
            'category': 'HARM_CATEGORY_DANGEROUS_CONTENT',
            'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      };
      
      print('Symptom Analysis: Sending request to Gemini API');
      
      // Send request with appropriate timeout
      final client = http.Client();
      try {
        final response = await client.post(
          Uri.parse(AppConstants.symptomCheckerApiUrl),
          headers: {
            'Content-Type': 'application/json',
          },
          body: jsonEncode(requestBody),
        ).timeout(const Duration(seconds: 30), onTimeout: () {
          throw TimeoutException('The request timed out after 30 seconds');
        });
        
        print('Symptom Analysis: Received response with status code ${response.statusCode}');
        
        if (response.statusCode == 200) {
          return _parseAnalysisResponse(response.body, symptoms);
        } else {
          // Handle HTTP error codes
          print('API Error: HTTP ${response.statusCode}');
          print('Response body: ${response.body}');
          
          if (response.statusCode == 400) {
            throw Exception('Bad request: Invalid input for symptom analysis');
          } else if (response.statusCode == 401 || response.statusCode == 403) {
            throw Exception('Authentication error: API key may be invalid or expired');
          } else if (response.statusCode == 429) {
            throw Exception('Rate limit exceeded: Too many requests to the API');
          } else if (response.statusCode >= 500) {
            throw Exception('Server error: The symptom analysis service is currently unavailable');
          } else {
            throw Exception('HTTP Error ${response.statusCode}: ${response.reasonPhrase}');
          }
        }
      } finally {
        client.close();
      }
    } catch (e) {
      print('Error in symptom analysis: $e');
      
      // Return a formatted error message
      if (e is TimeoutException) {
        return _createFallbackResponse(symptoms, 'Analysis timed out. Please try again.');
      } else if (e is SocketException) {
        return _createFallbackResponse(symptoms, 'Network error: Please check your internet connection.');
      } else if (e is http.ClientException) {
        return _createFallbackResponse(symptoms, 'API connection error: ${e.message}');
      } else if (e is FormatException) {
        return _createFallbackResponse(symptoms, 'Error parsing response from the API.');
      } else {
        return _createFallbackResponse(symptoms, 'Error analyzing symptoms: ${e.toString()}');
      }
    }
  }
  
  /// Parse the analysis response from Gemini API
  SymptomAnalysisResult _parseAnalysisResponse(String response, List<Symptom> symptoms) {
    try {
      print('Starting to parse response: ${response.substring(0, math.min(100, response.length))}...');

      // First, we need to parse the Gemini API response format
      Map<String, dynamic> apiResponse = jsonDecode(response);
      if (!apiResponse.containsKey('candidates') || 
          apiResponse['candidates'].isEmpty || 
          !apiResponse['candidates'][0].containsKey('content') ||
          !apiResponse['candidates'][0]['content'].containsKey('parts') ||
          apiResponse['candidates'][0]['content']['parts'].isEmpty) {
        print('Invalid API response structure');
        return _createFallbackResponse(symptoms, 'The API response structure was invalid.');
      }

      // Extract the actual text content from the API response
      String textContent = apiResponse['candidates'][0]['content']['parts'][0]['text'];
      print('Extracted text content from API response');

      // Now look for JSON in this content, either inside code blocks or directly
      String jsonText;
      
      // Look for JSON in markdown code blocks
      final codeBlockRegex = RegExp(r'```(?:json)?\s*([\s\S]*?)\s*```', caseSensitive: false);
      final codeBlockMatch = codeBlockRegex.firstMatch(textContent);

      if (codeBlockMatch != null) {
        // Extract JSON from code block and clean it
        final rawJson = codeBlockMatch.group(1)?.trim() ?? '';
        // Clean up any special characters or escape sequences that might cause parsing issues
        jsonText = rawJson.replaceAll('\n', '').replaceAll('\r', '').replaceAll('\t', '');
        print('Found JSON in code block, cleaned up for parsing');
      } else {
        // Try to extract JSON directly
        final jsonStart = textContent.indexOf('{');
        final jsonEnd = textContent.lastIndexOf('}') + 1;
        
        if (jsonStart == -1 || jsonEnd == 0 || jsonEnd <= jsonStart) {
          print('Invalid JSON format in content - creating fallback response');
          return _createFallbackResponse(symptoms, 'The AI response did not contain valid JSON data.');
        }
        
        // Clean up extracted JSON
        jsonText = textContent.substring(jsonStart, jsonEnd)
            .replaceAll('\n', '')
            .replaceAll('\r', '')
            .replaceAll('\t', '');
        print('Extracted JSON directly from content and cleaned up for parsing');
      }

      try {
        final data = jsonDecode(jsonText);
        print('Successfully parsed JSON data: ${data.keys.join(', ')}');
        
        if (data == null) {
          print('Null data from JSON decode');
          return _createFallbackResponse(symptoms, 'The AI response returned null data.');
        }
        
        // Check for both possibleConditions (Flutter app format) and conditions (web format)
        List<dynamic> conditionsData = [];
        
        if (data.containsKey('possibleConditions')) {
          conditionsData = data['possibleConditions'];
          print('Found possibleConditions format in response');
        } else if (data.containsKey('conditions')) {
          conditionsData = data['conditions'];
          print('Found conditions format in response (web format)');
        } else {
          print('Missing required conditions field in JSON response');
          print('Available keys: ${data.keys.join(', ')}');
          return _createFallbackResponse(symptoms, 'The AI response was missing required data fields.');
        }
        
        // Parse possible conditions
        final List<PossibleCondition> conditions = [];
        for (final conditionData in conditionsData) {
          try {
            // Check for required fields in both formats
            String name = '';
            String description = '';
            double confidenceLevel = 0.5;
            SymptomSeverity severity = SymptomSeverity.moderate;
            
            // Handle name field
            if (conditionData.containsKey('name')) {
              name = conditionData['name'] ?? 'Unknown condition';
            } else {
              print('Skipping condition missing name field');
              continue;
            }
            
            // Handle description field
            if (conditionData.containsKey('description')) {
              description = conditionData['description'] ?? 'No description available';
            } else {
              print('Skipping condition missing description field');
              continue;
            }
            
            // Handle confidence/confidenceLevel field (handle both formats)
            if (conditionData.containsKey('confidenceLevel')) {
              // App format: 0.0-1.0
              try {
                if (conditionData['confidenceLevel'] is double) {
                  confidenceLevel = conditionData['confidenceLevel'];
                } else if (conditionData['confidenceLevel'] is int) {
                  confidenceLevel = conditionData['confidenceLevel'].toDouble() / 100.0;
                } else if (conditionData['confidenceLevel'] is String) {
                  confidenceLevel = double.tryParse(conditionData['confidenceLevel']) ?? 0.5;
                }
                // Ensure value is between 0 and 1
                confidenceLevel = confidenceLevel.clamp(0.0, 1.0);
              } catch (e) {
                print('Error parsing confidenceLevel: $e');
              }
            } else if (conditionData.containsKey('confidence')) {
              // Web format: 0-100
              try {
                if (conditionData['confidence'] is int) {
                  confidenceLevel = conditionData['confidence'] / 100.0;
                } else if (conditionData['confidence'] is double) {
                  confidenceLevel = conditionData['confidence'] / 100.0;
                } else if (conditionData['confidence'] is String) {
                  confidenceLevel = (double.tryParse(conditionData['confidence']) ?? 50) / 100.0;
                }
                // Ensure value is between 0 and 1
                confidenceLevel = confidenceLevel.clamp(0.0, 1.0);
              } catch (e) {
                print('Error parsing confidence: $e');
              }
            }
            
            // Parse the severity
            if (conditionData.containsKey('severity')) {
              String severityStr = conditionData['severity']?.toString().toLowerCase() ?? 'moderate';
              switch (severityStr) {
                case 'mild':
                  severity = SymptomSeverity.mild;
                  break;
                case 'moderate':
                  severity = SymptomSeverity.moderate;
                  break;
                case 'severe':
                  severity = SymptomSeverity.severe;
                  break;
                case 'emergency':
                case 'unbearable':
                  severity = SymptomSeverity.unbearable;
                  break;
                default:
                  severity = SymptomSeverity.moderate;
              }
            }
            
            conditions.add(PossibleCondition(
              name: name,
              description: description,
              confidenceLevel: confidenceLevel,
              severity: severity,
              additionalInfo: conditionData['additionalInfo'],
            ));
          } catch (e) {
            print('Error parsing condition: $e');
            // Continue to next condition rather than failing entirely
          }
        }
        
        // Parse recommended remedies - check for both formats
        final List<Remedy> remedies = [];
        List<dynamic> remediesData = [];
        
        if (data.containsKey('recommendedRemedies')) {
          remediesData = data['recommendedRemedies'];
        } else if (data.containsKey('remedies')) {
          remediesData = data['remedies'];
        }
        
        for (final remedyData in remediesData) {
          try {
            // Check fields in both formats
            String name = '';
            String description = '';
            RemedyType type = RemedyType.home;
            
            // Handle name/title field
            if (remedyData.containsKey('name')) {
              name = remedyData['name'] ?? 'Unknown remedy';
            } else if (remedyData.containsKey('title')) {
              name = remedyData['title'] ?? 'Unknown remedy';
            } else {
              print('Skipping remedy missing name/title field');
              continue;
            }
            
            // Handle description field
            if (remedyData.containsKey('description')) {
              description = remedyData['description'] ?? 'No description available';
            } else {
              print('Skipping remedy missing description field');
              continue;
            }
            
            // Parse the remedy type
            if (remedyData.containsKey('type')) {
              String typeStr = remedyData['type']?.toString().toLowerCase() ?? 'home';
              switch (typeStr) {
                case 'home':
                  type = RemedyType.home;
                  break;
                case 'otc':
                  type = RemedyType.otc;
                  break;
                case 'professional':
                  type = RemedyType.professional;
                  break;
                default:
                  type = RemedyType.home;
              }
            }
            
            remedies.add(Remedy(
              name: name,
              description: description,
              type: type,
              warning: remedyData['warning'],
            ));
          } catch (e) {
            print('Error parsing remedy: $e');
            // Continue to next remedy
          }
        }
        
        // If no valid conditions were found, add a fallback
        if (conditions.isEmpty) {
          print('No valid conditions found in the response');
          conditions.add(PossibleCondition(
            name: 'Analysis Incomplete',
            description: 'The analysis did not return any clear conditions. Please try again with more symptom details.',
            confidenceLevel: 0.5,
            severity: SymptomSeverity.moderate,
          ));
        }
        
        // If no valid remedies were found, add fallbacks
        if (remedies.isEmpty) {
          remedies.add(Remedy(
            name: 'Rest and Hydration',
            description: 'Get adequate rest and stay hydrated while your body recovers.',
            type: RemedyType.home,
          ));
          remedies.add(Remedy(
            name: 'Consult a Healthcare Provider',
            description: 'For proper diagnosis and treatment, consult with a healthcare professional.',
            type: RemedyType.professional,
          ));
        }
        
        print('Successfully parsed ${conditions.length} conditions and ${remedies.length} remedies');
        
        // Get disclaimer from either format or use default
        String disclaimer = data['disclaimer'] ?? 'This is a preliminary analysis based on the symptoms provided. Always consult with a healthcare professional for proper medical advice and diagnosis.';
        
        // Parse overall severity if available
        SymptomSeverity? overallSeverity;
        if (data.containsKey('overallSeverity')) {
          String severityStr = data['overallSeverity']?.toString().toLowerCase() ?? '';
          switch (severityStr) {
            case 'mild':
              overallSeverity = SymptomSeverity.mild;
              break;
            case 'moderate':
              overallSeverity = SymptomSeverity.moderate;
              break;
            case 'severe':
              overallSeverity = SymptomSeverity.severe;
              break;
            case 'emergency':
            case 'unbearable':
              overallSeverity = SymptomSeverity.unbearable;
              break;
          }
        }
        
        // Parse doctor recommendation
        bool? shouldSeeDoctor;
        if (data.containsKey('shouldSeeDoctor')) {
          var shouldSeeValue = data['shouldSeeDoctor'];
          if (shouldSeeValue is bool) {
            shouldSeeDoctor = shouldSeeValue;
          } else if (shouldSeeValue is String) {
            shouldSeeDoctor = shouldSeeValue.toLowerCase() == 'true';
          }
        }
        
        // Get specialist recommendation
        String? specialistRecommendation;
        if (data.containsKey('specialistRecommendation')) {
          specialistRecommendation = data['specialistRecommendation']?.toString();
        }
        
        // Create and return the complete analysis result
        return SymptomAnalysisResult.create(
          symptoms: symptoms,
          possibleConditions: conditions,
          recommendedRemedies: remedies,
          disclaimer: disclaimer,
          overallSeverity: overallSeverity,
          shouldSeeDoctor: shouldSeeDoctor,
          specialistRecommendation: specialistRecommendation,
        );
      } catch (jsonError) {
        print('JSON parsing error: $jsonError');
        return _createFallbackResponse(symptoms, 'Error parsing the AI response: $jsonError');
      }
    } catch (e) {
      print('Error parsing analysis response: $e');
      return _createFallbackResponse(symptoms, 'Error analyzing symptoms: $e');
    }
  }
  
  /// Create a fallback response when analysis fails
  SymptomAnalysisResult _createFallbackResponse(List<Symptom> symptoms, String errorMessage) {
    return SymptomAnalysisResult.create(
      symptoms: symptoms,
      possibleConditions: [
        PossibleCondition(
          name: 'Unable to Determine',
          description: 'The analysis could not determine a specific condition. $errorMessage',
          confidenceLevel: 0.5,
          severity: SymptomSeverity.moderate,
        ),
        PossibleCondition(
          name: 'General Symptoms',
          description: 'Your symptoms could be related to several different conditions. Please consult with a healthcare provider for proper diagnosis.',
          confidenceLevel: 0.3,
          severity: SymptomSeverity.moderate,
        ),
        // Add a third fallback condition
        PossibleCondition(
          name: 'Technical Analysis Limitation',
          description: 'The AI had difficulty analyzing your specific symptoms. This could be due to unusual symptom combinations or complex health issues that require in-person evaluation.',
          confidenceLevel: 0.2,
          severity: SymptomSeverity.moderate,
        ),
      ],
      recommendedRemedies: [
        Remedy(
          name: 'Consult a Healthcare Provider',
          description: 'Since the analysis was inconclusive, it is recommended to consult a healthcare provider for proper diagnosis and treatment.',
          type: RemedyType.professional,
        ),
        Remedy(
          name: 'Try Again Later',
          description: 'You may try analyzing your symptoms again later with more specific details.',
          type: RemedyType.home,
        ),
      ],
      disclaimer: 'This is a fallback analysis due to an error. Please consult a healthcare professional for proper diagnosis and advice.',
      overallSeverity: SymptomSeverity.moderate,
      shouldSeeDoctor: true,
      specialistRecommendation: 'General Practitioner',
    );
  }
  
  /// Get text representation of severity
  String _getSeverityText(SymptomSeverity severity) {
    switch (severity) {
      case SymptomSeverity.mild:
        return 'Mild';
      case SymptomSeverity.moderate:
        return 'Moderate';
      case SymptomSeverity.severe:
        return 'Severe';
      case SymptomSeverity.unbearable:
        return 'Unbearable';
      default:
        return 'Unknown';
    }
  }
  
  /// Get text representation of duration
  String _getDurationText(SymptomDuration duration, int value) {
    switch (duration) {
      case SymptomDuration.minutes:
        return value == 1 ? 'Minute' : 'Minutes';
      case SymptomDuration.hours:
        return value == 1 ? 'Hour' : 'Hours';
      case SymptomDuration.days:
        return value == 1 ? 'Day' : 'Days';
      case SymptomDuration.weeks:
        return value == 1 ? 'Week' : 'Weeks';
      case SymptomDuration.months:
        return value == 1 ? 'Month' : 'Months';
      default:
        return '';
    }
  }
} 