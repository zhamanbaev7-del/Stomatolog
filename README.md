# Stomatolog

Landing page for a dental clinic with a secure booking form.

## Security Model

- Frontend (`script.js`) sends form data to `POST /api/booking`.
- Telegram token and chat id are stored only on the server in `.env`.
- Secrets are not committed to git.

## Run Locally

1. Create `.env` from `.env.example` and fill real values:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
2. Start server:

```bash
npm start
```

3. Open `http://localhost:3000`.
