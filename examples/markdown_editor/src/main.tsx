import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

if (!document.getElementById('root')) {
  document.body.innerHTML = '<div id="root"></div>';
}

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
);
