import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../data/smart_assistant_repository.dart';
import '../data/tashih_chat_api.dart';
import 'cubit/smart_assistant_cubit.dart';

const _emerald = Color(0xFF1F6B55);
const _emeraldDeep = Color(0xFF164F3F);
const _sand = Color(0xFFF7F3E9);
const _gold = Color(0xFFE1B868);

class SmartAssistantScreen extends StatelessWidget {
  const SmartAssistantScreen({super.key, this.repository});
  final SmartAssistantRepository? repository;

  @override
  Widget build(BuildContext context) => BlocProvider(
    create: (_) =>
        SmartAssistantCubit(repository ?? SmartAssistantRepository()),
    child: const _SmartAssistantView(),
  );
}

class _SmartAssistantView extends StatefulWidget {
  const _SmartAssistantView();

  @override
  State<_SmartAssistantView> createState() => _SmartAssistantViewState();
}

class _SmartAssistantViewState extends State<_SmartAssistantView> {
  final _controller = TextEditingController();
  final _scrollController = ScrollController();

  @override
  void dispose() {
    _controller.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _send() {
    if (_controller.text.trim().isEmpty) return;
    context.read<SmartAssistantCubit>().send(_controller.text);
    _controller.clear();
  }

  void _scrollToLatest() => WidgetsBinding.instance.addPostFrameCallback((_) {
    if (!_scrollController.hasClients) return;
    _scrollController.animateTo(
      _scrollController.position.maxScrollExtent,
      duration: const Duration(milliseconds: 280),
      curve: Curves.easeOutCubic,
    );
  });

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('المساعد الذكي')),
    body: BlocConsumer<SmartAssistantCubit, SmartAssistantState>(
      listenWhen: (previous, current) =>
          previous.messages.length != current.messages.length ||
          previous.error != current.error,
      listener: (context, state) {
        _scrollToLatest();
        if (state.error.isNotEmpty) {
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text(state.error)));
        }
      },
      builder: (context, state) => Column(
        children: [
          Expanded(
            child: ListView(
              controller: _scrollController,
              padding: const EdgeInsets.fromLTRB(16, 20, 16, 16),
              children: [
                const _WelcomeCard(),
                const SizedBox(height: 18),
                ...state.messages.map(
                  (message) => _FadeMessage(message: message),
                ),
                if (state.isSending) const _TypingBubble(),
              ],
            ),
          ),
          _Composer(
            controller: _controller,
            isSending: state.isSending,
            onSend: _send,
          ),
        ],
      ),
    ),
  );
}

class _WelcomeCard extends StatelessWidget {
  const _WelcomeCard();
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(20),
    decoration: BoxDecoration(
      color: _emeraldDeep,
      borderRadius: BorderRadius.circular(24),
    ),
    child: const Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(Icons.auto_awesome_rounded, color: _gold, size: 29),
            SizedBox(width: 10),
            Text(
              'مساعد التحقق من الحديث',
              style: TextStyle(
                color: Colors.white,
                fontSize: 19,
                fontWeight: FontWeight.w800,
              ),
            ),
          ],
        ),
        SizedBox(height: 9),
        Text(
          'اكتب الحديث الذي تريد التحقق منه، وسأعرض الحكم المنقول من المصدر عند توفره.',
          style: TextStyle(color: Color(0xFFDCEDE9), height: 1.6),
        ),
      ],
    ),
  );
}

class _FadeMessage extends StatelessWidget {
  const _FadeMessage({required this.message});
  final AssistantMessage message;

  @override
  Widget build(BuildContext context) => TweenAnimationBuilder<double>(
    key: ValueKey(message.id),
    tween: Tween(begin: 0, end: 1),
    duration: const Duration(milliseconds: 360),
    curve: Curves.easeOutCubic,
    builder: (context, value, child) => Opacity(
      opacity: value,
      child: Transform.translate(
        offset: Offset(0, 14 * (1 - value)),
        child: child,
      ),
    ),
    child: Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Align(
        alignment: message.isUser
            ? Alignment.centerLeft
            : Alignment.centerRight,
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 520),
          child: message.isUser
              ? _UserBubble(text: message.text)
              : _AssistantBubble(message: message),
        ),
      ),
    ),
  );
}

class _UserBubble extends StatelessWidget {
  const _UserBubble({required this.text});
  final String text;
  @override
  Widget build(BuildContext context) => DecoratedBox(
    decoration: BoxDecoration(
      color: _emerald,
      borderRadius: BorderRadius.circular(20).copyWith(bottomLeft: Radius.zero),
    ),
    child: Padding(
      padding: const EdgeInsets.all(14),
      child: Text(
        text,
        style: const TextStyle(color: Colors.white, height: 1.6),
      ),
    ),
  );
}

