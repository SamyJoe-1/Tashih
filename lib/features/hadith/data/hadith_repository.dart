import 'kafela_hadith_api.dart';

class HadithRepository {
  HadithRepository({KafelaHadithApi? api}) : _api = api ?? KafelaHadithApi();

  final KafelaHadithApi _api;

  Future<List<HadithCollection>> getCollections() => _api.fetchCollections();
  Future<HadithPage> getCollectionHadiths(String collection, int page) =>
      _api.fetchCollectionHadiths(collection, page);
  Future<List<HadithItem>> search(String query) => _api.search(query);
}
