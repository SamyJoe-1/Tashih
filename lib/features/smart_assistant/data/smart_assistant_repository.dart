import 'tashih_chat_api.dart';

class SmartAssistantRepository {
  SmartAssistantRepository({TashihChatApi? api})
    : _api = api ?? TashihChatApi();
  final TashihChatApi _api;

  Future<HadithVerification> send(String message) => _api.verifyHadith(message);
}
