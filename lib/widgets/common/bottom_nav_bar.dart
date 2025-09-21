import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

/// Provider to track the current navigation index
final currentNavIndexProvider = StateProvider<int>((ref) => 0);

/// Custom bottom navigation bar for the application
class LifeSyncBottomNavBar extends ConsumerWidget {
  /// Default constructor
  const LifeSyncBottomNavBar({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentIndex = ref.watch(currentNavIndexProvider);
    
    return NavigationBar(
      selectedIndex: currentIndex,
      onDestinationSelected: (index) {
        ref.read(currentNavIndexProvider.notifier).state = index;
        
        switch (index) {
          case 0:
            context.go('/dashboard');
            break;
          case 1:
            context.go('/water');
            break;
          case 2:
            context.go('/medications');
            break;
          case 3:
            context.go('/chat');
            break;
          case 4:
            context.go('/symptoms');
            break;
        }
      },
      destinations: const [
        NavigationDestination(
          icon: Icon(Icons.dashboard_outlined),
          selectedIcon: Icon(Icons.dashboard),
          label: 'Dashboard',
        ),
        NavigationDestination(
          icon: Icon(Icons.water_drop_outlined),
          selectedIcon: Icon(Icons.water_drop),
          label: 'Water',
        ),
        NavigationDestination(
          icon: Icon(Icons.medication_outlined),
          selectedIcon: Icon(Icons.medication),
          label: 'Meds',
        ),
        NavigationDestination(
          icon: Icon(Icons.chat_outlined),
          selectedIcon: Icon(Icons.chat),
          label: 'Chat',
        ),
        NavigationDestination(
          icon: Icon(Icons.healing_outlined),
          selectedIcon: Icon(Icons.healing),
          label: 'Symptoms',
        ),
      ],
    );
  }
} 