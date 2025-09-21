import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../../widgets/common/app_bar.dart';
import '../../widgets/common/bottom_nav_bar.dart';
import '../../widgets/common/loading_indicator.dart';
import '../../providers/medication_provider.dart';
import '../../models/medication_model.dart';
import '../../app/constants.dart';
import '../../widgets/common/error_view.dart';

/// Medications screen
class MedicationsScreen extends ConsumerWidget {
  /// Default constructor
  const MedicationsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final medicationState = ref.watch(medicationProviderProvider);
    
    return Scaffold(
      appBar: const LifeSyncAppBar(
        title: 'Medications',
      ),
      body: medicationState.isLoading
          ? const LoadingIndicator(text: 'Loading medications...')
          : RefreshIndicator(
              onRefresh: () => ref.read(medicationProviderProvider.notifier).refreshMedications(),
              child: medicationState.activeMedications.isEmpty
                  ? _buildEmptyState(context)
                  : _buildMedicationsList(context, medicationState, theme, ref),
            ),
      bottomNavigationBar: const LifeSyncBottomNavBar(),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.push('/add-medication'),
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(
            Icons.medication_outlined,
            size: 80,
            color: Colors.grey,
          ),
          const SizedBox(height: 16),
          Text(
            'No Medications',
            style: Theme.of(context).textTheme.headlineSmall,
          ),
          const SizedBox(height: 8),
          Text(
            'You haven\'t added any medications yet',
            style: Theme.of(context).textTheme.bodyLarge,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),
          FilledButton.icon(
            onPressed: () => context.push('/add-medication'),
            icon: const Icon(Icons.add),
            label: const Text('Add Medication'),
          ),
        ],
      ),
    );
  }

  Widget _buildMedicationsList(
    BuildContext context,
    MedicationState medicationState,
    ThemeData theme,
    WidgetRef ref,
  ) {
    final medications = medicationState.activeMedications;
    
    return ListView(
      padding: const EdgeInsets.all(AppConstants.defaultPadding),
      children: [
        // Today's medications section
        Text(
          'Today\'s Medications',
          style: theme.textTheme.titleLarge,
        ),
        const SizedBox(height: 16),
        
        // Current medications
        ListView.builder(
          physics: const NeverScrollableScrollPhysics(),
          shrinkWrap: true,
          itemCount: medications.length,
          itemBuilder: (context, index) {
            final medication = medications[index];
            return _buildMedicationCard(context, medication, ref);
          },
        ),
        
        const SizedBox(height: 24),
        
        // Log section
        if (medicationState.medicationLogs.isNotEmpty) ...[
          Text(
            'Recent Logs',
            style: theme.textTheme.titleLarge,
          ),
          const SizedBox(height: 16),
          
          // Recent logs
          ListView.builder(
            physics: const NeverScrollableScrollPhysics(),
            shrinkWrap: true,
            itemCount: medicationState.medicationLogs.length > 5
                ? 5
                : medicationState.medicationLogs.length,
            itemBuilder: (context, index) {
              final log = medicationState.medicationLogs[index];
              final medication = medicationState.medications.firstWhere(
                (m) => m.id == log.medicationId,
                orElse: () => Medication.create(
                  userId: '',
                  name: 'Unknown',
                  frequency: MedicationFrequency.daily,
                  times: [MedicationTime.morning],
                ),
              );
              return _buildLogTile(context, log, medication);
            },
          ),
          
          const SizedBox(height: 16),
          
          // View all logs button
          TextButton.icon(
            onPressed: () {
              // TODO: Navigate to medication history screen
            },
            icon: const Icon(Icons.history),
            label: const Text('View All Logs'),
          ),
        ],
      ],
    );
  }

  Widget _buildMedicationCard(
    BuildContext context,
    Medication medication,
    WidgetRef ref,
  ) {
    final timeLabels = medication.times.map((time) {
      switch (time) {
        case MedicationTime.morning:
          return 'Morning';
        case MedicationTime.afternoon:
          return 'Afternoon';
        case MedicationTime.evening:
          return 'Evening';
        case MedicationTime.night:
          return 'Night';
        case MedicationTime.beforeMeal:
          return 'Before meal';
        case MedicationTime.withMeal:
          return 'With meal';
        case MedicationTime.afterMeal:
          return 'After meal';
        case MedicationTime.custom:
          return 'Custom';
      }
    }).join(', ');
    
    String frequencyLabel;
    switch (medication.frequency) {
      case MedicationFrequency.daily:
        frequencyLabel = 'Once Daily';
        break;
      case MedicationFrequency.multipleTimes:
        frequencyLabel = 'Multiple Times Daily';
        break;
      case MedicationFrequency.everyOtherDay:
        frequencyLabel = 'Every Other Day';
        break;
      case MedicationFrequency.weekly:
        frequencyLabel = 'Weekly';
        break;
      case MedicationFrequency.asNeeded:
        frequencyLabel = 'As Needed';
        break;
      case MedicationFrequency.custom:
        frequencyLabel = 'Custom Schedule';
        break;
    }
    
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: InkWell(
        onTap: () => context.push('/medication/${medication.id}'),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const CircleAvatar(
                    backgroundColor: Colors.purple,
                    child: Icon(Icons.medication, color: Colors.white),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          medication.name,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        if (medication.dosage != null)
                          Text(
                            medication.dosage!,
                            style: const TextStyle(
                              color: Colors.grey,
                            ),
                          ),
                      ],
                    ),
                  ),
                  PopupMenuButton<String>(
                    onSelected: (value) {
                      if (value == 'delete') {
                        _showDeleteConfirmation(
                          context,
                          medication,
                          ref,
                        );
                      } else if (value == 'edit') {
                        // TODO: Navigate to edit medication screen
                      } else if (value == 'log') {
                        _showLogDialog(context, medication, ref);
                      }
                    },
                    itemBuilder: (BuildContext context) => [
                      const PopupMenuItem<String>(
                        value: 'log',
                        child: Row(
                          children: [
                            Icon(Icons.check_circle_outline),
                            SizedBox(width: 8),
                            Text('Log Dose'),
                          ],
                        ),
                      ),
                      const PopupMenuItem<String>(
                        value: 'edit',
                        child: Row(
                          children: [
                            Icon(Icons.edit),
                            SizedBox(width: 8),
                            Text('Edit'),
                          ],
                        ),
                      ),
                      const PopupMenuItem<String>(
                        value: 'delete',
                        child: Row(
                          children: [
                            Icon(Icons.delete_outline, color: Colors.red),
                            SizedBox(width: 8),
                            Text('Delete', style: TextStyle(color: Colors.red)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Frequency',
                          style: TextStyle(
                            color: Colors.grey,
                            fontSize: 12,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(frequencyLabel),
                      ],
                    ),
                  ),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Time',
                          style: TextStyle(
                            color: Colors.grey,
                            fontSize: 12,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(timeLabels),
                      ],
                    ),
                  ),
                ],
              ),
              if (medication.instructions != null) ...[
                const SizedBox(height: 12),
                const Divider(),
                const SizedBox(height: 4),
                Text(
                  medication.instructions!,
                  style: const TextStyle(
                    fontStyle: FontStyle.italic,
                    color: Colors.grey,
                  ),
                ),
              ],
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  OutlinedButton.icon(
                    onPressed: () => _showLogDialog(context, medication, ref),
                    icon: const Icon(Icons.check),
                    label: const Text('Log Dose'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLogTile(
    BuildContext context,
    MedicationLog log,
    Medication medication,
  ) {
    final formattedTime = DateFormat.jm().format(log.timestamp);
    final formattedDate = DateFormat.yMMMd().format(log.timestamp);
    
    return ListTile(
      leading: CircleAvatar(
        backgroundColor: log.taken ? Colors.green : Colors.red,
        child: Icon(
          log.taken ? Icons.check : Icons.close,
          color: Colors.white,
        ),
      ),
      title: Text(medication.name),
      subtitle: Text('${log.taken ? 'Taken' : 'Skipped'} at $formattedTime on $formattedDate'),
      trailing: IconButton(
        icon: const Icon(Icons.info_outline),
        onPressed: () {
          // Show log details
          showDialog(
            context: context,
            builder: (context) => AlertDialog(
              title: Text(medication.name),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Status: ${log.taken ? 'Taken' : 'Skipped'}'),
                  const SizedBox(height: 8),
                  Text('Time: $formattedTime'),
                  const SizedBox(height: 8),
                  Text('Date: $formattedDate'),
                  const SizedBox(height: 8),
                  Text('Scheduled time: ${log.scheduledTime}'),
                  if (log.notes != null) ...[
                    const SizedBox(height: 8),
                    Text('Notes: ${log.notes}'),
                  ],
                ],
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Close'),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  void _showDeleteConfirmation(
    BuildContext context,
    Medication medication,
    WidgetRef ref,
  ) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Medication?'),
        content: Text(
          'Are you sure you want to delete ${medication.name}? This action cannot be undone.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () async {
              await ref.read(medicationProviderProvider.notifier)
                  .deleteMedication(medication.id);
              if (context.mounted) {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('${medication.name} deleted'),
                    behavior: SnackBarBehavior.floating,
                  ),
                );
              }
            },
            style: FilledButton.styleFrom(
              backgroundColor: Colors.red,
            ),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }

  void _showLogDialog(
    BuildContext context,
    Medication medication,
    WidgetRef ref,
  ) {
    final notesController = TextEditingController();
    bool taken = true;
    String scheduledTime = 'Morning';
    
    // Set default scheduled time based on current time
    final currentHour = DateTime.now().hour;
    if (currentHour < 12) {
      scheduledTime = 'Morning';
    } else if (currentHour < 18) {
      scheduledTime = 'Afternoon';
    } else {
      scheduledTime = 'Evening';
    }
    
    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setState) => AlertDialog(
          title: Text('Log ${medication.name}'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Taken/Skipped toggle
              SegmentedButton<bool>(
                segments: const [
                  ButtonSegment<bool>(
                    value: true,
                    label: Text('Taken'),
                    icon: Icon(Icons.check_circle_outline),
                  ),
                  ButtonSegment<bool>(
                    value: false,
                    label: Text('Skipped'),
                    icon: Icon(Icons.cancel_outlined),
                  ),
                ],
                selected: {taken},
                onSelectionChanged: (Set<bool> newSelection) {
                  setState(() {
                    taken = newSelection.first;
                  });
                },
              ),
              const SizedBox(height: 16),
              
              // Scheduled time dropdown
              DropdownButtonFormField<String>(
                value: scheduledTime,
                decoration: const InputDecoration(
                  labelText: 'Scheduled Time',
                ),
                items: [
                  'Morning',
                  'Afternoon',
                  'Evening',
                  'Night',
                  'With meal',
                  'Other',
                ].map((String value) {
                  return DropdownMenuItem<String>(
                    value: value,
                    child: Text(value),
                  );
                }).toList(),
                onChanged: (String? newValue) {
                  if (newValue != null) {
                    setState(() {
                      scheduledTime = newValue;
                    });
                  }
                },
              ),
              const SizedBox(height: 16),
              
              // Notes field
              TextField(
                controller: notesController,
                decoration: const InputDecoration(
                  labelText: 'Notes (optional)',
                  hintText: 'Add any notes about this dose',
                ),
                maxLines: 2,
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            FilledButton(
              onPressed: () async {
                final notes = notesController.text.isEmpty 
                    ? null 
                    : notesController.text;
                
                await ref.read(medicationProviderProvider.notifier)
                    .logMedicationTaken(
                      medicationId: medication.id,
                      taken: taken,
                      notes: notes,
                      scheduledTime: scheduledTime,
                    );
                
                if (context.mounted) {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                        '${medication.name} marked as ${taken ? 'taken' : 'skipped'}',
                      ),
                      behavior: SnackBarBehavior.floating,
                    ),
                  );
                }
              },
              child: const Text('Save'),
            ),
          ],
        ),
      ),
    );
  }
} 