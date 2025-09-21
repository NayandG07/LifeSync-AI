import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:intl/intl.dart';

import '../app/constants.dart';
import '../models/health_metric_model.dart';

part 'health_metrics_service.g.dart';

/// Provider for health metrics service
@riverpod
HealthMetricsService healthMetricsService(HealthMetricsServiceRef ref) {
  return HealthMetricsService(FirebaseFirestore.instance);
}

/// Service for handling health metrics operations
class HealthMetricsService {
  /// Constructor
  HealthMetricsService(this._firestore);

  final FirebaseFirestore _firestore;

  // Get user metrics collection reference - using top-level collection per Firestore rules
  CollectionReference<Map<String, dynamic>> _getHealthMetricsCollection() {
    return _firestore
        .collection(AppConstants.healthMetricsCollection);
  }

  /// Get metrics for a specific date
  Future<List<HealthMetric>> getMetricsForDate(String userId, DateTime date) async {
    try {
      final String dateString = DateFormat('yyyy-MM-dd').format(date);
      
      // Updated to use the top-level collection with userId field filter
      final snapshot = await _getHealthMetricsCollection()
          .where('userId', isEqualTo: userId)
          .where('date', isEqualTo: dateString)
          .get();
      
      return snapshot.docs
          .map((doc) => HealthMetric.fromJson(doc.data()))
          .toList();
    } catch (e) {
      print('Error getting metrics: $e');
      throw Exception('Failed to get metrics: $e');
    }
  }

  /// Get metrics for a date range
  Future<List<HealthMetric>> getMetricsForDateRange(
    String userId,
    DateTime startDate,
    DateTime endDate,
  ) async {
    try {
      final String startDateString = DateFormat('yyyy-MM-dd').format(startDate);
      final String endDateString = DateFormat('yyyy-MM-dd').format(endDate);
      
      // Updated to use the top-level collection with userId field filter
      final snapshot = await _getHealthMetricsCollection()
          .where('userId', isEqualTo: userId)
          .where('date', isGreaterThanOrEqualTo: startDateString)
          .where('date', isLessThanOrEqualTo: endDateString)
          .get();
      
      return snapshot.docs
          .map((doc) => HealthMetric.fromJson(doc.data()))
          .toList();
    } catch (e) {
      print('Error getting metrics: $e');
      throw Exception('Failed to get metrics: $e');
    }
  }

  /// Add or update a health metric
  Future<void> addOrUpdateMetric(String userId, HealthMetric metric) async {
    try {
      // Ensure the userId is set on the metric
      final metricWithUserId = metric.copyWith(userId: userId);
      
      // Use the top-level collection
      final docRef = _getHealthMetricsCollection().doc(metric.id);
      await docRef.set(metricWithUserId.toJson());
      
      print('✅ [HEALTH] Metric ${metric.id} of type ${metric.type.name} saved successfully for user $userId');
    } catch (e) {
      print('Error adding metric: $e');
      throw Exception('Failed to add metric: $e');
    }
  }

  /// Delete a health metric
  Future<void> deleteMetric(String userId, String metricId) async {
    try {
      // Use the top-level collection
      await _getHealthMetricsCollection().doc(metricId).delete();
      
      print('✅ [HEALTH] Metric $metricId deleted successfully for user $userId');
    } catch (e) {
      print('Error deleting metric: $e');
      throw Exception('Failed to delete metric: $e');
    }
  }

  /// Get latest metrics by type
  Future<Map<String, HealthMetric>> getLatestMetricsByType(String userId) async {
    try {
      final Map<String, HealthMetric> latestMetrics = {};
      
      // Get all metric types
      for (final type in HealthMetricType.values) {
        final String typeStr = type.name;
        
        // Use the top-level collection with userId field filter
        final snapshot = await _getHealthMetricsCollection()
            .where('userId', isEqualTo: userId)
            .where('type', isEqualTo: typeStr)
            .orderBy('timestamp', descending: true)
            .limit(1)
            .get();
        
        if (snapshot.docs.isNotEmpty) {
          latestMetrics[typeStr] = HealthMetric.fromJson(snapshot.docs.first.data());
        }
      }
      
      return latestMetrics;
    } catch (e) {
      print('Error getting latest metrics: $e');
      throw Exception('Failed to get latest metrics: $e');
    }
  }
} 