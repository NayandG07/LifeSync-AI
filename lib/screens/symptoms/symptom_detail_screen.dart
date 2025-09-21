import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

import '../../widgets/common/app_bar.dart';

/// Symptom detail screen
class SymptomDetailScreen extends ConsumerWidget {
  /// Default constructor
  const SymptomDetailScreen({
    super.key,
    required this.symptomId,
  });

  /// ID of the symptom to display
  final String symptomId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: const LifeSyncAppBar(
        title: 'Symptom Details',
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.healing,
              size: 80,
              color: Colors.red,
            ),
            const SizedBox(height: 16),
            Text(
              'Symptom Detail Screen',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            Text(
              'Symptom ID: $symptomId',
              style: Theme.of(context).textTheme.bodyLarge,
            ),
          ],
        ),
      ),
    );
  }
} 