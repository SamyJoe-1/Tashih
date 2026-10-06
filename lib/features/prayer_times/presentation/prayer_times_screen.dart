import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../core/state/view_status.dart';
import '../data/aladhan_prayer_times_api.dart';
import '../data/prayer_times_repository.dart';
import 'cubit/prayer_times_cubit.dart';

const _emerald = Color(0xFF1F6B55);
const _emeraldDeep = Color(0xFF164F3F);
const _gold = Color(0xFFE1B868);

class PrayerTimesScreen extends StatelessWidget {
  const PrayerTimesScreen({super.key, this.repository});
  final PrayerTimesRepository? repository;

  @override
  Widget build(BuildContext context) => BlocProvider(
    create: (_) =>
        PrayerTimesCubit(repository ?? PrayerTimesRepository())..load(),
    child: const _PrayerTimesView(),
  );
}

class _PrayerTimesView extends StatelessWidget {
  const _PrayerTimesView();

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(
      title: const Text('مواقيت الصلاة'),
      actions: [
        IconButton(
          onPressed: () => context.read<PrayerTimesCubit>().load(),
          icon: const Icon(Icons.refresh_rounded),
        ),
      ],
    ),
    body: BlocBuilder<PrayerTimesCubit, PrayerTimesState>(
      builder: (context, state) {
        if (state.status == ViewStatus.loading ||
            state.status == ViewStatus.initial) {
          return const _LoadingState();
        }
        if (state.status == ViewStatus.failure) {
          return _LocationError(
            message: state.error,
            onRetry: () => context.read<PrayerTimesCubit>().load(),
          );
        }
        return _PrayerSchedule(
          times: state.prayerTimes!,
          onRefresh: () => context.read<PrayerTimesCubit>().load(),
        );
      },
    ),
  );
}

class _LoadingState extends StatelessWidget {
  const _LoadingState();
  @override
  Widget build(BuildContext context) => const Center(
    child: Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        CircularProgressIndicator(color: _emerald),
        SizedBox(height: 16),
        Text('جارٍ تحديد موقعك وحساب المواقيت'),
      ],
    ),
  );
}

class _PrayerSchedule extends StatelessWidget {
  const _PrayerSchedule({required this.times, required this.onRefresh});
  final PrayerTimes times;
  final VoidCallback onRefresh;
  static const _prayers = [
    _Prayer('Fajr', 'الفجر', Icons.dark_mode_rounded),
    _Prayer('Sunrise', 'الشروق', Icons.wb_sunny_outlined),
    _Prayer('Dhuhr', 'الظهر', Icons.light_mode_rounded),
    _Prayer('Asr', 'العصر', Icons.wb_sunny_rounded),
    _Prayer('Maghrib', 'المغرب', Icons.nights_stay_rounded),
    _Prayer('Isha', 'العشاء', Icons.nightlight_round),
  ];

