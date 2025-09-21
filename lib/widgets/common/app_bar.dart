import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';


/// Custom app bar for the application
class LifeSyncAppBar extends ConsumerWidget implements PreferredSizeWidget {
  /// Default constructor
  const LifeSyncAppBar({
    super.key,
    this.title,
    this.actions,
    this.showBackButton = true,
    this.onBackPressed,
    this.bottom,
    this.elevation,
    this.centerTitle = true,
    this.titleSpacing,
    this.backgroundColor,
    this.leading,
  });

  /// The title to display
  final String? title;
  
  /// Actions to display on the right side
  final List<Widget>? actions;
  
  /// Whether to show the back button
  final bool showBackButton;
  
  /// Callback when back button is pressed
  final VoidCallback? onBackPressed;
  
  /// Bottom widget, typically a TabBar
  final PreferredSizeWidget? bottom;
  
  /// Elevation of the app bar
  final double? elevation;
  
  /// Whether to center the title
  final bool centerTitle;
  
  /// Spacing around the title
  final double? titleSpacing;
  
  /// Background color of the app bar
  final Color? backgroundColor;
  
  /// Leading widget
  final Widget? leading;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return AppBar(
      title: title != null ? Text(title!) : null,
      centerTitle: centerTitle,
      titleSpacing: titleSpacing,
      backgroundColor: backgroundColor,
      elevation: elevation ?? 0,
      scrolledUnderElevation: 2,
      actions: actions,
      bottom: bottom,
      leading: _buildLeading(context),
    );
  }
  
  Widget? _buildLeading(BuildContext context) {
    if (leading != null) {
      return leading;
    }
    
    if (showBackButton && Navigator.of(context).canPop()) {
      return IconButton(
        icon: const Icon(Icons.arrow_back_ios_new_rounded),
        onPressed: onBackPressed ?? () => Navigator.of(context).pop(),
        tooltip: 'Back',
      );
    }
    
    return null;
  }

  @override
  Size get preferredSize => Size.fromHeight(
        kToolbarHeight + (bottom?.preferredSize.height ?? 0),
      );
} 