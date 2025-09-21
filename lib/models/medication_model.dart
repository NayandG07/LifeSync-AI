import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:flutter/foundation.dart';
import 'package:uuid/uuid.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

part 'medication_model.freezed.dart';
part 'medication_model.g.dart';

/// Helper class to convert between DateTime and Firestore Timestamp
class TimestampConverter implements JsonConverter<DateTime, dynamic> {
  /// Constructor
  const TimestampConverter();

  @override
  DateTime fromJson(dynamic timestamp) {
    try {
      if (timestamp == null) {
        return DateTime.now(); // Default to current time if null
      }
      if (timestamp is Timestamp) {
        return timestamp.toDate();
      } else if (timestamp is String) {
        return DateTime.parse(timestamp);
      } else if (timestamp is int) {
        // Handle milliseconds since epoch
        return DateTime.fromMillisecondsSinceEpoch(timestamp);
      }
      return DateTime.now(); // Fallback to current time
    } catch (e) {
      print('Error converting timestamp: $e');
      return DateTime.now(); // Default to current time on error
    }
  }

  @override
  dynamic toJson(DateTime date) => date.toIso8601String();
}

/// Frequency of taking medication
enum MedicationFrequency {
  /// Once daily
  daily,
  
  /// Multiple times daily
  multipleTimes,
  
  /// Every other day
  everyOtherDay,
  
  /// Weekly
  weekly,
  
  /// As needed
  asNeeded,
  
  /// Custom schedule
  custom,
}

/// Time of day to take medication
enum MedicationTime {
  /// Morning
  morning,
  
  /// Afternoon
  afternoon,
  
  /// Evening
  evening,
  
  /// Night
  night,
  
  /// Before meal
  beforeMeal,
  
  /// With meal
  withMeal,
  
  /// After meal
  afterMeal,
  
  /// Custom time
  custom,
}

/// Model representing a medication
@freezed
class Medication with _$Medication {
  /// Creates a medication
  const factory Medication({
    required String id,
    required String userId,
    required String name,
    String? dosage,
    String? instructions,
    required MedicationFrequency frequency,
    required List<MedicationTime> times,
    int? quantity,
    int? refillReminder,
    String? notes,
    String? imageUrl,
    @Default([]) List<String> customTimes,
    @Default(true) bool isActive,
    @TimestampConverter() required DateTime startDate,
    @TimestampConverter() DateTime? endDate,
    @TimestampConverter() DateTime? nextDueDate,
    @TimestampConverter() required DateTime createdAt,
    @TimestampConverter() DateTime? updatedAt,
  }) = _Medication;

  /// Creates a medication from JSON
  factory Medication.fromJson(Map<String, dynamic> json) => _$MedicationFromJson(json);
  
  /// Create a new medication
  factory Medication.create({
    required String userId,
    required String name,
    String? dosage,
    String? instructions,
    required MedicationFrequency frequency,
    required List<MedicationTime> times,
    int? quantity,
    int? refillReminder,
    String? notes,
    String? imageUrl,
    List<String>? customTimes,
    DateTime? startDate,
    DateTime? endDate,
    DateTime? nextDueDate,
  }) {
    final now = DateTime.now();
    return Medication(
      id: const Uuid().v4(),
      userId: userId,
      name: name,
      dosage: dosage,
      instructions: instructions,
      frequency: frequency,
      times: times,
      quantity: quantity,
      refillReminder: refillReminder,
      notes: notes,
      imageUrl: imageUrl,
      customTimes: customTimes ?? [],
      isActive: true,
      startDate: startDate ?? now,
      endDate: endDate,
      nextDueDate: nextDueDate,
      createdAt: now,
      updatedAt: now,
    );
  }
}

/// Model representing a medication log (when a medication was taken)
@freezed
class MedicationLog with _$MedicationLog {
  /// Creates a medication log
  const factory MedicationLog({
    required String id,
    required String medicationId,
    required String userId,
    @TimestampConverter() required DateTime timestamp,
    required bool taken,
    String? notes,
    required String scheduledTime,
  }) = _MedicationLog;

  /// Creates a medication log from JSON
  factory MedicationLog.fromJson(Map<String, dynamic> json) => _$MedicationLogFromJson(json);
  
  /// Create a new medication log
  factory MedicationLog.create({
    required String medicationId,
    required String userId,
    required bool taken,
    String? notes,
    required String scheduledTime,
  }) {
    return MedicationLog(
      id: const Uuid().v4(),
      medicationId: medicationId,
      userId: userId,
      timestamp: DateTime.now(),
      taken: taken,
      notes: notes,
      scheduledTime: scheduledTime,
    );
  }
} 