  @override
  Widget build(BuildContext context) {
    final next = _nextPrayer();
    return RefreshIndicator(
      color: _emerald,
      onRefresh: () async => onRefresh(),
      child: ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.fromLTRB(20, 20, 20, 32),
        children: [
          _NextPrayerCard(
            prayer: next,
            time: times.timings[next.key] ?? '--:--',
            hijriDate: times.hijriDate,
          ),
          const SizedBox(height: 18),
          Row(
            children: [
              const Icon(Icons.my_location_rounded, color: _emerald, size: 18),
              const SizedBox(width: 6),
              const Text(
                'موقعك الحالي',
                style: TextStyle(
                  color: _emeraldDeep,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const Spacer(),
              Text(
                times.timezone,
                style: TextStyle(
                  color: _emeraldDeep.withValues(alpha: .58),
                  fontSize: 12,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ..._prayers.map(
            (prayer) => Padding(
              padding: const EdgeInsets.only(bottom: 11),
              child: _PrayerTile(
                prayer: prayer,
                time: times.timings[prayer.key] ?? '--:--',
                isNext: prayer.key == next.key,
              ),
            ),
          ),
          const SizedBox(height: 5),
          OutlinedButton.icon(
            onPressed: onRefresh,
            icon: const Icon(Icons.my_location_rounded),
            label: const Text('تحديث حسب موقعي الحالي'),
          ),
        ],
      ),
    );
  }

  _Prayer _nextPrayer() {
    final now = TimeOfDay.now();
    final nowMinutes = now.hour * 60 + now.minute;
    for (final prayer in _prayers) {
      final parts = (times.timings[prayer.key] ?? '').split(':');
      if (parts.length != 2) {
        continue;
      }
      final hour = int.tryParse(parts[0]);
      final minute = int.tryParse(parts[1]);
      if (hour != null && minute != null && hour * 60 + minute > nowMinutes) {
        return prayer;
      }
    }
    return _prayers.first;
  }
}

class _NextPrayerCard extends StatelessWidget {
  const _NextPrayerCard({
    required this.prayer,
    required this.time,
    required this.hijriDate,
  });
  final _Prayer prayer;
  final String time;
  final String hijriDate;
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(22),
    decoration: BoxDecoration(
      color: _emeraldDeep,
      borderRadius: BorderRadius.circular(25),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          hijriDate,
          style: const TextStyle(color: Color(0xFFDCEDE9), fontSize: 13),
        ),
        const SizedBox(height: 19),
        const Text(
          'الصلاة القادمة',
          style: TextStyle(color: _gold, fontWeight: FontWeight.w700),
        ),
        const SizedBox(height: 3),
        Row(
          children: [
            Icon(prayer.icon, color: Colors.white, size: 32),
            const SizedBox(width: 10),
            Text(
              prayer.name,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 27,
                fontWeight: FontWeight.w800,
              ),
            ),
            const Spacer(),
            Text(
              time,
              textDirection: TextDirection.ltr,
              style: const TextStyle(
                color: _gold,
                fontSize: 22,
                fontWeight: FontWeight.w800,
              ),
            ),
          ],
        ),
      ],
    ),
  );
}

class _PrayerTile extends StatelessWidget {
  const _PrayerTile({
    required this.prayer,
    required this.time,
    required this.isNext,
  });
  final _Prayer prayer;
  final String time;
  final bool isNext;
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
    decoration: BoxDecoration(
      color: isNext ? const Color(0xFFE9F1D9) : Colors.white,
      borderRadius: BorderRadius.circular(18),
      border: Border.all(
        color: isNext
            ? _emerald.withValues(alpha: .32)
            : _emerald.withValues(alpha: .08),
      ),
    ),
    child: Row(
      children: [
        Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: isNext ? _emerald : const Color(0xFFDCEDE9),
            borderRadius: BorderRadius.circular(14),
          ),
          child: Icon(prayer.icon, color: isNext ? Colors.white : _emeraldDeep),
        ),
        const SizedBox(width: 13),
        Text(
          prayer.name,
          style: const TextStyle(
            color: _emeraldDeep,
            fontSize: 17,
            fontWeight: FontWeight.w800,
          ),
        ),
        const Spacer(),
        Text(
          time,
          textDirection: TextDirection.ltr,
          style: const TextStyle(
            color: _emeraldDeep,
            fontSize: 18,
            fontWeight: FontWeight.w800,
          ),
        ),
      ],
    ),
  );
}

class _LocationError extends StatelessWidget {
  const _LocationError({required this.onRetry, required this.message});

  final VoidCallback onRetry;
  final String message;

  @override
  Widget build(BuildContext context) => Center(
    child: Padding(
      padding: const EdgeInsets.all(32),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.location_off_rounded, color: _emerald, size: 52),
          const SizedBox(height: 14),
          const Text(
            'نحتاج موقعك الحالي',
            style: TextStyle(
              color: _emeraldDeep,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            message,
            textAlign: TextAlign.center,
            style: TextStyle(color: _emeraldDeep.withValues(alpha: .65)),
          ),
          const SizedBox(height: 18),
          FilledButton.icon(
            onPressed: onRetry,
            icon: const Icon(Icons.my_location_rounded),
            label: const Text('السماح بالموقع والمحاولة'),
          ),
        ],
      ),
    ),
  );
}

class _Prayer {
  const _Prayer(this.key, this.name, this.icon);
  final String key;
  final String name;
  final IconData icon;
}
