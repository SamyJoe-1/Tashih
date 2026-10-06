import 'package:flutter/material.dart';

import 'features/duas/presentation/duas_screen.dart';
import 'features/hadith/presentation/hadith_screen.dart';
import 'features/prayer_times/presentation/prayer_times_screen.dart';
import 'features/quran/presentation/quran_screen.dart';
import 'features/smart_assistant/presentation/smart_assistant_screen.dart';

const _emerald = Color(0xFF1F6B55);
const _emeraldDeep = Color(0xFF164F3F);
const _sand = Color(0xFFF7F3E9);
const _gold = Color(0xFFE1B868);

void main() => runApp(const IslamicApp());

class IslamicApp extends StatelessWidget {
  const IslamicApp({super.key});

  @override
  Widget build(BuildContext context) => MaterialApp(
    title: 'زاد المسلم',
    debugShowCheckedModeBanner: false,
    theme: ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: _emerald,
        primary: _emerald,
        surface: _sand,
      ),
      scaffoldBackgroundColor: _sand,
      appBarTheme: const AppBarTheme(
        backgroundColor: _emeraldDeep,
        foregroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
      ),
    ),
    home: const Directionality(
      textDirection: TextDirection.rtl,
      child: HomeScreen(),
    ),
  );
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  static const _sections = <IslamicSection>[
    IslamicSection(
      'الأدعية',
      'وردك اليومي من خير الدعاء',
      Icons.auto_awesome_rounded,
      Color(0xFFE9F1D9),
    ),
    IslamicSection(
      'المصحف الشريف',
      'اقرأ وتدبر آيات القرآن الكريم',
      Icons.menu_book_rounded,
      Color(0xFFFFE8C2),
    ),
    IslamicSection(
      'الأحاديث',
      'من هدي النبي ﷺ',
      Icons.format_quote_rounded,
      Color(0xFFDCEDE9),
    ),
    IslamicSection(
      'مواقيت الصلاة',
      'اعرف وقت صلاتك القادمة',
      Icons.mosque_rounded,
      Color(0xFFE7E1F4),
    ),
    IslamicSection(
      'القبلة',
      'حدد اتجاه القبلة أينما كنت',
      Icons.explore_rounded,
      Color(0xFFD9EBE2),
    ),
    IslamicSection(
      'المساعد الذكي',
      'تحقق من صحة الأحاديث بسهولة',
      Icons.auto_awesome_rounded,
      Color(0xFFEDE4D2),
    ),
  ];

  @override
  Widget build(BuildContext context) => Scaffold(
    body: SafeArea(
      child: CustomScrollView(
        slivers: [
          const SliverToBoxAdapter(child: _Header()),
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 30),
            sliver: SliverList.separated(
              itemCount: _sections.length,
              separatorBuilder: (_, index) => const SizedBox(height: 14),
              itemBuilder: (context, index) => _SectionCard(
                section: _sections[index],
                onTap: () {
                  if (index == 0) {
                    Navigator.of(context).push(
                      MaterialPageRoute<void>(
                        builder: (_) => const Directionality(
                          textDirection: TextDirection.rtl,
                          child: DuasScreen(),
                        ),
                      ),
                    );
                    return;
                  }
                  if (index == 1) {
                    Navigator.of(context).push(
                      MaterialPageRoute<void>(
                        builder: (_) => const Directionality(
                          textDirection: TextDirection.rtl,
                          child: QuranScreen(),
                        ),
                      ),
                    );
                    return;
                  }
                  if (index == 2) {
                    Navigator.of(context).push(
                      MaterialPageRoute<void>(
                        builder: (_) => const Directionality(
                          textDirection: TextDirection.rtl,
                          child: HadithScreen(),
                        ),
                      ),
                    );
                    return;
                  }
                  if (index == 3) {
                    Navigator.of(context).push(
                      MaterialPageRoute<void>(
                        builder: (_) => const Directionality(
                          textDirection: TextDirection.rtl,
                          child: PrayerTimesScreen(),
                        ),
                      ),
                    );
                    return;
                  }
                  if (index == 5) {
                    Navigator.of(context).push(
                      MaterialPageRoute<void>(
                        builder: (_) => const Directionality(
                          textDirection: TextDirection.rtl,
                          child: SmartAssistantScreen(),
                        ),
                      ),
                    );
                    return;
                  }
                  Navigator.of(context).push(
                    MaterialPageRoute<void>(
                      builder: (_) => Directionality(
                        textDirection: TextDirection.rtl,
                        child: SectionPlaceholder(section: _sections[index]),
                      ),
                    ),
                  );
                },
              ),
            ),
          ),
        ],
      ),
    ),
  );
}

