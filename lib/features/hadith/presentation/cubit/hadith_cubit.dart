import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/state/view_status.dart';
import '../../data/hadith_repository.dart';
import '../../data/kafela_hadith_api.dart';

class HadithCollectionsCubit extends Cubit<HadithCollectionsState> {
  HadithCollectionsCubit(this._repository)
    : super(const HadithCollectionsState());
  final HadithRepository _repository;

  Future<void> load() async {
    emit(state.copyWith(status: ViewStatus.loading));
    try {
      final collections = await _repository.getCollections();
      emit(
        state.copyWith(status: ViewStatus.success, collections: collections),
      );
    } catch (error) {
      emit(state.copyWith(status: ViewStatus.failure, error: error.toString()));
    }
  }
}

class HadithCollectionsState {
  const HadithCollectionsState({
    this.status = ViewStatus.initial,
    this.collections = const [],
    this.error = '',
  });
  final ViewStatus status;
  final List<HadithCollection> collections;
  final String error;

  HadithCollectionsState copyWith({
    ViewStatus? status,
    List<HadithCollection>? collections,
    String? error,
  }) => HadithCollectionsState(
    status: status ?? this.status,
    collections: collections ?? this.collections,
    error: error ?? this.error,
  );
}

class HadithSearchCubit extends Cubit<HadithSearchState> {
  HadithSearchCubit(this._repository) : super(const HadithSearchState());
  final HadithRepository _repository;

  Future<void> search(String query) async {
    if (query.trim().length < 2) {
      emit(const HadithSearchState());
      return;
    }
    emit(state.copyWith(status: ViewStatus.loading));
    try {
      final results = await _repository.search(query.trim());
      emit(state.copyWith(status: ViewStatus.success, results: results));
    } catch (error) {
      emit(state.copyWith(status: ViewStatus.failure, error: error.toString()));
    }
  }

  void clear() => emit(const HadithSearchState());
}

class HadithSearchState {
  const HadithSearchState({
    this.status = ViewStatus.initial,
    this.results = const [],
    this.error = '',
  });
  final ViewStatus status;
  final List<HadithItem> results;
  final String error;

  HadithSearchState copyWith({
    ViewStatus? status,
    List<HadithItem>? results,
    String? error,
  }) => HadithSearchState(
    status: status ?? this.status,
    results: results ?? this.results,
    error: error ?? this.error,
  );
}

class CollectionHadithsCubit extends Cubit<CollectionHadithsState> {
  CollectionHadithsCubit(this._repository)
    : super(const CollectionHadithsState());
  final HadithRepository _repository;

  Future<void> load(String collection) async {
    emit(state.copyWith(status: ViewStatus.loading));
    try {
      final page = await _repository.getCollectionHadiths(collection, 1);
      emit(
        CollectionHadithsState(
          status: ViewStatus.success,
          items: page.items,
          total: page.total,
        ),
      );
    } catch (error) {
      emit(state.copyWith(status: ViewStatus.failure, error: error.toString()));
    }
  }

  Future<void> loadMore(String collection) async {
    if (state.isLoadingMore || state.items.length >= state.total) return;
    emit(state.copyWith(isLoadingMore: true));
    try {
      final page = await _repository.getCollectionHadiths(
        collection,
        state.page + 1,
      );
      emit(
        state.copyWith(
          items: [...state.items, ...page.items],
          page: state.page + 1,
          total: page.total,
          isLoadingMore: false,
        ),
      );
    } catch (error) {
      emit(state.copyWith(isLoadingMore: false, error: error.toString()));
    }
  }
}

class CollectionHadithsState {
  const CollectionHadithsState({
    this.status = ViewStatus.initial,
    this.items = const [],
    this.total = 0,
    this.page = 1,
    this.isLoadingMore = false,
    this.error = '',
  });
  final ViewStatus status;
  final List<HadithItem> items;
  final int total;
  final int page;
  final bool isLoadingMore;
  final String error;

  CollectionHadithsState copyWith({
    ViewStatus? status,
    List<HadithItem>? items,
    int? total,
    int? page,
    bool? isLoadingMore,
    String? error,
  }) => CollectionHadithsState(
    status: status ?? this.status,
    items: items ?? this.items,
    total: total ?? this.total,
    page: page ?? this.page,
    isLoadingMore: isLoadingMore ?? this.isLoadingMore,
    error: error ?? this.error,
  );
}
