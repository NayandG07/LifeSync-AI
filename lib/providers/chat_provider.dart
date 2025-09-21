import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:flutter/foundation.dart';

import '../models/message_model.dart';
import '../services/chat_service.dart';
import '../services/chat_prompt_service.dart';
import '../services/gemini_service.dart';
// Fix auth provider import to match the same one used in routes.dart
import 'auth/auth_provider.dart';

part 'chat_provider.g.dart';