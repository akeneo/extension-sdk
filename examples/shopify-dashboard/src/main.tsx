import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import App from './App.tsx'
import './index.css'
import {pimTheme} from "akeneo-design-system";
import {ThemeProvider} from "styled-components";

if (!document.getElementById('root')) {
    document.body.innerHTML = '<div id="root"></div>';
}

ReactDOM.render(
  <StrictMode>
    <ThemeProvider theme={pimTheme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
  document.getElementById('root')
);
