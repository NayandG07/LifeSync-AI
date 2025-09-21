import 'package:flutter/material.dart';

/// Utility class for form field validation
class InputValidators {
  /// Validates that a field is not empty
  static String? validateNotEmpty(
    String? value, {
    String fieldName = 'Field',
    String? errorMessage,
  }) {
    if (value == null || value.trim().isEmpty) {
      return errorMessage ?? '$fieldName is required';
    }
    return null;
  }

  /// Validates email format
  static String? validateEmail(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Email is required';
    }
    
    final emailRegex = RegExp(
      r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    );
    
    if (!emailRegex.hasMatch(value)) {
      return 'Please enter a valid email address';
    }
    
    return null;
  }

  /// Validates password strength
  static String? validatePassword(
    String? value, {
    bool isLogin = false,
  }) {
    if (value == null || value.trim().isEmpty) {
      return 'Password is required';
    }
    
    // For login, we only check that the password is not empty
    if (isLogin) {
      return null;
    }
    
    if (value.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    
    return null;
  }

  /// Validates numeric input
  static String? validateNumeric(
    String? value, {
    String fieldName = 'Field',
    String? errorMessage,
    double? min,
    double? max,
  }) {
    if (value == null || value.trim().isEmpty) {
      return errorMessage ?? '$fieldName is required';
    }
    
    final number = double.tryParse(value);
    if (number == null) {
      return '$fieldName must be a number';
    }
    
    if (min != null && number < min) {
      return '$fieldName must be at least $min';
    }
    
    if (max != null && number > max) {
      return '$fieldName must be at most $max';
    }
    
    return null;
  }

  /// Validates that passwords match
  static String? validatePasswordsMatch(String? password, String? confirmPassword) {
    if (confirmPassword == null || confirmPassword.trim().isEmpty) {
      return 'Please confirm your password';
    }
    
    if (password != confirmPassword) {
      return 'Passwords do not match';
    }
    
    return null;
  }
  
  /// Validates a name
  static String? validateName(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Name is required';
    }
    
    if (value.length < 2) {
      return 'Name must be at least 2 characters long';
    }
    
    return null;
  }
  
  /// Legacy method for password confirmation
  static String? validateConfirmPassword(String? value, String password) {
    return validatePasswordsMatch(password, value);
  }
} 