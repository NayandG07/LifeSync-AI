import 'package:firebase_auth/firebase_auth.dart' hide User;
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:google_sign_in/google_sign_in.dart';

import '../app/constants.dart';
import '../models/user_model.dart' as model;

part 'auth_service.g.dart';

/// Exception thrown during authentication
class AuthException implements Exception {
  /// Constructor
  AuthException(this.message);

  /// Error message
  final String message;

  @override
  String toString() => message;
}

/// Service for handling authentication operations
@riverpod
AuthService authService(AuthServiceRef ref) {
  print('Creating AuthService provider with GoogleSignIn');
  return AuthService(
    FirebaseAuth.instance,
    FirebaseFirestore.instance,
    GoogleSignIn(
      // Use the web client ID from the strings.xml file
      clientId: '647875324235-nqilp5aac16u3ug0c9hupuc5flvpv0eg.apps.googleusercontent.com',
      scopes: ['email', 'profile'],
    ),
  );
}

/// Authentication service
class AuthService {
  /// Constructor
  AuthService(this._auth, this._firestore, this._googleSignIn);

  final FirebaseAuth _auth;
  final FirebaseFirestore _firestore;
  final GoogleSignIn _googleSignIn;

  /// Stream of authentication state changes
  Stream<model.User?> get authStateChanges {
    return _auth.authStateChanges().asyncMap((firebaseUser) async {
      if (firebaseUser == null) {
        return null;
      }

      try {
        // Check for user document in Firestore
        final docSnapshot = await _firestore
            .collection(AppConstants.usersCollection)
            .doc(firebaseUser.uid)
            .get();

        if (docSnapshot.exists) {
          // If the user exists, return the user data
          try {
            return model.User.fromJson(docSnapshot.data()!);
          } catch (e) {
            print('Error parsing user data in authStateChanges: $e');
            
            // Return a basic user if there's a parsing error
            return model.User(
              id: firebaseUser.uid,
              email: firebaseUser.email ?? '',
              displayName: firebaseUser.displayName ?? '',
              photoUrl: firebaseUser.photoURL,
            );
          }
        } else {
          // Create a new user document if it doesn't exist
          final user = model.User(
            id: firebaseUser.uid,
            email: firebaseUser.email ?? '',
            displayName: firebaseUser.displayName ?? '',
            photoUrl: firebaseUser.photoURL,
            createdAt: DateTime.now(),
            lastLoginAt: DateTime.now(),
          );

          // Create the user document in Firestore
          await _firestore
              .collection(AppConstants.usersCollection)
              .doc(firebaseUser.uid)
              .set(user.toJson());

          return user;
        }
      } catch (e) {
        print('Error in authStateChanges: $e');
        // Return a basic user if there's an error accessing Firestore
        return model.User(
          id: firebaseUser.uid,
          email: firebaseUser.email ?? '',
          displayName: firebaseUser.displayName ?? '',
          photoUrl: firebaseUser.photoURL,
        );
      }
    });
  }

  /// Get the current user
  Future<model.User?> getCurrentUser() async {
    final firebaseUser = _auth.currentUser;
    if (firebaseUser == null) {
      return null;
    }

    try {
      final docSnapshot = await _firestore
          .collection(AppConstants.usersCollection)
          .doc(firebaseUser.uid)
          .get();

      if (docSnapshot.exists) {
        try {
          return model.User.fromJson(docSnapshot.data()!);
        } catch (e) {
          print('Error parsing user data in getCurrentUser: $e');
          
          // Return a basic user if there's a parsing error
          return model.User(
            id: firebaseUser.uid,
            email: firebaseUser.email ?? '',
            displayName: firebaseUser.displayName ?? '',
            photoUrl: firebaseUser.photoURL,
          );
        }
      } else {
        // If the user document doesn't exist but the Firebase user does,
        // create a new user document
        final user = model.User(
          id: firebaseUser.uid,
          email: firebaseUser.email ?? '',
          displayName: firebaseUser.displayName ?? '',
          photoUrl: firebaseUser.photoURL,
          createdAt: DateTime.now(),
          lastLoginAt: DateTime.now(),
        );

        await _firestore
            .collection(AppConstants.usersCollection)
            .doc(firebaseUser.uid)
            .set(user.toJson());

        return user;
      }
    } catch (e) {
      print('Error in getCurrentUser: $e');
      // Return a basic user if there's an error
      return model.User(
        id: firebaseUser.uid,
        email: firebaseUser.email ?? '',
        displayName: firebaseUser.displayName ?? '',
        photoUrl: firebaseUser.photoURL,
      );
    }
  }

