import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:intl/intl.dart';
import 'package:uuid/uuid.dart';

import '../app/constants.dart';

part 'symptom_service.g.dart';

/// Provider for symptom service
@riverpod
SymptomService symptomService(SymptomServiceRef ref) {
  return SymptomService(FirebaseFirestore.instance);
}

/// Symptom severity levels
enum SymptomSeverity {
  /// Mild symptom
  mild,
  
  /// Moderate symptom
  moderate,
  
  /// Severe symptom
  severe,
  
  /// Very severe symptom
  verySevere,
}

/// Symptom duration units
enum DurationUnit {
  /// Minutes
  minutes,
  
  /// Hours
  hours,
  
  /// Days
  days,
  
  /// Weeks
  weeks,
  
  /// Months
  months,
}

/// Data model for symptom entry
class Symptom {
  /// Constructor
  Symptom({
    required this.id,
    required this.userId,
    required this.name,
    required this.severity,
    required this.date,
    required this.timestamp,
    required this.duration,
    required this.durationValue,
    this.notes,
    this.bodyLocation,
    this.tags,
  });

  /// Create a new symptom entry
  factory Symptom.create({
    required String userId,
    required String name,
    required SymptomSeverity severity,
    required DateTime date,
    required DurationUnit duration,
    required int durationValue,
    String? notes,
    String? bodyLocation,
    List<String>? tags,
  }) {
    return Symptom(
      id: const Uuid().v4(),
      userId: userId,
      name: name,
      severity: severity,
      date: DateFormat('yyyy-MM-dd').format(date),
      timestamp: DateTime.now(),
      duration: duration,
      durationValue: durationValue,
      notes: notes,
      bodyLocation: bodyLocation,
      tags: tags,
    );
  }

  /// Create from JSON
  factory Symptom.fromJson(Map<String, dynamic> json) {
    return Symptom(
      id: json['id'] as String,
      userId: json['userId'] as String,
      name: json['name'] as String,
      severity: SymptomSeverity.values.firstWhere(
        (e) => e.name == json['severity'],
        orElse: () => SymptomSeverity.mild,
      ),
      date: json['date'] as String,
      timestamp: (json['timestamp'] as Timestamp).toDate(),
      duration: DurationUnit.values.firstWhere(
        (e) => e.name == json['duration'],
        orElse: () => DurationUnit.days,
      ),
      durationValue: json['durationValue'] as int,
      notes: json['notes'] as String?,
      bodyLocation: json['bodyLocation'] as String?,
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
      'name': name,
      'severity': severity.name,
      'date': date,
      'timestamp': timestamp,
      'duration': duration.name,
      'durationValue': durationValue,
      'notes': notes,
      'bodyLocation': bodyLocation,
      'tags': tags,
    };
  }

  /// Symptom entry ID
  final String id;

  /// User ID
  final String userId;

  /// Symptom name
  final String name;

  /// Symptom severity
  final SymptomSeverity severity;

  /// Date in yyyy-MM-dd format
  final String date;

  /// Timestamp of when the entry was created
  final DateTime timestamp;

  /// Duration unit (e.g., days, weeks)
  final DurationUnit duration;

  /// Duration value (e.g., 3 days would be value=3, duration=days)
  final int durationValue;

  /// Optional notes
  final String? notes;

  /// Optional body location
  final String? bodyLocation;

  /// Optional tags
  final List<String>? tags;

  /// Create a copy with modified fields
  Symptom copyWith({
    String? id,
    String? userId,
    String? name,
    SymptomSeverity? severity,
    String? date,
    DateTime? timestamp,
    DurationUnit? duration,
    int? durationValue,
    String? notes,
    String? bodyLocation,
    List<String>? tags,
  }) {
    return Symptom(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      name: name ?? this.name,
      severity: severity ?? this.severity,
      date: date ?? this.date,
      timestamp: timestamp ?? this.timestamp,
      duration: duration ?? this.duration,
      durationValue: durationValue ?? this.durationValue,
      notes: notes ?? this.notes,
      bodyLocation: bodyLocation ?? this.bodyLocation,
      tags: tags ?? this.tags,
    );
  }
}

/// Service for managing symptom entries
class SymptomService {
  /// Constructor
  SymptomService(this._firestore);

  final FirebaseFirestore _firestore;

