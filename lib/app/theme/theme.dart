import 'package:flutter/material.dart';
import '../constants.dart';

/// LifeSync brand colors
class BrandColors {
  /// Primary blue color from logo
  static const Color primaryBlue = Color(0xFF4257DC);
  
  /// Secondary blue color 
  static const Color secondaryBlue = Color(0xFF3A4BC5);
  
  /// Light blue for backgrounds
  static const Color lightBlue = Color(0xFFE6EAFF);
  
  /// Blue accent color
  static const Color accentBlue = Color(0xFF5C70E2);
}

/// App theme configuration
class AppTheme {
  /// Light theme
  static final ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    colorScheme: ColorScheme.fromSeed(
      seedColor: BrandColors.primaryBlue,
      brightness: Brightness.light,
      primary: BrandColors.primaryBlue,
      secondary: BrandColors.secondaryBlue,
    ),
    appBarTheme: const AppBarTheme(
      elevation: 0,
      centerTitle: true,
      backgroundColor: Colors.white,
      foregroundColor: BrandColors.primaryBlue,
      titleTextStyle: TextStyle(
        color: BrandColors.primaryBlue,
        fontSize: 20,
        fontWeight: FontWeight.bold,
      ),
    ),
    cardTheme: CardTheme(
      elevation: AppConstants.cardElevation,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppConstants.defaultBorderRadius),
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: BrandColors.primaryBlue,
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(
          horizontal: AppConstants.mediumPadding,
          vertical: AppConstants.smallPadding,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppConstants.defaultBorderRadius),
        ),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(AppConstants.defaultBorderRadius),
      ),
      filled: true,
      contentPadding: const EdgeInsets.symmetric(
        horizontal: AppConstants.mediumPadding,
        vertical: AppConstants.smallPadding,
      ),
    ),
    textTheme: const TextTheme(
      displayLarge: TextStyle(
        color: BrandColors.primaryBlue,
        fontWeight: FontWeight.bold,
      ),
      displayMedium: TextStyle(
        color: BrandColors.primaryBlue,
        fontWeight: FontWeight.bold,
      ),
      displaySmall: TextStyle(
        color: BrandColors.primaryBlue,
        fontWeight: FontWeight.bold,
      ),
      headlineMedium: TextStyle(
        color: BrandColors.primaryBlue,
        fontWeight: FontWeight.bold,
      ),
    ),
  );

  /// Dark theme
  static final ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    colorScheme: ColorScheme.fromSeed(
      seedColor: BrandColors.primaryBlue,
      brightness: Brightness.dark,
      primary: BrandColors.primaryBlue,
      secondary: BrandColors.secondaryBlue,
    ),
    appBarTheme: const AppBarTheme(
      elevation: 0,
      centerTitle: true,
      titleTextStyle: TextStyle(
        color: BrandColors.primaryBlue,
        fontSize: 20,
        fontWeight: FontWeight.bold,
      ),
    ),
    cardTheme: CardTheme(
      elevation: AppConstants.cardElevation,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppConstants.defaultBorderRadius),
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: BrandColors.primaryBlue,
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(
          horizontal: AppConstants.mediumPadding,
          vertical: AppConstants.smallPadding,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppConstants.defaultBorderRadius),
        ),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(AppConstants.defaultBorderRadius),
      ),
      filled: true,
      contentPadding: const EdgeInsets.symmetric(
        horizontal: AppConstants.mediumPadding,
        vertical: AppConstants.smallPadding,
      ),
    ),
  );
} 