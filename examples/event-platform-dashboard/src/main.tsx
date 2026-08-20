import {StrictMode} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from 'styled-components';
import {pimTheme} from 'akeneo-design-system';
import App from './App.tsx';

while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
}

const mountPoint = document.createElement('div');
mountPoint.id = 'root';
document.body.appendChild(mountPoint);

Object.assign(document.body.style, {
    margin: '0',
    padding: '0',
    background: 'transparent',
});

ReactDOM.render(
    <StrictMode>
        <ThemeProvider theme={pimTheme}>
            <App />
        </ThemeProvider>
    </StrictMode>,
    mountPoint,
);
