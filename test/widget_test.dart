import 'package:flutter_test/flutter_test.dart';
import 'package:islamic_app/main.dart';

void main() {
  testWidgets('home shows all Islamic sections', (tester) async {
    await tester.pumpWidget(const IslamicApp());

    expect(find.text('زاد المسلم'), findsOneWidget);
    expect(find.text('الأدعية'), findsOneWidget);
    expect(find.text('المصحف الشريف'), findsOneWidget);
    expect(find.text('الأحاديث'), findsOneWidget);
    expect(find.text('مواقيت الصلاة'), findsOneWidget);
    expect(find.text('القبلة'), findsOneWidget);
  });
}
