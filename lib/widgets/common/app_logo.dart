import 'package:flutter/material.dart';

/// Simple app logo that uses the LifeSync brand color
class AppLogo extends StatelessWidget {
  /// Default constructor
  const AppLogo({
    this.size = 48.0,
    this.showText = true,
    this.showTagline = false,
    this.textSize,
    this.centered = true,
    super.key,
  });

  /// Size of the logo icon
  final double size;
  
  /// Whether to show the text
  final bool showText;
  
  /// Whether to show the tagline
  final bool showTagline;
  
  /// Text size override
  final double? textSize;
  
  /// Whether to center the logo
  final bool centered;

  @override
  Widget build(BuildContext context) {
    final calculatedTextSize = textSize ?? (size * 0.75);
    final taglineSize = calculatedTextSize * 0.45;
    
    final Color primaryBlue = const Color(0xFF4257DC);
    
    Widget logoContent = Row(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        // Logo icon (simplified)
        Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: primaryBlue.withOpacity(0.1),
            border: Border.all(
              color: primaryBlue,
              width: 2.0,
            ),
          ),
          child: Icon(
            Icons.favorite,
            color: primaryBlue,
            size: size * 0.5,
          ),
        ),
        
        // Text elements
        if (showText) ...[
          SizedBox(width: size * 0.3),
          Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'LifeSync',
                style: TextStyle(
                  color: primaryBlue,
                  fontSize: calculatedTextSize,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 0.5,
                ),
              ),
              if (showTagline)
                Text(
                  'Your personal health and wellness companion',
                  style: TextStyle(
                    color: Colors.grey[600],
                    fontSize: taglineSize,
                  ),
                ),
            ],
          ),
        ],
      ],
    );
    
    if (centered) {
      return Center(child: logoContent);
    }
    
    return logoContent;
  }
} 