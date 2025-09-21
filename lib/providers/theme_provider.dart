import 'package:flutter/material.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../app/constants.dart';

part 'theme_provider.g.dart';

/// Provider for the app's theme mode
@riverpod
class ThemeModeNotifier extends _$ThemeModeNotifier {
  @override
  ThemeMode build() {
    _loadThemePreference();
    return ThemeMode.system;
  }

  /// Load the theme preference from shared preferences
  Future<void> _loadThemePreference() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final themeString = prefs.getString(AppConstants.themePreferenceKey);
      
      if (themeString != null) {
        if (themeString == 'light') {
          state = ThemeMode.light;
        } else if (themeString == 'dark') {
          state = ThemeMode.dark;
        } else {
          state = ThemeMode.system;
        }
      }
    } catch (e) {
      print('Failed to load theme preference: $e');
    }
  }

  /// Set the theme to light mode
  Future<void> setLightMode() async {
    state = ThemeMode.light;
    await _saveThemePreference('light');
  }

  /// Set the theme to dark mode
  Future<void> setDarkMode() async {
    state = ThemeMode.dark;
    await _saveThemePreference('dark');
  }

  /// Set the theme to follow the system theme
  Future<void> setSystemMode() async {
    state = ThemeMode.system;
    await _saveThemePreference('system');
  }

  /// Toggle between light and dark mode
  Future<void> toggleTheme() async {
    if (state == ThemeMode.light) {
      await setDarkMode();
    } else {
      await setLightMode();
    }
  }

  /// Save the theme preference to shared preferences
  Future<void> _saveThemePreference(String theme) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(AppConstants.themePreferenceKey, theme);
    } catch (e) {
      print('Failed to save theme preference: $e');
    }
  }
}

/// Provider for accessing the current theme mode
@riverpod
ThemeMode themeModeProvider(ThemeModeProviderRef ref) {
  return ref.watch(themeModeNotifierProvider);
} 