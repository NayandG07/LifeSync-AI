/// App-wide constants
class AppConstants {
  /// App name
  static const String appName = 'LifeSync AI';
  
  /// Asset paths
  static const String logoPath = 'assets/images/logo.png';
  static const String backgroundPath = 'assets/images/background.png';
  static const String loadingAnimationPath = 'assets/animations/loading.json';
  
  /// Animation durations
  static const Duration shortAnimationDuration = Duration(milliseconds: 150);
  static const Duration mediumAnimationDuration = Duration(milliseconds: 300);
  static const Duration longAnimationDuration = Duration(milliseconds: 500);
  
  /// API endpoints and keys
  static const String baseApiUrl = 'https://generativelanguage.googleapis.com';
  static const String apiVersion = 'v1beta';
  
  // API Keys
  static const String chatbotApiKey = 'AIzaSyDf1GICpOHzL3Y9tXMl0SDgtpu0Xb27o2E';
  static const String symptomCheckerApiKey = 'AIzaSyBv6KK5I0UBOBE-UjGg5YwCAs67HrdsJ_M';
  
  // Full API URLs
  static const String chatbotApiUrl = '$baseApiUrl/$apiVersion/models/gemini-2.5-pro:generateContent?key=$chatbotApiKey';
  static const String symptomCheckerApiUrl = '$baseApiUrl/$apiVersion/models/gemini-2.0-flash:generateContent?key=$symptomCheckerApiKey';
  
  /// Firebase collections - updated to match Firestore rules
  static const String usersCollection = 'users';
  static const String messagesCollection = 'messages';
  static const String conversationsCollection = 'conversations';
  
  // Top-level collections based on Firestore rules
  static const String moodsCollection = 'moods';
  static const String symptomsCollection = 'symptoms';
  static const String healthMetricsCollection = 'health_metrics';
  static const String waterLogsCollection = 'water_logs';
  
  // Other app collections
  static const String medicationsCollection = 'medications';
  static const String remindersCollection = 'reminders';
  
  /// SharedPreferences keys
  static const String themePreferenceKey = 'theme_preference';
  static const String userIdKey = 'user_id';
  static const String authTokenKey = 'auth_token';
  static const String onboardingCompletedKey = 'onboarding_completed';
  static const String dailyWaterGoalKey = 'daily_water_goal';
  static const String currentConversationKey = 'current_conversation';
  
  /// Health metrics guidelines (based on WHO)
  static const int defaultDailyWaterIntakeGoalMl = 2000;
  static const int minDailyStepsGoal = 7000;
  static const int optimalDailyStepsGoal = 10000;
  static const int minSleepHoursGoal = 7;
  static const int maxSleepHoursGoal = 9;
  
  /// UI constants
  static const double defaultPadding = 16.0;
  static const double smallPadding = 8.0;
  static const double mediumPadding = 16.0;
  static const double largePadding = 24.0;
  static const double defaultBorderRadius = 12.0;
  static const double smallBorderRadius = 8.0;
  static const double mediumBorderRadius = 16.0;
  static const double largeBorderRadius = 16.0;
  static const double cardElevation = 2.0;
  
  /// App-wide text formats
  static const String dateFormat = 'MMM dd, yyyy';
  static const String timeFormat = 'h:mm a';
  static const String dateTimeFormat = 'MMM dd, yyyy · h:mm a';
} 