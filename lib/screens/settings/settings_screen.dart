import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../widgets/common/app_bar.dart';
import '../../widgets/common/bottom_nav_bar.dart';
import '../../app/constants.dart';
import '../../providers/theme_provider.dart';
import '../../providers/auth/auth_provider.dart';

/// Settings screen
class SettingsScreen extends ConsumerWidget {
  /// Default constructor
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeMode = ref.watch(themeModeNotifierProvider);
    final isDarkMode = themeMode == ThemeMode.dark;
    
    return Scaffold(
      appBar: const LifeSyncAppBar(
        title: 'Settings',
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppConstants.defaultPadding),
        children: [
          ListTile(
            leading: const Icon(Icons.person_outline),
            title: const Text('Account Settings'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () => context.push('/account-settings'),
          ),
          const Divider(),
          ListTile(
            leading: Icon(isDarkMode ? Icons.dark_mode : Icons.light_mode),
            title: const Text('Theme'),
            trailing: Switch(
              value: isDarkMode,
              onChanged: (value) {
                ref.read(themeModeNotifierProvider.notifier).toggleTheme();
              },
            ),
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.health_and_safety_outlined),
            title: const Text('Health Connect'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () => context.push('/health-connect'),
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.logout),
            title: const Text('Logout'),
            onTap: () {
              showDialog(
                context: context,
                builder: (context) => AlertDialog(
                  title: const Text('Logout'),
                  content: const Text('Are you sure you want to logout?'),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.pop(context),
                      child: const Text('Cancel'),
                    ),
                    FilledButton(
                      onPressed: () async {
                        Navigator.pop(context);
                        await ref.read(authProvider.notifier).signOut();
                      },
                      child: const Text('Logout'),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
      bottomNavigationBar: const LifeSyncBottomNavBar(),
    );
  }
} 