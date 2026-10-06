import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../core/state/view_status.dart';
import '../data/duas_repository.dart';
import '../data/telawa_duas_api.dart';
import 'cubit/duas_cubit.dart';

const _emerald = Color(0xFF1F6B55);
const _emeraldDeep = Color(0xFF164F3F);
const _gold = Color(0xFFE1B868);

class DuasScreen extends StatelessWidget {
  const DuasScreen({super.key, this.repository});
  final DuasRepository? repository;

  @override
  Widget build(BuildContext context) => BlocProvider(
    create: (_) => DuasCubit(repository ?? DuasRepository())..load(),
    child: const _DuasView(),
  );
}

class _DuasView extends StatelessWidget {
  const _DuasView();

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(
      title: const Text('الأدعية'),
      actions: [
        IconButton(
          onPressed: () => context.read<DuasCubit>().load(),
          icon: const Icon(Icons.refresh_rounded),
        ),
      ],
    ),
    body: BlocBuilder<DuasCubit, DuasState>(
      builder: (context, state) {
        if (state.status == ViewStatus.loading ||
            state.status == ViewStatus.initial) {
          return const Center(
            child: CircularProgressIndicator(color: _emerald),
          );
        }
        if (state.status == ViewStatus.failure) {
          return _LoadError(
            message: state.error,
            onRetry: () => context.read<DuasCubit>().load(),
          );
        }
        return RefreshIndicator(
          color: _emerald,
          onRefresh: () => context.read<DuasCubit>().load(),
          child: ListView.separated(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 32),
            itemCount: state.categories.length + 1,
            separatorBuilder: (_, _) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              if (index == 0) return const _DuasIntro();
              final category = state.categories[index - 1];
              return _CategoryTile(
                category: category,
                onTap: () => Navigator.of(context).push(
                  MaterialPageRoute<void>(
                    builder: (_) => Directionality(
                      textDirection: TextDirection.rtl,
                      child: DuaDetailsScreen(category: category),
                    ),
                  ),
                ),
              );
            },
          ),
        );
      },
    ),
  );
}

class _DuasIntro extends StatelessWidget {
  const _DuasIntro();

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(20),
    decoration: BoxDecoration(
      color: _emeraldDeep,
      borderRadius: BorderRadius.circular(24),
    ),
    child: const Row(
      children: [
        Icon(Icons.auto_awesome_rounded, color: _gold, size: 34),
        SizedBox(width: 14),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'حصن المسلم',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.w800,
                ),
              ),
              SizedBox(height: 4),
              Text(
                'اختر بابًا واقرأ أذكاره',
                style: TextStyle(color: Color(0xFFDCEDE9), fontSize: 13),
              ),
            ],
          ),
        ),
      ],
    ),
  );
}

class _CategoryTile extends StatelessWidget {
  const _CategoryTile({required this.category, required this.onTap});
  final DuaCategory category;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => Material(
    color: Colors.white,
    borderRadius: BorderRadius.circular(18),
    child: InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: const Color(0xFFE9F1D9),
                borderRadius: BorderRadius.circular(14),
              ),
              child: const Icon(Icons.menu_book_rounded, color: _emeraldDeep),
            ),
            const SizedBox(width: 13),
            Expanded(
              child: Text(
                category.title,
                style: const TextStyle(
                  color: _emeraldDeep,
                  fontWeight: FontWeight.w700,
                  fontSize: 16,
                ),
              ),
            ),
            Text(
              '${category.duaCount} دعاء',
              style: TextStyle(
                color: _emerald.withValues(alpha: .8),
                fontSize: 12,
              ),
            ),
            const SizedBox(width: 6),
            const Icon(Icons.chevron_left_rounded, color: _emerald),
          ],
        ),
      ),
    ),
  );
}

class DuaDetailsScreen extends StatelessWidget {
  const DuaDetailsScreen({super.key, required this.category, this.repository});
  final DuaCategory category;
  final DuasRepository? repository;

  @override
  Widget build(BuildContext context) => BlocProvider(
    create: (_) =>
        DuaDetailsCubit(repository ?? DuasRepository())..load(category.id),
    child: Scaffold(
      appBar: AppBar(title: Text(category.title)),
      body: BlocBuilder<DuaDetailsCubit, DuaDetailsState>(
        builder: (context, state) {
          if (state.status == ViewStatus.loading ||
              state.status == ViewStatus.initial) {
            return const Center(
              child: CircularProgressIndicator(color: _emerald),
            );
          }
          if (state.status == ViewStatus.failure) {
            return _LoadError(
              message: state.error,
              onRetry: () => context.read<DuaDetailsCubit>().load(category.id),
            );
          }
          final duas = state.collection!.duas;
          return ListView.separated(
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 32),
            itemCount: duas.length,
            separatorBuilder: (_, _) => const SizedBox(height: 14),
            itemBuilder: (_, index) =>
                _DuaCard(dua: duas[index], number: index + 1),
          );
        },
      ),
    ),
  );
}

class _DuaCard extends StatelessWidget {
  const _DuaCard({required this.dua, required this.number});
  final DuaEntry dua;
  final int number;

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(19),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(22),
      border: Border.all(color: _emerald.withValues(alpha: .1)),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              width: 28,
              height: 28,
              alignment: Alignment.center,
              decoration: const BoxDecoration(
                color: _emerald,
                shape: BoxShape.circle,
              ),
              child: Text(
                '$number',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const Spacer(),
            if (dua.repeat != '1')
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 5,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xFFFFE8C2),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  'يُكرر ${dua.repeat} مرات',
                  style: const TextStyle(
                    color: _emeraldDeep,
                    fontWeight: FontWeight.w600,
                    fontSize: 12,
                  ),
                ),
              ),
          ],
        ),
        const SizedBox(height: 15),
        Text(
          dua.arabic,
          style: const TextStyle(
            color: _emeraldDeep,
            fontSize: 18,
            height: 1.9,
            fontWeight: FontWeight.w600,
          ),
        ),
        if (dua.reference.isNotEmpty) ...[
          const SizedBox(height: 12),
          Text(
            dua.reference,
            style: TextStyle(
              color: _emeraldDeep.withValues(alpha: .6),
              fontSize: 12,
            ),
          ),
        ],
      ],
    ),
  );
}

class _LoadError extends StatelessWidget {
  const _LoadError({required this.onRetry, required this.message});
  final VoidCallback onRetry;
  final String message;

  @override
  Widget build(BuildContext context) => Center(
    child: Padding(
      padding: const EdgeInsets.all(32),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.cloud_off_rounded, color: _emerald, size: 48),
          const SizedBox(height: 14),
          const Text(
            'تعذر تحميل الأدعية',
            style: TextStyle(
              color: _emeraldDeep,
              fontSize: 19,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            message,
            textAlign: TextAlign.center,
            style: TextStyle(color: _emeraldDeep.withValues(alpha: .65)),
          ),
          const SizedBox(height: 18),
          FilledButton.icon(
            onPressed: onRetry,
            icon: const Icon(Icons.refresh_rounded),
            label: const Text('إعادة المحاولة'),
          ),
        ],
      ),
    ),
  );
}
