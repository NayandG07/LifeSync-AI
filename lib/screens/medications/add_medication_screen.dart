import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../../widgets/common/app_bar.dart';
import '../../providers/medication_provider.dart';
import '../../providers/auth/auth_provider.dart';
import '../../models/medication_model.dart';
import '../../app/constants.dart';
import '../../utils/input_validators.dart';

/// Add medication screen
class AddMedicationScreen extends ConsumerStatefulWidget {
  /// Default constructor
  const AddMedicationScreen({super.key});

  @override
  ConsumerState<AddMedicationScreen> createState() => _AddMedicationScreenState();
}

class _AddMedicationScreenState extends ConsumerState<AddMedicationScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _dosageController = TextEditingController();
  final _instructionsController = TextEditingController();
  final _notesController = TextEditingController();
  final _quantityController = TextEditingController();
  final _refillReminderController = TextEditingController();

  MedicationFrequency _frequency = MedicationFrequency.daily;
  final List<MedicationTime> _selectedTimes = [MedicationTime.morning];
  DateTime _startDate = DateTime.now();
  DateTime? _endDate;
  bool _isActive = true;

  @override
  void dispose() {
    _nameController.dispose();
    _dosageController.dispose();
    _instructionsController.dispose();
    _notesController.dispose();
    _quantityController.dispose();
    _refillReminderController.dispose();
    super.dispose();
  }

  Future<void> _selectStartDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _startDate,
      firstDate: DateTime.now().subtract(const Duration(days: 365)),
      lastDate: DateTime.now().add(const Duration(days: 365 * 5)),
    );
    
    if (picked != null && picked != _startDate) {
      setState(() {
        _startDate = picked;
      });
    }
  }

  Future<void> _selectEndDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _endDate ?? DateTime.now().add(const Duration(days: 30)),
      firstDate: _startDate,
      lastDate: DateTime.now().add(const Duration(days: 365 * 5)),
    );
    
    if (picked != null) {
      setState(() {
        _endDate = picked;
      });
    }
  }

  void _toggleMedicationTime(MedicationTime time) {
    setState(() {
      if (_selectedTimes.contains(time)) {
        if (_selectedTimes.length > 1) {
          _selectedTimes.remove(time);
        }
      } else {
        _selectedTimes.add(time);
      }
    });
  }

  Future<void> _saveMedication() async {
    if (_formKey.currentState?.validate() ?? false) {
      final authState = ref.read(authProvider);
      if (authState.user == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('You must be logged in to add medications')),
        );
        return;
      }

      final userId = authState.user!.id;
      
      final medication = Medication.create(
        userId: userId,
        name: _nameController.text,
        dosage: _dosageController.text.isEmpty ? null : _dosageController.text,
        instructions: _instructionsController.text.isEmpty ? null : _instructionsController.text,
        frequency: _frequency,
        times: _selectedTimes,
        quantity: int.tryParse(_quantityController.text),
        refillReminder: int.tryParse(_refillReminderController.text),
        notes: _notesController.text.isEmpty ? null : _notesController.text,
        startDate: _startDate,
        endDate: _endDate,
      );
      
      await ref.read(medicationProviderProvider.notifier).addMedication(medication);
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('${_nameController.text} added to medications')),
        );
        context.go('/medications');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      appBar: const LifeSyncAppBar(
        title: 'Add Medication',
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(AppConstants.defaultPadding),
          children: [
            Text(
              'Basic Information',
              style: theme.textTheme.titleLarge,
            ),
            const SizedBox(height: 16),
            
            // Name field
            TextFormField(
              controller: _nameController,
              decoration: const InputDecoration(
                labelText: 'Medication Name',
                hintText: 'Enter medication name',
                prefixIcon: Icon(Icons.medication),
              ),
              textCapitalization: TextCapitalization.words,
              validator: (value) => InputValidators.validateNotEmpty(
                value,
                fieldName: 'Medication name',
              ),
            ),
            const SizedBox(height: 16),
            
            // Dosage field
            TextFormField(
              controller: _dosageController,
              decoration: const InputDecoration(
                labelText: 'Dosage',
                hintText: 'E.g., 10mg, 1 tablet, etc.',
                prefixIcon: Icon(Icons.numbers),
              ),
            ),
            const SizedBox(height: 16),
            
            // Instructions field
            TextFormField(
              controller: _instructionsController,
              decoration: const InputDecoration(
                labelText: 'Instructions',
                hintText: 'E.g., Take with food, etc.',
                prefixIcon: Icon(Icons.info_outline),
              ),
              maxLines: 2,
            ),
            const SizedBox(height: 24),
            
            Text(
              'Schedule',
              style: theme.textTheme.titleLarge,
            ),
            const SizedBox(height: 16),
            
            // Frequency dropdown
            DropdownButtonFormField<MedicationFrequency>(
              value: _frequency,
              decoration: const InputDecoration(
                labelText: 'Frequency',
                prefixIcon: Icon(Icons.repeat),
              ),
              items: MedicationFrequency.values.map((frequency) {
                String label;
                switch (frequency) {
                  case MedicationFrequency.daily:
                    label = 'Once Daily';
                    break;
                  case MedicationFrequency.multipleTimes:
                    label = 'Multiple Times Daily';
                    break;
                  case MedicationFrequency.everyOtherDay:
                    label = 'Every Other Day';
                    break;
                  case MedicationFrequency.weekly:
                    label = 'Weekly';
                    break;
                  case MedicationFrequency.asNeeded:
                    label = 'As Needed';
                    break;
                  case MedicationFrequency.custom:
                    label = 'Custom Schedule';
                    break;
                }
                return DropdownMenuItem<MedicationFrequency>(
                  value: frequency,
                  child: Text(label),
                );
              }).toList(),
              onChanged: (value) {
                if (value != null) {
                  setState(() {
                    _frequency = value;
                  });
                }
              },
            ),
            const SizedBox(height: 16),
            
            // Time of day chips
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Time of Day',
                  style: theme.textTheme.titleMedium,
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    _buildTimeChip(MedicationTime.morning, 'Morning'),
                    _buildTimeChip(MedicationTime.afternoon, 'Afternoon'),
                    _buildTimeChip(MedicationTime.evening, 'Evening'),
                    _buildTimeChip(MedicationTime.night, 'Night'),
                    _buildTimeChip(MedicationTime.beforeMeal, 'Before Meal'),
                    _buildTimeChip(MedicationTime.withMeal, 'With Meal'),
                    _buildTimeChip(MedicationTime.afterMeal, 'After Meal'),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 16),
            
            // Date range
            Row(
              children: [
                Expanded(
                  child: ListTile(
                    title: const Text('Start Date'),
                    subtitle: Text(DateFormat('MMM d, yyyy').format(_startDate)),
                    trailing: const Icon(Icons.calendar_today),
                    onTap: () => _selectStartDate(context),
                  ),
                ),
                Expanded(
                  child: ListTile(
                    title: const Text('End Date'),
                    subtitle: Text(_endDate != null
                        ? DateFormat('MMM d, yyyy').format(_endDate!)
                        : 'Ongoing'),
                    trailing: const Icon(Icons.calendar_today),
                    onTap: () => _selectEndDate(context),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            
            // End date clear button
            if (_endDate != null)
              TextButton.icon(
                onPressed: () {
                  setState(() {
                    _endDate = null;
                  });
                },
                icon: const Icon(Icons.clear),
                label: const Text('Clear End Date'),
              ),
            const SizedBox(height: 24),
            
            Text(
              'Additional Details',
              style: theme.textTheme.titleLarge,
            ),
            const SizedBox(height: 16),
            
            // Quantity field
            TextFormField(
              controller: _quantityController,
              decoration: const InputDecoration(
                labelText: 'Quantity',
                hintText: 'Number of pills/units',
                prefixIcon: Icon(Icons.inventory_2_outlined),
              ),
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 16),
            
            // Refill reminder field
            TextFormField(
              controller: _refillReminderController,
              decoration: const InputDecoration(
                labelText: 'Refill Reminder',
                hintText: 'Remind when this many units left',
                prefixIcon: Icon(Icons.notifications_active_outlined),
              ),
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 16),
            
            // Notes field
            TextFormField(
              controller: _notesController,
              decoration: const InputDecoration(
                labelText: 'Notes',
                hintText: 'Any additional information',
                prefixIcon: Icon(Icons.note),
              ),
              maxLines: 3,
            ),
            const SizedBox(height: 16),
            
            // Active switch
            SwitchListTile(
              title: const Text('Active Medication'),
              subtitle: const Text('Turn off if this medication is not currently being taken'),
              value: _isActive,
              onChanged: (value) {
                setState(() {
                  _isActive = value;
                });
              },
            ),
            const SizedBox(height: 24),
            
            // Save button
            FilledButton(
              onPressed: _saveMedication,
              child: const Text('Save Medication'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTimeChip(MedicationTime time, String label) {
    final isSelected = _selectedTimes.contains(time);
    return FilterChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (_) => _toggleMedicationTime(time),
      avatar: isSelected ? const Icon(Icons.check, size: 18) : null,
    );
  }
} 