// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'user_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

User _$UserFromJson(Map<String, dynamic> json) {
  return _User.fromJson(json);
}

/// @nodoc
mixin _$User {
  String get id => throw _privateConstructorUsedError;
  String get email => throw _privateConstructorUsedError;
  String get displayName => throw _privateConstructorUsedError;
  String? get photoUrl => throw _privateConstructorUsedError;
  @TimestampConverter()
  DateTime? get dateOfBirth => throw _privateConstructorUsedError;
  String? get gender => throw _privateConstructorUsedError;
  double? get height => throw _privateConstructorUsedError;
  double? get weight => throw _privateConstructorUsedError;
  bool get isOnboarded => throw _privateConstructorUsedError;
  int get dailyWaterGoalMl => throw _privateConstructorUsedError;
  int get dailyStepsGoal => throw _privateConstructorUsedError;
  int get dailySleepHoursGoal => throw _privateConstructorUsedError;
  Map<String, dynamic> get healthPreferences =>
      throw _privateConstructorUsedError;
  Map<String, dynamic> get appSettings => throw _privateConstructorUsedError;
  List<String> get favoriteChats => throw _privateConstructorUsedError;
  @TimestampConverter()
  DateTime? get createdAt => throw _privateConstructorUsedError;
  @TimestampConverter()
  DateTime? get lastLoginAt => throw _privateConstructorUsedError;

  /// Serializes this User to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of User
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $UserCopyWith<User> get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $UserCopyWith<$Res> {
  factory $UserCopyWith(User value, $Res Function(User) then) =
      _$UserCopyWithImpl<$Res, User>;
  @useResult
  $Res call(
      {String id,
      String email,
      String displayName,
      String? photoUrl,
      @TimestampConverter() DateTime? dateOfBirth,
      String? gender,
      double? height,
      double? weight,
      bool isOnboarded,
      int dailyWaterGoalMl,
      int dailyStepsGoal,
      int dailySleepHoursGoal,
      Map<String, dynamic> healthPreferences,
      Map<String, dynamic> appSettings,
      List<String> favoriteChats,
      @TimestampConverter() DateTime? createdAt,
      @TimestampConverter() DateTime? lastLoginAt});
}

/// @nodoc
class _$UserCopyWithImpl<$Res, $Val extends User>
    implements $UserCopyWith<$Res> {
  _$UserCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of User
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? email = null,
    Object? displayName = null,
    Object? photoUrl = freezed,
    Object? dateOfBirth = freezed,
    Object? gender = freezed,
    Object? height = freezed,
    Object? weight = freezed,
    Object? isOnboarded = null,
    Object? dailyWaterGoalMl = null,
    Object? dailyStepsGoal = null,
    Object? dailySleepHoursGoal = null,
    Object? healthPreferences = null,
    Object? appSettings = null,
    Object? favoriteChats = null,
    Object? createdAt = freezed,
    Object? lastLoginAt = freezed,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      email: null == email
          ? _value.email
          : email // ignore: cast_nullable_to_non_nullable
              as String,
      displayName: null == displayName
          ? _value.displayName
          : displayName // ignore: cast_nullable_to_non_nullable
              as String,
      photoUrl: freezed == photoUrl
          ? _value.photoUrl
          : photoUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      dateOfBirth: freezed == dateOfBirth
          ? _value.dateOfBirth
          : dateOfBirth // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      gender: freezed == gender
          ? _value.gender
          : gender // ignore: cast_nullable_to_non_nullable
              as String?,
      height: freezed == height
          ? _value.height
          : height // ignore: cast_nullable_to_non_nullable
              as double?,
      weight: freezed == weight
          ? _value.weight
          : weight // ignore: cast_nullable_to_non_nullable
              as double?,
      isOnboarded: null == isOnboarded
          ? _value.isOnboarded
          : isOnboarded // ignore: cast_nullable_to_non_nullable
              as bool,
      dailyWaterGoalMl: null == dailyWaterGoalMl
          ? _value.dailyWaterGoalMl
          : dailyWaterGoalMl // ignore: cast_nullable_to_non_nullable
              as int,
      dailyStepsGoal: null == dailyStepsGoal
          ? _value.dailyStepsGoal
          : dailyStepsGoal // ignore: cast_nullable_to_non_nullable
              as int,
      dailySleepHoursGoal: null == dailySleepHoursGoal
          ? _value.dailySleepHoursGoal
          : dailySleepHoursGoal // ignore: cast_nullable_to_non_nullable
              as int,
      healthPreferences: null == healthPreferences
          ? _value.healthPreferences
          : healthPreferences // ignore: cast_nullable_to_non_nullable
              as Map<String, dynamic>,
      appSettings: null == appSettings
          ? _value.appSettings
          : appSettings // ignore: cast_nullable_to_non_nullable
              as Map<String, dynamic>,
      favoriteChats: null == favoriteChats
          ? _value.favoriteChats
          : favoriteChats // ignore: cast_nullable_to_non_nullable
              as List<String>,
      createdAt: freezed == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      lastLoginAt: freezed == lastLoginAt
          ? _value.lastLoginAt
          : lastLoginAt // ignore: cast_nullable_to_non_nullable
              as DateTime?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$UserImplCopyWith<$Res> implements $UserCopyWith<$Res> {
  factory _$$UserImplCopyWith(
          _$UserImpl value, $Res Function(_$UserImpl) then) =
      __$$UserImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String email,
      String displayName,
      String? photoUrl,
      @TimestampConverter() DateTime? dateOfBirth,
      String? gender,
      double? height,
      double? weight,
      bool isOnboarded,
      int dailyWaterGoalMl,
      int dailyStepsGoal,
      int dailySleepHoursGoal,
      Map<String, dynamic> healthPreferences,
      Map<String, dynamic> appSettings,
      List<String> favoriteChats,
      @TimestampConverter() DateTime? createdAt,
      @TimestampConverter() DateTime? lastLoginAt});
}

