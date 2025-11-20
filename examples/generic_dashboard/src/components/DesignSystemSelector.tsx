import { ThemeProvider } from 'styled-components';
import { TabBar, pimTheme } from 'akeneo-design-system';
import { useDesignSystem } from '../contexts/DesignSystemContext';

export const DesignSystemSelector = () => {
  const { designSystem, setDesignSystem } = useDesignSystem();

  return (
    <ThemeProvider theme={pimTheme}>
      <div style={{ padding: '20px 20px 0 20px', backgroundColor: '#f7f7fb' }}>
        <TabBar moreButtonTitle="More">
          <TabBar.Tab
            isActive={designSystem === 'akeneo'}
            onClick={() => setDesignSystem('akeneo')}
          >
            Akeneo Design System
          </TabBar.Tab>
          <TabBar.Tab
            isActive={designSystem === 'shadcn'}
            onClick={() => setDesignSystem('shadcn')}
          >
            shadcn/ui
          </TabBar.Tab>
          <TabBar.Tab
            isActive={designSystem === 'polaris'}
            onClick={() => setDesignSystem('polaris')}
          >
            Shopify Polaris
          </TabBar.Tab>
        </TabBar>
      </div>
    </ThemeProvider>
  );
};
