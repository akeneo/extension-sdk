import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { pimTheme } from 'akeneo-design-system';
import App from './App';

ReactDOM.render(
  <ThemeProvider theme={pimTheme}>
    <App />
  </ThemeProvider>,
  document.getElementById('root')
);
