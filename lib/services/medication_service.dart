import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../app/constants.dart';
import '../models/medication_model.dart';

part 'medication_service.g.dart';

/// Provider for medication service
@riverpod
MedicationService medicationService(MedicationServiceRef ref) {
  return MedicationService(FirebaseFirestore.instance);
}

/// Service for managing medications
class MedicationService {
  /// Constructor
  MedicationService(this._firestore);

  final FirebaseFirestore _firestore;

  // Get medications collection reference
  CollectionReference<Map<String, dynamic>> _getMedicationsCollection() {
    return _firestore.collection(AppConstants.medicationsCollection);
  }
  
  // Get medication logs collection reference
  CollectionReference<Map<String, dynamic>> _getMedicationLogsCollection() {
    return _firestore.collection('medication_logs');
  }

  /// Add a new medication
  Future<Medication?> addMedication(Medication medication) async {
    try {
      // Generate new ID if needed
      final String id = medication.id.isEmpty
          ? _getMedicationsCollection().doc().id
          : medication.id;
      
      // Create a medication with the proper ID
      final medicationWithId = medication.copyWith(id: id);
      
      // Save to Firestore
      await _getMedicationsCollection()
          .doc(id)
          .set(medicationWithId.toJson());
      
      return medicationWithId;
    } catch (e) {
      print('Error adding medication: $e');
      return null;
    }
  }

  /// Get medications for a user
  Future<List<Medication>> getMedicationsForUser(String userId) async {
    try {
      // Simplified query that doesn't require a complex index
      final snapshot = await _getMedicationsCollection()
          .where('userId', isEqualTo: userId)
          .get();
      
      // Sort client-side instead of using orderBy in the query
      final medications = snapshot.docs.map((doc) {
        try {
          return Medication.fromJson(doc.data());
        } catch (e) {
          print('Error parsing medication document: $e');
          return null;
        }
      })
      .where((med) => med != null)
      .cast<Medication>()
      .toList();
          
      medications.sort((a, b) => a.name.compareTo(b.name));
      
      return medications;
    } catch (e) {
      print('Error getting medications: $e');
      // Return empty list instead of throwing
      return [];
    }
  }

  /// Get active medications for a user
  Future<List<Medication>> getActiveMedicationsForUser(String userId) async {
    try {
      // Get all medications and filter client-side
      final allMedications = await getMedicationsForUser(userId);
      
      // Filter active medications client-side
      final activeMedications = allMedications
          .where((medication) => medication.isActive)
          .toList();
          
      // Sort by name
      activeMedications.sort((a, b) => a.name.compareTo(b.name));
      
      return activeMedications;
    } catch (e) {
      print('Error getting active medications: $e');
      return [];
    }
  }

  /// Get a medication by ID
  Future<Medication?> getMedicationById(String medicationId) async {
    try {
      final doc = await _getMedicationsCollection().doc(medicationId).get();
      
      if (doc.exists) {
        return Medication.fromJson(doc.data()!);
      } else {
        print('Medication not found: $medicationId');
        return null;
      }
    } catch (e) {
      print('Error getting medication by ID: $e');
      return null;
    }
  }

  /// Update an existing medication
  Future<bool> updateMedication(Medication medication) async {
    try {
      await _getMedicationsCollection()
          .doc(medication.id)
          .update(medication.toJson());
      
      return true;
    } catch (e) {
      print('Error updating medication: $e');
      return false;
    }
  }

  /// Delete a medication
  Future<bool> deleteMedication(String medicationId) async {
    try {
      await _getMedicationsCollection().doc(medicationId).delete();
      return true;
    } catch (e) {
      print('Error deleting medication: $e');
      return false;
    }
  }

  /// Log a medication intake
  Future<MedicationLog?> logMedicationIntake(MedicationLog log) async {
    try {
      // Generate new ID if needed
      final String id = log.id.isEmpty
          ? _getMedicationLogsCollection().doc().id
          : log.id;
      
      // Create a log with the proper ID
      final logWithId = log.copyWith(id: id);
      
      // Save to Firestore
      await _getMedicationLogsCollection()
          .doc(id)
          .set(logWithId.toJson());
      
      return logWithId;
    } catch (e) {
      print('Error logging medication intake: $e');
      return null;
    }
  }

