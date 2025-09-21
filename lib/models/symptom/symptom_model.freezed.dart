// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'symptom_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

Symptom _$SymptomFromJson(Map<String, dynamic> json) {
  return _Symptom.fromJson(json);
}

/// @nodoc
mixin _$Symptom {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  SymptomSeverity get severity => throw _privateConstructorUsedError;
  SymptomDuration get duration => throw _privateConstructorUsedError;
  int get durationValue => throw _privateConstructorUsedError;
  DateTime get timestamp => throw _privateConstructorUsedError;
  BodyRegion? get bodyRegion => throw _privateConstructorUsedError;
  String? get notes => throw _privateConstructorUsedError;

  /// Serializes this Symptom to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of Symptom
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $SymptomCopyWith<Symptom> get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $SymptomCopyWith<$Res> {
  factory $SymptomCopyWith(Symptom value, $Res Function(Symptom) then) =
      _$SymptomCopyWithImpl<$Res, Symptom>;
  @useResult
  $Res call(
      {String id,
      String name,
      SymptomSeverity severity,
      SymptomDuration duration,
      int durationValue,
      DateTime timestamp,
      BodyRegion? bodyRegion,
      String? notes});
}

/// @nodoc
class _$SymptomCopyWithImpl<$Res, $Val extends Symptom>
    implements $SymptomCopyWith<$Res> {
  _$SymptomCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of Symptom
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? severity = null,
    Object? duration = null,
    Object? durationValue = null,
    Object? timestamp = null,
    Object? bodyRegion = freezed,
    Object? notes = freezed,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      severity: null == severity
          ? _value.severity
          : severity // ignore: cast_nullable_to_non_nullable
              as SymptomSeverity,
      duration: null == duration
          ? _value.duration
          : duration // ignore: cast_nullable_to_non_nullable
              as SymptomDuration,
      durationValue: null == durationValue
          ? _value.durationValue
          : durationValue // ignore: cast_nullable_to_non_nullable
              as int,
      timestamp: null == timestamp
          ? _value.timestamp
          : timestamp // ignore: cast_nullable_to_non_nullable
              as DateTime,
      bodyRegion: freezed == bodyRegion
          ? _value.bodyRegion
          : bodyRegion // ignore: cast_nullable_to_non_nullable
              as BodyRegion?,
      notes: freezed == notes
          ? _value.notes
          : notes // ignore: cast_nullable_to_non_nullable
              as String?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$SymptomImplCopyWith<$Res> implements $SymptomCopyWith<$Res> {
  factory _$$SymptomImplCopyWith(
          _$SymptomImpl value, $Res Function(_$SymptomImpl) then) =
      __$$SymptomImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String name,
      SymptomSeverity severity,
      SymptomDuration duration,
      int durationValue,
      DateTime timestamp,
      BodyRegion? bodyRegion,
      String? notes});
}

