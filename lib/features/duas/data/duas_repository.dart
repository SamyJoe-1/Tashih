import 'telawa_duas_api.dart';

class DuasRepository {
  DuasRepository({TelawaDuasApi? api}) : _api = api ?? TelawaDuasApi();

  final TelawaDuasApi _api;

  Future<List<DuaCategory>> getCategories() => _api.fetchCategories();
  Future<DuaCollection> getCollection(int id) => _api.fetchCollection(id);
}
