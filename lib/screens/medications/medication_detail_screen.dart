import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

import '../../widgets/common/app_bar.dart';

/// Medication detail screen
class MedicationDetailScreen extends ConsumerWidget {
  /// Default constructor
  const MedicationDetailScreen({
    super.key,
    required this.medicationId,
  });

  /// ID of the medication to display
  final String medicationId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: const LifeSyncAppBar(
        title: 'Medication Details',
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.medical_information,
              size: 80,
              color: Colors.purple,
            ),
            const SizedBox(height: 16),
            Text(
              'Medication Detail Screen',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            Text(
              'Medication ID: $medicationId',
              style: Theme.of(context).textTheme.bodyLarge,
            ),
          ],
        ),
      ),
    );
  }
} 