import 'package:flutter/material.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../services/medication_service.dart';
import '../models/medication_model.dart';
import '../providers/auth/auth_provider.dart';

part 'medication_provider.g.dart';

/// State for medication provider
class MedicationState {
  /// Constructor
  MedicationState({
    required this.medications,
    required this.activeMedications,
    required this.medicationLogs,
    this.selectedMedication,
    this.isLoading = false,
    this.error,
  });

  /// List of all medications
  final List<Medication> medications;
  
  /// List of active medications
  final List<Medication> activeMedications;
  
  /// List of medication logs
  final List<MedicationLog> medicationLogs;
  
  /// Currently selected medication
  final Medication? selectedMedication;
  
  /// Loading state
  final bool isLoading;
  
  /// Error message
  final String? error;

  /// Create a copy with modifications
  MedicationState copyWith({
    List<Medication>? medications,
    List<Medication>? activeMedications,
    List<MedicationLog>? medicationLogs,
    Medication? selectedMedication,
    bool? isLoading,
    String? error,
  }) {
    return MedicationState(
      medications: medications ?? this.medications,
      activeMedications: activeMedications ?? this.activeMedications,
      medicationLogs: medicationLogs ?? this.medicationLogs,
      selectedMedication: selectedMedication ?? this.selectedMedication,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

/// Provider for medications
@riverpod
class MedicationProvider extends _$MedicationProvider {
  @override
  MedicationState build() {
    _loadMedications();
    
    return MedicationState(
      medications: [],
      activeMedications: [],
      medicationLogs: [],
      isLoading: true,
    );
  }

  Future<void> _loadMedications() async {
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
      final medicationService = ref.read(medicationServiceProvider);
      
      try {
        final medications = await medicationService.getMedicationsForUser(userId);
        final activeMedications = await medicationService.getActiveMedicationsForUser(userId);
        final medicationLogs = await medicationService.getMedicationLogsForUser(userId);
        
        state = state.copyWith(
          medications: medications,
          activeMedications: activeMedications,
          medicationLogs: medicationLogs,
          isLoading: false,
        );
      } catch (serviceError) {
        // Set empty lists if there's an error from the service
        debugPrint('Service error: $serviceError');
        state = state.copyWith(
          medications: [],
          activeMedications: [],
          medicationLogs: [],
          error: 'Failed to load medications',
          isLoading: false,
        );
      }
    } catch (e) {
      state = state.copyWith(
        error: e.toString(),
        isLoading: false,
        medications: [],
        activeMedications: [],
        medicationLogs: [],
      );
      debugPrint('Error loading medications: $e');
    }
  }

  /// Refresh medications
  Future<void> refreshMedications() async {
    state = state.copyWith(isLoading: true, error: null);
    await _loadMedications();
  }

  /// Get medication by ID
  Future<void> getMedicationById(String medicationId) async {
    try {
      state = state.copyWith(isLoading: true, error: null);
      
      final medicationService = ref.read(medicationServiceProvider);
      final medication = await medicationService.getMedicationById(medicationId);
      
      if (medication != null) {
        // Also load logs for this medication
        final logs = await medicationService.getMedicationLogsForMedication(medicationId);
        
        state = state.copyWith(
          selectedMedication: medication,
          medicationLogs: logs,
          isLoading: false,
        );
      } else {
        state = state.copyWith(
          error: 'Medication not found',
          isLoading: false,
        );
      }
    } catch (e) {
      state = state.copyWith(
        error: e.toString(),
        isLoading: false,
      );
      debugPrint('Error getting medication: $e');
    }
  }

  /// Add a new medication
  Future<void> addMedication(Medication medication) async {
    try {
      state = state.copyWith(isLoading: true, error: null);
      
      final medicationService = ref.read(medicationServiceProvider);
      final addedMedication = await medicationService.addMedication(medication);
      
      if (addedMedication != null) {
        final updatedMedications = [...state.medications, addedMedication];
        final updatedActiveMedications = addedMedication.isActive
            ? [...state.activeMedications, addedMedication]
            : state.activeMedications;
        
        state = state.copyWith(
          medications: updatedMedications,
          activeMedications: updatedActiveMedications,
          isLoading: false,
        );
      } else {
        state = state.copyWith(
          error: 'Failed to add medication',
          isLoading: false,
        );
      }
    } catch (e) {
      state = state.copyWith(
        error: e.toString(),
        isLoading: false,
      );
      debugPrint('Error adding medication: $e');
    }
  }

  /// Update a medication
  Future<void> updateMedication(Medication medication) async {
    try {
      state = state.copyWith(isLoading: true, error: null);
      
      final medicationService = ref.read(medicationServiceProvider);
      await medicationService.updateMedication(medication);
      
      // Update in the local state
      final updatedMedications = state.medications.map((m) => 
        m.id == medication.id ? medication : m
      ).toList();
      
      final updatedActiveMedications = medication.isActive
          ? state.activeMedications.any((m) => m.id == medication.id)
              ? state.activeMedications.map((m) => 
                  m.id == medication.id ? medication : m
                ).toList()
              : [...state.activeMedications, medication]
          : state.activeMedications.where((m) => m.id != medication.id).toList();
      
      state = state.copyWith(
        medications: updatedMedications,
        activeMedications: updatedActiveMedications,
        selectedMedication: medication,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(
        error: e.toString(),
        isLoading: false,
      );
      debugPrint('Error updating medication: $e');
    }
  }

  /// Delete a medication
  Future<void> deleteMedication(String medicationId) async {
    try {
      state = state.copyWith(isLoading: true, error: null);
      
      final medicationService = ref.read(medicationServiceProvider);
      await medicationService.deleteMedication(medicationId);
      
      // Remove from the local state
      final updatedMedications = state.medications.where((m) => m.id != medicationId).toList();
      final updatedActiveMedications = state.activeMedications.where((m) => m.id != medicationId).toList();
      
      state = state.copyWith(
        medications: updatedMedications,
        activeMedications: updatedActiveMedications,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(
        error: e.toString(),
        isLoading: false,
      );
      debugPrint('Error deleting medication: $e');
    }
  }

  /// Log medication as taken
  Future<void> logMedicationTaken({
    required String medicationId,
    required bool taken,
    String? notes,
    required String scheduledTime,
  }) async {
    try {
      final authState = ref.read(authProvider);
      if (authState.user == null) {
        state = state.copyWith(
          error: 'User not authenticated',
        );
        return;
      }
      
      final userId = authState.user!.id;
      final medicationService = ref.read(medicationServiceProvider);
      
      // Create a MedicationLog object
      final newLog = MedicationLog.create(
        medicationId: medicationId,
        userId: userId,
        taken: taken,
        notes: notes,
        scheduledTime: scheduledTime,
      );
      
      // Use the new logMedicationIntake method
      final log = await medicationService.logMedicationIntake(newLog);
      
      if (log != null) {
        // Add to local state
        final updatedLogs = [log, ...state.medicationLogs];
        
        state = state.copyWith(
          medicationLogs: updatedLogs,
        );
      } else {
        state = state.copyWith(
          error: 'Failed to log medication',
        );
      }
    } catch (e) {
      state = state.copyWith(error: e.toString());
      debugPrint('Error logging medication: $e');
    }
  }

  /// Delete a medication log
  Future<void> deleteMedicationLog(String logId) async {
    try {
      final medicationService = ref.read(medicationServiceProvider);
      
      await medicationService.deleteMedicationLog(logId);
      
      // Remove from the local state
      final updatedLogs = state.medicationLogs.where((log) => log.id != logId).toList();
      
      state = state.copyWith(
        medicationLogs: updatedLogs,
      );
    } catch (e) {
      state = state.copyWith(error: e.toString());
      debugPrint('Error deleting medication log: $e');
    }
  }
} 