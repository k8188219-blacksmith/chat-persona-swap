import { createRoot } from 'react-dom/client';
import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { ConvexReactClient } from 'convex/react';
import App from './App.tsx';
import './index.css';

const CONVEX_URL =
  import.meta.env.VITE_CONVEX_URL ||
  'https://bug-free-space-computing-machine-r4xw667v9p43wqj9-3210.app.github.dev';

const convex = new ConvexReactClient(CONVEX_URL);

createRoot(document.getElementById('root')!).render(
  <ConvexAuthProvider client={convex}>
    <App />
  </ConvexAuthProvider>,
);
