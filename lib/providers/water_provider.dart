import 'package:flutter/material.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../services/water_log_service.dart';
import '../providers/auth/auth_provider.dart';

part 'water_provider.g.dart';

/// State for water intake tracking
class WaterState {
  /// Constructor
  WaterState({
    required this.todayLogs,
    required this.totalIntake,
    required this.goalAmount,
    required this.progressPercentage,
    this.isLoading = false,
    this.error,
  });

  /// Today's water logs
  final List<WaterLog> todayLogs;
  
  /// Total water intake for today in ml
  final int totalIntake;
  
  /// Goal amount in ml
  final int goalAmount;
  
  /// Progress towards goal (0.0 to 1.0)
  final double progressPercentage;
  
  /// Loading state
  final bool isLoading;
  
  /// Error message
  final String? error;

  /// Create a copy with modifications
  WaterState copyWith({
    List<WaterLog>? todayLogs,
    int? totalIntake,
    int? goalAmount,
    double? progressPercentage,
    bool? isLoading,
    String? error,
  }) {
    return WaterState(
      todayLogs: todayLogs ?? this.todayLogs,
      totalIntake: totalIntake ?? this.totalIntake,
      goalAmount: goalAmount ?? this.goalAmount,
      progressPercentage: progressPercentage ?? this.progressPercentage,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

/// Provider for water intake tracking
@riverpod
class WaterProvider extends _$WaterProvider {
  @override
  WaterState build() {
    _loadWaterData();
    
    return WaterState(
      todayLogs: [],
      totalIntake: 0,
      goalAmount: 2000, // Default 2000ml, will be updated from user profile
      progressPercentage: 0.0,
      isLoading: true,
    );
  }

  Future<void> _loadWaterData() async {
    try {
      final authState = ref.read(authProvider);
      if (authState.user == null) {
        state = state.copyWith(
          error: 'User not authenticated',
          isLoading: false,
        );
        return;
      }
      
      final userId = authState.user!.id;
      final userGoal = authState.user!.dailyWaterGoalMl;
      
      final waterLogService = ref.read(waterLogServiceProvider);
      final logs = await waterLogService.getWaterLogsForDate(userId, DateTime.now());
      final totalIntake = await waterLogService.getTotalWaterIntakeForDate(userId, DateTime.now());
      
      final progressPercentage = userGoal > 0 
          ? (totalIntake / userGoal).clamp(0.0, 1.0) 
          : 0.0;
      
      state = state.copyWith(
        todayLogs: logs,
        totalIntake: totalIntake,
        goalAmount: userGoal,
        progressPercentage: progressPercentage,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(
        error: e.toString(),
        isLoading: false,
      );
      debugPrint('Error loading water data: $e');
    }
  }

  /// Refresh water data
  Future<void> refreshWaterData() async {
    state = state.copyWith(isLoading: true, error: null);
    await _loadWaterData();
  }

  /// Add water intake
  Future<void> addWaterIntake(int amount, {String? notes}) async {
    try {
      final authState = ref.read(authProvider);
      if (authState.user == null) {
        state = state.copyWith(
          error: 'User not authenticated',
        );
        return;
      }
      
      final userId = authState.user!.id;
      final waterLogService = ref.read(waterLogServiceProvider);
      
      await waterLogService.addWaterLog(userId, amount, notes: notes);
      
      // Refresh data after adding
      await refreshWaterData();
    } catch (e) {
      state = state.copyWith(error: e.toString());
      debugPrint('Error adding water intake: $e');
    }
  }

  /// Delete water log
  Future<void> deleteWaterLog(String logId) async {
    try {
      final waterLogService = ref.read(waterLogServiceProvider);
      
      await waterLogService.deleteWaterLog(logId);
      
      // Refresh data after deleting
      await refreshWaterData();
    } catch (e) {
      state = state.copyWith(error: e.toString());
      debugPrint('Error deleting water log: $e');
    }
  }

  /// Update water log
  Future<void> updateWaterLog(WaterLog log) async {
    try {
      final waterLogService = ref.read(waterLogServiceProvider);
      
      await waterLogService.updateWaterLog(log);
      
      // Refresh data after updating
      await refreshWaterData();
    } catch (e) {
      state = state.copyWith(error: e.toString());
      debugPrint('Error updating water log: $e');
    }
  }
} 