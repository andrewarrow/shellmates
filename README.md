# shellmates

Rent bare metal servers and create your own micro-cloud with friends.

Split costs, maximize resources, and build a community of developers.

# video demo
[![Video Demo](https://i.imgur.com/FxoS0dI.png)](https://www.youtube.com/watch?v=MNcnoMVRC68)

## How shellmates Works

1. Rent a powerful bare metal server from providers like Hetzner or OVH at prices starting from $34.50/month
2. We help you setup Firecracker VMs to divide your server into smaller VMs
3. Keep what you need and rent out the rest to other developers at fair prices
4. Save up to 90% compared to cloud providers like AWS while building relationships with other developers

## Development

```bash
# Install dependencies
npm run install:all

# Start development server
npm run dev
```

## Production Deployment

1. Build the production bundle:
```bash
npm run build:tar
```

2. Copy the tarball to your server:
```bash
scp shellmates-dist.tar.gz user@server:/path/to/deploy
```

3. On the server, extract and run:
```bash
tar -xzf shellmates-dist.tar.gz
cd dist
DB_PATH=/path/to/db.sqlite PORT=3000 npm start
```

## Environment Variables

- `PORT`: Server port (default: 3000)
- `DB_PATH`: Path to SQLite database file
- `NODE_ENV`: Set to 'production' for production mode
- `FRONTEND_URL`: URL for CORS (default: http://localhost:5173)

