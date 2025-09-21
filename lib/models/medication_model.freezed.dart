// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'medication_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

Medication _$MedicationFromJson(Map<String, dynamic> json) {
  return _Medication.fromJson(json);
}

/// @nodoc
mixin _$Medication {
  String get id => throw _privateConstructorUsedError;
  String get userId => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String? get dosage => throw _privateConstructorUsedError;
  String? get instructions => throw _privateConstructorUsedError;
  MedicationFrequency get frequency => throw _privateConstructorUsedError;
  List<MedicationTime> get times => throw _privateConstructorUsedError;
  int? get quantity => throw _privateConstructorUsedError;
  int? get refillReminder => throw _privateConstructorUsedError;
  String? get notes => throw _privateConstructorUsedError;
  String? get imageUrl => throw _privateConstructorUsedError;
  List<String> get customTimes => throw _privateConstructorUsedError;
  bool get isActive => throw _privateConstructorUsedError;
  @TimestampConverter()
  DateTime get startDate => throw _privateConstructorUsedError;
  @TimestampConverter()
  DateTime? get endDate => throw _privateConstructorUsedError;
  @TimestampConverter()
  DateTime? get nextDueDate => throw _privateConstructorUsedError;
  @TimestampConverter()
  DateTime get createdAt => throw _privateConstructorUsedError;
  @TimestampConverter()
  DateTime? get updatedAt => throw _privateConstructorUsedError;

  /// Serializes this Medication to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of Medication
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $MedicationCopyWith<Medication> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $MedicationCopyWith<$Res> {
  factory $MedicationCopyWith(
          Medication value, $Res Function(Medication) then) =
      _$MedicationCopyWithImpl<$Res, Medication>;
  @useResult
  $Res call(
      {String id,
      String userId,
      String name,
      String? dosage,
      String? instructions,
      MedicationFrequency frequency,
      List<MedicationTime> times,
      int? quantity,
      int? refillReminder,
      String? notes,
      String? imageUrl,
      List<String> customTimes,
      bool isActive,
      @TimestampConverter() DateTime startDate,
      @TimestampConverter() DateTime? endDate,
      @TimestampConverter() DateTime? nextDueDate,
      @TimestampConverter() DateTime createdAt,
      @TimestampConverter() DateTime? updatedAt});
}

/// @nodoc
class _$MedicationCopyWithImpl<$Res, $Val extends Medication>
    implements $MedicationCopyWith<$Res> {
  _$MedicationCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of Medication
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? userId = null,
    Object? name = null,
    Object? dosage = freezed,
    Object? instructions = freezed,
    Object? frequency = null,
    Object? times = null,
    Object? quantity = freezed,
    Object? refillReminder = freezed,
    Object? notes = freezed,
    Object? imageUrl = freezed,
    Object? customTimes = null,
    Object? isActive = null,
    Object? startDate = null,
    Object? endDate = freezed,
    Object? nextDueDate = freezed,
    Object? createdAt = null,
    Object? updatedAt = freezed,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      userId: null == userId
          ? _value.userId
          : userId // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      dosage: freezed == dosage
          ? _value.dosage
          : dosage // ignore: cast_nullable_to_non_nullable
              as String?,
      instructions: freezed == instructions
          ? _value.instructions
          : instructions // ignore: cast_nullable_to_non_nullable
              as String?,
      frequency: null == frequency
          ? _value.frequency
          : frequency // ignore: cast_nullable_to_non_nullable
              as MedicationFrequency,
      times: null == times
          ? _value.times
          : times // ignore: cast_nullable_to_non_nullable
              as List<MedicationTime>,
      quantity: freezed == quantity
          ? _value.quantity
          : quantity // ignore: cast_nullable_to_non_nullable
              as int?,
      refillReminder: freezed == refillReminder
          ? _value.refillReminder
          : refillReminder // ignore: cast_nullable_to_non_nullable
              as int?,
      notes: freezed == notes
          ? _value.notes
          : notes // ignore: cast_nullable_to_non_nullable
              as String?,
      imageUrl: freezed == imageUrl
          ? _value.imageUrl
          : imageUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      customTimes: null == customTimes
          ? _value.customTimes
          : customTimes // ignore: cast_nullable_to_non_nullable
              as List<String>,
      isActive: null == isActive
          ? _value.isActive
          : isActive // ignore: cast_nullable_to_non_nullable
              as bool,
      startDate: null == startDate
          ? _value.startDate
          : startDate // ignore: cast_nullable_to_non_nullable
              as DateTime,
      endDate: freezed == endDate
          ? _value.endDate
          : endDate // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      nextDueDate: freezed == nextDueDate
          ? _value.nextDueDate
          : nextDueDate // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      updatedAt: freezed == updatedAt
          ? _value.updatedAt
          : updatedAt // ignore: cast_nullable_to_non_nullable
              as DateTime?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$MedicationImplCopyWith<$Res>
    implements $MedicationCopyWith<$Res> {
  factory _$$MedicationImplCopyWith(
          _$MedicationImpl value, $Res Function(_$MedicationImpl) then) =
      __$$MedicationImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String userId,
      String name,
      String? dosage,
      String? instructions,
      MedicationFrequency frequency,
      List<MedicationTime> times,
      int? quantity,
      int? refillReminder,
      String? notes,
      String? imageUrl,
      List<String> customTimes,
      bool isActive,
      @TimestampConverter() DateTime startDate,
      @TimestampConverter() DateTime? endDate,
      @TimestampConverter() DateTime? nextDueDate,
      @TimestampConverter() DateTime createdAt,
      @TimestampConverter() DateTime? updatedAt});
}

