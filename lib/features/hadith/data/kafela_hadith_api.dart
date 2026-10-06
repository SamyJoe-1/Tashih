import 'dart:convert';

import 'package:http/http.dart' as http;

class KafelaHadithApi {
  KafelaHadithApi({http.Client? client}) : _client = client ?? http.Client();

  static const _baseUrl = 'https://api.kafela.net/v1';
  final http.Client _client;

  Future<List<HadithCollection>> fetchCollections() async {
    final body = await _get('/collections');
    final data = body['data'] as List<dynamic>;
    return data
        .map((item) => HadithCollection.fromJson(item as Map<String, dynamic>))
        .toList(growable: false);
  }

  Future<HadithPage> fetchCollectionHadiths(String collection, int page) async {
    final body = await _get(
      '/collections/$collection/hadiths',
      query: {'page': '$page'},
    );
    final data = body['data'] as List<dynamic>;
    return HadithPage(
      items: data
          .map(
            (item) => HadithItem.fromJson(
              item as Map<String, dynamic>,
              collection: collection,
            ),
          )
          .toList(growable: false),
      total: body['total'] as int? ?? data.length,
    );
  }

  Future<List<HadithItem>> search(String query) async {
    final body = await _get('/search', query: {'q': query});
    final data = body['data'] as List<dynamic>;
    return data
        .map((item) => HadithItem.fromJson(item as Map<String, dynamic>))
        .toList(growable: false);
  }

  Future<Map<String, dynamic>> _get(
    String path, {
    Map<String, String>? query,
  }) async {
    final uri = Uri.parse('$_baseUrl$path').replace(queryParameters: query);
    final response = await _client.get(uri);
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw HadithApiException('تعذر الاتصال بخدمة الأحاديث. حاول مرة أخرى.');
    }
    final body =
        jsonDecode(utf8.decode(response.bodyBytes)) as Map<String, dynamic>;
    if (body['data'] == null) {
      throw HadithApiException(
        body['error'] as String? ?? 'تعذر جلب الأحاديث.',
      );
    }
    return body;
  }
}

class HadithCollection {
  const HadithCollection({
    required this.slug,
    required this.title,
    required this.totalHadith,
  });

  factory HadithCollection.fromJson(Map<String, dynamic> json) {
    final titles = json['collection'] as List<dynamic>? ?? [];
    final arabicTitle = titles.cast<Map<String, dynamic>>().firstWhere(
      (title) => title['lang'] == 'ar',
      orElse: () => titles.isEmpty
          ? <String, dynamic>{}
          : titles.first as Map<String, dynamic>,
    );
    return HadithCollection(
      slug: json['name'] as String,
      title: arabicTitle['title'] as String? ?? json['name'] as String,
      totalHadith:
          json['totalAvailableHadith'] as int? ??
          json['totalHadith'] as int? ??
          0,
    );
  }

  final String slug;
  final String title;
  final int totalHadith;
}

class HadithPage {
  const HadithPage({required this.items, required this.total});
  final List<HadithItem> items;
  final int total;
}

class HadithItem {
  const HadithItem({
    required this.collection,
    required this.number,
    required this.body,
    required this.chapterTitle,
    required this.reference,
    required this.isArabic,
  });

  factory HadithItem.fromJson(Map<String, dynamic> json, {String? collection}) {
    final texts = json['hadith'] as List<dynamic>? ?? [];
    final arabic = texts
        .cast<Map<String, dynamic>>()
        .where((text) => text['lang'] == 'ar')
        .toList();
    final selected = arabic.isNotEmpty
        ? arabic.first
        : texts.isNotEmpty
        ? texts.first as Map<String, dynamic>
        : <String, dynamic>{};
    return HadithItem(
      collection: collection ?? json['collection'] as String? ?? '',
      number: json['hadithNumber']?.toString() ?? '',
      body: selected['body'] as String? ?? 'لا يتوفر نص هذا الحديث حاليًا.',
      chapterTitle: selected['chapterTitle'] as String? ?? '',
      reference: _referenceText(json['reference']),
      isArabic: selected['lang'] == 'ar',
    );
  }

  static String _referenceText(dynamic raw) {
    if (raw is List<dynamic>) {
      return raw
          .whereType<Map<String, dynamic>>()
          .map((reference) => reference['value']?.toString() ?? '')
          .where((value) => value.isNotEmpty)
          .join(' • ');
    }
    if (raw is Map<String, dynamic>) {
      return raw.values
          .whereType<String>()
          .where((value) => value.isNotEmpty)
          .join(' • ');
    }
    return '';
  }

  final String collection;
  final String number;
  final String body;
  final String chapterTitle;
  final String reference;
  final bool isArabic;
}

class HadithApiException implements Exception {
  const HadithApiException(this.message);
  final String message;

  @override
  String toString() => message;
}