/// @nodoc
class __$$UserImplCopyWithImpl<$Res>
    extends _$UserCopyWithImpl<$Res, _$UserImpl>
    implements _$$UserImplCopyWith<$Res> {
  __$$UserImplCopyWithImpl(_$UserImpl _value, $Res Function(_$UserImpl) _then)
      : super(_value, _then);

  /// Create a copy of User
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? email = null,
    Object? displayName = null,
    Object? photoUrl = freezed,
    Object? dateOfBirth = freezed,
    Object? gender = freezed,
    Object? height = freezed,
    Object? weight = freezed,
    Object? isOnboarded = null,
    Object? dailyWaterGoalMl = null,
    Object? dailyStepsGoal = null,
    Object? dailySleepHoursGoal = null,
    Object? healthPreferences = null,
    Object? appSettings = null,
    Object? favoriteChats = null,
    Object? createdAt = freezed,
    Object? lastLoginAt = freezed,
  }) {
    return _then(_$UserImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      email: null == email
          ? _value.email
          : email // ignore: cast_nullable_to_non_nullable
              as String,
      displayName: null == displayName
          ? _value.displayName
          : displayName // ignore: cast_nullable_to_non_nullable
              as String,
      photoUrl: freezed == photoUrl
          ? _value.photoUrl
          : photoUrl // ignore: cast_nullable_to_non_nullable
              as String?,
      dateOfBirth: freezed == dateOfBirth
          ? _value.dateOfBirth
          : dateOfBirth // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      gender: freezed == gender
          ? _value.gender
          : gender // ignore: cast_nullable_to_non_nullable
              as String?,
      height: freezed == height
          ? _value.height
          : height // ignore: cast_nullable_to_non_nullable
              as double?,
      weight: freezed == weight
          ? _value.weight
          : weight // ignore: cast_nullable_to_non_nullable
              as double?,
      isOnboarded: null == isOnboarded
          ? _value.isOnboarded
          : isOnboarded // ignore: cast_nullable_to_non_nullable
              as bool,
      dailyWaterGoalMl: null == dailyWaterGoalMl
          ? _value.dailyWaterGoalMl
          : dailyWaterGoalMl // ignore: cast_nullable_to_non_nullable
              as int,
      dailyStepsGoal: null == dailyStepsGoal
          ? _value.dailyStepsGoal
          : dailyStepsGoal // ignore: cast_nullable_to_non_nullable
              as int,
      dailySleepHoursGoal: null == dailySleepHoursGoal
          ? _value.dailySleepHoursGoal
          : dailySleepHoursGoal // ignore: cast_nullable_to_non_nullable
              as int,
      healthPreferences: null == healthPreferences
          ? _value._healthPreferences
          : healthPreferences // ignore: cast_nullable_to_non_nullable
              as Map<String, dynamic>,
      appSettings: null == appSettings
          ? _value._appSettings
          : appSettings // ignore: cast_nullable_to_non_nullable
              as Map<String, dynamic>,
      favoriteChats: null == favoriteChats
          ? _value._favoriteChats
          : favoriteChats // ignore: cast_nullable_to_non_nullable
              as List<String>,
      createdAt: freezed == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      lastLoginAt: freezed == lastLoginAt
          ? _value.lastLoginAt
          : lastLoginAt // ignore: cast_nullable_to_non_nullable
              as DateTime?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$UserImpl with DiagnosticableTreeMixin implements _User {
  const _$UserImpl(
      {required this.id,
      required this.email,
      required this.displayName,
      this.photoUrl,
      @TimestampConverter() this.dateOfBirth,
      this.gender,
      this.height,
      this.weight,
      this.isOnboarded = false,
      this.dailyWaterGoalMl = 2000,
      this.dailyStepsGoal = 10000,
      this.dailySleepHoursGoal = 7,
      final Map<String, dynamic> healthPreferences = const {},
      final Map<String, dynamic> appSettings = const {},
      final List<String> favoriteChats = const [],
      @TimestampConverter() this.createdAt,
      @TimestampConverter() this.lastLoginAt})
      : _healthPreferences = healthPreferences,
        _appSettings = appSettings,
        _favoriteChats = favoriteChats;

  factory _$UserImpl.fromJson(Map<String, dynamic> json) =>
      _$$UserImplFromJson(json);

  @override
  final String id;
  @override
  final String email;
  @override
  final String displayName;
  @override
  final String? photoUrl;
  @override
  @TimestampConverter()
  final DateTime? dateOfBirth;
  @override
  final String? gender;
  @override
  final double? height;
  @override
  final double? weight;
  @override
  @JsonKey()
  final bool isOnboarded;
  @override
  @JsonKey()
  final int dailyWaterGoalMl;
  @override
  @JsonKey()
  final int dailyStepsGoal;
  @override
  @JsonKey()
  final int dailySleepHoursGoal;
  final Map<String, dynamic> _healthPreferences;
  @override
  @JsonKey()
  Map<String, dynamic> get healthPreferences {
    if (_healthPreferences is EqualUnmodifiableMapView)
      return _healthPreferences;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableMapView(_healthPreferences);
  }

  final Map<String, dynamic> _appSettings;
  @override
  @JsonKey()
  Map<String, dynamic> get appSettings {
    if (_appSettings is EqualUnmodifiableMapView) return _appSettings;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableMapView(_appSettings);
  }

  final List<String> _favoriteChats;
  @override
  @JsonKey()
  List<String> get favoriteChats {
    if (_favoriteChats is EqualUnmodifiableListView) return _favoriteChats;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_favoriteChats);
  }

  @override
  @TimestampConverter()
  final DateTime? createdAt;
  @override
  @TimestampConverter()
  final DateTime? lastLoginAt;

  @override
  String toString({DiagnosticLevel minLevel = DiagnosticLevel.info}) {
    return 'User(id: $id, email: $email, displayName: $displayName, photoUrl: $photoUrl, dateOfBirth: $dateOfBirth, gender: $gender, height: $height, weight: $weight, isOnboarded: $isOnboarded, dailyWaterGoalMl: $dailyWaterGoalMl, dailyStepsGoal: $dailyStepsGoal, dailySleepHoursGoal: $dailySleepHoursGoal, healthPreferences: $healthPreferences, appSettings: $appSettings, favoriteChats: $favoriteChats, createdAt: $createdAt, lastLoginAt: $lastLoginAt)';
  }

  @override
  void debugFillProperties(DiagnosticPropertiesBuilder properties) {
    super.debugFillProperties(properties);
    properties
      ..add(DiagnosticsProperty('type', 'User'))
      ..add(DiagnosticsProperty('id', id))
      ..add(DiagnosticsProperty('email', email))
      ..add(DiagnosticsProperty('displayName', displayName))
      ..add(DiagnosticsProperty('photoUrl', photoUrl))
      ..add(DiagnosticsProperty('dateOfBirth', dateOfBirth))
      ..add(DiagnosticsProperty('gender', gender))
      ..add(DiagnosticsProperty('height', height))
      ..add(DiagnosticsProperty('weight', weight))
      ..add(DiagnosticsProperty('isOnboarded', isOnboarded))
      ..add(DiagnosticsProperty('dailyWaterGoalMl', dailyWaterGoalMl))
      ..add(DiagnosticsProperty('dailyStepsGoal', dailyStepsGoal))
      ..add(DiagnosticsProperty('dailySleepHoursGoal', dailySleepHoursGoal))
      ..add(DiagnosticsProperty('healthPreferences', healthPreferences))
      ..add(DiagnosticsProperty('appSettings', appSettings))
      ..add(DiagnosticsProperty('favoriteChats', favoriteChats))
      ..add(DiagnosticsProperty('createdAt', createdAt))
      ..add(DiagnosticsProperty('lastLoginAt', lastLoginAt));
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$UserImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.email, email) || other.email == email) &&
            (identical(other.displayName, displayName) ||
                other.displayName == displayName) &&
            (identical(other.photoUrl, photoUrl) ||
                other.photoUrl == photoUrl) &&
            (identical(other.dateOfBirth, dateOfBirth) ||
                other.dateOfBirth == dateOfBirth) &&
            (identical(other.gender, gender) || other.gender == gender) &&
            (identical(other.height, height) || other.height == height) &&
            (identical(other.weight, weight) || other.weight == weight) &&
            (identical(other.isOnboarded, isOnboarded) ||
                other.isOnboarded == isOnboarded) &&
            (identical(other.dailyWaterGoalMl, dailyWaterGoalMl) ||
                other.dailyWaterGoalMl == dailyWaterGoalMl) &&
            (identical(other.dailyStepsGoal, dailyStepsGoal) ||
                other.dailyStepsGoal == dailyStepsGoal) &&
            (identical(other.dailySleepHoursGoal, dailySleepHoursGoal) ||
                other.dailySleepHoursGoal == dailySleepHoursGoal) &&
            const DeepCollectionEquality()
                .equals(other._healthPreferences, _healthPreferences) &&
            const DeepCollectionEquality()
                .equals(other._appSettings, _appSettings) &&
            const DeepCollectionEquality()
                .equals(other._favoriteChats, _favoriteChats) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.lastLoginAt, lastLoginAt) ||
                other.lastLoginAt == lastLoginAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      id,
      email,
      displayName,
      photoUrl,
      dateOfBirth,
      gender,
      height,
      weight,
      isOnboarded,
      dailyWaterGoalMl,
      dailyStepsGoal,
      dailySleepHoursGoal,
      const DeepCollectionEquality().hash(_healthPreferences),
      const DeepCollectionEquality().hash(_appSettings),
      const DeepCollectionEquality().hash(_favoriteChats),
      createdAt,
      lastLoginAt);

  /// Create a copy of User
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$UserImplCopyWith<_$UserImpl> get copyWith =>
      __$$UserImplCopyWithImpl<_$UserImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$UserImplToJson(
      this,
    );
  }
}