/// @nodoc
class __$$MedicationImplCopyWithImpl<$Res>
    extends _$MedicationCopyWithImpl<$Res, _$MedicationImpl>
    implements _$$MedicationImplCopyWith<$Res> {
  __$$MedicationImplCopyWithImpl(
      _$MedicationImpl _value, $Res Function(_$MedicationImpl) _then)
      : super(_value, _then);

  /// Create a copy of Medication
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? userId = null,
    Object? name = null,
    Object? dosage = freezed,
    Object? instructions = freezed,
    Object? frequency = null,
    Object? times = null,
    Object? quantity = freezed,
    Object? refillReminder = freezed,
    Object? notes = freezed,
    Object? imageUrl = freezed,
    Object? customTimes = null,
    Object? isActive = null,
    Object? startDate = null,
    Object? endDate = freezed,
    Object? nextDueDate = freezed,
    Object? createdAt = null,
    Object? updatedAt = freezed,
  }) {
    return _then(_$MedicationImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      userId: null == userId
          ? _value.userId
          : userId // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      dosage: freezed == dosage
          ? _value.dosage
          : dosage // ignore: cast_nullable_to_non_nullable
              as String?,
      instructions: freezed == instructions
          ? _value.instructions
          : instructions // ignore: cast_nullable_to_non_nullable
              as String?,
      frequency: null == frequency
          ? _value.frequency
          : frequency // ignore: cast_nullable_to_non_nullable
              as MedicationFrequency,
      times: null == times
          ? _value._times
          : times // ignore: cast_nullable_to_non_nullable
              as List<MedicationTime>,
      quantity: freezed == quantity
          ? _value.quantity
          : quantity // ignore: cast_nullable_to_non_nullable
              as int?,
      refillReminder: freezed == refillReminder
          ? _value.refillReminder
          : refillReminder // ignore: cast_nullable_to_non_nullable
              as int?,
      notes: freezed == notes
          ? _value.notes
          : notes // ignore: cast_nullable_to_non_nullable
              as String?,
      imageUrl: freezed == imageUrl
          ? _value.imageUrl
          : imageUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      customTimes: null == customTimes
          ? _value._customTimes
          : customTimes // ignore: cast_nullable_to_non_nullable
              as List<String>,
      isActive: null == isActive
          ? _value.isActive
          : isActive // ignore: cast_nullable_to_non_nullable
              as bool,
      startDate: null == startDate
          ? _value.startDate
          : startDate // ignore: cast_nullable_to_non_nullable
              as DateTime,
      endDate: freezed == endDate
          ? _value.endDate
          : endDate // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      nextDueDate: freezed == nextDueDate
          ? _value.nextDueDate
          : nextDueDate // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      updatedAt: freezed == updatedAt
          ? _value.updatedAt
          : updatedAt // ignore: cast_nullable_to_non_nullable
              as DateTime?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$MedicationImpl with DiagnosticableTreeMixin implements _Medication {
  const _$MedicationImpl(
      {required this.id,
      required this.userId,
      required this.name,
      this.dosage,
      this.instructions,
      required this.frequency,
      required final List<MedicationTime> times,
      this.quantity,
      this.refillReminder,
      this.notes,
      this.imageUrl,
      final List<String> customTimes = const [],
      this.isActive = true,
      @TimestampConverter() required this.startDate,
      @TimestampConverter() this.endDate,
      @TimestampConverter() this.nextDueDate,
      @TimestampConverter() required this.createdAt,
      @TimestampConverter() this.updatedAt})
      : _times = times,
        _customTimes = customTimes;

  factory _$MedicationImpl.fromJson(Map<String, dynamic> json) =>
      _$$MedicationImplFromJson(json);

  @override
  final String id;
  @override
  final String userId;
  @override
  final String name;
  @override
  final String? dosage;
  @override
  final String? instructions;
  @override
  final MedicationFrequency frequency;
  final List<MedicationTime> _times;
  @override
  List<MedicationTime> get times {
    if (_times is EqualUnmodifiableListView) return _times;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_times);
  }

  @override
  final int? quantity;
  @override
  final int? refillReminder;
  @override
  final String? notes;
  @override
  final String? imageUrl;
  final List<String> _customTimes;
  @override
  @JsonKey()
  List<String> get customTimes {
    if (_customTimes is EqualUnmodifiableListView) return _customTimes;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_customTimes);
  }

  @override
  @JsonKey()
  final bool isActive;
  @override
  @TimestampConverter()
  final DateTime startDate;
  @override
  @TimestampConverter()
  final DateTime? endDate;
  @override
  @TimestampConverter()
  final DateTime? nextDueDate;
  @override
  @TimestampConverter()
  final DateTime createdAt;
  @override
  @TimestampConverter()
  final DateTime? updatedAt;

  @override
  String toString({DiagnosticLevel minLevel = DiagnosticLevel.info}) {
    return 'Medication(id: $id, userId: $userId, name: $name, dosage: $dosage, instructions: $instructions, frequency: $frequency, times: $times, quantity: $quantity, refillReminder: $refillReminder, notes: $notes, imageUrl: $imageUrl, customTimes: $customTimes, isActive: $isActive, startDate: $startDate, endDate: $endDate, nextDueDate: $nextDueDate, createdAt: $createdAt, updatedAt: $updatedAt)';
  }

  @override
  void debugFillProperties(DiagnosticPropertiesBuilder properties) {
    super.debugFillProperties(properties);
    properties
      ..add(DiagnosticsProperty('type', 'Medication'))
      ..add(DiagnosticsProperty('id', id))
      ..add(DiagnosticsProperty('userId', userId))
      ..add(DiagnosticsProperty('name', name))
      ..add(DiagnosticsProperty('dosage', dosage))
      ..add(DiagnosticsProperty('instructions', instructions))
      ..add(DiagnosticsProperty('frequency', frequency))
      ..add(DiagnosticsProperty('times', times))
      ..add(DiagnosticsProperty('quantity', quantity))
      ..add(DiagnosticsProperty('refillReminder', refillReminder))
      ..add(DiagnosticsProperty('notes', notes))
      ..add(DiagnosticsProperty('imageUrl', imageUrl))
      ..add(DiagnosticsProperty('customTimes', customTimes))
      ..add(DiagnosticsProperty('isActive', isActive))
      ..add(DiagnosticsProperty('startDate', startDate))
      ..add(DiagnosticsProperty('endDate', endDate))
      ..add(DiagnosticsProperty('nextDueDate', nextDueDate))
      ..add(DiagnosticsProperty('createdAt', createdAt))
      ..add(DiagnosticsProperty('updatedAt', updatedAt));
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$MedicationImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.userId, userId) || other.userId == userId) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.dosage, dosage) || other.dosage == dosage) &&
            (identical(other.instructions, instructions) ||
                other.instructions == instructions) &&
            (identical(other.frequency, frequency) ||
                other.frequency == frequency) &&
            const DeepCollectionEquality().equals(other._times, _times) &&
            (identical(other.quantity, quantity) ||
                other.quantity == quantity) &&
            (identical(other.refillReminder, refillReminder) ||
                other.refillReminder == refillReminder) &&
            (identical(other.notes, notes) || other.notes == notes) &&
            (identical(other.imageUrl, imageUrl) ||
                other.imageUrl == imageUrl) &&
            const DeepCollectionEquality()
                .equals(other._customTimes, _customTimes) &&
            (identical(other.isActive, isActive) ||
                other.isActive == isActive) &&
            (identical(other.startDate, startDate) ||
                other.startDate == startDate) &&
            (identical(other.endDate, endDate) || other.endDate == endDate) &&
            (identical(other.nextDueDate, nextDueDate) ||
                other.nextDueDate == nextDueDate) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.updatedAt, updatedAt) ||
                other.updatedAt == updatedAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      id,
      userId,
      name,
      dosage,
      instructions,
      frequency,
      const DeepCollectionEquality().hash(_times),
      quantity,
      refillReminder,
      notes,
      imageUrl,
      const DeepCollectionEquality().hash(_customTimes),
      isActive,
      startDate,
      endDate,
      nextDueDate,
      createdAt,
      updatedAt);

  /// Create a copy of Medication
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$MedicationImplCopyWith<_$MedicationImpl> get copyWith =>
      __$$MedicationImplCopyWithImpl<_$MedicationImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$MedicationImplToJson(
      this,
    );
  }
}

