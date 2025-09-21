import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:lifesyncaiapp/providers/chat/chat_provider.dart';

import '../../app/constants.dart';

/// Widget for inputting chat messages
class ChatInput extends ConsumerStatefulWidget {
  /// Default constructor
  const ChatInput({super.key});

  @override
  ConsumerState<ChatInput> createState() => _ChatInputState();
}

class _ChatInputState extends ConsumerState<ChatInput> {
  final TextEditingController _controller = TextEditingController();
  final FocusNode _focusNode = FocusNode();
  bool _isTyping = false;
  
  @override
  void initState() {
    super.initState();
    
    // Check for prepopulated message after the build is complete
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final chatState = ref.read(chatProvider);
      if (chatState.prepopulatedMessage != null && chatState.prepopulatedMessage!.isNotEmpty) {
        // Set the text in the controller
        _controller.text = chatState.prepopulatedMessage!;
        setState(() {
          _isTyping = true;
        });
        
        // Clear the prepopulated message
        ref.read(chatProvider.notifier).prepopulateMessage('');
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  void _sendMessage() {
    final text = _controller.text.trim();
    if (text.isEmpty) return;

    ref.read(chatProvider.notifier).sendMessage(text);
    _controller.clear();
    setState(() {
      _isTyping = false;
    });
    
    // Keep focus on the text field
    _focusNode.requestFocus();
  }

  @override
  Widget build(BuildContext context) {
    final chatState = ref.watch(chatProvider);
    final isLoading = chatState.isLoading;
    final theme = Theme.of(context);
    
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 4,
            offset: const Offset(0, -1),
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(24),
                border: Border.all(
                  color: _focusNode.hasFocus
                      ? theme.colorScheme.primary.withOpacity(0.5)
                      : theme.colorScheme.outline.withOpacity(0.2),
                  width: 1.5,
                ),
                color: theme.colorScheme.surface,
              ),
              child: TextField(
                controller: _controller,
                focusNode: _focusNode,
                decoration: InputDecoration(
                  hintText: 'Type your message...',
                  hintStyle: TextStyle(
                    color: theme.colorScheme.onSurfaceVariant.withOpacity(0.7),
                  ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(24),
                    borderSide: BorderSide.none,
                  ),
                  filled: true,
                  fillColor: theme.colorScheme.surfaceVariant.withOpacity(0.5),
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 14,
                  ),
                  isDense: true,
                  suffixIcon: _isTyping 
                      ? IconButton(
                          icon: Icon(
                            Icons.close,
                            color: theme.colorScheme.onSurfaceVariant.withOpacity(0.7),
                            size: 20,
                          ),
                          onPressed: () {
                            _controller.clear();
                            setState(() {
                              _isTyping = false;
                            });
                          },
                        )
                      : null,
                ),
                maxLines: null,
                minLines: 1,
                keyboardType: TextInputType.text,
                textCapitalization: TextCapitalization.sentences,
                textInputAction: TextInputAction.send,
                enabled: !isLoading,
                style: theme.textTheme.bodyLarge?.copyWith(
                  color: theme.colorScheme.onSurface,
                ),
                onChanged: (value) {
                  setState(() {
                    _isTyping = value.trim().isNotEmpty;
                  });
                },
                onSubmitted: (_) => _isTyping && !isLoading ? _sendMessage() : null,
              ),
            ),
          ),
          const SizedBox(width: 12),
          AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            decoration: BoxDecoration(
              color: _isTyping && !isLoading
                  ? theme.colorScheme.primary
                  : theme.colorScheme.surfaceVariant,
              shape: BoxShape.circle,
              boxShadow: _isTyping && !isLoading ? [
                BoxShadow(
                  color: theme.colorScheme.primary.withOpacity(0.3),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ] : null,
            ),
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                borderRadius: BorderRadius.circular(30),
                onTap: isLoading
                  ? null
                  : _isTyping 
                    ? _sendMessage 
                    : () {
                      // TODO: Implement voice input
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: const Text('Voice input coming soon'),
                          behavior: SnackBarBehavior.floating,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                        ),
                      );
                    },
                child: Padding(
                  padding: const EdgeInsets.all(12.0),
                  child: isLoading 
                    ? SizedBox(
                        width: 24, 
                        height: 24, 
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: _isTyping
                            ? theme.colorScheme.onPrimary
                            : theme.colorScheme.onSurfaceVariant,
                        ),
                      )
                    : Icon(
                      _isTyping ? Icons.send_rounded : Icons.mic,
                      color: _isTyping
                          ? theme.colorScheme.onPrimary
                          : theme.colorScheme.onSurfaceVariant,
                      size: 20,
                    ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
} 