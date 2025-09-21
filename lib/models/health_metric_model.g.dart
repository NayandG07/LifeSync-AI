// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'health_metric_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$HealthMetricImpl _$$HealthMetricImplFromJson(Map<String, dynamic> json) =>
    _$HealthMetricImpl(
      id: json['id'] as String,
      type: $enumDecode(_$HealthMetricTypeEnumMap, json['type']),
      value: (json['value'] as num).toDouble(),
      unit: json['unit'] as String?,
      notes: json['notes'] as String?,
      timestamp: DateTime.parse(json['timestamp'] as String),
      date: json['date'] as String,
      userId: json['userId'] as String?,
    );

Map<String, dynamic> _$$HealthMetricImplToJson(_$HealthMetricImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'type': _$HealthMetricTypeEnumMap[instance.type]!,
      'value': instance.value,
      'unit': instance.unit,
      'notes': instance.notes,
      'timestamp': instance.timestamp.toIso8601String(),
      'date': instance.date,
      'userId': instance.userId,
    };

const _$HealthMetricTypeEnumMap = {
  HealthMetricType.water: 'water',
  HealthMetricType.steps: 'steps',
  HealthMetricType.sleep: 'sleep',
  HealthMetricType.weight: 'weight',
  HealthMetricType.heartRate: 'heartRate',
  HealthMetricType.bloodPressure: 'bloodPressure',
  HealthMetricType.bloodGlucose: 'bloodGlucose',
  HealthMetricType.mood: 'mood',
  HealthMetricType.stress: 'stress',
  HealthMetricType.custom: 'custom',
};
