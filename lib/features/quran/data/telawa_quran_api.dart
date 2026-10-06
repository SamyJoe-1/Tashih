import 'dart:convert';

import 'package:http/http.dart' as http;

class TelawaQuranApi {
  TelawaQuranApi({http.Client? client}) : _client = client ?? http.Client();

  static const _baseUrl = 'https://telawa.org/api/v1';
  final http.Client _client;

  Future<List<QuranSurah>> fetchSurahs() async {
    final data = await _get('/surahs') as List<dynamic>;
    return data
        .map((item) => QuranSurah.fromJson(item as Map<String, dynamic>))
        .toList(growable: false);
  }

  Future<QuranSurah> fetchSurah(int id) async {
    final data = await _get('/surahs/$id') as Map<String, dynamic>;
    return QuranSurah.fromJson(data);
  }

  Future<List<QuranSearchResult>> searchAyahs(String query) async {
    final data =
        await _get('/search', query: {'q': query}) as Map<String, dynamic>;
    final matches = data['arabicMatches'] as List<dynamic>? ?? [];
    return matches
        .map((item) => QuranSearchResult.fromJson(item as Map<String, dynamic>))
        .toList(growable: false);
  }

  Future<dynamic> _get(String path, {Map<String, String>? query}) async {
    final uri = Uri.parse('$_baseUrl$path').replace(queryParameters: query);
    final response = await _client.get(uri);
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw QuranApiException('تعذر الاتصال بخدمة المصحف. حاول مرة أخرى.');
    }
    final body =
        jsonDecode(utf8.decode(response.bodyBytes)) as Map<String, dynamic>;
    if (body['success'] != true) {
      throw QuranApiException(
        body['error'] as String? ?? 'تعذر جلب بيانات المصحف.',
      );
    }
    return body['data'];
  }
}

class QuranSurah {
  const QuranSurah({
    required this.id,
    required this.nameAr,
    required this.nameEn,
    required this.revelationType,
    required this.ayahCount,
    this.ayahs = const [],
  });

  factory QuranSurah.fromJson(Map<String, dynamic> json) => QuranSurah(
    id: json['id'] as int,
    nameAr: json['nameAr'] as String,
    nameEn: json['nameEn'] as String? ?? '',
    revelationType: json['revelationType'] as String? ?? '',
    ayahCount: json['ayahCount'] as int,
    ayahs: (json['ayahs'] as List<dynamic>? ?? [])
        .map((item) => QuranAyah.fromJson(item as Map<String, dynamic>))
        .toList(growable: false),
  );

  final int id;
  final String nameAr;
  final String nameEn;
  final String revelationType;
  final int ayahCount;
  final List<QuranAyah> ayahs;
}

class QuranAyah {
  const QuranAyah({
    required this.number,
    required this.key,
    required this.textAr,
    required this.page,
    required this.juz,
  });

  factory QuranAyah.fromJson(Map<String, dynamic> json) => QuranAyah(
    number: json['ayahNumber'] as int,
    key: json['ayahKey'] as String,
    textAr: json['textAr'] as String,
    page: json['page'] as int,
    juz: json['juz'] as int,
  );

  final int number;
  final String key;
  final String textAr;
  final int page;
  final int juz;
}

class QuranSearchResult {
  const QuranSearchResult({
    required this.surahId,
    required this.surahName,
    required this.ayahNumber,
    required this.ayahKey,
    required this.textAr,
  });

  factory QuranSearchResult.fromJson(Map<String, dynamic> json) {
    final surah = json['surah'] as Map<String, dynamic>;
    return QuranSearchResult(
      surahId: json['surahId'] as int,
      surahName: surah['nameAr'] as String,
      ayahNumber: json['ayahNumber'] as int,
      ayahKey: json['ayahKey'] as String,
      textAr: json['textAr'] as String,
    );
  }

  final int surahId;
  final String surahName;
  final int ayahNumber;
  final String ayahKey;
  final String textAr;
}

class QuranApiException implements Exception {
  const QuranApiException(this.message);
  final String message;

  @override
  String toString() => message;
}
