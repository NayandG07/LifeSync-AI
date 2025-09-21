import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/services.dart';

import 'app/constants.dart';
import 'app/routes.dart';
import 'app/theme/theme.dart';
import 'firebase_options.dart';
import 'providers/theme_provider.dart';

void main() async {
  // Add a top-level try-catch to capture any errors during initialization
  try {
    print('App starting...');
    
    // Ensure Flutter is initialized
    WidgetsFlutterBinding.ensureInitialized();
    print('Flutter binding initialized');
    
    // Set preferred orientations
    await SystemChrome.setPreferredOrientations([
      DeviceOrientation.portraitUp,
      DeviceOrientation.portraitDown,
    ]);
    print('Orientation set to portrait');
    
    // Initialize Firebase with better error handling
    try {
      print('Initializing Firebase...');
      
      // Check if Firebase is already initialized to avoid duplicate initialization
      if (Firebase.apps.isEmpty) {
        await Firebase.initializeApp(
          options: DefaultFirebaseOptions.currentPlatform,
        );
        print('Firebase core initialized');
        
        // Configure Firestore settings for better performance
        FirebaseFirestore.instance.settings = const Settings(
          persistenceEnabled: true,
          cacheSizeBytes: Settings.CACHE_SIZE_UNLIMITED,
        );
        print('Firestore settings configured');
      } else {
        print('Firebase already initialized, using existing app');
      }
      
      // Force refresh token to ensure authentication is valid
      final currentUser = FirebaseAuth.instance.currentUser;
      if (currentUser != null) {
        print('Current user exists: ${currentUser.uid}');
        try {
          await currentUser.getIdToken(true);
          print('Firebase user token refreshed successfully');
        } catch (tokenErr) {
          print('Error refreshing user token: $tokenErr');
        }
      } else {
        print('No current user logged in');
      }
      
      print('Firebase initialized successfully');
    } catch (e, stackTrace) {
      print('Error initializing Firebase: $e');
      print('Stack trace: $stackTrace');
      
      // Check if this is a duplicate app error, which can be safely ignored
      if (e is FirebaseException && e.code == 'duplicate-app') {
        print('Duplicate app error detected, continuing with existing Firebase instance');
      } else {
        // For other errors, show an error screen
        runApp(
          MaterialApp(
            home: Scaffold(
              body: Center(
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.error_outline, size: 50, color: Colors.red),
                      const SizedBox(height: 16),
                      const Text(
                        'Firebase Initialization Error',
                        style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 16),
                      Text('Error: $e', textAlign: TextAlign.center),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: () {
                          // Instead of calling main() again, just restart the app
                          SystemNavigator.pop();
                        },
                        child: const Text('Restart App'),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
        return; // Exit main() function
      }
    }
    
    print('Starting app with ProviderScope...');
    
    // Run the app with error handling and provider logging
    runApp(
      ProviderScope(
        observers: [ProviderLogger()], // Optional: adds logging for providers
        child: const MyApp(),
      ),
    );
    
    print('App launched successfully');
  } catch (e, stackTrace) {
    print('Fatal error during app initialization: $e');
    print('Stack trace: $stackTrace');
    
    // Show a simple error UI
    runApp(
      MaterialApp(
        home: Scaffold(
          body: Center(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.error_outline, size: 50, color: Colors.red),
                  const SizedBox(height: 16),
                  const Text(
                    'App Initialization Error',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 16),
                  Text('Error: $e', textAlign: TextAlign.center),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () {
                      // Instead of calling main() again, just restart the app
                      SystemNavigator.pop();
                    },
                    child: const Text('Restart App'),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Provider logger for debugging (optional)
class ProviderLogger extends ProviderObserver {
  @override
  void didUpdateProvider(
    ProviderBase provider,
    Object? previousValue,
    Object? newValue,
    ProviderContainer container,
  ) {
    print(
      '''
{
  "provider": "${provider.name ?? provider.runtimeType}",
  "newValue": "$newValue"
}''',
    );
  }
}

/// Main application widget
class MyApp extends ConsumerWidget {
  /// Default constructor
  const MyApp({super.key});
  
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    print('Building MyApp widget');
    try {
      final router = ref.watch(routerProvider);
      final themeMode = ref.watch(themeModeNotifierProvider);
      
      print('Initializing MaterialApp.router');
      return MaterialApp.router(
        title: AppConstants.appName,
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        themeMode: themeMode,
        debugShowCheckedModeBanner: false,
        routerConfig: router,
      );
    } catch (e, stackTrace) {
      print('Error in MyApp.build: $e');
      print('Stack trace: $stackTrace');
      
      // Return a simple error UI
      return MaterialApp(
        home: Scaffold(
          body: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.error_outline, size: 50, color: Colors.red),
                const SizedBox(height: 16),
                const Text(
                  'App Loading Error',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 16),
                Text('Error: $e', textAlign: TextAlign.center),
              ],
            ),
          ),
        ),
      );
    }
  }
}
