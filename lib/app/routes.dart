import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

import 'constants.dart';
import '../providers/auth/auth_provider.dart';
import '../screens/auth/login_screen.dart';
import '../screens/auth/signup_screen.dart';
import '../screens/auth/profile_setup_screen.dart';
import '../screens/dashboard/dashboard_screen.dart';
import '../screens/water/water_tracking_screen.dart';
import '../screens/water/water_history_screen.dart';
import '../screens/medications/medications_screen.dart';
import '../screens/medications/medication_detail_screen.dart';
import '../screens/medications/add_medication_screen.dart';
import '../screens/chat/chat_screen.dart';
import '../screens/chat/chat_history_screen.dart';
import '../screens/chat/chat_demo.dart';
import '../screens/symptoms/symptoms_screen.dart';
import '../screens/symptoms/symptom_detail_screen.dart';
import '../screens/symptoms/symptom_analysis_screen.dart';
import '../screens/settings/settings_screen.dart';
import '../screens/settings/account_settings_screen.dart';
import '../screens/settings/change_password_screen.dart';
import '../screens/health/health_connect_screen.dart';

/// Fallback error screen when route is not found
class RouteNotFoundScreen extends StatelessWidget {
  /// Constructor with path parameter
  const RouteNotFoundScreen({required this.path, super.key});
  
  /// The path that was not found
  final String path;
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Page Not Found'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.error_outline,
              size: 64.0,
              color: Colors.red,
            ),
            const SizedBox(height: 16.0),
            const Text(
              'Page Not Found',
              style: TextStyle(
                fontSize: 24.0,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8.0),
            Text(
              'No route found for: $path',
              style: const TextStyle(
                fontSize: 16.0,
              ),
            ),
            const SizedBox(height: 24.0),
            ElevatedButton(
              onPressed: () => context.go('/dashboard'),
              child: const Text('Go to Dashboard'),
            ),
          ],
        ),
      ),
    );
  }
}

/// App routes configuration
final routerProvider = Provider<GoRouter>((ref) {
  // Access the authentication state
  print('Initializing routerProvider');
  final authState = ref.watch(authProvider);
  print('Auth state in routerProvider - isAuthenticated: ${authState.isAuthenticated}, isOnboardingComplete: ${authState.isOnboardingComplete}');
  
  return GoRouter(
    initialLocation: authState.isAuthenticated ? '/dashboard' : '/login',
    redirect: (context, state) async {
      print('Router redirect - path: ${state.uri.path}');
      final authNotifier = ref.read(authProvider.notifier);
      
      // Always check authentication state
      print('Checking authentication state...');
      final isAuthenticated = await authNotifier.isAuthenticated();
      print('isAuthenticated: $isAuthenticated');
      
      final isOnboardingCompleted = await authNotifier.isOnboardingCompleted();
      print('isOnboardingCompleted: $isOnboardingCompleted');
      
      final isOnboardingRoute = 
          state.uri.path == '/onboarding' || 
          state.uri.path.startsWith('/onboarding/');
      
      final isAuthRoute = 
          state.uri.path == '/login' || 
          state.uri.path == '/signup' || 
          state.uri.path == '/forgot-password';
      
      print('Current path: ${state.uri.path}, isAuthRoute: $isAuthRoute, isOnboardingRoute: $isOnboardingRoute');
      
      // If not authenticated and not at auth or onboarding, go to login
      if (!isAuthenticated && !isAuthRoute && !isOnboardingRoute) {
        print('Not authenticated and not on auth route - redirecting to /login');
        return '/login';
      }
      
      // If authenticated but onboarding not complete, go to onboarding
      if (isAuthenticated && !isOnboardingCompleted && !isOnboardingRoute) {
        print('Authenticated but onboarding not complete - redirecting to /onboarding');
        return '/onboarding';
      }
      
      // If authenticated and at login, go to home
      if (isAuthenticated && isAuthRoute) {
        print('Authenticated and on auth route - redirecting to /');
        return '/';
      }
      
      // Let the app proceed normally
      print('No redirection needed, continuing to ${state.uri.path}');
      return null;
    },
    routes: [
      // Auth routes
      GoRoute(
        path: '/login',
        name: 'login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/signup',
        name: 'signup',
        builder: (context, state) => const SignupScreen(),
      ),
      GoRoute(
        path: '/profile-setup',
        name: 'profile-setup',
        builder: (context, state) => const ProfileSetupScreen(),
      ),
      
      // Onboarding route
      GoRoute(
        path: '/onboarding',
        name: 'onboarding',
        builder: (context, state) => const ProfileSetupScreen(),
      ),
      
      // Dashboard route
      GoRoute(
        path: '/dashboard',
        name: 'dashboard',
        builder: (context, state) => const DashboardScreen(),
      ),
      
      // Home route (root)
      GoRoute(
        path: '/',
        name: 'home',
        builder: (context, state) => const DashboardScreen(),
      ),
      
      // Water tracking routes
      GoRoute(
        path: '/water',
        name: 'water',
        builder: (context, state) => const WaterTrackingScreen(),
      ),
      GoRoute(
        path: '/water-history',
        name: 'water-history',
        builder: (context, state) => const WaterHistoryScreen(),
      ),
      
      // Medication routes
      GoRoute(
        path: '/medications',
        name: 'medications',
        builder: (context, state) => const MedicationsScreen(),
      ),
      GoRoute(
        path: '/medication/:id',
        name: 'medication-detail',
        builder: (context, state) => MedicationDetailScreen(
          medicationId: state.pathParameters['id'] ?? '',
        ),
      ),
      GoRoute(
        path: '/add-medication',
        name: 'add-medication',
        builder: (context, state) => const AddMedicationScreen(),
      ),
      
      // Chat routes
      GoRoute(
        path: '/chat',
        name: 'chat',
        builder: (context, state) => const ChatScreen(),
      ),
      GoRoute(
        path: '/chat-history',
        name: 'chat-history',
        builder: (context, state) => const ChatHistoryScreen(),
      ),
      GoRoute(
        path: '/chat-demo',
        name: 'chat-demo',
        builder: (context, state) => const ChatDemo(),
      ),
      
      // Symptom routes
      GoRoute(
        path: '/symptoms',
        name: 'symptoms',
        builder: (context, state) => const SymptomsScreen(),
      ),
      GoRoute(
        path: '/symptom/:id',
        name: 'symptom-detail',
        builder: (context, state) => SymptomDetailScreen(
          symptomId: state.pathParameters['id'] ?? '',
        ),
      ),
      GoRoute(
        path: '/symptom-analysis/:id',
        name: 'symptom-analysis',
        builder: (context, state) => SymptomAnalysisScreen(
          analysisId: state.pathParameters['id'] ?? 'latest',
        ),
      ),
      
      // Settings routes
      GoRoute(
        path: '/settings',
        name: 'settings',
        builder: (context, state) => const SettingsScreen(),
      ),
      GoRoute(
        path: '/account-settings',
        name: 'account-settings',
        builder: (context, state) => const AccountSettingsScreen(),
      ),
      GoRoute(
        path: '/change-password',
        name: 'change-password',
        builder: (context, state) => const ChangePasswordScreen(),
      ),
      
      // Health connect route
      GoRoute(
        path: '/health-connect',
        name: 'health-connect',
        builder: (context, state) => const HealthConnectScreen(),
      ),
    ],
    debugLogDiagnostics: true,
    errorBuilder: (context, state) => RouteNotFoundScreen(path: state.uri.path),
  );
}); 