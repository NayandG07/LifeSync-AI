import 'package:flutter/material.dart';
import 'package:flex_color_scheme/flex_color_scheme.dart';
import 'package:google_fonts/google_fonts.dart';

/// App theme configuration
class AppTheme {
  /// Light theme
  static ThemeData get lightTheme {
    return FlexThemeData.light(
      scheme: FlexScheme.blue,
      surfaceMode: FlexSurfaceMode.levelSurfacesLowScaffold,
      blendLevel: 9,
      subThemesData: const FlexSubThemesData(
        blendOnLevel: 10,
        blendOnColors: false,
        inputDecoratorRadius: 12.0,
        inputDecoratorBorderWidth: 1.5,
        inputDecoratorFocusedBorderWidth: 2.0,
        cardRadius: 16.0,
        bottomNavigationBarElevation: 2.0,
        navigationBarLabelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
        navigationBarSelectedLabelSize: 14.0,
        navigationBarUnselectedLabelSize: 12.0,
        navigationBarSelectedIconSize: 24.0,
        navigationBarUnselectedIconSize: 24.0,
        navigationBarIndicatorRadius: 12.0,
        navigationBarIndicatorOpacity: 0.2,
        navigationBarMutedUnselectedLabel: false,
        navigationBarMutedUnselectedIcon: false,
        appBarCenterTitle: true,
        dialogRadius: 20.0,
        tooltipRadius: 8.0,
        chipRadius: 20.0,
        tooltipSchemeColor: SchemeColor.inverseSurface,
        snackBarRadius: 8.0,
        popupMenuRadius: 8.0,
        menuRadius: 12.0,
        tabBarItemSchemeColor: SchemeColor.primary,
        tabBarUnselectedItemSchemeColor: SchemeColor.onSurfaceVariant,
        bottomNavigationBarSelectedLabelSchemeColor: SchemeColor.primary,
        bottomNavigationBarSelectedIconSchemeColor: SchemeColor.primary,
        elevatedButtonSchemeColor: SchemeColor.primary,
        textButtonSchemeColor: SchemeColor.primary,
        chipSchemeColor: SchemeColor.primary,
        outlinedButtonOutlineSchemeColor: SchemeColor.primary,
        checkboxSchemeColor: SchemeColor.primary,
        switchSchemeColor: SchemeColor.primary,
        radioSchemeColor: SchemeColor.primary,
        unselectedToggleIsColored: true,
      ),
      keyColors: const FlexKeyColors(
        useSecondary: true,
        useTertiary: true,
      ),
      tones: FlexTones.vivid(Brightness.light),
      visualDensity: FlexColorScheme.comfortablePlatformDensity,
      useMaterial3: true,
      fontFamily: GoogleFonts.nunito().fontFamily,
    ).copyWith(
      textTheme: GoogleFonts.nunitoTextTheme().copyWith(
        displayLarge: GoogleFonts.nunito(
          fontSize: 32,
          fontWeight: FontWeight.bold,
          letterSpacing: -1.5,
        ),
        displayMedium: GoogleFonts.nunito(
          fontSize: 28,
          fontWeight: FontWeight.bold,
          letterSpacing: -0.5,
        ),
        displaySmall: GoogleFonts.nunito(
          fontSize: 24,
          fontWeight: FontWeight.bold,
        ),
        headlineMedium: GoogleFonts.nunito(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.25,
        ),
        headlineSmall: GoogleFonts.nunito(
          fontSize: 18,
          fontWeight: FontWeight.w600,
        ),
        titleLarge: GoogleFonts.nunito(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.15,
        ),
        titleMedium: GoogleFonts.nunito(
          fontSize: 14,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.15,
        ),
        titleSmall: GoogleFonts.nunito(
          fontSize: 12,
          fontWeight: FontWeight.w500,
          letterSpacing: 0.1,
        ),
        bodyLarge: GoogleFonts.nunito(
          fontSize: 16,
          fontWeight: FontWeight.w400,
          letterSpacing: 0.5,
        ),
        bodyMedium: GoogleFonts.nunito(
          fontSize: 14,
          fontWeight: FontWeight.w400,
          letterSpacing: 0.25,
        ),
        bodySmall: GoogleFonts.nunito(
          fontSize: 12,
          fontWeight: FontWeight.w400,
          letterSpacing: 0.4,
        ),
        labelLarge: GoogleFonts.nunito(
          fontSize: 14,
          fontWeight: FontWeight.w600,
          letterSpacing: 1.25,
        ),
      ),
    );
  }

