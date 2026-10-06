import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../core/state/view_status.dart';
import '../data/hadith_repository.dart';
import '../data/kafela_hadith_api.dart';
import 'cubit/hadith_cubit.dart';

const _emerald = Color(0xFF1F6B55);
const _emeraldDeep = Color(0xFF164F3F);

class HadithScreen extends StatelessWidget {
  const HadithScreen({super.key, this.repository});
  final HadithRepository? repository;

  @override
  Widget build(BuildContext context) {
    final source = repository ?? HadithRepository();
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => HadithCollectionsCubit(source)..load()),
        BlocProvider(create: (_) => HadithSearchCubit(source)),
      ],
      child: const _HadithView(),
    );
  }
}

class _HadithView extends StatefulWidget {
  const _HadithView();
  @override
  State<_HadithView> createState() => _HadithViewState();
}

class _HadithViewState extends State<_HadithView> {
  final _controller = TextEditingController();
  String _query = '';

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _search() {
    final query = _controller.text.trim();
    FocusScope.of(context).unfocus();
    setState(() => _query = query);
    context.read<HadithSearchCubit>().search(query);
  }

  void _clear() {
    _controller.clear();
    setState(() => _query = '');
    context.read<HadithSearchCubit>().clear();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('الأحاديث')),
    body: BlocBuilder<HadithCollectionsCubit, HadithCollectionsState>(
      builder: (context, state) {
        if (state.status == ViewStatus.loading ||
            state.status == ViewStatus.initial) {
          return const Center(
            child: CircularProgressIndicator(color: _emerald),
          );
        }
        if (state.status == ViewStatus.failure) {
          return _ErrorView(
            onRetry: () => context.read<HadithCollectionsCubit>().load(),
          );
        }
        final collections = _query.isEmpty
            ? state.collections
            : _filter(state.collections, _query);
        return ListView(
          padding: const EdgeInsets.fromLTRB(20, 18, 20, 32),
          children: [
            _SearchBar(
              controller: _controller,
              onSearch: _search,
              onClear: _query.isEmpty ? null : _clear,
            ),
            const SizedBox(height: 18),
            const _HeaderCard(),
            const SizedBox(height: 18),
            Text(
              _query.isEmpty ? 'مصادر الأحاديث' : 'المصادر المطابقة',
              style: const TextStyle(
                color: _emeraldDeep,
                fontSize: 18,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 10),
            ...collections.map(
              (item) => Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: _CollectionTile(collection: item),
              ),
            ),
            if (_query.isNotEmpty) ...[
              const SizedBox(height: 12),
              const Text(
                'نتائج نص الحديث',
                style: TextStyle(
                  color: _emeraldDeep,
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 10),
              const _SearchResults(),
            ],
          ],
        );
      },
    ),
  );
}

List<HadithCollection> _filter(List<HadithCollection> items, String query) =>
    items
        .where(
          (item) =>
              item.title.contains(query) ||
              item.slug.contains(query.toLowerCase()),
        )
        .toList(growable: false);

class _SearchBar extends StatelessWidget {
  const _SearchBar({
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
          decoration: InputDecoration(
            hintText: 'ابحث بكلمة من نص الحديث أو اسم المصدر',
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

class _HeaderCard extends StatelessWidget {
  const _HeaderCard();
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(20),
    decoration: BoxDecoration(
      color: _emeraldDeep,
      borderRadius: BorderRadius.circular(24),
    ),
    child: const Row(
      children: [
        Icon(Icons.format_quote_rounded, color: Color(0xFFE1B868), size: 39),
        SizedBox(width: 14),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'هدي النبي ﷺ',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 21,
                  fontWeight: FontWeight.w800,
                ),
              ),
              SizedBox(height: 4),
              Text(
                'تصفح المصادر وابحث في نصوص الأحاديث',
                style: TextStyle(color: Color(0xFFDCEDE9), fontSize: 13),
              ),
            ],
          ),
        ),
      ],
    ),
  );
}

