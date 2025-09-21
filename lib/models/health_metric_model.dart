import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:flutter/foundation.dart';
import 'package:uuid/uuid.dart';

part 'health_metric_model.freezed.dart';
part 'health_metric_model.g.dart';

/// Types of health metrics
enum HealthMetricType {
  /// Water intake in ml
  water,
  
  /// Step count
  steps,
  
  /// Sleep duration in hours
  sleep,
  
  /// Weight in kg
  weight,
  
  /// Heart rate in bpm
  heartRate,
  
  /// Blood pressure (systolic/diastolic)
  bloodPressure,
  
  /// Blood glucose level in mg/dl
  bloodGlucose,
  
  /// Mood rating (1-5)
  mood,
  
  /// Stress level (1-5)
  stress,
  
  /// Custom metric
  custom
}

/// Model representing a health metric
@freezed
class HealthMetric with _$HealthMetric {
  /// Default constructor
  const factory HealthMetric({
    required String id,
    required HealthMetricType type,
    required double value,
    String? unit,
    String? notes,
    required DateTime timestamp,
    required String date,
    String? userId,
  }) = _HealthMetric;

  /// Constructor to create health metric from json
  factory HealthMetric.fromJson(Map<String, dynamic> json) =>
      _$HealthMetricFromJson(json);
      
  /// Create a new health metric with auto-generated ID
  factory HealthMetric.create({
    required HealthMetricType type,
    required double value,
    String? unit,
    String? notes,
    String? userId,
    DateTime? timestamp,
  }) {
    final now = timestamp ?? DateTime.now();
    return HealthMetric(
      id: const Uuid().v4(),
      type: type,
      value: value,
      unit: unit,
      notes: notes,
      timestamp: now,
      date: '${now.year}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}',
      userId: userId,
    );
  }
}

/// Extension methods for HealthMetricType
extension HealthMetricTypeExtension on HealthMetricType {
  /// Get the display name for the metric type
  String get displayName {
    switch (this) {
      case HealthMetricType.water:
        return 'Water Intake';
      case HealthMetricType.steps:
        return 'Steps';
      case HealthMetricType.sleep:
        return 'Sleep';
      case HealthMetricType.weight:
        return 'Weight';
      case HealthMetricType.heartRate:
        return 'Heart Rate';
      case HealthMetricType.bloodPressure:
        return 'Blood Pressure';
      case HealthMetricType.bloodGlucose:
        return 'Blood Glucose';
      case HealthMetricType.mood:
        return 'Mood';
      case HealthMetricType.stress:
        return 'Stress Level';
      case HealthMetricType.custom:
        return 'Custom';
    }
  }

  /// Get the default unit for the metric type
  String get defaultUnit {
    switch (this) {
      case HealthMetricType.water:
        return 'ml';
      case HealthMetricType.steps:
        return 'steps';
      case HealthMetricType.sleep:
        return 'hrs';
      case HealthMetricType.weight:
        return 'kg';
      case HealthMetricType.heartRate:
        return 'bpm';
      case HealthMetricType.bloodPressure:
        return 'mmHg';
      case HealthMetricType.bloodGlucose:
        return 'mg/dl';
      case HealthMetricType.mood:
        return '';
      case HealthMetricType.stress:
        return '';
      case HealthMetricType.custom:
        return '';
    }
  }

  /// Get the icon data for the metric type
  String get iconName {
    switch (this) {
      case HealthMetricType.water:
        return 'water_drop';
      case HealthMetricType.steps:
        return 'directions_walk';
      case HealthMetricType.sleep:
        return 'bedtime';
      case HealthMetricType.weight:
        return 'monitor_weight';
      case HealthMetricType.heartRate:
        return 'favorite';
      case HealthMetricType.bloodPressure:
        return 'speed';
      case HealthMetricType.bloodGlucose:
        return 'bloodtype';
      case HealthMetricType.mood:
        return 'mood';
      case HealthMetricType.stress:
        return 'psychology';
      case HealthMetricType.custom:
        return 'ballot';
    }
  }
} 