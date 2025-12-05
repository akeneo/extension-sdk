import 'styled-components';
import { Theme } from 'akeneo-design-system';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}