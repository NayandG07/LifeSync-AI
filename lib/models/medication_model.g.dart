// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'medication_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$MedicationImpl _$$MedicationImplFromJson(Map<String, dynamic> json) =>
    _$MedicationImpl(
      id: json['id'] as String,
      userId: json['userId'] as String,
      name: json['name'] as String,
      dosage: json['dosage'] as String?,
      instructions: json['instructions'] as String?,
      frequency: $enumDecode(_$MedicationFrequencyEnumMap, json['frequency']),
      times: (json['times'] as List<dynamic>)
          .map((e) => $enumDecode(_$MedicationTimeEnumMap, e))
          .toList(),
      quantity: (json['quantity'] as num?)?.toInt(),
      refillReminder: (json['refillReminder'] as num?)?.toInt(),
      notes: json['notes'] as String?,
      imageUrl: json['imageUrl'] as String?,
      customTimes: (json['customTimes'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
      isActive: json['isActive'] as bool? ?? true,
      startDate: const TimestampConverter().fromJson(json['startDate']),
      endDate: const TimestampConverter().fromJson(json['endDate']),
      nextDueDate: const TimestampConverter().fromJson(json['nextDueDate']),
      createdAt: const TimestampConverter().fromJson(json['createdAt']),
      updatedAt: const TimestampConverter().fromJson(json['updatedAt']),
    );

Map<String, dynamic> _$$MedicationImplToJson(_$MedicationImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'name': instance.name,
      'dosage': instance.dosage,
      'instructions': instance.instructions,
      'frequency': _$MedicationFrequencyEnumMap[instance.frequency]!,
      'times': instance.times.map((e) => _$MedicationTimeEnumMap[e]!).toList(),
      'quantity': instance.quantity,
      'refillReminder': instance.refillReminder,
      'notes': instance.notes,
      'imageUrl': instance.imageUrl,
      'customTimes': instance.customTimes,
      'isActive': instance.isActive,
      'startDate': const TimestampConverter().toJson(instance.startDate),
      'endDate': _$JsonConverterToJson<dynamic, DateTime>(
          instance.endDate, const TimestampConverter().toJson),
      'nextDueDate': _$JsonConverterToJson<dynamic, DateTime>(
          instance.nextDueDate, const TimestampConverter().toJson),
      'createdAt': const TimestampConverter().toJson(instance.createdAt),
      'updatedAt': _$JsonConverterToJson<dynamic, DateTime>(
          instance.updatedAt, const TimestampConverter().toJson),
    };

const _$MedicationFrequencyEnumMap = {
  MedicationFrequency.daily: 'daily',
  MedicationFrequency.multipleTimes: 'multipleTimes',
  MedicationFrequency.everyOtherDay: 'everyOtherDay',
  MedicationFrequency.weekly: 'weekly',
  MedicationFrequency.asNeeded: 'asNeeded',
  MedicationFrequency.custom: 'custom',
};

const _$MedicationTimeEnumMap = {
  MedicationTime.morning: 'morning',
  MedicationTime.afternoon: 'afternoon',
  MedicationTime.evening: 'evening',
  MedicationTime.night: 'night',
  MedicationTime.beforeMeal: 'beforeMeal',
  MedicationTime.withMeal: 'withMeal',
  MedicationTime.afterMeal: 'afterMeal',
  MedicationTime.custom: 'custom',
};

Json? _$JsonConverterToJson<Json, Value>(
  Value? value,
  Json? Function(Value value) toJson,
) =>
    value == null ? null : toJson(value);

_$MedicationLogImpl _$$MedicationLogImplFromJson(Map<String, dynamic> json) =>
    _$MedicationLogImpl(
      id: json['id'] as String,
      medicationId: json['medicationId'] as String,
      userId: json['userId'] as String,
      timestamp: const TimestampConverter().fromJson(json['timestamp']),
      taken: json['taken'] as bool,
      notes: json['notes'] as String?,
      scheduledTime: json['scheduledTime'] as String,
    );

Map<String, dynamic> _$$MedicationLogImplToJson(_$MedicationLogImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'medicationId': instance.medicationId,
      'userId': instance.userId,
      'timestamp': const TimestampConverter().toJson(instance.timestamp),
      'taken': instance.taken,
      'notes': instance.notes,
      'scheduledTime': instance.scheduledTime,
    };
