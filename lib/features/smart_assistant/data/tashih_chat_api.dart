import 'dart:convert';

import 'package:http/http.dart' as http;

class TashihChatApi {
  TashihChatApi({http.Client? client, String? apiKey})
    : _client = client ?? http.Client(),
      _apiKey = apiKey ?? const String.fromEnvironment('TASHIH_API_KEY');

  static const _url = 'https://tashih.diagnify-ai.com/v1/chat';
  final http.Client _client;
  final String _apiKey;

  Future<HadithVerification> verifyHadith(String text) async {
    final headers = <String, String>{
      'accept': 'application/json',
      'content-type': 'application/json',
    };
    if (_apiKey.isNotEmpty) headers['X-API-Key'] = _apiKey;

    final response = await _client.post(
      Uri.parse(_url),
      headers: headers,
      body: jsonEncode({
        'messages': [
          {'role': 'user', 'content': text},
        ],
      }),
    );
    final body = _decode(response.bodyBytes);
    if (response.statusCode == 401) {
      throw const SmartAssistantException(
        'خدمة التحقق تحتاج مفتاح API صالحًا.',
      );
    }
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw SmartAssistantException(
        _errorMessage(body) ?? 'تعذر التواصل مع خدمة التحقق.',
      );
    }
    return HadithVerification.fromJson(body);
  }

  Map<String, dynamic> _decode(List<int> bytes) {
    try {
      return jsonDecode(utf8.decode(bytes)) as Map<String, dynamic>;
    } catch (_) {
      return const {};
    }
  }

  String? _errorMessage(Map<String, dynamic> body) =>
      (body['error'] as Map<String, dynamic>?)?['message_ar'] as String?;
}

class HadithVerification {
  const HadithVerification({
    required this.status,
    required this.replyAr,
    required this.messageAr,
    required this.verdictAr,
    required this.disclaimerAr,
    required this.sourceUsed,
    required this.sessionId,
    this.bestMatch,
  });

  factory HadithVerification.fromJson(Map<String, dynamic> json) =>
      HadithVerification(
        status: json['status'] as String? ?? 'unknown',
        replyAr:
            json['reply_ar'] as String? ??
            json['message_ar'] as String? ??
            'تعذر إنشاء رد.',
        messageAr: json['message_ar'] as String? ?? '',
        verdictAr: json['verdict_ar'] as String?,
        disclaimerAr: json['disclaimer_ar'] as String? ?? '',
        sourceUsed: json['source_used'] as String? ?? '',
        sessionId: json['session_id'] as String?,
        bestMatch: json['best_match'] is Map<String, dynamic>
            ? HadithMatch.fromJson(json['best_match'] as Map<String, dynamic>)
            : null,
      );

  final String status;
  final String replyAr;
  final String messageAr;
  final String? verdictAr;
  final String disclaimerAr;
  final String sourceUsed;
  final String? sessionId;
  final HadithMatch? bestMatch;
}

class HadithMatch {
  const HadithMatch({
    required this.hadithText,
    required this.sourceBook,
    required this.scholar,
    required this.gradeText,
  });

  factory HadithMatch.fromJson(Map<String, dynamic> json) => HadithMatch(
    hadithText: json['hadith_text'] as String? ?? '',
    sourceBook: json['source_book'] as String? ?? '',
    scholar: json['muhaddith'] as String? ?? '',
    gradeText: json['grade_text'] as String? ?? '',
  );

  final String hadithText;
  final String sourceBook;
  final String scholar;
  final String gradeText;
}

class SmartAssistantException implements Exception {
  const SmartAssistantException(this.message);
  final String message;
  @override
  String toString() => message;
}
