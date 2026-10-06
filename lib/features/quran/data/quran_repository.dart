import 'telawa_quran_api.dart';

class QuranRepository {
  QuranRepository({TelawaQuranApi? api}) : _api = api ?? TelawaQuranApi();

  final TelawaQuranApi _api;

  Future<List<QuranSurah>> getSurahs() => _api.fetchSurahs();
  Future<QuranSurah> getSurah(int id) => _api.fetchSurah(id);
  Future<List<QuranSearchResult>> searchAyahs(String query) =>
      _api.searchAyahs(query);
}
