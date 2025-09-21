import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:intl/intl.dart';

import '../../app/constants.dart';
import '../../models/chat/message.dart';

/// Widget to display a chat message
class MessageBubble extends ConsumerWidget {
  /// Default constructor
  const MessageBubble({
    super.key,
    required this.message,
  });

  /// The message to display
  final Message message;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final isUser = message.type == MessageType.user;
    final isSystem = message.type == MessageType.system;
    
    // Format timestamp
    final formattedTime = DateFormat.jm().format(message.timestamp);
    
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0, horizontal: 8.0),
      child: Row(
        mainAxisAlignment: isUser 
            ? MainAxisAlignment.end 
            : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          if (!isUser && !isSystem) ...[
            CircleAvatar(
              backgroundColor: theme.colorScheme.primary,
              radius: 18,
              child: Icon(
                Icons.health_and_safety_rounded,
                color: theme.colorScheme.onPrimary,
                size: 20,
              ),
            ),
            const SizedBox(width: 8),
          ],
          
          Flexible(
            child: Container(
              constraints: BoxConstraints(
                maxWidth: MediaQuery.of(context).size.width * 0.75,
              ),
              padding: const EdgeInsets.symmetric(
                horizontal: 16.0,
                vertical: 12.0,
              ),
              decoration: BoxDecoration(
                color: isSystem
                    ? theme.colorScheme.surfaceVariant
                    : isUser
                        ? theme.colorScheme.primary.withOpacity(0.9)
                        : theme.colorScheme.secondaryContainer.withOpacity(0.9),
                borderRadius: BorderRadius.circular(20.0).copyWith(
                  bottomRight: isUser ? const Radius.circular(4.0) : null,
                  bottomLeft: !isUser ? const Radius.circular(4.0) : null,
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 2,
                    offset: const Offset(0, 1),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (isSystem)
                    Text(
                      message.content,
                      style: theme.textTheme.bodyLarge?.copyWith(
                        color: theme.colorScheme.onSurfaceVariant,
                        fontStyle: FontStyle.italic,
                      ),
                    )
                  else if (message.content.contains('```') || message.content.contains('*') || message.content.contains('- '))
                    // Use Markdown for AI messages with markdown syntax
                    MarkdownBody(
                      data: message.content,
                      styleSheet: MarkdownStyleSheet(
                        p: theme.textTheme.bodyLarge?.copyWith(
                          color: isUser
                              ? theme.colorScheme.onPrimary
                              : theme.colorScheme.onSecondaryContainer,
                          height: 1.4,
                        ),
                        code: theme.textTheme.bodyMedium?.copyWith(
                          fontFamily: 'monospace',
                          backgroundColor: isUser
                              ? theme.colorScheme.primaryContainer
                              : theme.colorScheme.tertiaryContainer,
                          color: isUser
                              ? theme.colorScheme.onPrimaryContainer
                              : theme.colorScheme.onTertiaryContainer,
                        ),
                        codeblockDecoration: BoxDecoration(
                          color: isUser
                              ? theme.colorScheme.primaryContainer
                              : theme.colorScheme.tertiaryContainer,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        blockquote: theme.textTheme.bodyMedium?.copyWith(
                          color: isUser
                              ? theme.colorScheme.onPrimary.withOpacity(0.9)
                              : theme.colorScheme.onSecondaryContainer.withOpacity(0.9),
                          fontStyle: FontStyle.italic,
                        ),
                        h1: theme.textTheme.titleLarge?.copyWith(
                          color: isUser
                              ? theme.colorScheme.onPrimary
                              : theme.colorScheme.onSecondaryContainer,
                        ),
                        h2: theme.textTheme.titleMedium?.copyWith(
                          color: isUser
                              ? theme.colorScheme.onPrimary
                              : theme.colorScheme.onSecondaryContainer,
                        ),
                        h3: theme.textTheme.titleSmall?.copyWith(
                          color: isUser
                              ? theme.colorScheme.onPrimary
                              : theme.colorScheme.onSecondaryContainer,
                        ),
                        em: TextStyle(
                          fontStyle: FontStyle.italic,
                        ),
                        strong: TextStyle(
                          fontWeight: FontWeight.bold,
                        ),
                        listBullet: theme.textTheme.bodyLarge?.copyWith(
                          color: isUser
                              ? theme.colorScheme.onPrimary
                              : theme.colorScheme.onSecondaryContainer,
                        ),
                      ),
                      onTapLink: (text, href, title) {
                        if (href != null) {
                          launchUrl(Uri.parse(href));
                        }
                      },
                    )
                  else
                    // Regular text for simple messages
                    Text(
                      message.content,
                      style: theme.textTheme.bodyLarge?.copyWith(
                        color: isUser
                            ? theme.colorScheme.onPrimary
                            : theme.colorScheme.onSecondaryContainer,
                        fontWeight: FontWeight.w400,
                        height: 1.4,
                        fontSize: 16,
                      ),
                    ),
                  const SizedBox(height: 6),
                  Text(
                    formattedTime,
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: isUser
                          ? theme.colorScheme.onPrimary.withOpacity(0.7)
                          : isSystem
                              ? theme.colorScheme.onSurfaceVariant.withOpacity(0.7)
                              : theme.colorScheme.onSecondaryContainer.withOpacity(0.7),
                      fontSize: 10,
                    ),
                  ),
                ],
              ),
            ),
          ),
          
          if (isUser) ...[
            const SizedBox(width: 8),
            CircleAvatar(
              backgroundColor: theme.colorScheme.primaryContainer,
              radius: 18,
              child: Icon(
                Icons.person,
                color: theme.colorScheme.onPrimaryContainer,
                size: 20,
              ),
            ),
          ],
        ],
      ),
    );
  }
} 