import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';

import '../../app/constants.dart';

/// A loading indicator with optional text and animation
class LoadingIndicator extends StatelessWidget {
  /// Default constructor
  const LoadingIndicator({
    this.text,
    this.useLottie = false,
    super.key,
  });
  
  /// Optional text to display below the loading indicator
  final String? text;
  
  /// Whether to use Lottie animation or a simple CircularProgressIndicator
  final bool useLottie;
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (useLottie)
            _buildLottieAnimation(theme)
          else
            SizedBox(
              width: 48, 
              height: 48,
              child: CircularProgressIndicator(
                color: theme.colorScheme.primary,
              ),
            ),
          if (text != null) ...[
            const SizedBox(height: 16),
            Text(
              text!,
              style: theme.textTheme.bodyLarge,
              textAlign: TextAlign.center,
            ),
          ],
        ],
      ),
    );
  }
  
  Widget _buildLottieAnimation(ThemeData theme) {
    return SizedBox(
      width: 200,
      height: 200,
      child: LottieBuilder.asset(
        AppConstants.loadingAnimationPath,
        frameRate: FrameRate.max,
        repeat: true,
        errorBuilder: (context, error, stackTrace) {
          // Fallback to standard loading indicator
          return SizedBox(
            width: 48, 
            height: 48,
            child: CircularProgressIndicator(
              color: theme.colorScheme.primary,
            ),
          );
        },
      ),
    );
  }
} 