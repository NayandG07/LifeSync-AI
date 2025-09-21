import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

/// Error display widget for showing error messages
class ErrorDisplay extends ConsumerWidget {
  /// Default constructor
  const ErrorDisplay({
    super.key,
    required this.error,
    this.onRetry,
    this.showIcon = true,
    this.iconSize = 48.0,
    this.iconColor,
    this.textColor,
    this.retryButtonText = 'Retry',
    this.showRetryButton = true,
  });

  /// Error message to display
  final String error;
  
  /// Callback when retry button is pressed
  final VoidCallback? onRetry;
  
  /// Whether to show an icon
  final bool showIcon;
  
  /// Size of the error icon
  final double iconSize;
  
  /// Color of the error icon
  final Color? iconColor;
  
  /// Color of the error text
  final Color? textColor;
  
  /// Text to display on the retry button
  final String retryButtonText;
  
  /// Whether to show the retry button
  final bool showRetryButton;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (showIcon) ...[
              Icon(
                Icons.error_outline_rounded,
                size: iconSize,
                color: iconColor ?? colorScheme.error,
              ),
              const SizedBox(height: 16),
            ],
            Text(
              error,
              style: theme.textTheme.bodyLarge?.copyWith(
                color: textColor ?? colorScheme.onSurface,
              ),
              textAlign: TextAlign.center,
            ),
            if (showRetryButton && onRetry != null) ...[
              const SizedBox(height: 24),
              FilledButton.icon(
                onPressed: onRetry,
                icon: const Icon(Icons.refresh_rounded),
                label: Text(retryButtonText),
              ),
            ],
          ],
        ),
      ),
    );
  }
} 