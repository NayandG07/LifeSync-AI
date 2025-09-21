import 'package:flutter/material.dart';
import '../models/symptom/symptom_model.dart';

/// Data class containing common symptoms organized by body region
class SymptomData {
  /// Head region symptoms
  static const List<String> headSymptoms = [
    'Headache',
    'Dizziness', 
    'Blurred vision',
    'Ear pain',
    'Sore throat',
    'Fever',
    'Neck pain',
    'Nasal congestion',
    'Memory problems',
    'Confusion',
    'Migraine',
    'Vertigo',
    'Tinnitus',
    'Sinus pressure',
  ];
  
  /// Chest region symptoms
  static const List<String> chestSymptoms = [
    'Chest pain',
    'Shortness of breath',
    'Heart palpitations',
    'Cough',
    'Rapid heartbeat',
    'Wheezing',
    'Chest tightness',
    'Difficulty breathing',
    'Shallow breathing',
    'Coughing up blood',
  ];
  
  /// Abdomen region symptoms
  static const List<String> abdomenSymptoms = [
    'Stomach pain',
    'Nausea',
    'Vomiting',
    'Diarrhea',
    'Constipation',
    'Bloating',
    'Acid reflux',
    'Loss of appetite',
    'Abdominal cramps',
    'Indigestion',
    'Gas',
  ];
  
  /// Back region symptoms
  static const List<String> backSymptoms = [
    'Back pain',
    'Spine pain',
    'Muscle stiffness',
    'Lower back pain',
    'Upper back pain',
    'Sciatica',
    'Limited mobility',
  ];
  
  /// Arms region symptoms
  static const List<String> armsSymptoms = [
    'Arm pain',
    'Joint pain',
    'Muscle weakness',
    'Numbness',
    'Swelling',
    'Tingling',
    'Limited range of motion',
    'Redness',
  ];
  
  /// Legs region symptoms
  static const List<String> legsSymptoms = [
    'Leg pain',
    'Difficulty walking',
    'Knee pain',
    'Ankle pain',
    'Cramps',
    'Varicose veins',
    'Swollen ankles',
    'Joint stiffness',
  ];
  
  /// Skin symptoms
  static const List<String> skinSymptoms = [
    'Rash',
    'Itching',
    'Hives',
    'Discoloration',
    'Dryness',
    'Bruising',
    'Lesions',
    'Excessive sweating',
  ];
  
  /// General symptoms
  static const List<String> generalSymptoms = [
    'Fatigue',
    'Weakness',
    'Chills',
    'Night sweats',
    'Weight loss',
    'Anxiety',
    'Depression',
    'Sleep disturbances',
    'Fever',
  ];
  
  /// Get symptoms for a given body region
  static List<String> getSymptomsByBodyRegion(BodyRegion region) {
    switch (region) {
      case BodyRegion.head:
        return headSymptoms;
      case BodyRegion.chest:
        return chestSymptoms;
      case BodyRegion.abdomen:
        return abdomenSymptoms;
      case BodyRegion.back:
        return backSymptoms;
      case BodyRegion.arms:
        return armsSymptoms;
      case BodyRegion.legs:
        return legsSymptoms;
      case BodyRegion.skin:
        return skinSymptoms;
      case BodyRegion.general:
        return generalSymptoms;
    }
  }
  
  /// Get all symptoms from all regions
  static List<String> getAllSymptoms() {
    return [
      ...headSymptoms,
      ...chestSymptoms,
      ...abdomenSymptoms,
      ...backSymptoms,
      ...armsSymptoms,
      ...legsSymptoms,
      ...skinSymptoms,
      ...generalSymptoms,
    ];
  }
  
  /// Get icon for a body region
  static IconData getIconForBodyRegion(BodyRegion region) {
    switch (region) {
      case BodyRegion.head:
        return Icons.face;
      case BodyRegion.chest:
        return Icons.favorite;
      case BodyRegion.abdomen:
        return Icons.local_hospital;
      case BodyRegion.back:
        return Icons.accessibility;
      case BodyRegion.arms:
        return Icons.sports_gymnastics;
      case BodyRegion.legs:
        return Icons.accessibility_new;
      case BodyRegion.skin:
        return Icons.texture;
      case BodyRegion.general:
        return Icons.person;
    }
  }
  
  /// Get name for a body region
  static String getNameForBodyRegion(BodyRegion region) {
    switch (region) {
      case BodyRegion.head:
        return 'Head';
      case BodyRegion.chest:
        return 'Chest';
      case BodyRegion.abdomen:
        return 'Abdomen';
      case BodyRegion.back:
        return 'Back';
      case BodyRegion.arms:
        return 'Arms';
      case BodyRegion.legs:
        return 'Legs';
      case BodyRegion.skin:
        return 'Skin';
      case BodyRegion.general:
        return 'General';
    }
  }
} 