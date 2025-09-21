import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../models/user_model.dart';
import '../../services/auth_service.dart';

part 'auth_provider.g.dart';

/// Authentication state class
class AuthState {
  /// Constructor
  const AuthState({
    this.user,
    this.isLoading = false,
    this.error,
  });

  /// Currently logged in user
  final User? user;
  
  /// Loading state
  final bool isLoading;
  
  /// Error message
  final String? error;
  
  /// Whether the user is authenticated
  bool get isAuthenticated => user != null;
  
  /// Whether the user has completed onboarding
  bool get isOnboardingComplete => user?.isOnboarded ?? false;
  
  /// Create a copy with updated fields
  AuthState copyWith({
    User? user,
    bool? isLoading,
    String? error,
  }) {
    return AuthState(
      user: user ?? this.user,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

/// Provider for authentication
@Riverpod(keepAlive: true)
class Auth extends _$Auth {
  @override
  AuthState build() {
    _initializeAuthState();
    return const AuthState();
  }

  Future<void> _initializeAuthState() async {
    // Listen to auth state changes from Firebase
    final authService = ref.read(authServiceProvider);
    
    ref.listenSelf((_, __) {
      // Cancel the subscription when the provider is disposed
    });

    try {
      // First check if we have a current user
      final currentUser = await authService.getCurrentUser();
      if (currentUser != null) {
        state = AuthState(user: currentUser);
      }
      
      // Then listen to auth state changes
      authService.authStateChanges.listen((user) {
        if (user == null) {
          state = const AuthState();
        } else {
          state = AuthState(user: user);
        }
      });
    } catch (e) {
      state = AuthState(error: e.toString());
    }
  }

  /// Sign in with email and password
  Future<void> signIn(String email, String password) async {
    if (state.isLoading) return;
    
    state = state.copyWith(isLoading: true, error: null);
    
    try {
      final authService = ref.read(authServiceProvider);
      final user = await authService.signInWithEmailAndPassword(
        email,
        password,
      );
      
      state = state.copyWith(user: user, isLoading: false);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  /// Sign in with Google
  Future<void> signInWithGoogle() async {
    if (state.isLoading) return;
    
    state = state.copyWith(isLoading: true, error: null);
    
    try {
      final authService = ref.read(authServiceProvider);
      final user = await authService.signInWithGoogle();
      
      // User cancelled the sign-in flow
      if (user == null) {
        state = state.copyWith(isLoading: false);
        return;
      }
      
      state = state.copyWith(user: user, isLoading: false);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  /// Sign up with email and password
  Future<void> signUp(String email, String password, String displayName) async {
    if (state.isLoading) return;
    
    state = state.copyWith(isLoading: true, error: null);
    
    try {
      final authService = ref.read(authServiceProvider);
      final user = await authService.signUpWithEmailAndPassword(
        email,
        password,
        displayName,
      );
      
      state = state.copyWith(user: user, isLoading: false);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  /// Sign out
  Future<void> signOut() async {
    if (state.isLoading) return;
    
    state = state.copyWith(isLoading: true, error: null);
    
    try {
      final authService = ref.read(authServiceProvider);
      await authService.signOut();
      
      state = const AuthState(isLoading: false);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  /// Send password reset email
  Future<bool> forgotPassword(String email) async {
    if (state.isLoading) return false;
    
    state = state.copyWith(isLoading: true, error: null);
    
    try {
      final authService = ref.read(authServiceProvider);
      final success = await authService.sendPasswordResetEmail(email);
      
      state = state.copyWith(isLoading: false);
      return success;
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
      return false;
    }
  }

  /// Change password
  Future<bool> changePassword(String currentPassword, String newPassword) async {
    if (state.isLoading) return false;
    
    state = state.copyWith(isLoading: true, error: null);
    
    try {
      final authService = ref.read(authServiceProvider);
      final success = await authService.changePassword(currentPassword, newPassword);
      
      state = state.copyWith(isLoading: false);
      return success;
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
      return false;
    }
  }

  /// Update the user's profile
  Future<bool> updateProfile(User user) async {
    if (state.isLoading) return false;
    
    state = state.copyWith(isLoading: true, error: null);
    
    try {
      final authService = ref.read(authServiceProvider);
      final updatedUser = await authService.updateUserProfile(user);
      
      if (updatedUser != null) {
        state = state.copyWith(user: updatedUser, isLoading: false);
        return true;
      } else {
        state = state.copyWith(
          error: 'Failed to update profile',
          isLoading: false,
        );
        return false;
      }
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
      return false;
    }
  }

  /// Complete the onboarding process
  Future<void> completeOnboarding(User user) async {
    await updateProfile(user.copyWith(isOnboarded: true));
  }
  
  /// Check if the user is authenticated
  Future<bool> isAuthenticated() async {
    final authService = ref.read(authServiceProvider);
    final user = await authService.getCurrentUser();
    return user != null;
  }

  /// Check if the user has completed onboarding
  Future<bool> isOnboardingCompleted() async {
    final authService = ref.read(authServiceProvider);
    final user = await authService.getCurrentUser();
    return user?.isOnboarded ?? false;
  }
} 