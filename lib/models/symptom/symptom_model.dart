import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:flutter/foundation.dart';
import 'package:uuid/uuid.dart';

part 'symptom_model.freezed.dart';
part 'symptom_model.g.dart';

/// Symptom severity levels
enum SymptomSeverity {
  /// Mild symptoms
  mild,
  
  /// Moderate symptoms
  moderate,
  
  /// Severe symptoms
  severe,
  
  /// Unbearable symptoms
  unbearable
}

/// Time duration units for symptoms
enum SymptomDuration {
  /// Minutes
  minutes,
  
  /// Hours
  hours,
  
  /// Days
  days,
  
  /// Weeks
  weeks,
  
  /// Months
  months
}

/// Body regions for categorizing symptoms
enum BodyRegion {
  /// Head region
  head,
  
  /// Chest region
  chest,
  
  /// Abdomen region
  abdomen,
  
  /// Back region
  back,
  
  /// Arms region
  arms,
  
  /// Legs region
  legs,
  
  /// Skin
  skin,
  
  /// General symptoms
  general
}

/// Symptom model
@freezed
class Symptom with _$Symptom {
  /// Default constructor
  const factory Symptom({
    required String id,
    required String name,
    required SymptomSeverity severity,
    required SymptomDuration duration,
    required int durationValue,
    required DateTime timestamp,
    BodyRegion? bodyRegion,
    String? notes,
  }) = _Symptom;
  
  /// Create a new symptom with defaults
  factory Symptom.create({
    required String name,
    SymptomSeverity severity = SymptomSeverity.moderate,
    SymptomDuration duration = SymptomDuration.days,
    int durationValue = 1,
    BodyRegion? bodyRegion,
    String? notes,
  }) {
    return Symptom(
      id: const Uuid().v4(),
      name: name,
      severity: severity,
      duration: duration,
      durationValue: durationValue,
      timestamp: DateTime.now(),
      bodyRegion: bodyRegion,
      notes: notes,
    );
  }

  /// Factory to create from JSON
  factory Symptom.fromJson(Map<String, dynamic> json) => _$SymptomFromJson(json);
}

/// Possible condition from symptom analysis
@freezed
class PossibleCondition with _$PossibleCondition {
  /// Default constructor
  const factory PossibleCondition({
    required String name,
    required String description,
    required double confidenceLevel,
    required SymptomSeverity severity,
    String? additionalInfo,
  }) = _PossibleCondition;

  /// Factory to create from JSON
  factory PossibleCondition.fromJson(Map<String, dynamic> json) => _$PossibleConditionFromJson(json);
}

/// Remedy type
enum RemedyType {
  /// Home remedies
  home,
  
  /// Over-the-counter medications
  otc,
  
  /// Professional medical remedies
  professional
}

/// Remedy recommendation
@freezed
class Remedy with _$Remedy {
  /// Default constructor
  const factory Remedy({
    required String name,
    required String description,
    required RemedyType type,
    String? warning,
  }) = _Remedy;

  /// Factory to create from JSON
  factory Remedy.fromJson(Map<String, dynamic> json) => _$RemedyFromJson(json);
}

/// Complete symptom analysis result
@freezed
class SymptomAnalysisResult with _$SymptomAnalysisResult {
  /// Default constructor
  const factory SymptomAnalysisResult({
    required String id,
    required List<Symptom> symptoms,
    required List<PossibleCondition> possibleConditions,
    required List<Remedy> recommendedRemedies,
    required DateTime timestamp,
    String? disclaimer,
    SymptomSeverity? overallSeverity,
    bool? shouldSeeDoctor,
    String? specialistRecommendation,
  }) = _SymptomAnalysisResult;

  /// Create analysis with auto-generated ID
  factory SymptomAnalysisResult.create({
    required List<Symptom> symptoms,
    required List<PossibleCondition> possibleConditions,
    required List<Remedy> recommendedRemedies,
    String? disclaimer,
    SymptomSeverity? overallSeverity,
    bool? shouldSeeDoctor,
    String? specialistRecommendation,
  }) {
    return SymptomAnalysisResult(
      id: const Uuid().v4(),
      symptoms: symptoms,
      possibleConditions: possibleConditions,
      recommendedRemedies: recommendedRemedies,
      timestamp: DateTime.now(),
      disclaimer: disclaimer ?? 'This analysis is provided for informational purposes only and should not replace professional medical advice. Always consult with a healthcare provider regarding your specific situation.',
      overallSeverity: overallSeverity,
      shouldSeeDoctor: shouldSeeDoctor,
      specialistRecommendation: specialistRecommendation,
    );
  }

  /// Factory to create from JSON
  factory SymptomAnalysisResult.fromJson(Map<String, dynamic> json) => _$SymptomAnalysisResultFromJson(json);
} 