/// @nodoc
class __$$SymptomImplCopyWithImpl<$Res>
    extends _$SymptomCopyWithImpl<$Res, _$SymptomImpl>
    implements _$$SymptomImplCopyWith<$Res> {
  __$$SymptomImplCopyWithImpl(
      _$SymptomImpl _value, $Res Function(_$SymptomImpl) _then)
      : super(_value, _then);

  /// Create a copy of Symptom
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? severity = null,
    Object? duration = null,
    Object? durationValue = null,
    Object? timestamp = null,
    Object? bodyRegion = freezed,
    Object? notes = freezed,
  }) {
    return _then(_$SymptomImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      severity: null == severity
          ? _value.severity
          : severity // ignore: cast_nullable_to_non_nullable
              as SymptomSeverity,
      duration: null == duration
          ? _value.duration
          : duration // ignore: cast_nullable_to_non_nullable
              as SymptomDuration,
      durationValue: null == durationValue
          ? _value.durationValue
          : durationValue // ignore: cast_nullable_to_non_nullable
              as int,
      timestamp: null == timestamp
          ? _value.timestamp
          : timestamp // ignore: cast_nullable_to_non_nullable
              as DateTime,
      bodyRegion: freezed == bodyRegion
          ? _value.bodyRegion
          : bodyRegion // ignore: cast_nullable_to_non_nullable
              as BodyRegion?,
      notes: freezed == notes
          ? _value.notes
          : notes // ignore: cast_nullable_to_non_nullable
              as String?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$SymptomImpl with DiagnosticableTreeMixin implements _Symptom {
  const _$SymptomImpl(
      {required this.id,
      required this.name,
      required this.severity,
      required this.duration,
      required this.durationValue,
      required this.timestamp,
      this.bodyRegion,
      this.notes});

  factory _$SymptomImpl.fromJson(Map<String, dynamic> json) =>
      _$$SymptomImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final SymptomSeverity severity;
  @override
  final SymptomDuration duration;
  @override
  final int durationValue;
  @override
  final DateTime timestamp;
  @override
  final BodyRegion? bodyRegion;
  @override
  final String? notes;

  @override
  String toString({DiagnosticLevel minLevel = DiagnosticLevel.info}) {
    return 'Symptom(id: $id, name: $name, severity: $severity, duration: $duration, durationValue: $durationValue, timestamp: $timestamp, bodyRegion: $bodyRegion, notes: $notes)';
  }

  @override
  void debugFillProperties(DiagnosticPropertiesBuilder properties) {
    super.debugFillProperties(properties);
    properties
      ..add(DiagnosticsProperty('type', 'Symptom'))
      ..add(DiagnosticsProperty('id', id))
      ..add(DiagnosticsProperty('name', name))
      ..add(DiagnosticsProperty('severity', severity))
      ..add(DiagnosticsProperty('duration', duration))
      ..add(DiagnosticsProperty('durationValue', durationValue))
      ..add(DiagnosticsProperty('timestamp', timestamp))
      ..add(DiagnosticsProperty('bodyRegion', bodyRegion))
      ..add(DiagnosticsProperty('notes', notes));
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$SymptomImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.severity, severity) ||
                other.severity == severity) &&
            (identical(other.duration, duration) ||
                other.duration == duration) &&
            (identical(other.durationValue, durationValue) ||
                other.durationValue == durationValue) &&
            (identical(other.timestamp, timestamp) ||
                other.timestamp == timestamp) &&
            (identical(other.bodyRegion, bodyRegion) ||
                other.bodyRegion == bodyRegion) &&
            (identical(other.notes, notes) || other.notes == notes));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, id, name, severity, duration,
      durationValue, timestamp, bodyRegion, notes);

  /// Create a copy of Symptom
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$SymptomImplCopyWith<_$SymptomImpl> get copyWith =>
      __$$SymptomImplCopyWithImpl<_$SymptomImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$SymptomImplToJson(
      this,
    );
  }
}

abstract class _Symptom implements Symptom {
  const factory _Symptom(
      {required final String id,
      required final String name,
      required final SymptomSeverity severity,
      required final SymptomDuration duration,
      required final int durationValue,
      required final DateTime timestamp,
      final BodyRegion? bodyRegion,
      final String? notes}) = _$SymptomImpl;

  factory _Symptom.fromJson(Map<String, dynamic> json) = _$SymptomImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  SymptomSeverity get severity;
  @override
  SymptomDuration get duration;
  @override
  int get durationValue;
  @override
  DateTime get timestamp;
  @override
  BodyRegion? get bodyRegion;
  @override
  String? get notes;

