// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'symptom_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$bodyRegionFilterHash() => r'7b8593730780db8aa8385abfaa874b3162efccfc';

/// Body region filter for symptoms
///
/// Copied from [BodyRegionFilter].
@ProviderFor(BodyRegionFilter)
final bodyRegionFilterProvider =
    AutoDisposeNotifierProvider<BodyRegionFilter, BodyRegion?>.internal(
  BodyRegionFilter.new,
  name: r'bodyRegionFilterProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$bodyRegionFilterHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$BodyRegionFilter = AutoDisposeNotifier<BodyRegion?>;
String _$symptomStateHash() => r'8ab9d5b4cb5111be629e5ea5d3301bdbdd41d593';

/// Provider for symptom data
///
/// Copied from [SymptomState].
@ProviderFor(SymptomState)
final symptomStateProvider =
    AutoDisposeNotifierProvider<SymptomState, List<Symptom>>.internal(
  SymptomState.new,
  name: r'symptomStateProvider',
  debugGetCreateSourceHash:
      const bool.fromEnvironment('dart.vm.product') ? null : _$symptomStateHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$SymptomState = AutoDisposeNotifier<List<Symptom>>;
String _$symptomAnalysisResultNotifierHash() =>
    r'8fdd3e8bcaf882f2ebcf52abf4ac92860a5325d9';

/// Provider for symptom analysis results
///
/// Copied from [SymptomAnalysisResultNotifier].
@ProviderFor(SymptomAnalysisResultNotifier)
final symptomAnalysisResultNotifierProvider = AutoDisposeNotifierProvider<
    SymptomAnalysisResultNotifier, AsyncValue<SymptomAnalysisResult?>>.internal(
  SymptomAnalysisResultNotifier.new,
  name: r'symptomAnalysisResultNotifierProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$symptomAnalysisResultNotifierHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$SymptomAnalysisResultNotifier
    = AutoDisposeNotifier<AsyncValue<SymptomAnalysisResult?>>;
String _$symptomHistoryHash() => r'efc936a10cc54b3b03e38af26575652a3a9e851e';

/// Provider for symptom analysis history
///
/// Copied from [SymptomHistory].
@ProviderFor(SymptomHistory)
final symptomHistoryProvider = AutoDisposeNotifierProvider<SymptomHistory,
    AsyncValue<List<String>>>.internal(
  SymptomHistory.new,
  name: r'symptomHistoryProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$symptomHistoryHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$SymptomHistory = AutoDisposeNotifier<AsyncValue<List<String>>>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