class _CollectionTile extends StatelessWidget {
  const _CollectionTile({required this.collection});
  final HadithCollection collection;
  @override
  Widget build(BuildContext context) => Material(
    color: Colors.white,
    borderRadius: BorderRadius.circular(18),
    child: InkWell(
      onTap: () => Navigator.of(context).push(
        MaterialPageRoute<void>(
          builder: (_) => Directionality(
            textDirection: TextDirection.rtl,
            child: CollectionHadithsScreen(collection: collection),
          ),
        ),
      ),
      borderRadius: BorderRadius.circular(18),
      child: Padding(
        padding: const EdgeInsets.all(15),
        child: Row(
          children: [
            Container(
              width: 46,
              height: 46,
              decoration: BoxDecoration(
                color: const Color(0xFFDCEDE9),
                borderRadius: BorderRadius.circular(15),
              ),
              child: const Icon(
                Icons.library_books_rounded,
                color: _emeraldDeep,
              ),
            ),
            const SizedBox(width: 13),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    collection.title,
                    style: const TextStyle(
                      color: _emeraldDeep,
                      fontSize: 16,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  Text(
                    '${collection.totalHadith} حديث',
                    style: TextStyle(
                      color: _emeraldDeep.withValues(alpha: .57),
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

class _SearchResults extends StatelessWidget {
  const _SearchResults();
  @override
  Widget build(BuildContext context) =>
      BlocBuilder<HadithSearchCubit, HadithSearchState>(
        builder: (context, state) {
          if (state.status == ViewStatus.initial) {
            return const _Message('اكتب كلمتين أو أكثر من نص الحديث للبحث.');
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
            return const _Message('تعذر تنفيذ البحث الآن.');
          }
          if (state.results.isEmpty) {
            return const _Message('لا توجد أحاديث مطابقة.');
          }
          return Column(
            children: state.results
                .map(
                  (item) => Padding(
                    padding: const EdgeInsets.only(bottom: 10),
                    child: _HadithCard(item: item, source: item.collection),
                  ),
                )
                .toList(growable: false),
          );
        },
      );
}

class CollectionHadithsScreen extends StatelessWidget {
  const CollectionHadithsScreen({
    super.key,
    required this.collection,
    this.repository,
  });
  final HadithCollection collection;
  final HadithRepository? repository;
  @override
  Widget build(BuildContext context) => BlocProvider(
    create: (_) =>
        CollectionHadithsCubit(repository ?? HadithRepository())
          ..load(collection.slug),
    child: Scaffold(
      appBar: AppBar(title: Text(collection.title)),
      body: BlocBuilder<CollectionHadithsCubit, CollectionHadithsState>(
        builder: (context, state) {
          if (state.status == ViewStatus.loading ||
              state.status == ViewStatus.initial) {
            return const Center(
              child: CircularProgressIndicator(color: _emerald),
            );
          }
          if (state.status == ViewStatus.failure) {
            return _ErrorView(
              onRetry: () =>
                  context.read<CollectionHadithsCubit>().load(collection.slug),
            );
          }
          final hasMore = state.items.length < state.total;
          return ListView.separated(
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 32),
            itemCount: state.items.length + (hasMore ? 1 : 0),
            separatorBuilder: (_, _) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              if (index == state.items.length) {
                return OutlinedButton(
                  onPressed: state.isLoadingMore
                      ? null
                      : () => context.read<CollectionHadithsCubit>().loadMore(
                          collection.slug,
                        ),
                  child: state.isLoadingMore
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Text('تحميل المزيد'),
                );
              }
              return _HadithCard(
                item: state.items[index],
                source: collection.title,
              );
            },
          );
        },
      ),
    ),
  );
}

class _HadithCard extends StatelessWidget {
  const _HadithCard({required this.item, required this.source});
  final HadithItem item;
  final String source;
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(18),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(21),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              'حديث ${item.number}',
              style: const TextStyle(
                color: _emerald,
                fontWeight: FontWeight.bold,
              ),
            ),
            const Spacer(),
            Text(source, style: const TextStyle(color: _emerald, fontSize: 12)),
          ],
        ),
        if (item.chapterTitle.isNotEmpty) ...[
          const SizedBox(height: 10),
          Text(
            item.chapterTitle,
            style: const TextStyle(color: _emerald, fontSize: 12),
          ),
        ],
        const SizedBox(height: 12),
        Text(
          item.body,
          style: TextStyle(
            color: _emeraldDeep,
            fontSize: item.isArabic ? 18 : 15,
            height: 1.85,
          ),
        ),
      ],
    ),
  );
}

class _Message extends StatelessWidget {
  const _Message(this.message);
  final String message;
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(18),
    color: Colors.white,
    child: Text(message, textAlign: TextAlign.center),
  );
}

class _ErrorView extends StatelessWidget {
  const _ErrorView({required this.onRetry});
  final VoidCallback onRetry;
  @override
  Widget build(BuildContext context) => Center(
    child: FilledButton.icon(
      onPressed: onRetry,
      icon: const Icon(Icons.refresh_rounded),
      label: const Text('إعادة المحاولة'),
    ),
  );
}
