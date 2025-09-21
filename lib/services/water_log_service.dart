import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:intl/intl.dart';
import 'package:uuid/uuid.dart';

import '../app/constants.dart';

part 'water_log_service.g.dart';

/// Provider for water log service
@riverpod
WaterLogService waterLogService(WaterLogServiceRef ref) {
  return WaterLogService(FirebaseFirestore.instance);
}

/// Data model for water log
class WaterLog {
  /// Constructor
  WaterLog({
    required this.id,
    required this.userId,
    required this.amount,
    required this.date,
    required this.timestamp,
    this.notes,
  });

  /// Create a new water log entry
  factory WaterLog.create({
    required String userId,
    required int amount,
    required DateTime date,
    String? notes,
  }) {
    return WaterLog(
      id: const Uuid().v4(),
      userId: userId,
      amount: amount,
      date: DateFormat('yyyy-MM-dd').format(date),
      timestamp: DateTime.now(),
      notes: notes,
    );
  }

  /// Create from JSON
  factory WaterLog.fromJson(Map<String, dynamic> json) {
    return WaterLog(
      id: json['id'] as String,
      userId: json['userId'] as String,
      amount: json['amount'] as int,
      date: json['date'] as String,
      timestamp: (json['timestamp'] as Timestamp).toDate(),
      notes: json['notes'] as String?,
    );
  }

  /// Convert to JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'amount': amount,
      'date': date,
      'timestamp': timestamp,
      'notes': notes,
    };
  }

  /// Water log ID
  final String id;

  /// User ID
  final String userId;

  /// Water amount in milliliters
  final int amount;

  /// Date in yyyy-MM-dd format
  final String date;

  /// Timestamp of when the log was created
  final DateTime timestamp;

  /// Optional notes
  final String? notes;

  /// Create a copy with modified fields
  WaterLog copyWith({
    String? id,
    String? userId,
    int? amount,
    String? date,
    DateTime? timestamp,
    String? notes,
  }) {
    return WaterLog(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      amount: amount ?? this.amount,
      date: date ?? this.date,
      timestamp: timestamp ?? this.timestamp,
      notes: notes ?? this.notes,
    );
  }
}

/// Service for managing water log entries
class WaterLogService {
  /// Constructor
  WaterLogService(this._firestore);

  final FirebaseFirestore _firestore;

  // Get water logs collection reference - using top-level collection per Firestore rules
  CollectionReference<Map<String, dynamic>> _getWaterLogsCollection() {
    return _firestore
        .collection(AppConstants.waterLogsCollection);
  }

  /// Add a new water log entry
  Future<WaterLog?> addWaterLog(String userId, int amount, {String? notes}) async {
    try {
      final log = WaterLog.create(
        userId: userId,
        amount: amount,
        date: DateTime.now(),
        notes: notes,
      );
      
      // Add to water_logs collection
      await _getWaterLogsCollection()
          .doc(log.id)
          .set(log.toJson());
      
      print('✅ [WATER] Log ${log.id} added successfully: ${log.amount}ml for user $userId');
      
      return log;
    } catch (e) {
      print('Error adding water log: $e');
      return null;
    }
  }

  /// Get water logs for a specific date
  Future<List<WaterLog>> getWaterLogsForDate(String userId, DateTime date) async {
    try {
      final String dateString = DateFormat('yyyy-MM-dd').format(date);
      
      // Simplified query that doesn't require a composite index
      final snapshot = await _getWaterLogsCollection()
          .where('userId', isEqualTo: userId)
          .where('date', isEqualTo: dateString)
          .get();
      
      // Sort the results client-side instead of using orderBy in the query
      final logs = snapshot.docs
          .map((doc) => WaterLog.fromJson(doc.data()))
          .toList();
          
      logs.sort((a, b) => b.timestamp.compareTo(a.timestamp)); // Sort by timestamp descending
      
      return logs;
    } catch (e) {
      print('Error getting water logs: $e');
      // Return empty list instead of throwing an exception
      return [];
    }
  }

  /// Get water logs for a date range
  Future<List<WaterLog>> getWaterLogsForDateRange(
    String userId,
    DateTime startDate,
    DateTime endDate,
  ) async {
    try {
      final String startDateString = DateFormat('yyyy-MM-dd').format(startDate);
      final String endDateString = DateFormat('yyyy-MM-dd').format(endDate);
      
      // Simplified query that only requires a basic index
      final snapshot = await _getWaterLogsCollection()
          .where('userId', isEqualTo: userId)
          .get();
      
      // Filter and sort the results client-side
      final logs = snapshot.docs
          .map((doc) => WaterLog.fromJson(doc.data()))
          .where((log) => log.date.compareTo(startDateString) >= 0 && 
                          log.date.compareTo(endDateString) <= 0)
          .toList();
          
      // Sort by date first, then by timestamp
      logs.sort((a, b) {
        final dateComparison = a.date.compareTo(b.date);
        if (dateComparison != 0) return dateComparison;
        return a.timestamp.compareTo(b.timestamp);
      });
      
      return logs;
    } catch (e) {
      print('Error getting water logs for date range: $e');
      // Return empty list instead of throwing an exception
      return [];
    }
  }

  /// Update a water log entry
  Future<bool> updateWaterLog(WaterLog log) async {
    try {
      await _getWaterLogsCollection()
          .doc(log.id)
          .update(log.toJson());
      
      print('✅ [WATER] Log ${log.id} updated successfully to ${log.amount}ml for user ${log.userId}');
      return true;
    } catch (e) {
      print('Error updating water log: $e');
      return false;
    }
  }

  /// Delete a water log entry
  Future<bool> deleteWaterLog(String logId) async {
    try {
      await _getWaterLogsCollection()
          .doc(logId)
          .delete();
      
      print('✅ [WATER] Log $logId deleted successfully');
      return true;
    } catch (e) {
      print('Error deleting water log: $e');
      return false;
    }
  }

  /// Get total water intake for a date
  Future<int> getTotalWaterIntakeForDate(String userId, DateTime date) async {
    try {
      final logs = await getWaterLogsForDate(userId, date);
      
      int total = 0;
      for (final log in logs) {
        total += log.amount;
      }
      return total;
    } catch (e) {
      print('Error getting total water intake: $e');
      return 0; // Return 0 instead of throwing an exception
    }
  }
} 