import 'dart:convert';

import 'package:http/http.dart' as http;

class AladhanPrayerTimesApi {
  AladhanPrayerTimesApi({http.Client? client})
    : _client = client ?? http.Client();

  final http.Client _client;

  Future<PrayerTimes> fetchToday({
    required double latitude,
    required double longitude,
  }) async {
    final now = DateTime.now();
    final date =
        '${now.day.toString().padLeft(2, '0')}-${now.month.toString().padLeft(2, '0')}-${now.year}';
    final uri = Uri.parse('https://api.aladhan.com/v1/timings/$date').replace(
      queryParameters: {
        'latitude': latitude.toString(),
        'longitude': longitude.toString(),
        'method': '5',
      },
    );
    final response = await _client.get(uri);
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw PrayerTimesException('تعذر جلب مواقيت الصلاة. حاول مرة أخرى.');
    }
    final body =
        jsonDecode(utf8.decode(response.bodyBytes)) as Map<String, dynamic>;
    if (body['code'] != 200) {
      throw PrayerTimesException(
        body['status'] as String? ?? 'تعذر جلب مواقيت الصلاة.',
      );
    }
    return PrayerTimes.fromJson(body['data'] as Map<String, dynamic>);
  }
}

class PrayerTimes {
  const PrayerTimes({
    required this.timings,
    required this.hijriDate,
    required this.timezone,
  });

  factory PrayerTimes.fromJson(Map<String, dynamic> json) {
    final timings = json['timings'] as Map<String, dynamic>;
    final date = json['date'] as Map<String, dynamic>;
    final hijri = date['hijri'] as Map<String, dynamic>;
    final hijriMonth = hijri['month'] as Map<String, dynamic>;
    final meta = json['meta'] as Map<String, dynamic>;
    return PrayerTimes(
      timings: timings.map(
        (key, value) => MapEntry(key, _cleanTime(value.toString())),
      ),
      hijriDate: '${hijri['day']} ${hijriMonth['ar']} ${hijri['year']} هـ',
      timezone: meta['timezone'] as String? ?? '',
    );
  }

  static String _cleanTime(String value) => value.split(' ').first;

  final Map<String, String> timings;
  final String hijriDate;
  final String timezone;
}

class PrayerTimesException implements Exception {
  const PrayerTimesException(this.message);
  final String message;

  @override
  String toString() => message;
}
