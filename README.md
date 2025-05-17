# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/b327c061-3e8c-453e-8956-069c41696eee

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/b327c061-3e8c-453e-8956-069c41696eee) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/b327c061-3e8c-453e-8956-069c41696eee) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Convex

```bash
# Copy the docker-compose.yml file locally
npx degit get-convex/convex-backend/self-hosted/docker/docker-compose.yml docker-compose.yml

# replace all http://127.0.0.1 with public url https://[codespace-url]-3210.app.github.dev

# set url visibility to public

# Pull the latest docker images
docker compose pull
# Run the containers
docker compose up
# Generate an admin key to authorize deployments and dashboard access
docker compose exec backend ./generate_admin_key.sh
```

## Convex Auth

run `generateKeys.mjs` to get keys and paste them to Convex Dashboard -> Settings -> Environment Variables

```javascript
// generateKeys.mjs
import { exportJWK, exportPKCS8, generateKeyPair } from 'jose';

const keys = await generateKeyPair('RS256', {
  extractable: true,
});
const privateKey = await exportPKCS8(keys.privateKey);
const publicKey = await exportJWK(keys.publicKey);
const jwks = JSON.stringify({ keys: [{ use: 'sig', ...publicKey }] });

process.stdout.write(
  `JWT_PRIVATE_KEY="${privateKey.trimEnd().replace(/\n/g, ' ')}"`,
);
process.stdout.write('\n');
process.stdout.write(`JWKS=${jwks}`);
process.stdout.write('\n');
```
