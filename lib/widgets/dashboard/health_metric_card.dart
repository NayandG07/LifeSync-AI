import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

import '../../app/constants.dart';

/// Widget to display a health metric on the dashboard
class HealthMetricCard extends ConsumerWidget {
  /// Default constructor
  const HealthMetricCard({
    super.key,
    required this.title,
    required this.value,
    required this.icon,
    this.unit,
    this.goal,
    this.color,
    this.progress,
    this.onTap,
  });

  /// Title of the metric
  final String title;
  
  /// Current value of the metric
  final String value;
  
  /// Unit of measurement
  final String? unit;
  
  /// Target goal for this metric
  final String? goal;
  
  /// Icon to display
  final IconData icon;
  
  /// Color for the card theme
  final Color? color;
  
  /// Progress towards the goal (0.0 to 1.0)
  final double? progress;
  
  /// Callback when the card is tapped
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final cardColor = color ?? theme.colorScheme.primary;
    final isDarkMode = theme.brightness == Brightness.dark;
    
    return Card(
      clipBehavior: Clip.antiAlias,
      elevation: AppConstants.cardElevation,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppConstants.defaultBorderRadius),
        side: isDarkMode 
            ? BorderSide(color: cardColor.withOpacity(0.3), width: 1.0)
            : BorderSide.none,
      ),
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(10.0), // Reduced from 12.0
          child: LayoutBuilder(
            builder: (context, constraints) {
              final availableWidth = constraints.maxWidth;
              final isCompact = availableWidth < 150; // Check if card is very small
              
              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Row(
                    mainAxisSize: MainAxisSize.max,
                    children: [
                      Icon(
                        icon,
                        color: color,
                        size: isCompact ? 16 : 18, // Reduced from 18/20
                      ),
                      SizedBox(width: isCompact ? 4 : 6), // Reduced from 6/8
                      Expanded(
                        child: Text(
                          title,
                          style: Theme.of(context).textTheme.titleSmall?.copyWith(
                            fontWeight: FontWeight.w600,
                            fontSize: isCompact ? 12 : 14, // Reduced from 14/16
                          ),
                          overflow: TextOverflow.ellipsis,
                          maxLines: 1,
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: isCompact ? 6 : 8), // Reduced from 8/10
                  // Value and unit row
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.baseline,
                    textBaseline: TextBaseline.alphabetic,
                    children: [
                      Flexible(
                        flex: 2,
                        child: Text(
                          value,
                          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                            fontWeight: FontWeight.bold,
                            fontSize: isCompact ? 18 : 20, // Reduced from 20/24
                          ),
                          overflow: TextOverflow.ellipsis,
                          maxLines: 1,
                        ),
                      ),
                      if (unit != null)
                        Flexible(
                          flex: 1,
                          child: Text(
                            unit!,
                            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: Theme.of(context).textTheme.bodySmall?.color?.withOpacity(0.7),
                              fontSize: isCompact ? 10 : 12, // Reduced from 12/14
                            ),
                            overflow: TextOverflow.ellipsis,
                            maxLines: 1,
                          ),
                        ),
                    ],
                  ),
                  
                  // Goal if provided (with ellipsis)
                  if (goal != null) ...[
                    const SizedBox(height: 2),
                    Text(
                      'Goal: $goal',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: theme.textTheme.bodySmall?.copyWith(
                        fontSize: 10, // Smaller text
                        color: isDarkMode 
                          ? Colors.white.withOpacity(0.7) 
                          : theme.colorScheme.onSurfaceVariant,
                      ),
                    ),
                  ],
                  
                  // Progress bar if provided
                  if (progress != null) ...[
                    const SizedBox(height: 6), // Less spacing
                    Stack(
                      children: [
                        // Track
                        Container(
                          height: 4, // Even smaller height
                          decoration: BoxDecoration(
                            color: isDarkMode 
                              ? theme.colorScheme.surfaceContainerHighest
                              : theme.colorScheme.surfaceContainerHighest,
                            borderRadius: BorderRadius.circular(2),
                          ),
                        ),
                        // Progress
                        FractionallySizedBox(
                          widthFactor: progress,
                          child: Container(
                            height: 4, // Even smaller height
                            decoration: BoxDecoration(
                              color: cardColor,
                              borderRadius: BorderRadius.circular(2),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ],
              );
            },
          ),
        ),
      ),
    );
  }
} 