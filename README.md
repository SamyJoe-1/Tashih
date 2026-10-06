# Tashih Web

Next.js 16 (App Router, React 19, Tailwind 4) front-end for Tashih, the hadith verification site. It talks to the Tashih AI API (branch `llm`) through a rewrite: `/api/v1/*` is proxied to `${TASHIH_API_URL}/v1/*`.

## Requirements
- Node.js **20.9+** (22 LTS recommended) and npm
- Git
- The Tashih API running (see branch `llm`). Without it the site loads but verification and ask pages fail.
- For production: pm2 (`npm i -g pm2`) and a reverse proxy (nginx/Caddy) for HTTPS.

## 1. Get the code
```bash
git clone -b main https://github.com/SamyJoe-1/Tashih.git site
cd site
```

## 2. Install dependencies
```bash
npm ci
```

## 3. Configure environment
Create `.env.local` (dev) or `.env.production` (prod) in the project root. All values are optional:

| Variable | Default | Purpose |
|---|---|---|
| `TASHIH_API_URL` | `http://127.0.0.1:8010` | Base URL of the Tashih API (no trailing slash) |
| `NEXT_PUBLIC_SITE_URL` | - | Public site URL, used for sitemap, canonical and OpenGraph links (e.g. `https://tashih.example.com`) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | - | Contact email shown on the site |
| `GOOGLE_SITE_VERIFICATION` | - | Google Search Console token |
| `BING_SITE_VERIFICATION` | - | Bing Webmaster token |

Example:
```bash
cat > .env.production <<'ENV'
TASHIH_API_URL=http://127.0.0.1:8010
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_CONTACT_EMAIL=you@your-domain.com
ENV
```
`NEXT_PUBLIC_*` values are baked in at build time; rebuild after changing them. `TASHIH_API_URL` is also read at build time (rewrites), so rebuild if it changes.

## 4. Run in development
```bash
npm run dev
```
Open http://localhost:3000

## 5. Build and run in production
```bash
npm run build
npm start -- -p 3031 -H 127.0.0.1
```

### With pm2 (recommended)
`ecosystem.config.cjs` is included (app `tashih-web`, port 3031, bound to 127.0.0.1):
```bash
npm run build
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup        # run the command it prints, so it starts on reboot
```
Update later:
```bash
git pull
npm ci
npm run build
pm2 restart tashih-web
```

### Reverse proxy (nginx example)
```nginx
server {
    server_name your-domain.com;
    location / {
        proxy_pass http://127.0.0.1:3031;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Then enable HTTPS: `certbot --nginx -d your-domain.com`. The app sends an HSTS header, so HTTPS is required.

## 6. Run the API (backend)
```bash
git clone -b llm https://github.com/SamyJoe-1/Tashih.git tashih-ai
cd tashih-ai
cp .env.example .env     # fill in your keys
docker compose up -d --build
```
The API listens on `127.0.0.1:8010`, which is the default `TASHIH_API_URL`. See that branch's README for details.

## Useful commands
| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `pm2 logs tashih-web` | Live logs |

## Troubleshooting
- **Port in use:** change `-p` in `ecosystem.config.cjs` and your proxy.
- **API errors / 502 on `/api/v1/...`:** check `curl http://127.0.0.1:8010/health` and `TASHIH_API_URL`.
- **Old content after deploy:** you forgot `npm run build` before `pm2 restart`.
- **Build runs out of memory:** `NODE_OPTIONS=--max-old-space-size=2048 npm run build`.