abstract class _Medication implements Medication {
  const factory _Medication(
      {required final String id,
      required final String userId,
      required final String name,
      final String? dosage,
      final String? instructions,
      required final MedicationFrequency frequency,
      required final List<MedicationTime> times,
      final int? quantity,
      final int? refillReminder,
      final String? notes,
      final String? imageUrl,
      final List<String> customTimes,
      final bool isActive,
      @TimestampConverter() required final DateTime startDate,
      @TimestampConverter() final DateTime? endDate,
      @TimestampConverter() final DateTime? nextDueDate,
      @TimestampConverter() required final DateTime createdAt,
      @TimestampConverter() final DateTime? updatedAt}) = _$MedicationImpl;

  factory _Medication.fromJson(Map<String, dynamic> json) =
      _$MedicationImpl.fromJson;

  @override
  String get id;
  @override
  String get userId;
  @override
  String get name;
  @override
  String? get dosage;
  @override
  String? get instructions;
  @override
  MedicationFrequency get frequency;
  @override
  List<MedicationTime> get times;
  @override
  int? get quantity;
  @override
  int? get refillReminder;
  @override
  String? get notes;
  @override
  String? get imageUrl;
  @override
  List<String> get customTimes;
  @override
  bool get isActive;
  @override
  @TimestampConverter()
  DateTime get startDate;
  @override
  @TimestampConverter()
  DateTime? get endDate;
  @override
  @TimestampConverter()
  DateTime? get nextDueDate;
  @override
  @TimestampConverter()
  DateTime get createdAt;
  @override
  @TimestampConverter()
  DateTime? get updatedAt;

