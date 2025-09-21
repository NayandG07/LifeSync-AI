import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:go_router/go_router.dart';

import '../../providers/auth/auth_provider.dart';
import '../../utils/input_validators.dart';
import '../../widgets/common/app_bar.dart';
import '../../widgets/common/loading_indicator.dart';
import '../../app/constants.dart';

/// Account settings screen
class AccountSettingsScreen extends ConsumerStatefulWidget {
  /// Default constructor
  const AccountSettingsScreen({super.key});

  @override
  ConsumerState<AccountSettingsScreen> createState() => _AccountSettingsScreenState();
}

class _AccountSettingsScreenState extends ConsumerState<AccountSettingsScreen> {
  final _formKey = GlobalKey<FormState>();
  final _displayNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _weightController = TextEditingController();
  final _heightController = TextEditingController();

  String _selectedGender = 'Male';
  DateTime? _selectedDate;
  final List<String> _genders = ['Male', 'Female', 'Other', 'Prefer not to say'];
  bool _isEditing = false;

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
    _displayNameController.dispose();
    _emailController.dispose();
    _weightController.dispose();
    _heightController.dispose();
    super.dispose();
  }

  void _loadUserData() {
    final user = ref.read(authProvider).user;
    if (user != null) {
      _displayNameController.text = user.displayName;
      _emailController.text = user.email;
      
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
    if (!_isEditing) return;
    
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

  void _toggleEditing() {
    setState(() {
      _isEditing = !_isEditing;
    });
  }
  
  Future<void> _saveProfile() async {
    if (_formKey.currentState?.validate() ?? false) {
      final weight = double.tryParse(_weightController.text);
      final height = double.tryParse(_heightController.text);
      
      final user = ref.read(authProvider).user;
      if (user != null) {
        final updatedUser = user.copyWith(
          displayName: _displayNameController.text,
          weight: weight,
          height: height,
          gender: _selectedGender,
          dateOfBirth: _selectedDate,
        );
        
        await ref.read(authProvider.notifier).updateProfile(updatedUser);
        
        if (mounted) {
          setState(() {
            _isEditing = false;
          });
          
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Profile updated successfully'),
              behavior: SnackBarBehavior.floating,
            ),
          );
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final authState = ref.watch(authProvider);
    final user = authState.user;
    
    if (authState.isLoading) {
      return Scaffold(
        appBar: const LifeSyncAppBar(
          title: 'Profile',
        ),
        body: const LoadingIndicator(
          text: 'Loading profile...',
        ),
      );
    }
    
    if (user == null) {
      return Scaffold(
        appBar: const LifeSyncAppBar(
          title: 'Profile',
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.error_outline,
                size: 60,
                color: theme.colorScheme.error,
              ),
              const SizedBox(height: 16),
              const Text('User not found'),
              const SizedBox(height: 24),
              FilledButton(
                onPressed: () => context.go('/login'),
                child: const Text('Sign in'),
              ),
            ],
          ),
        ),
      );
    }
    
    return Scaffold(
      appBar: LifeSyncAppBar(
        title: 'Profile',
        actions: [
          IconButton(
            icon: Icon(_isEditing ? Icons.close : Icons.edit),
            onPressed: _toggleEditing,
          ),
        ],
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(AppConstants.defaultPadding),
          children: [
            // Profile Image
            Center(
              child: Stack(
                alignment: Alignment.bottomRight,
                children: [
                  const CircleAvatar(
                    radius: 50,
                    backgroundImage: null, // Would use user's photo if available
                    child: Icon(Icons.person, size: 50),
                  ),
                  if (_isEditing)
                    Container(
                      decoration: BoxDecoration(
                        color: theme.colorScheme.primary,
                        shape: BoxShape.circle,
                      ),
                      child: IconButton(
                        icon: const Icon(Icons.camera_alt, color: Colors.white, size: 20),
                        onPressed: () {
                          // TODO: Implement image upload
                        },
                      ),
                    ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            
            Text(
              'Personal Information',
              style: theme.textTheme.titleLarge,
            ),
            const SizedBox(height: 16),
            
            // Display Name Field
            TextFormField(
              controller: _displayNameController,
              decoration: const InputDecoration(
                labelText: 'Display Name',
                hintText: 'Enter your name',
                prefixIcon: Icon(Icons.person_outline),
              ),
              enabled: _isEditing,
              validator: (value) => InputValidators.validateNotEmpty(
                value,
                errorMessage: 'Display name is required',
              ),
            ),
            const SizedBox(height: 16),
            
            // Email Field
            TextFormField(
              controller: _emailController,
              decoration: const InputDecoration(
                labelText: 'Email',
                hintText: 'Enter your email',
                prefixIcon: Icon(Icons.email_outlined),
              ),
              enabled: false, // Email cannot be changed
              validator: (value) => InputValidators.validateEmail(value),
            ),
            const SizedBox(height: 24),
            
            Text(
              'Health Information',
              style: theme.textTheme.titleLarge,
            ),
            const SizedBox(height: 16),
            
            // Date of Birth Picker
            ListTile(
              enabled: _isEditing,
              title: const Text('Date of Birth'),
              subtitle: Text(
                _selectedDate != null
                    ? DateFormat('MMMM d, yyyy').format(_selectedDate!)
                    : 'Not set',
              ),
              trailing: _isEditing ? const Icon(Icons.calendar_month) : null,
              onTap: () => _selectDate(context),
            ),
            const Divider(),
            
            // Gender Selection
            ListTile(
              enabled: _isEditing,
              title: const Text('Gender'),
              subtitle: Text(_selectedGender),
              trailing: _isEditing ? const Icon(Icons.arrow_drop_down) : null,
              onTap: _isEditing ? () {
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
              } : null,
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
              enabled: _isEditing,
              validator: (value) => _isEditing ? InputValidators.validateNumeric(
                value,
                fieldName: 'Height',
              ) : null,
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
              enabled: _isEditing,
              validator: (value) => _isEditing ? InputValidators.validateNumeric(
                value,
                fieldName: 'Weight',
              ) : null,
            ),
            const SizedBox(height: 32),
            
            // Save Button (Only shown in edit mode)
            if (_isEditing)
              FilledButton(
                onPressed: _saveProfile,
                child: const Text('Save Profile'),
              ),
            
            if (!_isEditing)
              ListTile(
                leading: const Icon(Icons.password),
                title: const Text('Change Password'),
                trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                onTap: () {
                  // Navigate to change password
                  context.push('/change-password');
                },
              ),
              
            if (!_isEditing)
              ListTile(
                leading: Icon(Icons.delete_outline, color: theme.colorScheme.error),
                title: Text('Delete Account', style: TextStyle(color: theme.colorScheme.error)),
                trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                onTap: () {
                  // Show delete account confirmation
                  showDialog(
                    context: context,
                    builder: (context) => AlertDialog(
                      title: const Text('Delete Account?'),
                      content: const Text(
                          'This action cannot be undone. All your data will be permanently deleted.'),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.pop(context),
                          child: const Text('Cancel'),
                        ),
                        TextButton(
                          onPressed: () {
                            // TODO: Implement account deletion
                            Navigator.pop(context);
                          },
                          child: Text(
                            'Delete',
                            style: TextStyle(color: theme.colorScheme.error),
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
          ],
        ),
      ),
    );
  }
} 
