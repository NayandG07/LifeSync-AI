// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'theme_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$themeModeProviderHash() => r'8a9ad5e26c1adb93e9af46bbb6990e3e6d96b97e';

/// Provider for accessing the current theme mode
///
/// Copied from [themeModeProvider].
@ProviderFor(themeModeProvider)
final themeModeProviderProvider = AutoDisposeProvider<ThemeMode>.internal(
  themeModeProvider,
  name: r'themeModeProviderProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$themeModeProviderHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef ThemeModeProviderRef = AutoDisposeProviderRef<ThemeMode>;
String _$themeModeNotifierHash() => r'0bdac2ff1fa666bf863772a347edd7d3d41aa33a';

/// Provider for the app's theme mode
///
/// Copied from [ThemeModeNotifier].
@ProviderFor(ThemeModeNotifier)
final themeModeNotifierProvider =
    AutoDisposeNotifierProvider<ThemeModeNotifier, ThemeMode>.internal(
  ThemeModeNotifier.new,
  name: r'themeModeNotifierProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$themeModeNotifierHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

typedef _$ThemeModeNotifier = AutoDisposeNotifier<ThemeMode>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
