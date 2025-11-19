import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { DesignSystemProvider } from './contexts/DesignSystemContext';

// The root element is now created by the script itself if it doesn't exist.
if (!document.getElementById('root')) {
    document.body.innerHTML = '<div id="root"></div>';
}

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <DesignSystemProvider>
            <App />
        </DesignSystemProvider>
    </React.StrictMode>
);