  /// Get medication logs for a user
  Future<List<MedicationLog>> getMedicationLogsForUser(
    String userId, {
    DateTime? startDate,
    DateTime? endDate,
  }) async {
    try {
      // Simplified query that only uses userId
      final snapshot = await _getMedicationLogsCollection()
          .where('userId', isEqualTo: userId)
          .get();
      
      // Filter and sort client-side
      final logs = snapshot.docs.map((doc) {
        try {
          return MedicationLog.fromJson(doc.data());
        } catch (e) {
          print('Error parsing medication log document: $e');
          return null;
        }
      })
      .where((log) => log != null)
      .cast<MedicationLog>()
      .toList();
      
      // Filter by date if needed
      if (startDate != null || endDate != null) {
        return logs.where((log) {
          if (startDate != null && log.timestamp.isBefore(startDate)) {
            return false;
          }
          if (endDate != null && log.timestamp.isAfter(endDate)) {
            return false;
          }
          return true;
        }).toList();
      }
      
      // Sort by timestamp descending
      logs.sort((a, b) => b.timestamp.compareTo(a.timestamp));
      
      return logs;
    } catch (e) {
      print('Error getting medication logs: $e');
      return [];
    }
  }

  /// Get medication logs for a specific medication
  Future<List<MedicationLog>> getMedicationLogsForMedication(
    String medicationId, {
    DateTime? startDate,
    DateTime? endDate,
  }) async {
    try {
      // Simplified query
      final snapshot = await _getMedicationLogsCollection()
          .where('medicationId', isEqualTo: medicationId)
          .get();
      
      // Filter and sort client-side
      final logs = snapshot.docs.map((doc) {
        try {
          return MedicationLog.fromJson(doc.data());
        } catch (e) {
          print('Error parsing medication log document: $e');
          return null;
        }
      })
      .where((log) => log != null)
      .cast<MedicationLog>()
      .toList();
      
      // Filter by date if needed
      if (startDate != null || endDate != null) {
        return logs.where((log) {
          if (startDate != null && log.timestamp.isBefore(startDate)) {
            return false;
          }
          if (endDate != null && log.timestamp.isAfter(endDate)) {
            return false;
          }
          return true;
        }).toList();
      }
      
      // Sort by timestamp descending
      logs.sort((a, b) => b.timestamp.compareTo(a.timestamp));
      
      return logs;
    } catch (e) {
      print('Error getting medication logs: $e');
      return [];
    }
  }

  /// Get medication logs for a specific date
  Future<List<MedicationLog>> getMedicationLogsForDate(
    String userId,
    DateTime date,
  ) async {
    try {
      // Get all logs and filter client-side
      final allLogs = await getMedicationLogsForUser(userId);
      
      // Filter logs for the specified date
      final startDate = DateTime(date.year, date.month, date.day);
      final endDate = startDate.add(Duration(days: 1)).subtract(Duration(microseconds: 1));
      
      final logs = allLogs.where((log) {
        return log.timestamp.isAfter(startDate) && 
               log.timestamp.isBefore(endDate);
      }).toList();
      
      // Sort by timestamp
      logs.sort((a, b) => b.timestamp.compareTo(a.timestamp));
      
      return logs;
    } catch (e) {
      print('Error getting medication logs for date: $e');
      return [];
    }
  }

  /// Check if a medication has been taken today
  Future<bool> hasMedicationBeenTakenToday(String medicationId) async {
    try {
      final today = DateTime.now();
      final startOfDay = DateTime(today.year, today.month, today.day);
      final endOfDay = startOfDay
          .add(Duration(days: 1))
          .subtract(Duration(microseconds: 1));
      
      final logs = await getMedicationLogsForMedication(
        medicationId,
        startDate: startOfDay,
        endDate: endOfDay,
      );
      
      return logs.isNotEmpty;
    } catch (e) {
      print('Error checking if medication has been taken: $e');
      return false;
    }
  }

  /// Delete a medication log
  Future<bool> deleteMedicationLog(String logId) async {
    try {
      await _getMedicationLogsCollection().doc(logId).delete();
      return true;
    } catch (e) {
      print('Error deleting medication log: $e');
      return false;
    }
  }
} 