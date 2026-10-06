import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../core/state/view_status.dart';
import '../data/quran_repository.dart';
import '../data/telawa_quran_api.dart';
import 'cubit/quran_cubit.dart';

const _emerald = Color(0xFF1F6B55);
const _emeraldDeep = Color(0xFF164F3F);
const _gold = Color(0xFFE1B868);

class QuranScreen extends StatelessWidget {
  const QuranScreen({super.key, this.repository});
  final QuranRepository? repository;

  @override
  Widget build(BuildContext context) {
    final dataSource = repository ?? QuranRepository();
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => QuranCubit(dataSource)..loadSurahs()),
        BlocProvider(create: (_) => QuranSearchCubit(dataSource)),
      ],
      child: const _QuranView(),
    );
  }
}

class _QuranView extends StatefulWidget {
  const _QuranView();

  @override
  State<_QuranView> createState() => _QuranViewState();
}

class _QuranViewState extends State<_QuranView> {
  final _searchController = TextEditingController();
  String _query = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _search() {
    final query = _searchController.text.trim();
    FocusScope.of(context).unfocus();
    setState(() => _query = query);
    context.read<QuranSearchCubit>().search(query);
  }

  void _clearSearch() {
    _searchController.clear();
    setState(() => _query = '');
    context.read<QuranSearchCubit>().clear();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(
      title: const Text('المصحف الشريف'),
      actions: [
        IconButton(
          onPressed: () => context.read<QuranCubit>().loadSurahs(),
          icon: const Icon(Icons.refresh_rounded),
        ),
      ],
    ),
    body: BlocBuilder<QuranCubit, QuranState>(
      builder: (context, state) {
        if (state.status == ViewStatus.loading ||
            state.status == ViewStatus.initial) {
          return const Center(
            child: CircularProgressIndicator(color: _emerald),
          );
        }
        if (state.status == ViewStatus.failure) {
          return _LoadError(
            onRetry: () => context.read<QuranCubit>().loadSurahs(),
          );
        }
        final matchedSurahs = _filterSurahs(state.surahs, _query);
        return ListView(
          padding: const EdgeInsets.fromLTRB(20, 18, 20, 32),
          children: [
            _SearchField(
              controller: _searchController,
              onSearch: _search,
              onClear: _query.isEmpty ? null : _clearSearch,
            ),
            const SizedBox(height: 16),
            if (_query.isEmpty) ...[
              const _QuranIntro(),
              const SizedBox(height: 18),
              _TitleRow(
                title: 'سور القرآن',
                trailing: '${state.surahs.length} سورة',
              ),
            ] else
              _TitleRow(
                title: 'السور المطابقة',
                trailing: '${matchedSurahs.length} نتيجة',
              ),
            const SizedBox(height: 10),
            ...matchedSurahs.map(
              (surah) => Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: _SurahTile(surah: surah, onTap: () => _openSurah(surah)),
              ),
            ),
            if (_query.isNotEmpty) ...[
              const SizedBox(height: 10),
              const _TitleRow(title: 'نتائج نص الآيات'),
              const SizedBox(height: 10),
              _AyahResults(
                onOpenSurah: (id) => _openSurah(
                  state.surahs.firstWhere((surah) => surah.id == id),
                ),
              ),
            ],
          ],
        );
      },
    ),
  );

  void _openSurah(QuranSurah surah) => Navigator.of(context).push(
    MaterialPageRoute<void>(
      builder: (_) => Directionality(
        textDirection: TextDirection.rtl,
        child: SurahReaderScreen(surah: surah),
      ),
    ),
  );
}

List<QuranSurah> _filterSurahs(List<QuranSurah> surahs, String query) {
  if (query.isEmpty) return surahs;
  final normalizedQuery = _normalizeArabic(query);
  return surahs
      .where(
        (surah) =>
            surah.id.toString() == query ||
            _normalizeArabic(surah.nameAr).contains(normalizedQuery) ||
            surah.nameEn.toLowerCase().contains(query.toLowerCase()),
      )
      .toList(growable: false);
}

String _normalizeArabic(String text) => text
    .replaceAll(RegExp(r'[\u064B-\u065F\u0670\u0640]'), '')
    .replaceAll('ٱ', 'ا')
    .replaceAll('أ', 'ا')
    .replaceAll('إ', 'ا')
    .replaceAll('آ', 'ا')
    .replaceAll('ة', 'ه')
    .replaceAll('ى', 'ي')
    .replaceAll('سورة', '')
    .trim();

