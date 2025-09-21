import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../../app/constants.dart';
import '../../models/chat/message.dart';
import '../../providers/chat/chat_provider.dart';
import '../../widgets/common/app_bar.dart';
import '../../widgets/common/bottom_nav_bar.dart';
import '../../widgets/common/loading_indicator.dart';
import '../../widgets/common/error_display.dart';
import '../../widgets/chat/chat_input.dart';
import '../../widgets/chat/message_bubble.dart';

/// Chat screen for interacting with the AI assistant
class ChatScreen extends ConsumerStatefulWidget {
  /// Default constructor
  const ChatScreen({super.key});
  
  @override
  ConsumerState<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends ConsumerState<ChatScreen> {
  @override
  void initState() {
    super.initState();
    
    // Ensure the chat type is set to therapist mode
    WidgetsBinding.instance.addPostFrameCallback((_) {
      // Always use therapist mode in the chat screen
      ref.read(chatProvider.notifier).setChatType(ChatType.therapist);
      
      // Check for any pending message that needs to be sent automatically
      // This is used when navigating from the symptoms screen
      final chatState = ref.read(chatProvider);
      if (chatState.pendingUserMessage != null && chatState.pendingUserMessage!.isNotEmpty) {
        ref.read(chatProvider.notifier).sendMessage(chatState.pendingUserMessage!);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final chatState = ref.watch(chatProvider);
    final theme = Theme.of(context);
    
    return Scaffold(
      appBar: LifeSyncAppBar(
        title: 'LifeSync AI',
        actions: [
          IconButton(
            icon: const Icon(Icons.info_outline),
            onPressed: () {
              showDialog(
                context: context,
                builder: (context) => AlertDialog(
                  title: const Text('About LifeSync AI'),
                  content: const SingleChildScrollView(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Your personal health assistant powered by AI.',
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                        SizedBox(height: 16),
                        Text('You can ask about:'),
                        SizedBox(height: 8),
                        Text('• Health information and advice'),
                        Text('• Medication information'),
                        Text('• Fitness and wellness tips'),
                        Text('• Mental health support'),
                        Text('• Nutrition guidance'),
                        SizedBox(height: 16),
                        Text(
                          'Note: This AI provides general information only. Always consult healthcare professionals for medical advice.',
                          style: TextStyle(fontStyle: FontStyle.italic),
                        ),
                      ],
                    ),
                  ),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.of(context).pop(),
                      child: const Text('Close'),
                    ),
                  ],
                ),
              );
            },
            tooltip: 'About LifeSync AI',
          ),
        ],
        leading: Builder(
          builder: (context) => IconButton(
            icon: const Icon(Icons.menu),
            onPressed: () {
              Scaffold.of(context).openDrawer();
            },
          ),
        ),
      ),
      
      drawer: _buildChatDrawer(context),
      
      body: Column(
        children: [
          // Error message if any
          if (chatState.error != null) ...[
            Padding(
              padding: const EdgeInsets.all(AppConstants.smallPadding),
              child: ErrorDisplay(
                error: chatState.error ?? 'An error occurred',
                showRetryButton: false,
                showIcon: false,
              ),
            ),
          ],
          
          // Message list
          Expanded(
            child: chatState.messages.isEmpty
                ? _buildWelcomeMessage(context, ref)
                : _buildChatMessages(context, ref, chatState),
          ),
          
          // Typing indicator
          if (chatState.isLoading)
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: AppConstants.mediumPadding,
                vertical: AppConstants.smallPadding,
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(AppConstants.smallPadding),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.surfaceVariant,
                      borderRadius: BorderRadius.circular(
                        AppConstants.largeBorderRadius,
                      ),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          'LifeSync AI is typing',
                          style: theme.textTheme.bodySmall,
                        ),
                        const SizedBox(width: 8),
                        SizedBox(
                          width: 16,
                          height: 16,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: theme.colorScheme.primary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          
          // Input field
          const Padding(
            padding: EdgeInsets.all(AppConstants.smallPadding),
            child: ChatInput(),
          ),
        ],
      ),
      
      bottomNavigationBar: const LifeSyncBottomNavBar(),
    );
  }
  