  /// Dark theme
  static ThemeData get darkTheme {
    // Create a FlexColorScheme based dark theme with improved contrast
    return FlexThemeData.dark(
      scheme: FlexScheme.blue,
      surfaceMode: FlexSurfaceMode.highScaffoldLowSurface,
      blendLevel: 20, // Increased for better distinction between surfaces
      subThemesData: const FlexSubThemesData(
        blendOnLevel: 25, // Increased for better contrast
        inputDecoratorRadius: 12.0,
        inputDecoratorBorderWidth: 1.5,
        inputDecoratorFocusedBorderWidth: 2.0,
        cardRadius: 16.0,
        bottomNavigationBarElevation: 2.0,
        navigationBarLabelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
        navigationBarSelectedLabelSize: 14.0,
        navigationBarUnselectedLabelSize: 12.0,
        navigationBarSelectedIconSize: 24.0,
        navigationBarUnselectedIconSize: 24.0,
        navigationBarIndicatorRadius: 12.0,
        navigationBarIndicatorOpacity: 0.35, // Increased for better visibility
        navigationBarMutedUnselectedLabel: false,
        navigationBarMutedUnselectedIcon: false,
        appBarCenterTitle: true,
        dialogRadius: 20.0,
        tooltipRadius: 8.0,
        chipRadius: 20.0,
        tooltipSchemeColor: SchemeColor.inverseSurface,
        snackBarRadius: 8.0,
        popupMenuRadius: 8.0,
        menuRadius: 12.0,
        tabBarItemSchemeColor: SchemeColor.primary,
        tabBarUnselectedItemSchemeColor: SchemeColor.onSurfaceVariant,
        bottomNavigationBarSelectedLabelSchemeColor: SchemeColor.primary,
        bottomNavigationBarSelectedIconSchemeColor: SchemeColor.primary,
        elevatedButtonSchemeColor: SchemeColor.primary,
        textButtonSchemeColor: SchemeColor.primary,
        chipSchemeColor: SchemeColor.primary,
        outlinedButtonOutlineSchemeColor: SchemeColor.primary,
        checkboxSchemeColor: SchemeColor.primary,
        switchSchemeColor: SchemeColor.primary,
        radioSchemeColor: SchemeColor.primary,
        unselectedToggleIsColored: true,
        sliderBaseSchemeColor: SchemeColor.primary,
        sliderIndicatorSchemeColor: SchemeColor.primary,
      ),
      keyColors: const FlexKeyColors(
        useSecondary: true,
        useTertiary: true,
      ),
      tones: FlexTones.vivid(Brightness.dark), // Vivid tones for better contrast
      visualDensity: FlexColorScheme.comfortablePlatformDensity,
      useMaterial3: true,
      fontFamily: GoogleFonts.nunito().fontFamily,
    ).copyWith(
      // Additional improvements directly to the ThemeData
      colorScheme: ColorScheme.fromSeed(
        seedColor: Colors.blue,
        brightness: Brightness.dark,
        // Improved contrast by making surface colors darker
        surface: const Color(0xFF1E1E1E),
        background: const Color(0xFF121212),
        // Brighter primary and secondary colors for better visibility
        primary: const Color(0xFF2196F3),
        secondary: const Color(0xFF03DAC6),
      ),
      textTheme: GoogleFonts.nunitoTextTheme(ThemeData.dark().textTheme).copyWith(
        displayLarge: GoogleFonts.nunito(
          fontSize: 32,
          fontWeight: FontWeight.bold,
          letterSpacing: -1.5,
          color: Colors.white,
        ),
        displayMedium: GoogleFonts.nunito(
          fontSize: 28,
          fontWeight: FontWeight.bold,
          letterSpacing: -0.5,
          color: Colors.white,
        ),
        displaySmall: GoogleFonts.nunito(
          fontSize: 24,
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
        headlineMedium: GoogleFonts.nunito(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.25,
          color: Colors.white,
        ),
        headlineSmall: GoogleFonts.nunito(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: Colors.white,
        ),
        titleLarge: GoogleFonts.nunito(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.15,
          color: Colors.white,
        ),
        titleMedium: GoogleFonts.nunito(
          fontSize: 14,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.15,
          color: Colors.white,
        ),
        titleSmall: GoogleFonts.nunito(
          fontSize: 12,
          fontWeight: FontWeight.w500,
          letterSpacing: 0.1,
          color: Colors.white.withOpacity(0.87),
        ),
        bodyLarge: GoogleFonts.nunito(
          fontSize: 16,
          fontWeight: FontWeight.w400,
          letterSpacing: 0.5,
          color: Colors.white.withOpacity(0.87),
        ),
        bodyMedium: GoogleFonts.nunito(
          fontSize: 14,
          fontWeight: FontWeight.w400,
          letterSpacing: 0.25,
          color: Colors.white.withOpacity(0.87),
        ),
        bodySmall: GoogleFonts.nunito(
          fontSize: 12,
          fontWeight: FontWeight.w400,
          letterSpacing: 0.4,
          color: Colors.white.withOpacity(0.75),
        ),
        labelLarge: GoogleFonts.nunito(
          fontSize: 14,
          fontWeight: FontWeight.w600,
          letterSpacing: 1.25,
          color: Colors.white,
        ),
      ),
      // Improve card appearance in dark mode
      cardTheme: const CardTheme(
        elevation: 4.0, // Slightly higher for better depth perception in dark mode
        shadowColor: Colors.black38,
      ),
      // Improve divider visibility in dark mode
      dividerColor: const Color(0xFF3E3E3E), // Slightly lighter than background for better visibility
    );
  }
} 