  /// Create a copy of Symptom
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$SymptomImplCopyWith<_$SymptomImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

PossibleCondition _$PossibleConditionFromJson(Map<String, dynamic> json) {
  return _PossibleCondition.fromJson(json);
}

/// @nodoc
mixin _$PossibleCondition {
  String get name => throw _privateConstructorUsedError;
  String get description => throw _privateConstructorUsedError;
  double get confidenceLevel => throw _privateConstructorUsedError;
  SymptomSeverity get severity => throw _privateConstructorUsedError;
  String? get additionalInfo => throw _privateConstructorUsedError;

  /// Serializes this PossibleCondition to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of PossibleCondition
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $PossibleConditionCopyWith<PossibleCondition> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $PossibleConditionCopyWith<$Res> {
  factory $PossibleConditionCopyWith(
          PossibleCondition value, $Res Function(PossibleCondition) then) =
      _$PossibleConditionCopyWithImpl<$Res, PossibleCondition>;
  @useResult
  $Res call(
      {String name,
      String description,
      double confidenceLevel,
      SymptomSeverity severity,
      String? additionalInfo});
}

/// @nodoc
class _$PossibleConditionCopyWithImpl<$Res, $Val extends PossibleCondition>
    implements $PossibleConditionCopyWith<$Res> {
  _$PossibleConditionCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of PossibleCondition
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? name = null,
    Object? description = null,
    Object? confidenceLevel = null,
    Object? severity = null,
    Object? additionalInfo = freezed,
  }) {
    return _then(_value.copyWith(
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      description: null == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String,
      confidenceLevel: null == confidenceLevel
          ? _value.confidenceLevel
          : confidenceLevel // ignore: cast_nullable_to_non_nullable
              as double,
      severity: null == severity
          ? _value.severity
          : severity // ignore: cast_nullable_to_non_nullable
              as SymptomSeverity,
      additionalInfo: freezed == additionalInfo
          ? _value.additionalInfo
          : additionalInfo // ignore: cast_nullable_to_non_nullable
              as String?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$PossibleConditionImplCopyWith<$Res>
    implements $PossibleConditionCopyWith<$Res> {
  factory _$$PossibleConditionImplCopyWith(_$PossibleConditionImpl value,
          $Res Function(_$PossibleConditionImpl) then) =
      __$$PossibleConditionImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String name,
      String description,
      double confidenceLevel,
      SymptomSeverity severity,
      String? additionalInfo});
}

/// @nodoc
class __$$PossibleConditionImplCopyWithImpl<$Res>
    extends _$PossibleConditionCopyWithImpl<$Res, _$PossibleConditionImpl>
    implements _$$PossibleConditionImplCopyWith<$Res> {
  __$$PossibleConditionImplCopyWithImpl(_$PossibleConditionImpl _value,
      $Res Function(_$PossibleConditionImpl) _then)
      : super(_value, _then);

  /// Create a copy of PossibleCondition
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? name = null,
    Object? description = null,
    Object? confidenceLevel = null,
    Object? severity = null,
    Object? additionalInfo = freezed,
  }) {
    return _then(_$PossibleConditionImpl(
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      description: null == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String,
      confidenceLevel: null == confidenceLevel
          ? _value.confidenceLevel
          : confidenceLevel // ignore: cast_nullable_to_non_nullable
              as double,
      severity: null == severity
          ? _value.severity
          : severity // ignore: cast_nullable_to_non_nullable
              as SymptomSeverity,
      additionalInfo: freezed == additionalInfo
          ? _value.additionalInfo
          : additionalInfo // ignore: cast_nullable_to_non_nullable
              as String?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$PossibleConditionImpl
    with DiagnosticableTreeMixin
    implements _PossibleCondition {
  const _$PossibleConditionImpl(
      {required this.name,
      required this.description,
      required this.confidenceLevel,
      required this.severity,
      this.additionalInfo});

  factory _$PossibleConditionImpl.fromJson(Map<String, dynamic> json) =>
      _$$PossibleConditionImplFromJson(json);

  @override
  final String name;
  @override
  final String description;
  @override
  final double confidenceLevel;
  @override
  final SymptomSeverity severity;
  @override
  final String? additionalInfo;

  @override
  String toString({DiagnosticLevel minLevel = DiagnosticLevel.info}) {
    return 'PossibleCondition(name: $name, description: $description, confidenceLevel: $confidenceLevel, severity: $severity, additionalInfo: $additionalInfo)';
  }

  @override
  void debugFillProperties(DiagnosticPropertiesBuilder properties) {
    super.debugFillProperties(properties);
    properties
      ..add(DiagnosticsProperty('type', 'PossibleCondition'))
      ..add(DiagnosticsProperty('name', name))
      ..add(DiagnosticsProperty('description', description))
      ..add(DiagnosticsProperty('confidenceLevel', confidenceLevel))
      ..add(DiagnosticsProperty('severity', severity))
      ..add(DiagnosticsProperty('additionalInfo', additionalInfo));
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$PossibleConditionImpl &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.confidenceLevel, confidenceLevel) ||
                other.confidenceLevel == confidenceLevel) &&
            (identical(other.severity, severity) ||
                other.severity == severity) &&
            (identical(other.additionalInfo, additionalInfo) ||
                other.additionalInfo == additionalInfo));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, name, description,
      confidenceLevel, severity, additionalInfo);

  /// Create a copy of PossibleCondition
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$PossibleConditionImplCopyWith<_$PossibleConditionImpl> get copyWith =>
      __$$PossibleConditionImplCopyWithImpl<_$PossibleConditionImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$PossibleConditionImplToJson(
      this,
    );
  }
}

