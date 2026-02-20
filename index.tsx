import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // Or wherever your main component lives

// 1. Get the container element from your index.html
const container = document.getElementById('root');

// 2. Add a safety check (helpful for debugging blank screens)
if (!container) {
  throw new Error("Target container 'root' not found. Check your index.html.");
}

// 3. Create the React 19 root
const root = createRoot(container);

// 4. Render the application
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);