abstract class _User implements User {
  const factory _User(
      {required final String id,
      required final String email,
      required final String displayName,
      final String? photoUrl,
      @TimestampConverter() final DateTime? dateOfBirth,
      final String? gender,
      final double? height,
      final double? weight,
      final bool isOnboarded,
      final int dailyWaterGoalMl,
      final int dailyStepsGoal,
      final int dailySleepHoursGoal,
      final Map<String, dynamic> healthPreferences,
      final Map<String, dynamic> appSettings,
      final List<String> favoriteChats,
      @TimestampConverter() final DateTime? createdAt,
      @TimestampConverter() final DateTime? lastLoginAt}) = _$UserImpl;

  factory _User.fromJson(Map<String, dynamic> json) = _$UserImpl.fromJson;

  @override
  String get id;
  @override
  String get email;
  @override
  String get displayName;
  @override
  String? get photoUrl;
  @override
  @TimestampConverter()
  DateTime? get dateOfBirth;
  @override
  String? get gender;
  @override
  double? get height;
  @override
  double? get weight;
  @override
  bool get isOnboarded;
  @override
  int get dailyWaterGoalMl;
  @override
  int get dailyStepsGoal;
  @override
  int get dailySleepHoursGoal;
  @override
  Map<String, dynamic> get healthPreferences;
  @override
  Map<String, dynamic> get appSettings;
  @override
  List<String> get favoriteChats;
  @override
  @TimestampConverter()
  DateTime? get createdAt;
  @override
  @TimestampConverter()
  DateTime? get lastLoginAt;

  /// Create a copy of User
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$UserImplCopyWith<_$UserImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