abstract class _PossibleCondition implements PossibleCondition {
  const factory _PossibleCondition(
      {required final String name,
      required final String description,
      required final double confidenceLevel,
      required final SymptomSeverity severity,
      final String? additionalInfo}) = _$PossibleConditionImpl;

  factory _PossibleCondition.fromJson(Map<String, dynamic> json) =
      _$PossibleConditionImpl.fromJson;

  @override
  String get name;
  @override
  String get description;
  @override
  double get confidenceLevel;
  @override
  SymptomSeverity get severity;
  @override
  String? get additionalInfo;

  /// Create a copy of PossibleCondition
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$PossibleConditionImplCopyWith<_$PossibleConditionImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

Remedy _$RemedyFromJson(Map<String, dynamic> json) {
  return _Remedy.fromJson(json);
}

/// @nodoc
mixin _$Remedy {
  String get name => throw _privateConstructorUsedError;
  String get description => throw _privateConstructorUsedError;
  RemedyType get type => throw _privateConstructorUsedError;
  String? get warning => throw _privateConstructorUsedError;

  /// Serializes this Remedy to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of Remedy
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $RemedyCopyWith<Remedy> get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $RemedyCopyWith<$Res> {
  factory $RemedyCopyWith(Remedy value, $Res Function(Remedy) then) =
      _$RemedyCopyWithImpl<$Res, Remedy>;
  @useResult
  $Res call(
      {String name, String description, RemedyType type, String? warning});
}

/// @nodoc
class _$RemedyCopyWithImpl<$Res, $Val extends Remedy>
    implements $RemedyCopyWith<$Res> {
  _$RemedyCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of Remedy
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? name = null,
    Object? description = null,
    Object? type = null,
    Object? warning = freezed,
  }) {
    return _then(_value.copyWith(
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      description: null == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String,
      type: null == type
          ? _value.type
          : type // ignore: cast_nullable_to_non_nullable
              as RemedyType,
      warning: freezed == warning
          ? _value.warning
          : warning // ignore: cast_nullable_to_non_nullable
              as String?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$RemedyImplCopyWith<$Res> implements $RemedyCopyWith<$Res> {
  factory _$$RemedyImplCopyWith(
          _$RemedyImpl value, $Res Function(_$RemedyImpl) then) =
      __$$RemedyImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String name, String description, RemedyType type, String? warning});
}

/// @nodoc
class __$$RemedyImplCopyWithImpl<$Res>
    extends _$RemedyCopyWithImpl<$Res, _$RemedyImpl>
    implements _$$RemedyImplCopyWith<$Res> {
  __$$RemedyImplCopyWithImpl(
      _$RemedyImpl _value, $Res Function(_$RemedyImpl) _then)
      : super(_value, _then);

  /// Create a copy of Remedy
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? name = null,
    Object? description = null,
    Object? type = null,
    Object? warning = freezed,
  }) {
    return _then(_$RemedyImpl(
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      description: null == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String,
      type: null == type
          ? _value.type
          : type // ignore: cast_nullable_to_non_nullable
              as RemedyType,
      warning: freezed == warning
          ? _value.warning
          : warning // ignore: cast_nullable_to_non_nullable
              as String?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$RemedyImpl with DiagnosticableTreeMixin implements _Remedy {
  const _$RemedyImpl(
      {required this.name,
      required this.description,
      required this.type,
      this.warning});

  factory _$RemedyImpl.fromJson(Map<String, dynamic> json) =>
      _$$RemedyImplFromJson(json);

  @override
  final String name;
  @override
  final String description;
  @override
  final RemedyType type;
  @override
  final String? warning;

  @override
  String toString({DiagnosticLevel minLevel = DiagnosticLevel.info}) {
    return 'Remedy(name: $name, description: $description, type: $type, warning: $warning)';
  }

  @override
  void debugFillProperties(DiagnosticPropertiesBuilder properties) {
    super.debugFillProperties(properties);
    properties
      ..add(DiagnosticsProperty('type', 'Remedy'))
      ..add(DiagnosticsProperty('name', name))
      ..add(DiagnosticsProperty('description', description))
      ..add(DiagnosticsProperty('type', type))
      ..add(DiagnosticsProperty('warning', warning));
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$RemedyImpl &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.type, type) || other.type == type) &&
            (identical(other.warning, warning) || other.warning == warning));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode =>
      Object.hash(runtimeType, name, description, type, warning);

  /// Create a copy of Remedy
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$RemedyImplCopyWith<_$RemedyImpl> get copyWith =>
      __$$RemedyImplCopyWithImpl<_$RemedyImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$RemedyImplToJson(
      this,
    );
  }
}

abstract class _Remedy implements Remedy {
  const factory _Remedy(
      {required final String name,
      required final String description,
      required final RemedyType type,
      final String? warning}) = _$RemedyImpl;