  /// Create a copy of Medication
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$MedicationImplCopyWith<_$MedicationImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

MedicationLog _$MedicationLogFromJson(Map<String, dynamic> json) {
  return _MedicationLog.fromJson(json);
}

/// @nodoc
mixin _$MedicationLog {
  String get id => throw _privateConstructorUsedError;
  String get medicationId => throw _privateConstructorUsedError;
  String get userId => throw _privateConstructorUsedError;
  @TimestampConverter()
  DateTime get timestamp => throw _privateConstructorUsedError;
  bool get taken => throw _privateConstructorUsedError;
  String? get notes => throw _privateConstructorUsedError;
  String get scheduledTime => throw _privateConstructorUsedError;

  /// Serializes this MedicationLog to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of MedicationLog
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $MedicationLogCopyWith<MedicationLog> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $MedicationLogCopyWith<$Res> {
  factory $MedicationLogCopyWith(
          MedicationLog value, $Res Function(MedicationLog) then) =
      _$MedicationLogCopyWithImpl<$Res, MedicationLog>;
  @useResult
  $Res call(
      {String id,
      String medicationId,
      String userId,
      @TimestampConverter() DateTime timestamp,
      bool taken,
      String? notes,
      String scheduledTime});
}

/// @nodoc
class _$MedicationLogCopyWithImpl<$Res, $Val extends MedicationLog>
    implements $MedicationLogCopyWith<$Res> {
  _$MedicationLogCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of MedicationLog
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? medicationId = null,
    Object? userId = null,
    Object? timestamp = null,
    Object? taken = null,
    Object? notes = freezed,
    Object? scheduledTime = null,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      medicationId: null == medicationId
          ? _value.medicationId
          : medicationId // ignore: cast_nullable_to_non_nullable
              as String,
      userId: null == userId
          ? _value.userId
          : userId // ignore: cast_nullable_to_non_nullable
              as String,
      timestamp: null == timestamp
          ? _value.timestamp
          : timestamp // ignore: cast_nullable_to_non_nullable
              as DateTime,
      taken: null == taken
          ? _value.taken
          : taken // ignore: cast_nullable_to_non_nullable
              as bool,
      notes: freezed == notes
          ? _value.notes
          : notes // ignore: cast_nullable_to_non_nullable
              as String?,
      scheduledTime: null == scheduledTime
          ? _value.scheduledTime
          : scheduledTime // ignore: cast_nullable_to_non_nullable
              as String,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$MedicationLogImplCopyWith<$Res>
    implements $MedicationLogCopyWith<$Res> {
  factory _$$MedicationLogImplCopyWith(
          _$MedicationLogImpl value, $Res Function(_$MedicationLogImpl) then) =
      __$$MedicationLogImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String medicationId,
      String userId,
      @TimestampConverter() DateTime timestamp,
      bool taken,
      String? notes,
      String scheduledTime});
}

/// @nodoc
class __$$MedicationLogImplCopyWithImpl<$Res>
    extends _$MedicationLogCopyWithImpl<$Res, _$MedicationLogImpl>
    implements _$$MedicationLogImplCopyWith<$Res> {
  __$$MedicationLogImplCopyWithImpl(
      _$MedicationLogImpl _value, $Res Function(_$MedicationLogImpl) _then)
      : super(_value, _then);

  /// Create a copy of MedicationLog
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? medicationId = null,
    Object? userId = null,
    Object? timestamp = null,
    Object? taken = null,
    Object? notes = freezed,
    Object? scheduledTime = null,
  }) {
    return _then(_$MedicationLogImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      medicationId: null == medicationId
          ? _value.medicationId
          : medicationId // ignore: cast_nullable_to_non_nullable
              as String,
      userId: null == userId
          ? _value.userId
          : userId // ignore: cast_nullable_to_non_nullable
              as String,
      timestamp: null == timestamp
          ? _value.timestamp
          : timestamp // ignore: cast_nullable_to_non_nullable
              as DateTime,
      taken: null == taken
          ? _value.taken
          : taken // ignore: cast_nullable_to_non_nullable
              as bool,
      notes: freezed == notes
          ? _value.notes
          : notes // ignore: cast_nullable_to_non_nullable
              as String?,
      scheduledTime: null == scheduledTime
          ? _value.scheduledTime
          : scheduledTime // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$MedicationLogImpl
    with DiagnosticableTreeMixin
    implements _MedicationLog {
  const _$MedicationLogImpl(
      {required this.id,
      required this.medicationId,
      required this.userId,
      @TimestampConverter() required this.timestamp,
      required this.taken,
      this.notes,
      required this.scheduledTime});

  factory _$MedicationLogImpl.fromJson(Map<String, dynamic> json) =>
      _$$MedicationLogImplFromJson(json);

  @override
  final String id;
  @override
  final String medicationId;
  @override
  final String userId;
  @override
  @TimestampConverter()
  final DateTime timestamp;
  @override
  final bool taken;
  @override
  final String? notes;
  @override
  final String scheduledTime;

  @override
  String toString({DiagnosticLevel minLevel = DiagnosticLevel.info}) {
    return 'MedicationLog(id: $id, medicationId: $medicationId, userId: $userId, timestamp: $timestamp, taken: $taken, notes: $notes, scheduledTime: $scheduledTime)';
  }

  @override
  void debugFillProperties(DiagnosticPropertiesBuilder properties) {
    super.debugFillProperties(properties);
    properties
      ..add(DiagnosticsProperty('type', 'MedicationLog'))
      ..add(DiagnosticsProperty('id', id))
      ..add(DiagnosticsProperty('medicationId', medicationId))
      ..add(DiagnosticsProperty('userId', userId))
      ..add(DiagnosticsProperty('timestamp', timestamp))
      ..add(DiagnosticsProperty('taken', taken))
      ..add(DiagnosticsProperty('notes', notes))
      ..add(DiagnosticsProperty('scheduledTime', scheduledTime));
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$MedicationLogImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.medicationId, medicationId) ||
                other.medicationId == medicationId) &&
            (identical(other.userId, userId) || other.userId == userId) &&
            (identical(other.timestamp, timestamp) ||
                other.timestamp == timestamp) &&
            (identical(other.taken, taken) || other.taken == taken) &&
            (identical(other.notes, notes) || other.notes == notes) &&
            (identical(other.scheduledTime, scheduledTime) ||
                other.scheduledTime == scheduledTime));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, id, medicationId, userId,
      timestamp, taken, notes, scheduledTime);

  /// Create a copy of MedicationLog
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$MedicationLogImplCopyWith<_$MedicationLogImpl> get copyWith =>
      __$$MedicationLogImplCopyWithImpl<_$MedicationLogImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$MedicationLogImplToJson(
      this,
    );
  }
}

abstract class _MedicationLog implements MedicationLog {
  const factory _MedicationLog(
      {required final String id,
      required final String medicationId,
      required final String userId,
      @TimestampConverter() required final DateTime timestamp,
      required final bool taken,
      final String? notes,
      required final String scheduledTime}) = _$MedicationLogImpl;

  factory _MedicationLog.fromJson(Map<String, dynamic> json) =
      _$MedicationLogImpl.fromJson;

  @override
  String get id;
  @override
  String get medicationId;
  @override
  String get userId;
  @override
  @TimestampConverter()
  DateTime get timestamp;
  @override
  bool get taken;
  @override
  String? get notes;
  @override
  String get scheduledTime;

  /// Create a copy of MedicationLog
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$MedicationLogImplCopyWith<_$MedicationLogImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