class _SearchField extends StatelessWidget {
  const _SearchField({
    required this.controller,
    required this.onSearch,
    required this.onClear,
  });
  final TextEditingController controller;
  final VoidCallback onSearch;
  final VoidCallback? onClear;

  @override
  Widget build(BuildContext context) => Row(
    children: [
      Expanded(
        child: TextField(
          controller: controller,
          onSubmitted: (_) => onSearch(),
          textInputAction: TextInputAction.search,
          decoration: InputDecoration(
            hintText: 'ابحث باسم السورة أو بكلمة من آية',
            filled: true,
            fillColor: Colors.white,
            prefixIcon: const Icon(Icons.search_rounded, color: _emerald),
            suffixIcon: onClear == null
                ? null
                : IconButton(
                    onPressed: onClear,
                    icon: const Icon(Icons.close_rounded),
                  ),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(18),
              borderSide: BorderSide.none,
            ),
          ),
        ),
      ),
      const SizedBox(width: 9),
      SizedBox(
        height: 56,
        child: FilledButton(onPressed: onSearch, child: const Text('بحث')),
      ),
    ],
  );
}

class _QuranIntro extends StatelessWidget {
  const _QuranIntro();
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(20),
    decoration: BoxDecoration(
      color: _emeraldDeep,
      borderRadius: BorderRadius.circular(24),
    ),
    child: const Row(
      children: [
        Icon(Icons.menu_book_rounded, color: _gold, size: 36),
        SizedBox(width: 14),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'كتاب الله',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 21,
                  fontWeight: FontWeight.w800,
                ),
              ),
              SizedBox(height: 4),
              Text(
                'اقرأ السور وابحث في آيات القرآن الكريم',
                style: TextStyle(color: Color(0xFFDCEDE9), fontSize: 13),
              ),
            ],
          ),
        ),
      ],
    ),
  );
}

class _TitleRow extends StatelessWidget {
  const _TitleRow({required this.title, this.trailing});
  final String title;
  final String? trailing;
  @override
  Widget build(BuildContext context) => Row(
    children: [
      Text(
        title,
        style: const TextStyle(
          color: _emeraldDeep,
          fontSize: 18,
          fontWeight: FontWeight.w800,
        ),
      ),
      const Spacer(),
      if (trailing != null)
        Text(
          trailing!,
          style: TextStyle(
            color: _emerald.withValues(alpha: .75),
            fontSize: 12,
          ),
        ),
    ],
  );
}