  factory _Remedy.fromJson(Map<String, dynamic> json) = _$RemedyImpl.fromJson;

  @override
  String get name;
  @override
  String get description;
  @override
  RemedyType get type;
  @override
  String? get warning;

  /// Create a copy of Remedy
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$RemedyImplCopyWith<_$RemedyImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

SymptomAnalysisResult _$SymptomAnalysisResultFromJson(
    Map<String, dynamic> json) {
  return _SymptomAnalysisResult.fromJson(json);
}

/// @nodoc
mixin _$SymptomAnalysisResult {
  String get id => throw _privateConstructorUsedError;
  List<Symptom> get symptoms => throw _privateConstructorUsedError;
  List<PossibleCondition> get possibleConditions =>
      throw _privateConstructorUsedError;
  List<Remedy> get recommendedRemedies => throw _privateConstructorUsedError;
  DateTime get timestamp => throw _privateConstructorUsedError;
  String? get disclaimer => throw _privateConstructorUsedError;
  SymptomSeverity? get overallSeverity => throw _privateConstructorUsedError;
  bool? get shouldSeeDoctor => throw _privateConstructorUsedError;
  String? get specialistRecommendation => throw _privateConstructorUsedError;

  /// Serializes this SymptomAnalysisResult to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of SymptomAnalysisResult
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $SymptomAnalysisResultCopyWith<SymptomAnalysisResult> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $SymptomAnalysisResultCopyWith<$Res> {
  factory $SymptomAnalysisResultCopyWith(SymptomAnalysisResult value,
          $Res Function(SymptomAnalysisResult) then) =
      _$SymptomAnalysisResultCopyWithImpl<$Res, SymptomAnalysisResult>;
  @useResult
  $Res call(
      {String id,
      List<Symptom> symptoms,
      List<PossibleCondition> possibleConditions,
      List<Remedy> recommendedRemedies,
      DateTime timestamp,
      String? disclaimer,
      SymptomSeverity? overallSeverity,
      bool? shouldSeeDoctor,
      String? specialistRecommendation});
}

/// @nodoc
class _$SymptomAnalysisResultCopyWithImpl<$Res,
        $Val extends SymptomAnalysisResult>
    implements $SymptomAnalysisResultCopyWith<$Res> {
  _$SymptomAnalysisResultCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of SymptomAnalysisResult
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? symptoms = null,
    Object? possibleConditions = null,
    Object? recommendedRemedies = null,
    Object? timestamp = null,
    Object? disclaimer = freezed,
    Object? overallSeverity = freezed,
    Object? shouldSeeDoctor = freezed,
    Object? specialistRecommendation = freezed,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      symptoms: null == symptoms
          ? _value.symptoms
          : symptoms // ignore: cast_nullable_to_non_nullable
              as List<Symptom>,
      possibleConditions: null == possibleConditions
          ? _value.possibleConditions
          : possibleConditions // ignore: cast_nullable_to_non_nullable
              as List<PossibleCondition>,
      recommendedRemedies: null == recommendedRemedies
          ? _value.recommendedRemedies
          : recommendedRemedies // ignore: cast_nullable_to_non_nullable
              as List<Remedy>,
      timestamp: null == timestamp
          ? _value.timestamp
          : timestamp // ignore: cast_nullable_to_non_nullable
              as DateTime,
      disclaimer: freezed == disclaimer
          ? _value.disclaimer
          : disclaimer // ignore: cast_nullable_to_non_nullable
              as String?,
      overallSeverity: freezed == overallSeverity
          ? _value.overallSeverity
          : overallSeverity // ignore: cast_nullable_to_non_nullable
              as SymptomSeverity?,
      shouldSeeDoctor: freezed == shouldSeeDoctor
          ? _value.shouldSeeDoctor
          : shouldSeeDoctor // ignore: cast_nullable_to_non_nullable
              as bool?,
      specialistRecommendation: freezed == specialistRecommendation
          ? _value.specialistRecommendation
          : specialistRecommendation // ignore: cast_nullable_to_non_nullable
              as String?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$SymptomAnalysisResultImplCopyWith<$Res>
    implements $SymptomAnalysisResultCopyWith<$Res> {
  factory _$$SymptomAnalysisResultImplCopyWith(
          _$SymptomAnalysisResultImpl value,
          $Res Function(_$SymptomAnalysisResultImpl) then) =
      __$$SymptomAnalysisResultImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      List<Symptom> symptoms,
      List<PossibleCondition> possibleConditions,
      List<Remedy> recommendedRemedies,
      DateTime timestamp,
      String? disclaimer,
      SymptomSeverity? overallSeverity,
      bool? shouldSeeDoctor,
      String? specialistRecommendation});
}

/// @nodoc
class __$$SymptomAnalysisResultImplCopyWithImpl<$Res>
    extends _$SymptomAnalysisResultCopyWithImpl<$Res,
        _$SymptomAnalysisResultImpl>
    implements _$$SymptomAnalysisResultImplCopyWith<$Res> {
  __$$SymptomAnalysisResultImplCopyWithImpl(_$SymptomAnalysisResultImpl _value,
      $Res Function(_$SymptomAnalysisResultImpl) _then)
      : super(_value, _then);

  /// Create a copy of SymptomAnalysisResult
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? symptoms = null,
    Object? possibleConditions = null,
    Object? recommendedRemedies = null,
    Object? timestamp = null,
    Object? disclaimer = freezed,
    Object? overallSeverity = freezed,
    Object? shouldSeeDoctor = freezed,
    Object? specialistRecommendation = freezed,
  }) {
    return _then(_$SymptomAnalysisResultImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      symptoms: null == symptoms
          ? _value._symptoms
          : symptoms // ignore: cast_nullable_to_non_nullable
              as List<Symptom>,
      possibleConditions: null == possibleConditions
          ? _value._possibleConditions
          : possibleConditions // ignore: cast_nullable_to_non_nullable
              as List<PossibleCondition>,
      recommendedRemedies: null == recommendedRemedies
          ? _value._recommendedRemedies
          : recommendedRemedies // ignore: cast_nullable_to_non_nullable
              as List<Remedy>,
      timestamp: null == timestamp
          ? _value.timestamp
          : timestamp // ignore: cast_nullable_to_non_nullable
              as DateTime,
      disclaimer: freezed == disclaimer
          ? _value.disclaimer
          : disclaimer // ignore: cast_nullable_to_non_nullable
              as String?,
      overallSeverity: freezed == overallSeverity
          ? _value.overallSeverity
          : overallSeverity // ignore: cast_nullable_to_non_nullable
              as SymptomSeverity?,
      shouldSeeDoctor: freezed == shouldSeeDoctor
          ? _value.shouldSeeDoctor
          : shouldSeeDoctor // ignore: cast_nullable_to_non_nullable
              as bool?,
      specialistRecommendation: freezed == specialistRecommendation
          ? _value.specialistRecommendation
          : specialistRecommendation // ignore: cast_nullable_to_non_nullable
              as String?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$SymptomAnalysisResultImpl
    with DiagnosticableTreeMixin
    implements _SymptomAnalysisResult {
  const _$SymptomAnalysisResultImpl(
      {required this.id,
      required final List<Symptom> symptoms,
      required final List<PossibleCondition> possibleConditions,
      required final List<Remedy> recommendedRemedies,
      required this.timestamp,
      this.disclaimer,
      this.overallSeverity,
      this.shouldSeeDoctor,
      this.specialistRecommendation})
      : _symptoms = symptoms,
        _possibleConditions = possibleConditions,
        _recommendedRemedies = recommendedRemedies;

  factory _$SymptomAnalysisResultImpl.fromJson(Map<String, dynamic> json) =>
      _$$SymptomAnalysisResultImplFromJson(json);

  @override
  final String id;
  final List<Symptom> _symptoms;
  @override
  List<Symptom> get symptoms {
    if (_symptoms is EqualUnmodifiableListView) return _symptoms;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_symptoms);
  }

  final List<PossibleCondition> _possibleConditions;
  @override
  List<PossibleCondition> get possibleConditions {
    if (_possibleConditions is EqualUnmodifiableListView)
      return _possibleConditions;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_possibleConditions);
  }

  final List<Remedy> _recommendedRemedies;
  @override
  List<Remedy> get recommendedRemedies {
    if (_recommendedRemedies is EqualUnmodifiableListView)
      return _recommendedRemedies;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_recommendedRemedies);
  }

