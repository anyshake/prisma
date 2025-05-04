import './index.css';

import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';

import App from './App.tsx';
import { ErrorPage } from './components/ErrorPage.tsx';

createRoot(document.getElementById('root')!).render(
    <ErrorBoundary fallback={<ErrorPage />}>
        <App />
    </ErrorBoundary>
);
