import 'package:geolocator/geolocator.dart';

import 'aladhan_prayer_times_api.dart';

class PrayerTimesRepository {
  PrayerTimesRepository({AladhanPrayerTimesApi? api})
    : _api = api ?? AladhanPrayerTimesApi();

  final AladhanPrayerTimesApi _api;

  Future<PrayerTimes> getTodayPrayerTimes() async {
    if (!await Geolocator.isLocationServiceEnabled()) {
      throw const PrayerTimesException(
        'خدمة الموقع متوقفة. فعّلها ثم حاول مرة أخرى.',
      );
    }
    var permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
    }
    if (permission == LocationPermission.denied) {
      throw const PrayerTimesException(
        'يلزم السماح بالوصول إلى الموقع لحساب المواقيت بدقة.',
      );
    }
    if (permission == LocationPermission.deniedForever) {
      throw const PrayerTimesException(
        'صلاحية الموقع مرفوضة نهائيًا. فعّلها من إعدادات التطبيق.',
      );
    }
    final position = await Geolocator.getCurrentPosition(
      locationSettings: const LocationSettings(
        accuracy: LocationAccuracy.medium,
      ),
    );
    return _api.fetchToday(
      latitude: position.latitude,
      longitude: position.longitude,
    );
  }
}
