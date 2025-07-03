// // src/main.jsx
// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import App from './App.jsx';
// import './index.css';

// // Function to enable MSW mocking
// async function enableMocking() {
//   // Only run MSW in development environment
//   if (import.meta.env.DEV) {
//     const { worker } = await import('./mocks/browser');
//     return worker.start({
//       onUnhandledRequest(request) {
//         // Don't warn for Vite HMR requests
//         if (request.url.includes('/@vite') || request.url.includes('/@react-refresh')) {
//           return;
//         }
//         // Other unhandled requests will be bypassed
//       }
//     });
//   }
//   return Promise.resolve();
// }

// const rootElement = document.getElementById('root');
// const root = createRoot(rootElement);

// enableMocking().then(() => {
//   root.render(
//     <StrictMode>
//       <App />
//     </StrictMode>,
//   );
// }).catch(err => {
//   console.error("Failed to enable MSW mocking:", err);
//   // Render app normally if MSW fails
//   root.render(
//     <StrictMode>
//       <App />
//     </StrictMode>,
//   );
// });

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';


createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
);

