// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'symptom_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$SymptomImpl _$$SymptomImplFromJson(Map<String, dynamic> json) =>
    _$SymptomImpl(
      id: json['id'] as String,
      name: json['name'] as String,
      severity: $enumDecode(_$SymptomSeverityEnumMap, json['severity']),
      duration: $enumDecode(_$SymptomDurationEnumMap, json['duration']),
      durationValue: (json['durationValue'] as num).toInt(),
      timestamp: DateTime.parse(json['timestamp'] as String),
      bodyRegion: $enumDecodeNullable(_$BodyRegionEnumMap, json['bodyRegion']),
      notes: json['notes'] as String?,
    );

Map<String, dynamic> _$$SymptomImplToJson(_$SymptomImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'severity': _$SymptomSeverityEnumMap[instance.severity]!,
      'duration': _$SymptomDurationEnumMap[instance.duration]!,
      'durationValue': instance.durationValue,
      'timestamp': instance.timestamp.toIso8601String(),
      'bodyRegion': _$BodyRegionEnumMap[instance.bodyRegion],
      'notes': instance.notes,
    };

const _$SymptomSeverityEnumMap = {
  SymptomSeverity.mild: 'mild',
  SymptomSeverity.moderate: 'moderate',
  SymptomSeverity.severe: 'severe',
  SymptomSeverity.unbearable: 'unbearable',
};

const _$SymptomDurationEnumMap = {
  SymptomDuration.minutes: 'minutes',
  SymptomDuration.hours: 'hours',
  SymptomDuration.days: 'days',
  SymptomDuration.weeks: 'weeks',
  SymptomDuration.months: 'months',
};

const _$BodyRegionEnumMap = {
  BodyRegion.head: 'head',
  BodyRegion.chest: 'chest',
  BodyRegion.abdomen: 'abdomen',
  BodyRegion.back: 'back',
  BodyRegion.arms: 'arms',
  BodyRegion.legs: 'legs',
  BodyRegion.skin: 'skin',
  BodyRegion.general: 'general',
};

_$PossibleConditionImpl _$$PossibleConditionImplFromJson(
        Map<String, dynamic> json) =>
    _$PossibleConditionImpl(
      name: json['name'] as String,
      description: json['description'] as String,
      confidenceLevel: (json['confidenceLevel'] as num).toDouble(),
      severity: $enumDecode(_$SymptomSeverityEnumMap, json['severity']),
      additionalInfo: json['additionalInfo'] as String?,
    );

Map<String, dynamic> _$$PossibleConditionImplToJson(
        _$PossibleConditionImpl instance) =>
    <String, dynamic>{
      'name': instance.name,
      'description': instance.description,
      'confidenceLevel': instance.confidenceLevel,
      'severity': _$SymptomSeverityEnumMap[instance.severity]!,
      'additionalInfo': instance.additionalInfo,
    };

_$RemedyImpl _$$RemedyImplFromJson(Map<String, dynamic> json) => _$RemedyImpl(
      name: json['name'] as String,
      description: json['description'] as String,
      type: $enumDecode(_$RemedyTypeEnumMap, json['type']),
      warning: json['warning'] as String?,
    );

Map<String, dynamic> _$$RemedyImplToJson(_$RemedyImpl instance) =>
    <String, dynamic>{
      'name': instance.name,
      'description': instance.description,
      'type': _$RemedyTypeEnumMap[instance.type]!,
      'warning': instance.warning,
    };

const _$RemedyTypeEnumMap = {
  RemedyType.home: 'home',
  RemedyType.otc: 'otc',
  RemedyType.professional: 'professional',
};

_$SymptomAnalysisResultImpl _$$SymptomAnalysisResultImplFromJson(
        Map<String, dynamic> json) =>
    _$SymptomAnalysisResultImpl(
      id: json['id'] as String,
      symptoms: (json['symptoms'] as List<dynamic>)
          .map((e) => Symptom.fromJson(e as Map<String, dynamic>))
          .toList(),
      possibleConditions: (json['possibleConditions'] as List<dynamic>)
          .map((e) => PossibleCondition.fromJson(e as Map<String, dynamic>))
          .toList(),
      recommendedRemedies: (json['recommendedRemedies'] as List<dynamic>)
          .map((e) => Remedy.fromJson(e as Map<String, dynamic>))
          .toList(),
      timestamp: DateTime.parse(json['timestamp'] as String),
      disclaimer: json['disclaimer'] as String?,
      overallSeverity: $enumDecodeNullable(
          _$SymptomSeverityEnumMap, json['overallSeverity']),
      shouldSeeDoctor: json['shouldSeeDoctor'] as bool?,
      specialistRecommendation: json['specialistRecommendation'] as String?,
    );

Map<String, dynamic> _$$SymptomAnalysisResultImplToJson(
        _$SymptomAnalysisResultImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'symptoms': instance.symptoms,
      'possibleConditions': instance.possibleConditions,
      'recommendedRemedies': instance.recommendedRemedies,
      'timestamp': instance.timestamp.toIso8601String(),
      'disclaimer': instance.disclaimer,
      'overallSeverity': _$SymptomSeverityEnumMap[instance.overallSeverity],
      'shouldSeeDoctor': instance.shouldSeeDoctor,
      'specialistRecommendation': instance.specialistRecommendation,
    };
