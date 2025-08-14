# ArnoldOz — Telegram Mini App

Готовый статический шаблон для деплоя на **Vercel** и подключения к **Telegram Bot (WebApp)**.

## Что внутри
- `index.html` — основной файл
- `css/style.css` — стили (адаптив, поддержка темы Telegram)
- `js/script.js` — логика экранов/кнопок (без фреймворков)
- `assets/icons/` — оптимизированные SVG (авто-аудит)
- `manifest.json` — PWA мета
- `vercel.json` — конфиг кеша
- `svg_audit_report.csv` — отчёт проверки SVG
- Автогенерация экранов/кнопок по Excel: **buttons_analysis_split.xlsx**

## Развёртывание на Vercel
1. Создайте приватный репозиторий на GitHub и загрузите содержимое папки.
2. В Vercel: New Project → импортируйте репозиторий → Framework: **Other** → Build Command: пусто, Output: `/`.
3. Домен вида `https://your-app.vercel.app`.

## Подключение в Telegram
В BotFather:
- `/newbot` → получите токен.
- `/setdomain` → добавьте домен Vercel.
- `/setmenubutton` → укажите `web_app` с URL мини‑аппа.

## Примечания
- Скролл отключён (overflow: hidden).
- Кнопки без целевых экранов **disabled**.
- Анимация нажатия (scale/opacity).
- Кнопки «Назад» и «✕» работают.
- Модалки пересоздаются (шаблон в коде; расширяйте по надобности).

Сгенерировано: 2025-08-14T18:16:02.082604Z