  // Get symptoms collection reference - using top-level collection per Firestore rules
  CollectionReference<Map<String, dynamic>> _getSymptomsCollection() {
    return _firestore
        .collection(AppConstants.symptomsCollection);
  }

  /// Add a new symptom entry
  Future<Symptom> addSymptom({
    required String userId,
    required String name,
    required SymptomSeverity severity,
    required DurationUnit duration,
    required int durationValue,
    String? notes,
    String? bodyLocation,
    List<String>? tags,
  }) async {
    try {
      final symptom = Symptom.create(
        userId: userId,
        name: name,
        severity: severity,
        date: DateTime.now(),
        duration: duration,
        durationValue: durationValue,
        notes: notes,
        bodyLocation: bodyLocation,
        tags: tags,
      );
      
      // Add to symptoms collection
      await _getSymptomsCollection()
          .doc(symptom.id)
          .set(symptom.toJson());
      
      print('✅ [SYMPTOM] ${symptom.id} saved successfully: ${symptom.name} (${symptom.severity.name}) for user $userId');
      
      return symptom;
    } catch (e) {
      print('Error adding symptom: $e');
      throw Exception('Failed to add symptom: $e');
    }
  }

  /// Get symptoms for a specific date
  Future<List<Symptom>> getSymptomsForDate(String userId, DateTime date) async {
    try {
      final String dateString = DateFormat('yyyy-MM-dd').format(date);
      
      final snapshot = await _getSymptomsCollection()
          .where('userId', isEqualTo: userId)
          .where('date', isEqualTo: dateString)
          .orderBy('timestamp', descending: true)
          .get();
      
      return snapshot.docs
          .map((doc) => Symptom.fromJson(doc.data()))
          .toList();
    } catch (e) {
      print('Error getting symptoms: $e');
      throw Exception('Failed to get symptoms: $e');
    }
  }

  /// Get symptoms for a date range
  Future<List<Symptom>> getSymptomsForDateRange(
    String userId,
    DateTime startDate,
    DateTime endDate,
  ) async {
    try {
      final String startDateString = DateFormat('yyyy-MM-dd').format(startDate);
      final String endDateString = DateFormat('yyyy-MM-dd').format(endDate);
      
      final snapshot = await _getSymptomsCollection()
          .where('userId', isEqualTo: userId)
          .where('date', isGreaterThanOrEqualTo: startDateString)
          .where('date', isLessThanOrEqualTo: endDateString)
          .orderBy('date')
          .orderBy('timestamp')
          .get();
      
      return snapshot.docs
          .map((doc) => Symptom.fromJson(doc.data()))
          .toList();
    } catch (e) {
      print('Error getting symptoms for date range: $e');
      throw Exception('Failed to get symptoms for date range: $e');
    }
  }

  /// Update a symptom entry
  Future<void> updateSymptom(Symptom symptom) async {
    try {
      await _getSymptomsCollection()
          .doc(symptom.id)
          .update(symptom.toJson());
      
      print('✅ [SYMPTOM] ${symptom.id} updated successfully: ${symptom.name} (${symptom.severity.name}) for user ${symptom.userId}');
    } catch (e) {
      print('Error updating symptom: $e');
      throw Exception('Failed to update symptom: $e');
    }
  }

  /// Delete a symptom entry
  Future<void> deleteSymptom(String symptomId) async {
    try {
      await _getSymptomsCollection()
          .doc(symptomId)
          .delete();
      
      print('✅ [SYMPTOM] $symptomId deleted successfully');
    } catch (e) {
      print('Error deleting symptom: $e');
      throw Exception('Failed to delete symptom: $e');
    }
  }

  /// Get symptoms grouped by name
  Future<Map<String, List<Symptom>>> getSymptomsByName(String userId, int lastDays) async {
    try {
      final endDate = DateTime.now();
      final startDate = endDate.subtract(Duration(days: lastDays));
      
      final symptoms = await getSymptomsForDateRange(userId, startDate, endDate);
      
      // Group by symptom name
      final Map<String, List<Symptom>> groupedSymptoms = {};
      
      for (final symptom in symptoms) {
        if (!groupedSymptoms.containsKey(symptom.name)) {
          groupedSymptoms[symptom.name] = [];
        }
        groupedSymptoms[symptom.name]!.add(symptom);
      }
      
      return groupedSymptoms;
    } catch (e) {
      print('Error getting symptoms by name: $e');
      throw Exception('Failed to get symptoms by name: $e');
    }
  }
} 