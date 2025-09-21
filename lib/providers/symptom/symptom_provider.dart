import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

import '../../models/symptom/symptom_model.dart';
import '../../services/symptom/symptom_analysis_service.dart';

part 'symptom_provider.g.dart';

/// Body region filter for symptoms
@riverpod
class BodyRegionFilter extends _$BodyRegionFilter {
  @override
  BodyRegion? build() => null; // null means all regions
  
  /// Set the body region filter
  void setRegion(BodyRegion? region) {
    state = region;
  }
}

/// Provider for symptom data
@riverpod
class SymptomState extends _$SymptomState {
  @override
  List<Symptom> build() {
    return [];
  }
  
  /// Add a symptom
  void addSymptom(String name, {
    BodyRegion? bodyRegion,
    SymptomSeverity severity = SymptomSeverity.moderate,
    SymptomDuration duration = SymptomDuration.days,
    int durationValue = 1,
    String? notes,
  }) {
    final newSymptom = Symptom.create(
      name: name,
      bodyRegion: bodyRegion,
      severity: severity,
      duration: duration,
      durationValue: durationValue,
      notes: notes,
    );
    
    state = [...state, newSymptom];
  }
  
  /// Remove a symptom by ID
  void removeSymptom(String id) {
    state = state.where((s) => s.id != id).toList();
  }
  
  /// Update symptom severity
  void updateSymptomSeverity(String id, SymptomSeverity severity) {
    state = [
      for (final symptom in state)
        if (symptom.id == id)
          Symptom(
            id: symptom.id,
            name: symptom.name,
            severity: severity,
            duration: symptom.duration,
            durationValue: symptom.durationValue,
            timestamp: symptom.timestamp,
            bodyRegion: symptom.bodyRegion,
            notes: symptom.notes,
          )
        else
          symptom,
    ];
  }
  
  /// Update symptom duration
  void updateSymptomDuration(String id, SymptomDuration duration, int durationValue) {
    state = [
      for (final symptom in state)
        if (symptom.id == id)
          Symptom(
            id: symptom.id,
            name: symptom.name,
            severity: symptom.severity,
            duration: duration,
            durationValue: durationValue,
            timestamp: symptom.timestamp,
            bodyRegion: symptom.bodyRegion,
            notes: symptom.notes,
          )
        else
          symptom,
    ];
  }
  
  /// Update symptom notes
  void updateSymptomNotes(String id, String? notes) {
    state = [
      for (final symptom in state)
        if (symptom.id == id)
          Symptom(
            id: symptom.id,
            name: symptom.name,
            severity: symptom.severity,
            duration: symptom.duration,
            durationValue: symptom.durationValue,
            timestamp: symptom.timestamp,
            bodyRegion: symptom.bodyRegion,
            notes: notes,
          )
        else
          symptom,
    ];
  }
  
  /// Clear all symptoms
  void clearSymptoms() {
    state = [];
  }
}

/// Provider for symptom analysis results
@riverpod
class SymptomAnalysisResultNotifier extends _$SymptomAnalysisResultNotifier {
  // Store the latest result directly in the notifier for immediate access
  SymptomAnalysisResult? _latestResult;
  
  @override
  AsyncValue<SymptomAnalysisResult?> build() {
    // Load the latest result on initialization
    _loadLatestResult();
    return const AsyncValue.data(null);
  }
  
  // Load the latest result from shared preferences
  Future<void> _loadLatestResult() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final latestResultJson = prefs.getString('latest_symptom_result');
      
