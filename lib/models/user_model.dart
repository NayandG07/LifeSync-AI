import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:flutter/foundation.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

part 'user_model.freezed.dart';
part 'user_model.g.dart';

/// Helper class to convert between DateTime and Firestore Timestamp
class TimestampConverter implements JsonConverter<DateTime?, dynamic> {
  /// Constructor
  const TimestampConverter();

  @override
  DateTime? fromJson(dynamic timestamp) {
    try {
      if (timestamp == null) {
        return null;
      }
      if (timestamp is Timestamp) {
        return timestamp.toDate();
      } else if (timestamp is String) {
        return DateTime.parse(timestamp);
      } else if (timestamp is int) {
        // Handle milliseconds since epoch
        return DateTime.fromMillisecondsSinceEpoch(timestamp);
      } else if (timestamp is Map) {
        // Handle serialized timestamp format: {seconds: x, nanoseconds: y}
        if (timestamp.containsKey('seconds')) {
          final seconds = timestamp['seconds'] as int;
          final nanoseconds = timestamp['nanoseconds'] as int? ?? 0;
          return Timestamp(seconds, nanoseconds).toDate();
        }
      }
      return null;
    } catch (e) {
      print('Error converting user timestamp: $e');
      return null;
    }
  }

  @override
  dynamic toJson(DateTime? date) => date?.toIso8601String();
}

/// Model representing a user of the app
@freezed
class User with _$User {
  /// Creates a user
  const factory User({
    required String id,
    required String email,
    required String displayName,
    String? photoUrl,
    @TimestampConverter() DateTime? dateOfBirth,
    String? gender,
    double? height,
    double? weight,
    @Default(false) bool isOnboarded,
    @Default(2000) int dailyWaterGoalMl,
    @Default(10000) int dailyStepsGoal,
    @Default(7) int dailySleepHoursGoal,
    @Default({}) Map<String, dynamic> healthPreferences,
    @Default({}) Map<String, dynamic> appSettings,
    @Default([]) List<String> favoriteChats,
    @TimestampConverter() DateTime? createdAt,
    @TimestampConverter() DateTime? lastLoginAt,
  }) = _User;

  /// Creates a user from JSON
  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);

  /// Create an empty user
  factory User.empty() => const User(
        id: '',
        email: '',
        displayName: '',
      );
} 