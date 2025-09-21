import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../../widgets/common/app_bar.dart';
import '../../widgets/common/bottom_nav_bar.dart';
import '../../widgets/common/loading_indicator.dart';
import '../../providers/water_provider.dart';
import '../../services/water_log_service.dart';
import '../../app/constants.dart';

/// Water tracking screen
class WaterTrackingScreen extends ConsumerStatefulWidget {
  /// Default constructor
  const WaterTrackingScreen({super.key});

  @override
  ConsumerState<WaterTrackingScreen> createState() => _WaterTrackingScreenState();
}

class _WaterTrackingScreenState extends ConsumerState<WaterTrackingScreen> {
  final _formKey = GlobalKey<FormState>();
  final _waterController = TextEditingController();
  final _notesController = TextEditingController();
  
  // Common water amounts in milliliters
  final List<int> _quickAmounts = [100, 150, 200, 250, 300, 400, 500, 750];

  @override
  void dispose() {
    _waterController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  void _addWaterIntake(int amount) async {
    // Add water intake
    await ref.read(waterProviderProvider.notifier).addWaterIntake(amount);
    
    // Show a success message
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('You added ${amount}ml of water. Great job staying hydrated!'),
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }
  
  void _showAddWaterDialog() {
    _waterController.text = '';
    _notesController.text = '';
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Add Water Intake'),
        content: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextFormField(
                controller: _waterController,
                decoration: const InputDecoration(
                  labelText: 'Amount (ml)',
                  hintText: 'Enter water amount in milliliters',
                  prefixIcon: Icon(Icons.water_drop),
                ),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter an amount';
                  }
                  final amount = int.tryParse(value);
                  if (amount == null || amount <= 0) {
                    return 'Please enter a valid amount';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _notesController,
                decoration: const InputDecoration(
                  labelText: 'Notes (optional)',
                  hintText: 'Add any notes',
                  prefixIcon: Icon(Icons.note),
                ),
                maxLines: 2,
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () {
              if (_formKey.currentState?.validate() ?? false) {
                final amount = int.parse(_waterController.text);
                final notes = _notesController.text.isEmpty 
                    ? null 
                    : _notesController.text;
                
                _addWaterIntake(amount);
                
                Navigator.pop(context);
              }
            },
            child: const Text('Add'),
          ),
        ],
      ),
    );
  }
  
  void _deleteWaterLog(WaterLog log) async {
    await ref.read(waterProviderProvider.notifier).deleteWaterLog(log.id);
    
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Water log deleted'),
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final waterState = ref.watch(waterProviderProvider);
    final theme = Theme.of(context);
    
    return Scaffold(
      appBar: const LifeSyncAppBar(
        title: 'Water Tracking',
      ),
      body: waterState.isLoading
          ? const LoadingIndicator(text: 'Loading water data...')
          : RefreshIndicator(
              onRefresh: () => ref.read(waterProviderProvider.notifier).refreshWaterData(),
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(AppConstants.defaultPadding),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Progress indicator
                    _buildWaterProgressIndicator(waterState, theme),
                    const SizedBox(height: 24),
                    
                    // Quick add buttons
                    _buildQuickAddButtons(),
                    const SizedBox(height: 24),
                    
                    // Today's logs section
                    _buildTodayLogs(waterState, theme),
                  ],
                ),
              ),
            ),
      bottomNavigationBar: const LifeSyncBottomNavBar(),
      floatingActionButton: FloatingActionButton(
        onPressed: _showAddWaterDialog,
        child: const Icon(Icons.add),
      ),
    );
  }
  
  Widget _buildWaterProgressIndicator(WaterState waterState, ThemeData theme) {
    final progressPercentage = waterState.progressPercentage;
    final currentAmount = waterState.totalIntake;
    final goalAmount = waterState.goalAmount;
    
    return Card(
      margin: EdgeInsets.zero,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Row(
              children: [
                const Icon(Icons.water_drop, color: Colors.blue, size: 24),
                const SizedBox(width: 8),
                Text(
                  'Daily Progress',
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const Spacer(),
                Text(
                  '${(progressPercentage * 100).toInt()}%',
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: theme.colorScheme.primary,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            
            // Animated progress bar
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: LinearProgressIndicator(
                value: progressPercentage,
                minHeight: 24,
                backgroundColor: Colors.blue.shade100,
                valueColor: AlwaysStoppedAnimation<Color>(
                  progressPercentage < 0.3 
                      ? Colors.red 
                      : progressPercentage < 0.7 
                          ? Colors.orange 
                          : Colors.green,
                ),
              ),
            ),
            const SizedBox(height: 16),
            
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Current: $currentAmount ml',
                  style: theme.textTheme.titleSmall,
                ),
                Text(
                  'Goal: $goalAmount ml',
                  style: theme.textTheme.titleSmall,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickAddButtons() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Quick Add',
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 8),
        
        // Amount chips
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: _quickAmounts.map((amount) {
            return ActionChip(
              label: Text('$amount ml'),
              onPressed: () => _addWaterIntake(amount),
              avatar: const Icon(Icons.water_drop, size: 16),
            );
          }).toList(),
        ),
        
        const SizedBox(height: 8),
        OutlinedButton.icon(
          onPressed: _showAddWaterDialog,
          icon: const Icon(Icons.add),
          label: const Text('Custom Amount'),
        ),
      ],
    );
  }

  Widget _buildTodayLogs(WaterState waterState, ThemeData theme) {
    final logs = waterState.todayLogs;
    
    if (logs.isEmpty) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.symmetric(vertical: 32.0),
          child: Column(
            children: [
              Icon(Icons.water_drop_outlined, size: 48, color: Colors.grey),
              SizedBox(height: 16),
              Text('No water intake logged today'),
              SizedBox(height: 8),
              Text('Tap the + button to log your water intake'),
            ],
          ),
        ),
      );
    }
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Today\'s Logs',
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            TextButton.icon(
              onPressed: () => context.push('/water-history'),
              icon: const Icon(Icons.history, size: 16),
              label: const Text('History'),
            ),
          ],
        ),
        const SizedBox(height: 8),
        
        // Log list
        ListView.separated(
          physics: const NeverScrollableScrollPhysics(),
          shrinkWrap: true,
          itemCount: logs.length,
          separatorBuilder: (_, __) => const Divider(),
          itemBuilder: (context, index) {
            final log = logs[index];
            final formattedTime = DateFormat.jm().format(log.timestamp);
            
            return Dismissible(
              key: Key(log.id),
              background: Container(
                color: Colors.red,
                alignment: Alignment.centerRight,
                padding: const EdgeInsets.only(right: 16.0),
                child: const Icon(Icons.delete, color: Colors.white),
              ),
              direction: DismissDirection.endToStart,
              onDismissed: (direction) => _deleteWaterLog(log),
              child: ListTile(
                leading: const CircleAvatar(
                  backgroundColor: Colors.blue,
                  child: Icon(Icons.water_drop, color: Colors.white),
                ),
                title: Text('${log.amount} ml'),
                subtitle: Text(
                  log.notes != null && log.notes!.isNotEmpty
                      ? '${log.notes} • $formattedTime'
                      : formattedTime,
                ),
                trailing: IconButton(
                  icon: const Icon(Icons.delete_outline),
                  onPressed: () => _deleteWaterLog(log),
                ),
              ),
            );
          },
        ),
      ],
    );
  }
} 