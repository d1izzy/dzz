# Портфолио — full-stack разработка

Одностраничник на React + Vite + Tailwind. Светлая тема, вкладки слева на десктопе и сверху на мобилках.

## Запуск

```bash
npm install
npm run dev
```

Сборка:

```bash
npm run build
npm run preview
```

## Перед публикацией

Откройте `src/data/site.js` и пропишите свои контакты:

- `telegram` / `telegramUrl` (сейчас @thegodnull)
- `github` / `githubUrl`
- `email`

Проекты — в `src/data/projects.js`. Стек и услуги — в `src/data/stack.js` и `src/data/services.js`.

### Форма

По умолчанию форма открывает Telegram с текстом заявки.

Чтобы слать на почту через [Formspree](https://formspree.io):

1. Создайте форму и скопируйте ID (`xyzabcd`).
2. Создайте `.env`:

```
VITE_FORMSPREE_ID=xyzabcd
```

## Деплой

**Vercel / Netlify:** корень репозитория, команда `npm run build`, каталог `dist`. Для Netlify уже есть `netlify.toml`.

**GitHub Pages:** если сайт лежит не в корне домена, соберите с базовым путём:

```bash
# Windows PowerShell
$env:BASE_PATH="/имя-репо/"; npm run build
```

```bash
# bash
BASE_PATH=/имя-репо/ npm run build
```

Выложите содержимое `dist` в ветку `gh-pages` или включите GitHub Actions на `dist`.
