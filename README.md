
# Telegram Mini App (from your SVGs)

Готовый Next.js 14 (App Router) проект для деплоя на Vercel.

## Что внутри

- Ваша папка со SVG: `public/svg/` (14 файлов)
- Маркер доступных SVG: `public/manifest.json`
- Мэппинг логических имён → фактических файлов: `public/name-map.json`
- Простая система модалок и роутинга по `id` внутри SVG.
- Отчёт по проверке SVG: `SVG_LINT_REPORT.md`

## Как работает логика кликов

- На **главном экране** клики по `id`:
  - `btn-call-center` → открывает `callcenter-modal`
  - `btm-crm` → `crm-modal`
  - `btn-chat-arnold` → `btn-chat`

- В **callcenter-modal** работают: закрыть/назад, `btn-collcenter-entity-settings` → `collcenter-entity-settings`, `btn-collcenter-global-settings` → `collcenter-global-settings`.

- В **crm-modal** тап по строке таблицы (`row-*`, `table-row*`, `crm-row*`) → `crm-card-modal`.
  - В **crm-card-modal**: `btn-заметка`/`btn-note` → `crm-notes-modal`, `btn-напомнить`/`btn-remind` → `crm-reminder-modal`, `btn-рассылка` → `autoresponder-modal`.

- В **btn-chat**:
  - `btn-dialogs` → `socials-modal`
  - `btn-answer` → `question-generators-modal`
  - `btn-attach-file` и `btn-open-add-modal` → `add-modal`

- Все кнопки с `id`, содержащим `close`/`back/крест/назад/×/x` закрывают верхнюю модалку.
- Если на модалке нет кнопок закрытия — тап по затемнению закрывает её.

> Примечание: проект подбирает подходящие имена файлов по `public/name-map.json` (автогенерация по схожести с ожидаемыми именами). Если имя не найдено — в интерфейсе увидите сообщение "Не найден файл: ...".

## Локальный запуск

```bash
npm i
npm run dev
# Откройте http://localhost:3000
```

## Деплой на Vercel

1. Залейте репозиторий на GitHub.
2. В Vercel: New Project → импортируйте репо → Build Command/Output оставьте по умолчанию.
3. Готово.

## Отчёт по SVG

Смотрите `SVG_LINT_REPORT.md` — там базовые ошибки (дублирующиеся id, подозрительные символы в id, проблемы XML-парсинга и т. п.).

