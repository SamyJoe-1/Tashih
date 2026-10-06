import 'dart:convert';

import 'package:http/http.dart' as http;

class TelawaDuasApi {
  TelawaDuasApi({http.Client? client}) : _client = client ?? http.Client();

  static const _baseUrl = 'https://telawa.org/api/v1';
  final http.Client _client;

  Future<List<DuaCategory>> fetchCategories() async {
    final response = await _client.get(Uri.parse('$_baseUrl/duas'));
    final data = _readEnvelope(response);
    final categories = data as List<dynamic>;
    return categories
        .map((item) => DuaCategory.fromJson(item as Map<String, dynamic>))
        .toList(growable: false);
  }

  Future<DuaCollection> fetchCollection(int id) async {
    final response = await _client.get(Uri.parse('$_baseUrl/duas/$id'));
    return DuaCollection.fromJson(
      _readEnvelope(response) as Map<String, dynamic>,
    );
  }

  dynamic _readEnvelope(http.Response response) {
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw DuaApiException('تعذر الاتصال بالخدمة. حاول مرة أخرى.');
    }

    final body =
        jsonDecode(utf8.decode(response.bodyBytes)) as Map<String, dynamic>;
    if (body['success'] != true) {
      throw DuaApiException(body['error'] as String? ?? 'تعذر جلب الأدعية.');
    }
    return body['data'];
  }
}

class DuaCategory {
  const DuaCategory({
    required this.id,
    required this.title,
    required this.duaCount,
  });

  factory DuaCategory.fromJson(Map<String, dynamic> json) => DuaCategory(
    id: json['id'] as int,
    title: json['title'] as String,
    duaCount: json['duaCount'] as int? ?? 0,
  );

  final int id;
  final String title;
  final int duaCount;
}

class DuaCollection {
  const DuaCollection({
    required this.id,
    required this.title,
    required this.duas,
  });

  factory DuaCollection.fromJson(Map<String, dynamic> json) => DuaCollection(
    id: json['id'] as int,
    title: json['title'] as String,
    duas: (json['duas'] as List<dynamic>)
        .map((item) => DuaEntry.fromJson(item as Map<String, dynamic>))
        .toList(growable: false),
  );

  final int id;
  final String title;
  final List<DuaEntry> duas;
}

class DuaEntry {
  const DuaEntry({
    required this.id,
    required this.arabic,
    required this.repeat,
    required this.reference,
  });

  factory DuaEntry.fromJson(Map<String, dynamic> json) => DuaEntry(
    id: json['id'] as int,
    arabic: json['arabic'] as String,
    repeat: json['repeat']?.toString() ?? '1',
    reference: json['reference'] as String? ?? '',
  );

  final int id;
  final String arabic;
  final String repeat;
  final String reference;
}

class DuaApiException implements Exception {
  const DuaApiException(this.message);
  final String message;

  @override
  String toString() => message;
}
