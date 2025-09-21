// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$UserImpl _$$UserImplFromJson(Map<String, dynamic> json) => _$UserImpl(
      id: json['id'] as String,
      email: json['email'] as String,
      displayName: json['displayName'] as String,
      photoUrl: json['photoUrl'] as String?,
      dateOfBirth: const TimestampConverter().fromJson(json['dateOfBirth']),
      gender: json['gender'] as String?,
      height: (json['height'] as num?)?.toDouble(),
      weight: (json['weight'] as num?)?.toDouble(),
      isOnboarded: json['isOnboarded'] as bool? ?? false,
      dailyWaterGoalMl: (json['dailyWaterGoalMl'] as num?)?.toInt() ?? 2000,
      dailyStepsGoal: (json['dailyStepsGoal'] as num?)?.toInt() ?? 10000,
      dailySleepHoursGoal: (json['dailySleepHoursGoal'] as num?)?.toInt() ?? 7,
      healthPreferences:
          json['healthPreferences'] as Map<String, dynamic>? ?? const {},
      appSettings: json['appSettings'] as Map<String, dynamic>? ?? const {},
      favoriteChats: (json['favoriteChats'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
      createdAt: const TimestampConverter().fromJson(json['createdAt']),
      lastLoginAt: const TimestampConverter().fromJson(json['lastLoginAt']),
    );

Map<String, dynamic> _$$UserImplToJson(_$UserImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'email': instance.email,
      'displayName': instance.displayName,
      'photoUrl': instance.photoUrl,
      'dateOfBirth': const TimestampConverter().toJson(instance.dateOfBirth),
      'gender': instance.gender,
      'height': instance.height,
      'weight': instance.weight,
      'isOnboarded': instance.isOnboarded,
      'dailyWaterGoalMl': instance.dailyWaterGoalMl,
      'dailyStepsGoal': instance.dailyStepsGoal,
      'dailySleepHoursGoal': instance.dailySleepHoursGoal,
      'healthPreferences': instance.healthPreferences,
      'appSettings': instance.appSettings,
      'favoriteChats': instance.favoriteChats,
      'createdAt': const TimestampConverter().toJson(instance.createdAt),
      'lastLoginAt': const TimestampConverter().toJson(instance.lastLoginAt),
    };