  /// Sign in with email and password
  Future<model.User> signInWithEmailAndPassword(
    String email,
    String password,
  ) async {
    try {
      // Attempt to sign in with Firebase Auth
      final userCredential = await _auth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );

      if (userCredential.user == null) {
        throw AuthException('Login failed');
      }

      // Get user data from Firestore or create if it doesn't exist
      final user = await getCurrentUser();
      if (user == null) {
        throw AuthException('User data not found');
      }

      // Update last login time
      await _firestore
          .collection(AppConstants.usersCollection)
          .doc(userCredential.user!.uid)
          .update({'lastLoginAt': FieldValue.serverTimestamp()});
      
      print('✅ [AUTH] User ${userCredential.user!.uid} signed in successfully');

      // Save user ID to shared preferences
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(AppConstants.userIdKey, userCredential.user!.uid);

      return user;
    } on FirebaseAuthException catch (e) {
      print('FirebaseAuthException in signInWithEmailAndPassword: ${e.code}');
      throw AuthException(_mapFirebaseAuthErrorToMessage(e.code));
    } catch (e) {
      print('Exception in signInWithEmailAndPassword: $e');
      throw AuthException(e.toString());
    }
  }

  /// Sign in with Google
  Future<model.User?> signInWithGoogle() async {
    try {
      print('Starting Google Sign-In process...');
      
      // Begin interactive sign in process
      print('Calling GoogleSignIn.signIn()...');
      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
      
      if (googleUser == null) {
        // User cancelled the sign-in flow
        print('Google Sign-In cancelled by user');
        return null;
      }
      
      print('Google Sign-In successful: ${googleUser.email}');

      // Obtain the auth details from the request
      print('Getting authentication details...');
      final GoogleSignInAuthentication googleAuth = await googleUser.authentication;
      print('Got Google auth tokens - accessToken exists: ${googleAuth.accessToken != null}, idToken exists: ${googleAuth.idToken != null}');
      
      // Create a new credential
      final credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );
      print('Created Google AuthCredential');

      // Sign in to Firebase with the Google credential
      print('Signing in to Firebase with Google credential...');
      final userCredential = await _auth.signInWithCredential(credential);

      if (userCredential.user == null) {
        print('Firebase sign-in failed - userCredential.user is null');
        throw AuthException('Google sign in failed');
      }
      
      print('Firebase sign-in successful: ${userCredential.user!.uid}');

      // Get user data or create if it doesn't exist
      print('Fetching user data from Firestore...');
      final user = await getCurrentUser();
      if (user == null) {
        print('User data not found in Firestore');
        throw AuthException('User data not found');
      }
      
      print('User data retrieved: ${user.id}');

      // Update last login time
      print('Updating last login time...');
      await _firestore
          .collection(AppConstants.usersCollection)
          .doc(userCredential.user!.uid)
          .update({'lastLoginAt': FieldValue.serverTimestamp()});
      
      print('✅ [AUTH] User ${userCredential.user!.uid} signed in with Google successfully');

      // Save user ID to shared preferences
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(AppConstants.userIdKey, userCredential.user!.uid);
      print('User ID saved to SharedPreferences');

      return user;
    } on FirebaseAuthException catch (e) {
      print('FirebaseAuthException in signInWithGoogle: ${e.code}');
      print('FirebaseAuthException message: ${e.message}');
      throw AuthException(_mapFirebaseAuthErrorToMessage(e.code));
    } catch (e) {
      print('Exception in signInWithGoogle: $e');
      if (e is Exception) {
        print('Exception type: ${e.runtimeType}');
      }
      throw AuthException(e.toString());
    }
  }

  /// Sign up with email and password
  Future<model.User> signUpWithEmailAndPassword(
    String email,
    String password,
    String displayName,
  ) async {
    try {
      // Create user in Firebase Auth
      final userCredential = await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );

      if (userCredential.user == null) {
        throw AuthException('Signup failed');
      }

      // Update the user's display name
      await userCredential.user!.updateDisplayName(displayName);

      // Create the user document in Firestore
      final user = model.User(
        id: userCredential.user!.uid,
        email: email,
        displayName: displayName,
        createdAt: DateTime.now(),
        lastLoginAt: DateTime.now(),
      );

      await _firestore
          .collection(AppConstants.usersCollection)
          .doc(userCredential.user!.uid)
          .set(user.toJson());
      
      print('✅ [AUTH] User ${userCredential.user!.uid} created successfully');

      // Save user ID to shared preferences
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(AppConstants.userIdKey, userCredential.user!.uid);

      return user;
    } on FirebaseAuthException catch (e) {
      print('FirebaseAuthException in signUpWithEmailAndPassword: ${e.code}');
      throw AuthException(_mapFirebaseAuthErrorToMessage(e.code));
    } catch (e) {
      print('Exception in signUpWithEmailAndPassword: $e');
      throw AuthException(e.toString());
    }
  }

  /// Sign out
  Future<bool> signOut() async {
    try {
      // Also sign out from Google
      if (await _googleSignIn.isSignedIn()) {
        await _googleSignIn.signOut();
      }
      
      await _auth.signOut();
      // Clear user ID from shared preferences
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(AppConstants.userIdKey);
      print('✅ [AUTH] User signed out successfully');
      return true;
    } catch (e) {
      print('Exception in signOut: $e');
      return false;
    }
  }

  /// Forgot password - sends a password reset email
  Future<bool> sendPasswordResetEmail(String email) async {
    try {
      await _auth.sendPasswordResetEmail(email: email);
      print('✅ [AUTH] Password reset email sent to $email');
      return true;
    } on FirebaseAuthException catch (e) {
      print('FirebaseAuthException in sendPasswordResetEmail: ${e.code}');
      return false;
    } catch (e) {
      print('Exception in sendPasswordResetEmail: $e');
      return false;
    }
  }

  /// Change password for current user
  Future<bool> changePassword(String currentPassword, String newPassword) async {
    try {
      final user = _auth.currentUser;
      if (user == null) {
        return false;
      }
      
      // Get credentials to reauthenticate
      final email = user.email;
      if (email == null) {
        return false;
      }
      
      // Reauthenticate user before changing password
      AuthCredential credential = EmailAuthProvider.credential(
        email: email,
        password: currentPassword,
      );
      
      try {
        await user.reauthenticateWithCredential(credential);
      } on FirebaseAuthException catch (e) {
        print('Reauthentication failed: ${e.code}');
        if (e.code == 'wrong-password') {
          throw AuthException('Current password is incorrect.');
        }
        throw AuthException(_mapFirebaseAuthErrorToMessage(e.code));
      }
      
      // Change password
      await user.updatePassword(newPassword);
      print('✅ [AUTH] Password updated successfully for user ${user.uid}');
      return true;
    } on FirebaseAuthException catch (e) {
      print('FirebaseAuthException in changePassword: ${e.code}');
      throw AuthException(_mapFirebaseAuthErrorToMessage(e.code));
    } catch (e) {
      print('Exception in changePassword: $e');
      if (e is AuthException) {
        throw e;
      }
      throw AuthException(e.toString());
    }
  }

  /// Update the user's profile
  Future<model.User?> updateUserProfile(model.User user) async {
    try {
      await _firestore
          .collection(AppConstants.usersCollection)
          .doc(user.id)
          .update(user.toJson());

      // Update Firebase Auth display name if it changed
      if (_auth.currentUser != null &&
          _auth.currentUser!.displayName != user.displayName) {
        await _auth.currentUser!.updateDisplayName(user.displayName);
      }
      
      print('✅ [AUTH] User ${user.id} profile updated successfully');

      return user;
    } catch (e) {
      print('Exception in updateUserProfile: $e');
      return null;
    }
  }

  /// Helper method to map Firebase Auth error codes to user-friendly messages
  String _mapFirebaseAuthErrorToMessage(String code) {
    switch (code) {
      case 'invalid-email':
        return 'Invalid email address format.';
      case 'user-not-found':
        return 'No user found with this email address.';
      case 'wrong-password':
        return 'Incorrect password.';
      case 'email-already-in-use':
        return 'This email address is already in use by another account.';
      case 'weak-password':
        return 'Password is too weak. Please use a stronger password.';
      case 'user-disabled':
        return 'This user account has been disabled.';
      case 'too-many-requests':
        return 'Too many attempts. Please try again later.';
      case 'operation-not-allowed':
        return 'This operation is not allowed.';
      case 'account-exists-with-different-credential':
        return 'An account already exists with the same email address but different sign-in credentials.';
      case 'invalid-credential':
        return 'The credential used for authentication is invalid.';
      case 'requires-recent-login':
        return 'This operation requires recent authentication. Please log in again.';
      default:
        return 'An error occurred: $code';
    }
  }
} 