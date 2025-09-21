// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'health_tips_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$currentHealthTipHash() => r'0177ec316c38bb5e180367996e51f91a0cdadbd7';

/// Provider for the current health tip that automatically refreshes
///
/// Copied from [currentHealthTip].
@ProviderFor(currentHealthTip)
final currentHealthTipProvider = AutoDisposeProvider<HealthTip>.internal(
  currentHealthTip,
  name: r'currentHealthTipProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$currentHealthTipHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef CurrentHealthTipRef = AutoDisposeProviderRef<HealthTip>;
String _$healthTipsProviderHash() =>
    r'fa7aa5f0d291fc80f213b3ee1ffa2025db7b1328';

/// Provider for health tips
///
/// Copied from [HealthTipsProvider].
@ProviderFor(HealthTipsProvider)
final healthTipsProviderProvider =
    AutoDisposeNotifierProvider<HealthTipsProvider, HealthTipsState>.internal(
  HealthTipsProvider.new,
  name: r'healthTipsProviderProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$healthTipsProviderHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$HealthTipsProvider = AutoDisposeNotifier<HealthTipsState>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