  @override
  final DateTime timestamp;
  @override
  final String? disclaimer;
  @override
  final SymptomSeverity? overallSeverity;
  @override
  final bool? shouldSeeDoctor;
  @override
  final String? specialistRecommendation;

  @override
  String toString({DiagnosticLevel minLevel = DiagnosticLevel.info}) {
    return 'SymptomAnalysisResult(id: $id, symptoms: $symptoms, possibleConditions: $possibleConditions, recommendedRemedies: $recommendedRemedies, timestamp: $timestamp, disclaimer: $disclaimer, overallSeverity: $overallSeverity, shouldSeeDoctor: $shouldSeeDoctor, specialistRecommendation: $specialistRecommendation)';
  }

  @override
  void debugFillProperties(DiagnosticPropertiesBuilder properties) {
    super.debugFillProperties(properties);
    properties
      ..add(DiagnosticsProperty('type', 'SymptomAnalysisResult'))
      ..add(DiagnosticsProperty('id', id))
      ..add(DiagnosticsProperty('symptoms', symptoms))
      ..add(DiagnosticsProperty('possibleConditions', possibleConditions))
      ..add(DiagnosticsProperty('recommendedRemedies', recommendedRemedies))
      ..add(DiagnosticsProperty('timestamp', timestamp))
      ..add(DiagnosticsProperty('disclaimer', disclaimer))
      ..add(DiagnosticsProperty('overallSeverity', overallSeverity))
      ..add(DiagnosticsProperty('shouldSeeDoctor', shouldSeeDoctor))
      ..add(DiagnosticsProperty(
          'specialistRecommendation', specialistRecommendation));
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$SymptomAnalysisResultImpl &&
            (identical(other.id, id) || other.id == id) &&
            const DeepCollectionEquality().equals(other._symptoms, _symptoms) &&
            const DeepCollectionEquality()
                .equals(other._possibleConditions, _possibleConditions) &&
            const DeepCollectionEquality()
                .equals(other._recommendedRemedies, _recommendedRemedies) &&
            (identical(other.timestamp, timestamp) ||
                other.timestamp == timestamp) &&
            (identical(other.disclaimer, disclaimer) ||
                other.disclaimer == disclaimer) &&
            (identical(other.overallSeverity, overallSeverity) ||
                other.overallSeverity == overallSeverity) &&
            (identical(other.shouldSeeDoctor, shouldSeeDoctor) ||
                other.shouldSeeDoctor == shouldSeeDoctor) &&
            (identical(
                    other.specialistRecommendation, specialistRecommendation) ||
                other.specialistRecommendation == specialistRecommendation));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      id,
      const DeepCollectionEquality().hash(_symptoms),
      const DeepCollectionEquality().hash(_possibleConditions),
      const DeepCollectionEquality().hash(_recommendedRemedies),
      timestamp,
      disclaimer,
      overallSeverity,
      shouldSeeDoctor,
      specialistRecommendation);

  /// Create a copy of SymptomAnalysisResult
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$SymptomAnalysisResultImplCopyWith<_$SymptomAnalysisResultImpl>
      get copyWith => __$$SymptomAnalysisResultImplCopyWithImpl<
          _$SymptomAnalysisResultImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$SymptomAnalysisResultImplToJson(
      this,
    );
  }
}