class _Header extends StatelessWidget {
  const _Header();

  @override
  Widget build(BuildContext context) => Container(
    height: 245,
    decoration: const BoxDecoration(
      color: _emeraldDeep,
      borderRadius: BorderRadius.vertical(bottom: Radius.circular(38)),
    ),
    child: Stack(
      children: [
        const Positioned(
          top: -58,
          left: -35,
          child: _PatternRing(size: 190, opacity: .12),
        ),
        const Positioned(
          bottom: -48,
          right: -28,
          child: _PatternRing(size: 150, opacity: .12),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(22, 20, 22, 25),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: .12),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.nightlight_round, color: _gold),
                  ),
                  const Spacer(),
                  IconButton(
                    onPressed: () {},
                    icon: const Icon(Icons.notifications_none_rounded),
                    color: Colors.white,
                  ),
                ],
              ),
              const Spacer(),
              const Text(
                'السلام عليكم',
                style: TextStyle(
                  color: _gold,
                  fontSize: 17,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 5),
              const Text(
                'زاد المسلم',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 31,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 7),
              Text(
                'رفيقك اليومي نحو الطمأنينة والخير',
                style: TextStyle(
                  color: Colors.white.withValues(alpha: .78),
                  fontSize: 14,
                ),
              ),
            ],
          ),
        ),
      ],
    ),
  );
}

class _PatternRing extends StatelessWidget {
  const _PatternRing({required this.size, required this.opacity});
  final double size;
  final double opacity;

  @override
  Widget build(BuildContext context) => Opacity(
    opacity: opacity,
    child: Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(color: Colors.white, width: 18),
      ),
      child: Center(
        child: Container(
          width: size * .45,
          height: size * .45,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(color: Colors.white, width: 9),
          ),
        ),
      ),
    ),
  );
}

class _SectionCard extends StatelessWidget {
  const _SectionCard({required this.section, required this.onTap});
  final IslamicSection section;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => Material(
    color: Colors.white,
    borderRadius: BorderRadius.circular(22),
    child: InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(22),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: _emerald.withValues(alpha: .08)),
        ),
        child: Row(
          children: [
            Container(
              width: 58,
              height: 58,
              decoration: BoxDecoration(
                color: section.accent,
                borderRadius: BorderRadius.circular(18),
              ),
              child: Icon(section.icon, color: _emeraldDeep, size: 29),
            ),
            const SizedBox(width: 15),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    section.title,
                    style: const TextStyle(
                      color: _emeraldDeep,
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    section.subtitle,
                    style: TextStyle(
                      color: _emeraldDeep.withValues(alpha: .62),
                      fontSize: 13,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(Icons.chevron_left_rounded, color: _emerald),
          ],
        ),
      ),
    ),
  );
}

class IslamicSection {
  const IslamicSection(this.title, this.subtitle, this.icon, this.accent);
  final String title;
  final String subtitle;
  final IconData icon;
  final Color accent;
}

class SectionPlaceholder extends StatelessWidget {
  const SectionPlaceholder({super.key, required this.section});
  final IslamicSection section;

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: Text(section.title)),
    body: Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 92,
              height: 92,
              decoration: BoxDecoration(
                color: section.accent,
                shape: BoxShape.circle,
              ),
              child: Icon(section.icon, color: _emeraldDeep, size: 45),
            ),
            const SizedBox(height: 22),
            Text(
              section.title,
              style: const TextStyle(
                color: _emeraldDeep,
                fontSize: 25,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 10),
            Text(
              'سيتم تجهيز هذا القسم وربطه بالخدمة الخاصة به قريبًا.',
              textAlign: TextAlign.center,
              style: TextStyle(color: _emeraldDeep.withValues(alpha: .65)),
            ),
          ],
        ),
      ),
    ),
  );
}
