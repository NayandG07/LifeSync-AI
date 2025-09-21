import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../models/user_model.dart';
import '../services/auth_service.dart';

part 'auth_provider.g.dart';

/// Authentication state
class AuthState {
  /// Constructor
  const AuthState({
    this.user,
    this.isLoading = false,
    this.error,
  });

  /// User data
  final User? user;
  
  /// Loading state
  final bool isLoading;
  
  /// Error message
  final String? error;
  
  /// Whether the user is logged in
  bool get isLoggedIn => user != null && user!.id.isNotEmpty;
  
  /// Whether the user has completed onboarding
  bool get isOnboarded => user?.isOnboarded ?? false;

  /// Create a copy of the auth state with updated fields
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

/// Provider that watches the auth state
@riverpod
Stream<AuthState> authState(AuthStateRef ref) {
  final authService = ref.watch(authServiceProvider);
  
  return authService.authStateChanges.map((user) {
    if (user == null) {
      return const AuthState();
    } else {
      return AuthState(user: user);
    }
  });
}

/// Provider that handles authentication operations
@riverpod
class Auth extends _$Auth {
  @override
  AuthState build() {
    return const AuthState();
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
    } on AuthException catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
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
    } on AuthException catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
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
    } on AuthException catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  /// Send password reset email
  Future<void> forgotPassword(String email) async {
    if (state.isLoading) return;
    
    state = state.copyWith(isLoading: true, error: null);
    
    try {
      final authService = ref.read(authServiceProvider);
      await authService.sendPasswordResetEmail(email);
      
      state = state.copyWith(isLoading: false);
    } on AuthException catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  /// Update the user's profile
  Future<void> updateProfile(User user) async {
    if (state.isLoading) return;
    
    state = state.copyWith(isLoading: true, error: null);
    
    try {
      final authService = ref.read(authServiceProvider);
      final updatedUser = await authService.updateUserProfile(user);
      
      state = state.copyWith(user: updatedUser, isLoading: false);
    } on AuthException catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
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