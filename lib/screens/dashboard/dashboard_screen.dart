import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:intl/intl.dart';

import '../../app/constants.dart';
import '../../providers/auth/auth_provider.dart';
import '../../providers/water_provider.dart';
import '../../providers/medication_provider.dart';
import '../../widgets/common/app_bar.dart';
import '../../widgets/common/bottom_nav_bar.dart';
import '../../widgets/dashboard/health_metric_card.dart';

/// Provider for tracking the current navigation index
final currentNavIndexProvider = StateProvider<int>((ref) => 0);

/// Dashboard screen - the main screen of the app
class DashboardScreen extends ConsumerStatefulWidget {
  /// Default constructor
  const DashboardScreen({super.key});

  @override
  ConsumerState<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends ConsumerState<DashboardScreen> {
  @override
  void initState() {
    super.initState();
    // Reset the navigation index to 0 (dashboard)
    // Use Future.microtask to avoid calling setState during build
    Future.microtask(() {
      ref.read(currentNavIndexProvider.notifier).state = 0;
      // Load real-time data for the dashboard
      _refreshDashboardData();
    });
  }
  
  Future<void> _refreshDashboardData() async {
    // Refresh water data
    await ref.read(waterProviderProvider.notifier).refreshWaterData();
    // Refresh medication data
    await ref.read(medicationProviderProvider.notifier).refreshMedications();
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(authProvider).user;
    final waterState = ref.watch(waterProviderProvider);
    final medicationState = ref.watch(medicationProviderProvider);
    final today = DateTime.now();
    final dateFormat = DateFormat('EEEE, MMMM d');
    
    // Get actual water intake data from the provider
    final waterIntakeProgress = waterState.progressPercentage;
    final waterIntakeValue = waterState.totalIntake;
    
    // Sample data for other metrics - in a real app, these would come from providers
    final stepsProgress = 0.45; // 45% of daily goal
    final stepsValue = (user?.dailyStepsGoal ?? 10000) * stepsProgress;
    final sleepValue = 6.5; // 6.5 hours of sleep
    final sleepProgress = sleepValue / (user?.dailySleepHoursGoal ?? 8);
    final caloriesBurned = 1240;
    
    return Scaffold(
      appBar: LifeSyncAppBar(
        title: 'Dashboard',
        showBackButton: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {
              context.push('/notifications');
            },
          ),
          PopupMenuButton<String>(
            icon: const CircleAvatar(
              radius: 14,
              backgroundImage: null, // Would use user's photo if available
              child: Icon(Icons.person_outline, size: 20),
            ),
            offset: const Offset(0, 45),
            onSelected: (value) {
              if (value == 'profile') {
                context.push('/account-settings');
              } else if (value == 'settings') {
                context.push('/settings');
              } else if (value == 'logout') {
                _showLogoutConfirmation();
              }
            },
            itemBuilder: (BuildContext context) => [
              const PopupMenuItem<String>(
                value: 'profile',
                child: Row(
                  children: [
                    Icon(Icons.person_outline),
                    SizedBox(width: 8),
                    Text('Profile'),
                  ],
                ),
              ),
              const PopupMenuItem<String>(
                value: 'settings',
                child: Row(
                  children: [
                    Icon(Icons.settings_outlined),
                    SizedBox(width: 8),
                    Text('Settings'),
                  ],
                ),
              ),
              const PopupMenuItem<String>(
                value: 'logout',
                child: Row(
                  children: [
                    Icon(Icons.logout),
                    SizedBox(width: 8),
                    Text('Logout'),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: _refreshDashboardData,
          child: ListView(
            padding: EdgeInsets.zero,
            children: [
              // Header section with gradient background
              Container(
                padding: const EdgeInsets.all(AppConstants.defaultPadding),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Theme.of(context).colorScheme.primaryContainer.withOpacity(0.6),
                      Theme.of(context).colorScheme.surface,
                    ],
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Date and greeting
                    Text(
                      dateFormat.format(today),
                      style: Theme.of(context).textTheme.bodyLarge,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Hello, ${user?.displayName.split(' ').first ?? 'there'}! 👋',
                      style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                  ],
                ),
              ),
              
              // Rest of content
              Padding(
                padding: const EdgeInsets.all(AppConstants.defaultPadding),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 8),
                    
                    // Health metrics
                    const Text(
                      'Health Metrics',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    
                    // Health summary card
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(12.0),
                        child: Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: Theme.of(context).colorScheme.primary.withOpacity(0.1),
                                shape: BoxShape.circle,
                              ),
                              child: Icon(
                                Icons.favorite_outline,
                                color: Theme.of(context).colorScheme.primary,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Your Health Today',
                                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    'You\'re doing well overall. Try to drink more water to reach your goal.',
                                    style: Theme.of(context).textTheme.bodySmall,
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    
                    // Grid of health metrics
                    GridView.count(
                      physics: const NeverScrollableScrollPhysics(),
                      shrinkWrap: true,
                      crossAxisCount: 2,
                      childAspectRatio: 1.5,
                      crossAxisSpacing: 10,
                      mainAxisSpacing: 10,
                      children: [
                        // Water intake card
                        HealthMetricCard(
                          title: 'Water Intake',
                          value: '$waterIntakeValue',
                          unit: 'mL',
                          goal: '${waterState.goalAmount} mL',
                          icon: Icons.water_drop_outlined,
                          color: Colors.blue,
                          progress: waterIntakeProgress,
                          onTap: () => context.push('/water'),
                        ),
                        
                        // Steps card
                        HealthMetricCard(
                          title: 'Steps',
                          value: '${stepsValue.toInt()}',
                          goal: '${user?.dailyStepsGoal ?? 10000} steps',
                          icon: Icons.directions_walk_outlined,
                          color: Colors.green,
                          progress: stepsProgress,
                          onTap: () {
                            // Navigate to steps detail page
                          },
                        ),
                        
                        // Sleep card
                        HealthMetricCard(
                          title: 'Sleep',
                          value: sleepValue.toString(),
                          unit: 'hours',
                          goal: '${user?.dailySleepHoursGoal ?? 8} hours',
                          icon: Icons.bedtime_outlined,
                          color: Colors.indigo,
                          progress: sleepProgress,
                          onTap: () {
                            // Navigate to sleep detail page
                          },
                        ),
                        
                        // Calories card
                        HealthMetricCard(
                          title: 'Calories',
                          value: caloriesBurned.toString(),
                          icon: Icons.local_fire_department_outlined,
                          color: Colors.orange,
                          onTap: () {
                            // Navigate to calories detail page
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    
                    // Medication reminders
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Medications',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        TextButton(
                          onPressed: () => context.push('/medications'),
                          child: const Text('View All'),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    
                    // If no medications, show an add button, otherwise show medication list
                    medicationState.activeMedications.isEmpty
                      ? Card(
                          child: Padding(
                            padding: const EdgeInsets.all(AppConstants.defaultPadding),
                            child: Column(
                              children: [
                                const Icon(
                                  Icons.medication_outlined,
                                  size: 48,
                                  color: Colors.grey,
                                ),
                                const SizedBox(height: 12),
                                const Text(
                                  'No medications added yet',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                const Text(
                                  'Add your medications to get reminders',
                                  textAlign: TextAlign.center,
                                ),
                                const SizedBox(height: 16),
                                FilledButton.icon(
                                  onPressed: () => context.push('/add-medication'),
                                  icon: const Icon(Icons.add),
                                  label: const Text('Add Medication'),
                                ),
                              ],
                            ),
                          ),
                        )
                      : ListView.builder(
                          physics: const NeverScrollableScrollPhysics(),
                          shrinkWrap: true,
                          itemCount: medicationState.activeMedications.length > 2 
                            ? 2 
                            : medicationState.activeMedications.length,
                          itemBuilder: (context, index) {
                            final medication = medicationState.activeMedications[index];
                            return Card(
                              margin: const EdgeInsets.only(bottom: 8),
                              child: ListTile(
                                leading: CircleAvatar(
                                  backgroundColor: Theme.of(context).colorScheme.primaryContainer,
                                  child: const Icon(Icons.medication_outlined),
                                ),
                                title: Text(medication.name),
                                subtitle: Text(
                                  medication.dosage ?? 'No dosage specified',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                trailing: const Icon(Icons.chevron_right),
                                onTap: () => context.push('/medication/${medication.id}'),
                              ),
                            );
                          },
                        ),
                    const SizedBox(height: 24),
                    
                    // Health tips
                    const Text(
                      'Health Tips',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    
                    // Health tip card
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(AppConstants.defaultPadding),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            CircleAvatar(
                              backgroundColor: Theme.of(context).colorScheme.primary.withOpacity(0.1),
                              child: Icon(
                                Icons.lightbulb_outline,
                                color: Theme.of(context).colorScheme.primary,
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'Stay Hydrated',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  const Text(
                                    'Drinking enough water helps maintain energy levels and supports cognitive function.',
                                  ),
                                  const SizedBox(height: 8),
                                  TextButton(
                                    onPressed: () => context.push('/chat'),
                                    child: const Text('Ask AI Assistant'),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: const LifeSyncBottomNavBar(),
    );
  }

  void _showLogoutConfirmation() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Logout'),
        content: const Text('Are you sure you want to logout?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('CANCEL'),
          ),
          FilledButton(
            onPressed: () {
              Navigator.of(context).pop();
              ref.read(authProvider.notifier).signOut();
            },
            child: const Text('LOGOUT'),
          ),
        ],
      ),
    );
  }
} 