abstract class _SymptomAnalysisResult implements SymptomAnalysisResult {
  const factory _SymptomAnalysisResult(
      {required final String id,
      required final List<Symptom> symptoms,
      required final List<PossibleCondition> possibleConditions,
      required final List<Remedy> recommendedRemedies,
      required final DateTime timestamp,
      final String? disclaimer,
      final SymptomSeverity? overallSeverity,
      final bool? shouldSeeDoctor,
      final String? specialistRecommendation}) = _$SymptomAnalysisResultImpl;

  factory _SymptomAnalysisResult.fromJson(Map<String, dynamic> json) =
      _$SymptomAnalysisResultImpl.fromJson;

  @override
  String get id;
  @override
  List<Symptom> get symptoms;
  @override
  List<PossibleCondition> get possibleConditions;
  @override
  List<Remedy> get recommendedRemedies;
  @override
  DateTime get timestamp;
  @override
  String? get disclaimer;
  @override
  SymptomSeverity? get overallSeverity;
  @override
  bool? get shouldSeeDoctor;
  @override
  String? get specialistRecommendation;

  /// Create a copy of SymptomAnalysisResult
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$SymptomAnalysisResultImplCopyWith<_$SymptomAnalysisResultImpl>
      get copyWith => throw _privateConstructorUsedError;
}
