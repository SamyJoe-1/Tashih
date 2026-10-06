import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/state/view_status.dart';
import '../../data/duas_repository.dart';
import '../../data/telawa_duas_api.dart';

class DuasCubit extends Cubit<DuasState> {
  DuasCubit(this._repository) : super(const DuasState());
  final DuasRepository _repository;

  Future<void> load() async {
    emit(state.copyWith(status: ViewStatus.loading));
    try {
      final categories = await _repository.getCategories();
      emit(state.copyWith(status: ViewStatus.success, categories: categories));
    } catch (error) {
      emit(state.copyWith(status: ViewStatus.failure, error: error.toString()));
    }
  }
}

class DuasState {
  const DuasState({
    this.status = ViewStatus.initial,
    this.categories = const [],
    this.error = '',
  });
  final ViewStatus status;
  final List<DuaCategory> categories;
  final String error;

  DuasState copyWith({
    ViewStatus? status,
    List<DuaCategory>? categories,
    String? error,
  }) => DuasState(
    status: status ?? this.status,
    categories: categories ?? this.categories,
    error: error ?? this.error,
  );
}

class DuaDetailsCubit extends Cubit<DuaDetailsState> {
  DuaDetailsCubit(this._repository) : super(const DuaDetailsState());
  final DuasRepository _repository;

  Future<void> load(int categoryId) async {
    emit(state.copyWith(status: ViewStatus.loading));
    try {
      final collection = await _repository.getCollection(categoryId);
      emit(state.copyWith(status: ViewStatus.success, collection: collection));
    } catch (error) {
      emit(state.copyWith(status: ViewStatus.failure, error: error.toString()));
    }
  }
}

class DuaDetailsState {
  const DuaDetailsState({
    this.status = ViewStatus.initial,
    this.collection,
    this.error = '',
  });
  final ViewStatus status;
  final DuaCollection? collection;
  final String error;

  DuaDetailsState copyWith({
    ViewStatus? status,
    DuaCollection? collection,
    String? error,
  }) => DuaDetailsState(
    status: status ?? this.status,
    collection: collection ?? this.collection,
    error: error ?? this.error,
  );
}
