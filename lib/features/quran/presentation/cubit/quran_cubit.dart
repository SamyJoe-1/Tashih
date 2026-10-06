import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/state/view_status.dart';
import '../../data/quran_repository.dart';
import '../../data/telawa_quran_api.dart';

class QuranCubit extends Cubit<QuranState> {
  QuranCubit(this._repository) : super(const QuranState());
  final QuranRepository _repository;

  Future<void> loadSurahs() async {
    emit(state.copyWith(status: ViewStatus.loading));
    try {
      final surahs = await _repository.getSurahs();
      emit(state.copyWith(status: ViewStatus.success, surahs: surahs));
    } catch (error) {
      emit(state.copyWith(status: ViewStatus.failure, error: error.toString()));
    }
  }
}

class QuranState {
  const QuranState({
    this.status = ViewStatus.initial,
    this.surahs = const [],
    this.error = '',
  });
  final ViewStatus status;
  final List<QuranSurah> surahs;
  final String error;

  QuranState copyWith({
    ViewStatus? status,
    List<QuranSurah>? surahs,
    String? error,
  }) => QuranState(
    status: status ?? this.status,
    surahs: surahs ?? this.surahs,
    error: error ?? this.error,
  );
}

class QuranSearchCubit extends Cubit<QuranSearchState> {
  QuranSearchCubit(this._repository) : super(const QuranSearchState());
  final QuranRepository _repository;

  Future<void> search(String query) async {
    if (query.trim().length < 2) {
      emit(const QuranSearchState());
      return;
    }
    emit(state.copyWith(status: ViewStatus.loading));
    try {
      final results = await _repository.searchAyahs(query.trim());
      emit(state.copyWith(status: ViewStatus.success, results: results));
    } catch (error) {
      emit(state.copyWith(status: ViewStatus.failure, error: error.toString()));
    }
  }

  void clear() => emit(const QuranSearchState());
}

class QuranSearchState {
  const QuranSearchState({
    this.status = ViewStatus.initial,
    this.results = const [],
    this.error = '',
  });
  final ViewStatus status;
  final List<QuranSearchResult> results;
  final String error;

  QuranSearchState copyWith({
    ViewStatus? status,
    List<QuranSearchResult>? results,
    String? error,
  }) => QuranSearchState(
    status: status ?? this.status,
    results: results ?? this.results,
    error: error ?? this.error,
  );
}

class SurahCubit extends Cubit<SurahState> {
  SurahCubit(this._repository) : super(const SurahState());
  final QuranRepository _repository;

  Future<void> load(int surahId) async {
    emit(state.copyWith(status: ViewStatus.loading));
    try {
      final surah = await _repository.getSurah(surahId);
      emit(state.copyWith(status: ViewStatus.success, surah: surah));
    } catch (error) {
      emit(state.copyWith(status: ViewStatus.failure, error: error.toString()));
    }
  }
}

class SurahState {
  const SurahState({
    this.status = ViewStatus.initial,
    this.surah,
    this.error = '',
  });
  final ViewStatus status;
  final QuranSurah? surah;
  final String error;

  SurahState copyWith({ViewStatus? status, QuranSurah? surah, String? error}) =>
      SurahState(
        status: status ?? this.status,
        surah: surah ?? this.surah,
        error: error ?? this.error,
      );
}
