# shellmates

## How shellmates Works

The first date for your next startup - meet your technical co-founder.

Share a server, build together, and find your perfect technical match.
How shellmates Works

 1. Rent a powerful bare metal server from providers like Hetzner or OVH - your first project together
 2. We help you split the server into two VMs - one for each technical co-founder
 3. Collaborate on server management and build your first project on shared infrastructure
 4. From shellmates to co-founders - launch your startup with someone whose technical skills you already trust

Managing a shared server provides real insight into how you and your potential co-founder handle technical decisions, solve problems, and collaborate on infrastructure.

This practical collaboration reveals compatibility in ways that resumes and coffee chats never could. Find out if you're truly in sync before committing to building a company together.

Unlike typical co-founder matching platforms, we ensure both partners are technical. No more "idea person seeking coder" - just technical people seeking other technical people.

With shellmates, you're guaranteed to find someone who can contribute real code, not just business plans. Build your MVP together on shared infrastructure before seeking non-technical partners.

Sharing a server is just the beginning. As you collaborate on infrastructure, you'll naturally start discussing other projects and ideas. Many of our shellmates have gone on to found successful startups together.

The best technical co-founder relationships are built on trust, shared experiences, and proven collaboration - exactly what shellmates helps you establish from day one.

# video demo
[![Video Demo](https://i.imgur.com/FxoS0dI.png)](https://www.youtube.com/watch?v=MNcnoMVRC68)

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