      if (latestResultJson != null) {
        final resultMap = jsonDecode(latestResultJson);
        final result = SymptomAnalysisResult.fromJson(resultMap);
        _latestResult = result;
        
        // Update the state with the loaded result
        state = AsyncValue.data(result);
        print('SymptomAnalysisResultNotifier: Loaded cached result with ID: ${result.id}');
      }
    } catch (e) {
      print('Error loading latest symptom result: $e');
    }
  }
  
  /// Get the current result
  SymptomAnalysisResult? getCurrentResult() {
    // First try to get from the state if available
    if (state.value != null) {
      return state.value;
    }
    
    // Fall back to the stored latest result
    if (_latestResult != null) {
      print('Returning cached latest result from notifier: ${_latestResult!.id}');
      // Update the state with this result to ensure consistency
      state = AsyncValue.data(_latestResult);
      return _latestResult;
    }
    
    return null;
  }
  
  /// Analyze symptoms and get results
  Future<void> analyzeSymptoms(List<Symptom> symptoms) async {
    if (symptoms.isEmpty) {
      state = const AsyncValue.data(null);
      _latestResult = null;
      return;
    }
    
    state = const AsyncValue.loading();
    
    try {
      print('Symptom provider: Starting analysis of ${symptoms.length} symptoms');
      
      // Get the analysis service and perform analysis
      final analysisService = ref.read(symptomAnalysisServiceProvider);
      
      // Add debugging to trace API calls
      print('Symptom provider: Calling analyzeSymptoms on analysisService');
      
      // Perform the analysis with proper error handling
      final result = await analysisService.analyzeSymptoms(symptoms);
      
      // Store the result for direct access - do this before setting state
      _latestResult = result;
      
      // Also cache in shared preferences
      _cacheLatestResult(result);
      
      print('Symptom provider: Stored _latestResult with ${result.possibleConditions.length} conditions');
      
      // Log the result to help debug
      print('Symptom provider: Successfully received analysis result with ${result.possibleConditions.length} conditions');
      if (result.possibleConditions.isNotEmpty) {
        print('Symptom provider: First condition: ${result.possibleConditions.first.name}');
      }
      
      // Set the state with the result
      state = AsyncValue.data(result);
      print('Symptom provider: Successfully set state with result');
      
      // Save the result to history
      await _saveToHistory(result);
      
    } catch (e, stack) {
      print('Symptom provider: Error in analysis: $e');
      print('Error stack trace: $stack');
      
      // Even if there's an error in setting the state,
      // we might have a valid result in _latestResult
      state = AsyncValue.error(e, stack);
    }
  }
  
  /// Force update the state with a result (for emergency use when normal flow fails)
  Future<void> forceUpdateWithResult(SymptomAnalysisResult result) async {
    print('Symptom provider: Force updating with result ID: ${result.id}');
    
    // Store the result both in memory and cache
    _latestResult = result;
    
    // Force update the state with the new result
    state = AsyncValue.data(result);
    print('Symptom provider: Updated state with forced result');
    
    // Cache the result for persistence
    try {
      final prefs = await SharedPreferences.getInstance();
      final resultJson = jsonEncode(result.toJson());
      
      // Save as both latest and specific result
      await prefs.setString('latest_symptom_result', resultJson);
      await prefs.setString('symptom_result_${result.id}', resultJson);
      print('Symptom provider: Cached result in SharedPreferences with ID: ${result.id}');
      
      // Save to history
      await _saveToHistory(result);
      print('Symptom provider: Saved forced result to history with ID: ${result.id}');
    } catch (e) {
      print('Error caching result: $e');
    }
  }
  
  // Cache the latest result in SharedPreferences
  Future<void> _cacheLatestResult(SymptomAnalysisResult result) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final resultJson = jsonEncode(result.toJson());
      await prefs.setString('latest_symptom_result', resultJson);
      print('Cached latest symptom result: ${result.id}');
    } catch (e) {
      print('Error caching latest symptom result: $e');
    }
  }
  
  /// Save an analysis result to history
  Future<void> _saveToHistory(SymptomAnalysisResult result) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      
      // Get existing history
      final history = prefs.getStringList('symptom_history') ?? [];
      
      // Add the new result ID with timestamp
      final entry = '${result.id}:${result.timestamp.millisecondsSinceEpoch}';
      
      // Add to history and keep only the most recent 10 entries
      history.insert(0, entry);
      if (history.length > 10) {
        history.removeLast();
      }
      
      // Save back to preferences
      await prefs.setStringList('symptom_history', history);
      
      // Also save the actual result data
      final resultJson = jsonEncode(result.toJson());
      await prefs.setString('symptom_result_${result.id}', resultJson);
      print('Symptom provider: Saved analysis result to history with ID: ${result.id}');
    } catch (e) {
      print('Error saving to history: $e');
    }
  }
}

/// Provider for symptom analysis history
@riverpod
class SymptomHistory extends _$SymptomHistory {
  @override
  AsyncValue<List<String>> build() {
    _loadHistory();
    return const AsyncValue.loading();
  }
  
  /// Load symptom history from preferences
  Future<void> _loadHistory() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final history = prefs.getStringList('symptom_history') ?? [];
      state = AsyncValue.data(history);
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
    }
  }
  
  /// Clear symptom history
  Future<void> clearHistory() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove('symptom_history');
      
      // Clear individual result data
      final keys = prefs.getKeys();
      for (final key in keys) {
        if (key.startsWith('symptom_result_')) {
          await prefs.remove(key);
        }
      }
      
      state = const AsyncValue.data([]);
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
    }
  }
} 