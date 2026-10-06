import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/state/view_status.dart';
import '../../data/aladhan_prayer_times_api.dart';
import '../../data/prayer_times_repository.dart';

class PrayerTimesCubit extends Cubit<PrayerTimesState> {
  PrayerTimesCubit(this._repository) : super(const PrayerTimesState());
  final PrayerTimesRepository _repository;

  Future<void> load() async {
    emit(state.copyWith(status: ViewStatus.loading));
    try {
      final prayerTimes = await _repository.getTodayPrayerTimes();
      emit(
        state.copyWith(status: ViewStatus.success, prayerTimes: prayerTimes),
      );
    } catch (error) {
      emit(state.copyWith(status: ViewStatus.failure, error: error.toString()));
    }
  }
}

class PrayerTimesState {
  const PrayerTimesState({
    this.status = ViewStatus.initial,
    this.prayerTimes,
    this.error = '',
  });
  final ViewStatus status;
  final PrayerTimes? prayerTimes;
  final String error;

  PrayerTimesState copyWith({
    ViewStatus? status,
    PrayerTimes? prayerTimes,
    String? error,
  }) => PrayerTimesState(
    status: status ?? this.status,
    prayerTimes: prayerTimes ?? this.prayerTimes,
    error: error ?? this.error,
  );
}