  Widget _buildChatDrawer(BuildContext context) {
    final theme = Theme.of(context);
    final chatState = ref.watch(chatProvider);
    final conversations = chatState.conversations;
    
    return Drawer(
      child: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                children: [
                  Icon(
                    Icons.chat_bubble_rounded,
                    color: theme.colorScheme.primary,
                  ),
                  const SizedBox(width: 16),
                  Text(
                    'Chat History',
                    style: theme.textTheme.titleLarge,
                  ),
                ],
              ),
            ),
            Divider(),
            Expanded(
              child: conversations.isEmpty
                ? Center(
                    child: Text(
                      'No saved chats',
                      style: theme.textTheme.bodyMedium?.copyWith(
                        color: theme.colorScheme.outline,
                      ),
                    ),
                  )
                : ListView.builder(
                    padding: EdgeInsets.zero,
                    itemCount: conversations.length + 1, // +1 for the "New Chat" item
                    itemBuilder: (context, index) {
                      if (index == 0) {
                        // First item is always "New Chat"
                        return ListTile(
                          leading: CircleAvatar(
                            backgroundColor: theme.colorScheme.primaryContainer,
                            child: const Icon(Icons.add),
                          ),
                          title: const Text('New Chat'),
                          onTap: () {
                            // Create a new chat and close drawer
                            ref.read(chatProvider.notifier).createNewChat();
                            Navigator.pop(context);
                          },
                        );
                      }
                      
                      // Adjust index for the actual conversations
                      final conversation = conversations[index - 1];
                      final isActive = chatState.currentConversationId == conversation.id;
                      
                      return Dismissible(
                        key: Key(conversation.id),
                        background: Container(
                          color: theme.colorScheme.error,
                          alignment: Alignment.centerRight,
                          padding: const EdgeInsets.only(right: 16.0),
                          child: Icon(
                            Icons.delete,
                            color: theme.colorScheme.onError,
                          ),
                        ),
                        direction: DismissDirection.endToStart,
                        confirmDismiss: (direction) async {
                          return await showDialog(
                            context: context,
                            builder: (context) => AlertDialog(
                              title: const Text('Delete Chat'),
                              content: const Text('Are you sure you want to delete this chat?'),
                              actions: [
                                TextButton(
                                  onPressed: () => Navigator.of(context).pop(false),
                                  child: const Text('CANCEL'),
                                ),
                                TextButton(
                                  onPressed: () => Navigator.of(context).pop(true),
                                  child: const Text('DELETE'),
                                ),
                              ],
                            ),
                          );
                        },
                        onDismissed: (direction) {
                          // Delete this chat
                          ref.read(chatProvider.notifier).deleteConversation(conversation.id);
                        },
                        child: ListTile(
                          leading: CircleAvatar(
                            backgroundColor: isActive 
                                ? theme.colorScheme.primary
                                : theme.colorScheme.surfaceVariant,
                            child: Icon(
                              conversation.chatType == 'therapist'
                                  ? Icons.psychology
                                  : Icons.medical_services_outlined,
                              color: isActive
                                  ? theme.colorScheme.onPrimary
                                  : theme.colorScheme.onSurfaceVariant,
                            ),
                          ),
                          title: Text(
                            conversation.title,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
                            ),
                          ),
                          subtitle: conversation.updatedAt != null
                              ? Text(
                                  _formatChatTime(conversation.updatedAt!),
                                  style: theme.textTheme.bodySmall,
                                )
                              : null,
                          selected: isActive,
                          onTap: () {
                            // Select this chat
                            if (!isActive) {
                              ref.read(chatProvider.notifier).setConversation(conversation.id);
                            }
                            Navigator.pop(context);
                          },
                          trailing: IconButton(
                            icon: const Icon(Icons.delete_outline),
                            onPressed: () async {
                              final delete = await showDialog<bool>(
                                context: context,
                                builder: (context) => AlertDialog(
                                  title: const Text('Delete Chat'),
                                  content: const Text('Are you sure you want to delete this chat?'),
                                  actions: [
                                    TextButton(
                                      onPressed: () => Navigator.of(context).pop(false),
                                      child: const Text('CANCEL'),
                                    ),
                                    TextButton(
                                      onPressed: () => Navigator.of(context).pop(true),
                                      child: const Text('DELETE'),
                                    ),
                                  ],
                                ),
                              );
                              
                              if (delete == true) {
                                ref.read(chatProvider.notifier).deleteConversation(conversation.id);
                              }
                            },
                          ),
                        ),
                      );
                    },
                  ),
            ),
            Divider(),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: FilledButton.icon(
                onPressed: () async {
                  // Show confirmation dialog before clearing all chats
                  final confirm = await showDialog<bool>(
                    context: context,
                    builder: (context) => AlertDialog(
                      title: const Text('Clear All Chats'),
                      content: const Text('Are you sure you want to delete all your chat history? This cannot be undone.'),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.of(context).pop(false),
                          child: const Text('CANCEL'),
                        ),
                        TextButton(
                          onPressed: () => Navigator.of(context).pop(true),
                          child: const Text('DELETE ALL'),
                        ),
                      ],
                    ),
                  );
                  
                  if (confirm == true) {
                    await ref.read(chatProvider.notifier).deleteAllConversations();
                    Navigator.pop(context);
                  }
                },
                icon: const Icon(Icons.delete_forever),
                label: const Text('Clear All Chats'),
                style: FilledButton.styleFrom(
                  minimumSize: const Size.fromHeight(50),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
  
  // Format the conversation time in a human-readable way
  String _formatChatTime(DateTime dateTime) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final yesterday = today.subtract(const Duration(days: 1));
    final dateToCheck = DateTime(dateTime.year, dateTime.month, dateTime.day);
    
    if (dateToCheck == today) {
      // Today, just show the time
      return 'Today, ${DateFormat.jm().format(dateTime)}';
    } else if (dateToCheck == yesterday) {
      // Yesterday
      return 'Yesterday, ${DateFormat.jm().format(dateTime)}';
    } else if (now.difference(dateTime).inDays < 7) {
      // Within the last week
      return DateFormat('EEEE, ').add_jm().format(dateTime); // e.g. "Monday, 3:30 PM"
    } else {
      // Older
      return DateFormat.yMMMd().add_jm().format(dateTime); // e.g. "Jan 5, 2023, 3:30 PM"
    }
  }
  
  Widget _buildWelcomeMessage(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    
    // Only show therapist welcome message
    return Center(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(AppConstants.largePadding),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircleAvatar(
              radius: 50,
              backgroundColor: theme.colorScheme.primaryContainer,
              child: Icon(
                Icons.psychology,
                size: 50,
                color: theme.colorScheme.primary,
              ),
            ),
            const SizedBox(height: AppConstants.mediumPadding),
            Text(
              'LifeSync AI',
              style: theme.textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.bold,
                color: theme.colorScheme.primary,
              ),
            ),
            const SizedBox(height: AppConstants.smallPadding),
            Text(
              'Your personal health and wellness companion',
              style: theme.textTheme.bodyLarge,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: AppConstants.mediumPadding),
            Text(
              'Ask me about:',
              style: theme.textTheme.titleMedium,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: AppConstants.smallPadding),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              alignment: WrapAlignment.center,
              children: _buildTherapistSuggestions(context, ref),
            ),
          ],
        ),
      ),
    );
  }
  
  List<Widget> _buildTherapistSuggestions(BuildContext context, WidgetRef ref) {
    return [
      _buildSuggestionChip(context, ref, 'How can I improve my sleep?'),
      _buildSuggestionChip(context, ref, 'I\'ve been feeling anxious lately'),
      _buildSuggestionChip(context, ref, 'How to reduce stress?'),
      _buildSuggestionChip(context, ref, 'I\'m feeling overwhelmed'),
      _buildSuggestionChip(context, ref, 'Tips for mental health'),
    ];
  }
  
  Widget _buildSuggestionChip(BuildContext context, WidgetRef ref, String text) {
    return ActionChip(
      label: Text(text),
      onPressed: () {
        // Set this suggestion as a message
        ref.read(chatProvider.notifier).sendMessage(text);
      },
    );
  }

  Widget _buildChatMessages(
    BuildContext context, 
    WidgetRef ref, 
    ChatState chatState,
  ) {
    return ListView.builder(
      padding: const EdgeInsets.all(AppConstants.mediumPadding),
      reverse: true, // Start from the bottom
      itemCount: chatState.messages.length,
      itemBuilder: (context, index) {
        // Reverse index to show newest messages at the bottom
        final reversedIndex = chatState.messages.length - 1 - index;
        final message = chatState.messages[reversedIndex];
        
        // Determine if we should show timestamp (first message or if more than 5 min since previous)
        bool showTimestamp = true;
        if (reversedIndex > 0) {
          final prevMessage = chatState.messages[reversedIndex - 1];
          final timeDiff = message.timestamp.difference(prevMessage.timestamp);
          showTimestamp = timeDiff.inMinutes > 5;
        }
        
        return Column(
          children: [
            if (showTimestamp)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 8.0),
                child: Text(
                  DateFormat.yMd().add_jm().format(message.timestamp),
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: Theme.of(context).colorScheme.outline,
                  ),
                ),
              ),
            MessageBubble(message: message),
            const SizedBox(height: AppConstants.smallPadding),
          ],
        );
      },
    );
  }
} 