import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:intl/intl.dart';

import '../../app/constants.dart';
import '../../providers/auth/auth_provider.dart';
import '../../utils/input_validators.dart';
import '../../widgets/common/app_bar.dart';
import '../../widgets/common/app_logo.dart';
import '../../widgets/common/loading_indicator.dart';

/// Profile setup screen for onboarding new users
class ProfileSetupScreen extends ConsumerStatefulWidget {
  /// Default constructor
  const ProfileSetupScreen({super.key});

  @override
  ConsumerState<ProfileSetupScreen> createState() => _ProfileSetupScreenState();
}

class _ProfileSetupScreenState extends ConsumerState<ProfileSetupScreen> {
  final _formKey = GlobalKey<FormState>();
  final _weightController = TextEditingController();
  final _heightController = TextEditingController();

  String _selectedGender = 'Male';
  DateTime? _selectedDate;
  final List<String> _genders = ['Male', 'Female', 'Other', 'Prefer not to say'];
  final int _waterGoal = AppConstants.defaultDailyWaterIntakeGoalMl;
  final int _stepsGoal = AppConstants.optimalDailyStepsGoal;
  final int _sleepGoal = AppConstants.minSleepHoursGoal;

  @override
  void initState() {
    super.initState();
    // Delay to ensure the widget is properly mounted
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadUserData();
    });
  }

  @override
  void dispose() {
    _weightController.dispose();
    _heightController.dispose();
    super.dispose();
  }

  void _loadUserData() {
    final user = ref.read(authProvider).user;
    if (user != null) {
      if (user.weight != null) {
        _weightController.text = user.weight.toString();
      }
      if (user.height != null) {
        _heightController.text = user.height.toString();
      }
      if (user.gender != null) {
        setState(() {
          _selectedGender = user.gender!;
        });
      }
      if (user.dateOfBirth != null) {
        setState(() {
          _selectedDate = user.dateOfBirth;
        });
      }
    }
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate ?? DateTime.now().subtract(const Duration(days: 365 * 25)),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: Theme.of(context).colorScheme,
          ),
          child: child!,
        );
      },
    );
    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
      });
    }
  }
  
  Future<void> _completeSetup() async {
    if (_formKey.currentState?.validate() ?? false) {
      final weight = double.tryParse(_weightController.text);
      final height = double.tryParse(_heightController.text);
      
      final user = ref.read(authProvider).user;
      if (user != null) {
        final updatedUser = user.copyWith(
          weight: weight,
          height: height,
          gender: _selectedGender,
          dateOfBirth: _selectedDate,
          dailyWaterGoalMl: _waterGoal,
          dailyStepsGoal: _stepsGoal,
          dailySleepHoursGoal: _sleepGoal,
          isOnboarded: true,
        );
        
        await ref.read(authProvider.notifier).completeOnboarding(updatedUser);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final authState = ref.watch(authProvider);
    
    if (authState.isLoading) {
      return Scaffold(
        appBar: const LifeSyncAppBar(
          title: 'Setting Up Profile',
          showBackButton: false,
        ),
        body: const LoadingIndicator(
          text: 'Saving your profile...',
        ),
      );
    }
    
    return Scaffold(
      appBar: const LifeSyncAppBar(
        title: 'Complete Your Profile',
        showBackButton: false,
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(AppConstants.defaultPadding),
          children: [
            // App Logo
            const AppLogo(
              size: 60,
              showText: false,
              centered: true,
            ),
            const SizedBox(height: 24),
            
            Text(
              'Health Information',
              style: theme.textTheme.titleLarge,
            ),
            const SizedBox(height: 16),
            
            // Date of Birth Picker
            ListTile(
              title: const Text('Date of Birth'),
              subtitle: Text(
                _selectedDate != null
                    ? DateFormat('MMMM d, yyyy').format(_selectedDate!)
                    : 'Select your date of birth',
              ),
              trailing: const Icon(Icons.calendar_month),
              onTap: () => _selectDate(context),
            ),
            const Divider(),
            
            // Gender Selection
            ListTile(
              title: const Text('Gender'),
              subtitle: Text(_selectedGender),
              trailing: const Icon(Icons.arrow_drop_down),
              onTap: () {
                showDialog(
                  context: context,
                  builder: (context) => AlertDialog(
                    title: const Text('Select Gender'),
                    content: SizedBox(
                      width: double.maxFinite,
                      child: ListView.builder(
                        shrinkWrap: true,
                        itemCount: _genders.length,
                        itemBuilder: (context, index) {
                          return ListTile(
                            title: Text(_genders[index]),
                            onTap: () {
                              setState(() {
                                _selectedGender = _genders[index];
                              });
                              Navigator.pop(context);
                            },
                          );
                        },
                      ),
                    ),
                  ),
                );
              },
            ),
            const Divider(),
            
            // Height Field
            TextFormField(
              controller: _heightController,
              decoration: const InputDecoration(
                labelText: 'Height (cm)',
                hintText: 'Enter your height in centimeters',
                prefixIcon: Icon(Icons.height),
              ),
              keyboardType: TextInputType.number,
              validator: (value) => InputValidators.validateNumeric(
                value,
                fieldName: 'Height',
              ),
            ),
            const SizedBox(height: 16),
            
            // Weight Field
            TextFormField(
              controller: _weightController,
              decoration: const InputDecoration(
                labelText: 'Weight (kg)',
                hintText: 'Enter your weight in kilograms',
                prefixIcon: Icon(Icons.monitor_weight_outlined),
              ),
              keyboardType: TextInputType.number,
              validator: (value) => InputValidators.validateNumeric(
                value,
                fieldName: 'Weight',
              ),
            ),
            const SizedBox(height: 24),
            
            const SizedBox(height: 32),
            
            // Complete Button
            FilledButton(
              onPressed: authState.isLoading ? null : _completeSetup,
              child: const Text('Complete Setup'),
            ),
            
            if (authState.error != null) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: theme.colorScheme.errorContainer,
                  borderRadius: BorderRadius.circular(AppConstants.defaultBorderRadius),
                ),
                child: Text(
                  authState.error!,
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: theme.colorScheme.onErrorContainer,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
} 
