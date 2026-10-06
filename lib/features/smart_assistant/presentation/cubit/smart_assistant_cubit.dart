import 'package:flutter_bloc/flutter_bloc.dart';

import '../../data/smart_assistant_repository.dart';
import '../../data/tashih_chat_api.dart';

class SmartAssistantCubit extends Cubit<SmartAssistantState> {
  SmartAssistantCubit(this._repository) : super(const SmartAssistantState());
  final SmartAssistantRepository _repository;

  Future<void> send(String text) async {
    final message = text.trim();
    if (message.isEmpty || state.isSending) return;
    final userMessage = AssistantMessage.user(message);
    emit(
      state.copyWith(
        messages: [...state.messages, userMessage],
        isSending: true,
        error: '',
      ),
    );
    try {
      final verification = await _repository.send(message);
      emit(
        state.copyWith(
          messages: [
            ...state.messages,
            AssistantMessage.assistant(verification),
          ],
          isSending: false,
          sessionId: verification.sessionId ?? state.sessionId,
        ),
      );
    } catch (error) {
      emit(state.copyWith(isSending: false, error: error.toString()));
    }
  }
}

class SmartAssistantState {
  const SmartAssistantState({
    this.messages = const [],
    this.isSending = false,
    this.error = '',
    this.sessionId,
  });
  final List<AssistantMessage> messages;
  final bool isSending;
  final String error;
  final String? sessionId;

  SmartAssistantState copyWith({
    List<AssistantMessage>? messages,
    bool? isSending,
    String? error,
    String? sessionId,
  }) => SmartAssistantState(
    messages: messages ?? this.messages,
    isSending: isSending ?? this.isSending,
    error: error ?? this.error,
    sessionId: sessionId ?? this.sessionId,
  );
}

class AssistantMessage {
  const AssistantMessage._({
    required this.id,
    required this.text,
    required this.isUser,
    this.verification,
  });

  factory AssistantMessage.user(String text) => AssistantMessage._(
    id: DateTime.now().microsecondsSinceEpoch.toString(),
    text: text,
    isUser: true,
  );
  factory AssistantMessage.assistant(HadithVerification verification) =>
      AssistantMessage._(
        id: DateTime.now().microsecondsSinceEpoch.toString(),
        text: verification.replyAr,
        isUser: false,
        verification: verification,
      );

  final String id;
  final String text;
  final bool isUser;
  final HadithVerification? verification;
}
