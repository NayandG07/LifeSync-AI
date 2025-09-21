import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:intl/intl.dart';
import 'package:uuid/uuid.dart';

import '../app/constants.dart';

part 'mood_service.g.dart';

/// Provider for mood service
@riverpod
MoodService moodService(MoodServiceRef ref) {
  return MoodService(FirebaseFirestore.instance);
}

/// Mood levels
enum MoodLevel {
  /// Very negative mood
  veryNegative,
  
  /// Negative mood
  negative,
  
  /// Neutral mood
  neutral,
  
  /// Positive mood
  positive,
  
  /// Very positive mood
  veryPositive,
}

/// Data model for mood entry
class MoodEntry {
  /// Constructor
  MoodEntry({
    required this.id,
    required this.userId,
    required this.mood,
    required this.date,
    required this.timestamp,
    this.notes,
    this.tags,
  });

  /// Create a new mood entry
  factory MoodEntry.create({
    required String userId,
    required MoodLevel mood,
    required DateTime date,
    String? notes,
    List<String>? tags,
  }) {
    return MoodEntry(
      id: const Uuid().v4(),
      userId: userId,
      mood: mood,
      date: DateFormat('yyyy-MM-dd').format(date),
      timestamp: DateTime.now(),
      notes: notes,
      tags: tags,
    );
  }

  /// Create from JSON
  factory MoodEntry.fromJson(Map<String, dynamic> json) {
    return MoodEntry(
      id: json['id'] as String,
      userId: json['userId'] as String,
      mood: MoodLevel.values.firstWhere(
        (e) => e.name == json['mood'],
        orElse: () => MoodLevel.neutral,
      ),
      date: json['date'] as String,
      timestamp: (json['timestamp'] as Timestamp).toDate(),
      notes: json['notes'] as String?,
      tags: json['tags'] != null
          ? List<String>.from(json['tags'] as List)
          : null,
    );
  }

  /// Convert to JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'mood': mood.name,
      'date': date,
      'timestamp': timestamp,
      'notes': notes,
      'tags': tags,
    };
  }

  /// Mood entry ID
  final String id;

  /// User ID
  final String userId;

  /// Mood level
  final MoodLevel mood;

  /// Date in yyyy-MM-dd format
  final String date;

  /// Timestamp of when the entry was created
  final DateTime timestamp;

  /// Optional notes
  final String? notes;

  /// Optional tags
  final List<String>? tags;

  /// Create a copy with modified fields
  MoodEntry copyWith({
    String? id,
    String? userId,
    MoodLevel? mood,
    String? date,
    DateTime? timestamp,
    String? notes,
    List<String>? tags,
  }) {
    return MoodEntry(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      mood: mood ?? this.mood,
      date: date ?? this.date,
      timestamp: timestamp ?? this.timestamp,
      notes: notes ?? this.notes,
      tags: tags ?? this.tags,
    );
  }
}

/// Service for managing mood entries
class MoodService {
  /// Constructor
  MoodService(this._firestore);

  final FirebaseFirestore _firestore;

  // Get moods collection reference - using top-level collection per Firestore rules
  CollectionReference<Map<String, dynamic>> _getMoodsCollection() {
    return _firestore
        .collection(AppConstants.moodsCollection);
  }

  /// Add a new mood entry
  Future<MoodEntry> addMood(
    String userId,
    MoodLevel mood, {
    String? notes,
    List<String>? tags,
  }) async {
    try {
      final entry = MoodEntry.create(
        userId: userId,
        mood: mood,
        date: DateTime.now(),
        notes: notes,
        tags: tags,
      );
      
      // Add to moods collection
      await _getMoodsCollection()
          .doc(entry.id)
          .set(entry.toJson());
      
      print('✅ [MOOD] Entry ${entry.id} saved successfully: ${entry.mood.name} mood for user $userId');
      
      return entry;
    } catch (e) {
      print('Error adding mood entry: $e');
      throw Exception('Failed to add mood entry: $e');
    }
  }

  /// Get mood entries for a specific date
  Future<List<MoodEntry>> getMoodsForDate(String userId, DateTime date) async {
    try {
      final String dateString = DateFormat('yyyy-MM-dd').format(date);
      
      final snapshot = await _getMoodsCollection()
          .where('userId', isEqualTo: userId)
          .where('date', isEqualTo: dateString)
          .orderBy('timestamp', descending: true)
          .get();
      
      return snapshot.docs
          .map((doc) => MoodEntry.fromJson(doc.data()))
          .toList();
    } catch (e) {
      print('Error getting mood entries: $e');
      throw Exception('Failed to get mood entries: $e');
    }
  }

  /// Get mood entries for a date range
  Future<List<MoodEntry>> getMoodsForDateRange(
    String userId,
    DateTime startDate,
    DateTime endDate,
  ) async {
    try {
      final String startDateString = DateFormat('yyyy-MM-dd').format(startDate);
      final String endDateString = DateFormat('yyyy-MM-dd').format(endDate);
      
      final snapshot = await _getMoodsCollection()
          .where('userId', isEqualTo: userId)
          .where('date', isGreaterThanOrEqualTo: startDateString)
          .where('date', isLessThanOrEqualTo: endDateString)
          .orderBy('date')
          .orderBy('timestamp')
          .get();
      
      return snapshot.docs
          .map((doc) => MoodEntry.fromJson(doc.data()))
          .toList();
    } catch (e) {
      print('Error getting mood entries for date range: $e');
      throw Exception('Failed to get mood entries for date range: $e');
    }
  }

  /// Update a mood entry
  Future<void> updateMood(MoodEntry entry) async {
    try {
      await _getMoodsCollection()
          .doc(entry.id)
          .update(entry.toJson());
      
      print('✅ [MOOD] Entry ${entry.id} updated successfully to ${entry.mood.name} for user ${entry.userId}');
    } catch (e) {
      print('Error updating mood entry: $e');
      throw Exception('Failed to update mood entry: $e');
    }
  }

  /// Delete a mood entry
  Future<void> deleteMood(String entryId) async {
    try {
      await _getMoodsCollection()
          .doc(entryId)
          .delete();
      
      print('✅ [MOOD] Entry $entryId deleted successfully');
    } catch (e) {
      print('Error deleting mood entry: $e');
      throw Exception('Failed to delete mood entry: $e');
    }
  }

  /// Get the latest mood entry for a user
  Future<MoodEntry?> getLatestMood(String userId) async {
    try {
      final snapshot = await _getMoodsCollection()
          .where('userId', isEqualTo: userId)
          .orderBy('timestamp', descending: true)
          .limit(1)
          .get();
      
      if (snapshot.docs.isEmpty) {
        return null;
      }
      
      return MoodEntry.fromJson(snapshot.docs.first.data());
    } catch (e) {
      print('Error getting latest mood: $e');
      throw Exception('Failed to get latest mood: $e');
    }
  }

  /// Get mood statistics for a date range
  Future<Map<MoodLevel, int>> getMoodStats(
    String userId,
    DateTime startDate,
    DateTime endDate,
  ) async {
    try {
      final entries = await getMoodsForDateRange(userId, startDate, endDate);
      
      final stats = <MoodLevel, int>{};
      
      // Initialize counters for all mood levels
      for (final level in MoodLevel.values) {
        stats[level] = 0;
      }
      
      // Count entries for each mood level
      for (final entry in entries) {
        stats[entry.mood] = (stats[entry.mood] ?? 0) + 1;
      }
      
      return stats;
    } catch (e) {
      print('Error getting mood stats: $e');
      throw Exception('Failed to get mood stats: $e');
    }
  }
} 