class _AssistantBubble extends StatelessWidget {
  const _AssistantBubble({required this.message});
  final AssistantMessage message;
  @override
  Widget build(BuildContext context) {
    final result = message.verification;
    return DecoratedBox(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(
          20,
        ).copyWith(bottomRight: Radius.zero),
        border: Border.all(color: _emerald.withValues(alpha: .12)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(15),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.verified_outlined, color: _emerald, size: 19),
                const SizedBox(width: 6),
                const Text(
                  'المساعد الذكي',
                  style: TextStyle(
                    color: _emeraldDeep,
                    fontWeight: FontWeight.w800,
                    fontSize: 13,
                  ),
                ),
                const Spacer(),
                if (result?.verdictAr != null)
                  _VerdictBadge(text: result!.verdictAr!),
              ],
            ),
            const SizedBox(height: 10),
            Text(
              message.text,
              style: const TextStyle(
                color: _emeraldDeep,
                height: 1.75,
                fontSize: 16,
              ),
            ),
            if (result?.bestMatch != null)
              _MatchDetails(match: result!.bestMatch!),
            if (result?.disclaimerAr.isNotEmpty ?? false) ...[
              const Divider(height: 24),
              Text(
                result!.disclaimerAr,
                style: TextStyle(
                  color: _emeraldDeep.withValues(alpha: .58),
                  height: 1.5,
                  fontSize: 11,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _VerdictBadge extends StatelessWidget {
  const _VerdictBadge({required this.text});
  final String text;
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
    decoration: BoxDecoration(
      color: const Color(0xFFFFE8C2),
      borderRadius: BorderRadius.circular(14),
    ),
    child: Text(
      text,
      style: const TextStyle(
        color: _emeraldDeep,
        fontSize: 11,
        fontWeight: FontWeight.w700,
      ),
    ),
  );
}

class _MatchDetails extends StatelessWidget {
  const _MatchDetails({required this.match});
  final HadithMatch match;
  @override
  Widget build(BuildContext context) => Container(
    width: double.infinity,
    margin: const EdgeInsets.only(top: 13),
    padding: const EdgeInsets.all(12),
    decoration: BoxDecoration(
      color: _sand,
      borderRadius: BorderRadius.circular(14),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (match.hadithText.isNotEmpty)
          Text(
            match.hadithText,
            style: const TextStyle(
              color: _emeraldDeep,
              height: 1.6,
              fontWeight: FontWeight.w600,
            ),
          ),
        if (match.gradeText.isNotEmpty) ...[
          const SizedBox(height: 8),
          Text(
            match.gradeText,
            style: const TextStyle(
              color: _emerald,
              fontWeight: FontWeight.w700,
              fontSize: 12,
            ),
          ),
        ],
        if (match.sourceBook.isNotEmpty || match.scholar.isNotEmpty) ...[
          const SizedBox(height: 5),
          Text(
            [
              match.sourceBook,
              match.scholar,
            ].where((value) => value.isNotEmpty).join(' • '),
            style: TextStyle(
              color: _emeraldDeep.withValues(alpha: .63),
              fontSize: 12,
            ),
          ),
        ],
      ],
    ),
  );
}

class _TypingBubble extends StatelessWidget {
  const _TypingBubble();
  @override
  Widget build(BuildContext context) => const Align(
    alignment: Alignment.centerRight,
    child: Padding(
      padding: EdgeInsets.only(bottom: 12),
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.all(Radius.circular(18)),
        ),
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: SizedBox(
            width: 24,
            height: 16,
            child: CircularProgressIndicator(strokeWidth: 2, color: _emerald),
          ),
        ),
      ),
    ),
  );
}

class _Composer extends StatelessWidget {
  const _Composer({
    required this.controller,
    required this.isSending,
    required this.onSend,
  });
  final TextEditingController controller;
  final bool isSending;
  final VoidCallback onSend;
  @override
  Widget build(BuildContext context) => SafeArea(
    top: false,
    child: Container(
      padding: const EdgeInsets.fromLTRB(16, 10, 16, 14),
      decoration: const BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Color(0x12000000),
            blurRadius: 10,
            offset: Offset(0, -2),
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: controller,
              onSubmitted: (_) => onSend(),
              minLines: 1,
              maxLines: 4,
              textInputAction: TextInputAction.send,
              decoration: InputDecoration(
                hintText: 'اكتب الحديث الذي تريد التحقق منه...',
                filled: true,
                fillColor: _sand,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(18),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
          ),
          const SizedBox(width: 9),
          SizedBox(
            height: 52,
            width: 52,
            child: FilledButton(
              onPressed: isSending ? null : onSend,
              style: FilledButton.styleFrom(
                padding: EdgeInsets.zero,
                backgroundColor: _emerald,
              ),
              child: const Icon(Icons.send_rounded),
            ),
          ),
        ],
      ),
    ),
  );
}