class _SurahTile extends StatelessWidget {
  const _SurahTile({required this.surah, required this.onTap});
  final QuranSurah surah;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) => Material(
    color: Colors.white,
    borderRadius: BorderRadius.circular(18),
    child: InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 13),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: const Color(0xFFE9F1D9),
                borderRadius: BorderRadius.circular(13),
              ),
              child: Text(
                '${surah.id}',
                style: const TextStyle(
                  color: _emeraldDeep,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const SizedBox(width: 13),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    surah.nameAr,
                    style: const TextStyle(
                      color: _emeraldDeep,
                      fontSize: 16,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: 3),
                  Text(
                    '${surah.ayahCount} آيات  •  ${surah.revelationType == 'Meccan' ? 'مكية' : 'مدنية'}',
                    style: TextStyle(
                      color: _emeraldDeep.withValues(alpha: .58),
                      fontSize: 12,
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

class _AyahResults extends StatelessWidget {
  const _AyahResults({required this.onOpenSurah});
  final ValueChanged<int> onOpenSurah;
  @override
  Widget build(
    BuildContext context,
  ) => BlocBuilder<QuranSearchCubit, QuranSearchState>(
    builder: (context, state) {
      if (state.status == ViewStatus.initial) {
        return const _SearchMessage('اكتب كلمتين أو أكثر من نص الآية للبحث.');
      }
      if (state.status == ViewStatus.loading) {
        return const Center(
          child: Padding(
            padding: EdgeInsets.all(24),
            child: CircularProgressIndicator(color: _emerald),
          ),
        );
      }
      if (state.status == ViewStatus.failure) {
        return const _SearchMessage('تعذر تنفيذ البحث الآن.');
      }
      if (state.results.isEmpty) {
        return const _SearchMessage('لا توجد آيات مطابقة.');
      }
      return Column(
        children: state.results
            .map(
              (result) => Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: Material(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                  child: InkWell(
                    onTap: () => onOpenSurah(result.surahId),
                    borderRadius: BorderRadius.circular(18),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '${result.surahName} • الآية ${result.ayahNumber}',
                            style: const TextStyle(
                              color: _emerald,
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          const SizedBox(height: 9),
                          Text(
                            result.textAr,
                            style: const TextStyle(
                              color: _emeraldDeep,
                              fontSize: 17,
                              height: 1.8,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            )
            .toList(growable: false),
      );
    },
  );
}

class _SearchMessage extends StatelessWidget {
  const _SearchMessage(this.message);
  final String message;
  @override
  Widget build(BuildContext context) => Container(
    width: double.infinity,
    padding: const EdgeInsets.all(18),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(18),
    ),
    child: Text(
      message,
      textAlign: TextAlign.center,
      style: TextStyle(color: _emeraldDeep.withValues(alpha: .6)),
    ),
  );
}

class SurahReaderScreen extends StatelessWidget {
  const SurahReaderScreen({super.key, required this.surah, this.repository});
  final QuranSurah surah;
  final QuranRepository? repository;
  @override
  Widget build(BuildContext context) => BlocProvider(
    create: (_) => SurahCubit(repository ?? QuranRepository())..load(surah.id),
    child: Scaffold(
      appBar: AppBar(title: Text(surah.nameAr)),
      body: BlocBuilder<SurahCubit, SurahState>(
        builder: (context, state) {
          if (state.status == ViewStatus.loading ||
              state.status == ViewStatus.initial) {
            return const Center(
              child: CircularProgressIndicator(color: _emerald),
            );
          }
          if (state.status == ViewStatus.failure) {
            return _LoadError(
              onRetry: () => context.read<SurahCubit>().load(surah.id),
            );
          }
          final loadedSurah = state.surah!;
          return ListView.separated(
            padding: const EdgeInsets.fromLTRB(20, 22, 20, 32),
            itemCount: loadedSurah.ayahs.length + 1,
            separatorBuilder: (_, _) => const SizedBox(height: 12),
            itemBuilder: (_, index) => index == 0
                ? _SurahHeader(surah: loadedSurah)
                : _AyahCard(ayah: loadedSurah.ayahs[index - 1]),
          );
        },
      ),
    ),
  );
}

class _SurahHeader extends StatelessWidget {
  const _SurahHeader({required this.surah});
  final QuranSurah surah;
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(22),
    decoration: BoxDecoration(
      color: _emeraldDeep,
      borderRadius: BorderRadius.circular(24),
    ),
    child: Column(
      children: [
        Text(
          surah.nameAr,
          style: const TextStyle(
            color: _gold,
            fontSize: 25,
            fontWeight: FontWeight.w800,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          '${surah.ayahCount} آيات',
          style: const TextStyle(color: Colors.white70),
        ),
      ],
    ),
  );
}

class _AyahCard extends StatelessWidget {
  const _AyahCard({required this.ayah});
  final QuranAyah ayah;
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(18),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(20),
      border: Border.all(color: _emerald.withValues(alpha: .08)),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              width: 30,
              height: 30,
              alignment: Alignment.center,
              decoration: const BoxDecoration(
                color: _emerald,
                shape: BoxShape.circle,
              ),
              child: Text(
                '${ayah.number}',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const Spacer(),
            Text(
              'الجزء ${ayah.juz} • صفحة ${ayah.page}',
              style: TextStyle(
                color: _emeraldDeep.withValues(alpha: .52),
                fontSize: 11,
              ),
            ),
          ],
        ),
        const SizedBox(height: 14),
        Text(
          ayah.textAr,
          style: const TextStyle(
            color: _emeraldDeep,
            fontSize: 20,
            height: 1.9,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    ),
  );
}

class _LoadError extends StatelessWidget {
  const _LoadError({required this.onRetry});
  final VoidCallback onRetry;
  @override
  Widget build(BuildContext context) => Center(
    child: Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        const Icon(Icons.cloud_off_rounded, color: _emerald, size: 48),
        const SizedBox(height: 12),
        const Text(
          'تعذر تحميل المصحف',
          style: TextStyle(
            color: _emeraldDeep,
            fontSize: 19,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 14),
        FilledButton.icon(
          onPressed: onRetry,
          icon: const Icon(Icons.refresh_rounded),
          label: const Text('إعادة المحاولة'),
        ),
      ],
    ),
  );
}
