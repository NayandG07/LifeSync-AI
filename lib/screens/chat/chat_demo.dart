import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lifesyncaiapp/providers/chat/chat_provider.dart';

/// A demo page to showcase the chat functionality
class ChatDemo extends ConsumerWidget {
  const ChatDemo({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Chat Demo'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Therapist mode button
            ElevatedButton.icon(
              onPressed: () {
                ref.read(chatProvider.notifier).setChatType(ChatType.therapist);
                context.push('/chat');
              },
              icon: const Icon(Icons.psychology),
              label: const Text('Start Therapy Chat'),
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(
                  horizontal: 32, 
                  vertical: 16,
                ),
              ),
            ),
            
            const SizedBox(height: 20),
            
            // Symptom checker mode button
            ElevatedButton.icon(
              onPressed: () {
                ref.read(chatProvider.notifier).setChatType(ChatType.symptomChecker);
                context.push('/chat');
              },
              icon: const Icon(Icons.healing),
              label: const Text('Start Symptom Analysis'),
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(
                  horizontal: 32, 
                  vertical: 16,
                ),
              ),
            ),
            
            const SizedBox(height: 40),
            
            // Clear chat history button
            TextButton.icon(
              onPressed: () {
                ref.read(chatProvider.notifier).clearChat();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Chat history cleared'),
                    duration: Duration(seconds: 2),
                  ),
                );
              },
              icon: const Icon(Icons.delete_outline),
              label: const Text('Clear Chat History'),
            ),
          ],
        ),
      ),
    );
  }
} 