import { useState, useMemo, useEffect } from 'react';
import { SectionTitle, Helper, Placeholder, UsersIllustration, MessageBar } from 'akeneo-design-system';
import styled from 'styled-components';
import { ViewMode, FilterState, DisplayMode } from './types';
import { loadConfig } from './utils/config';
import { navigateToProduct } from './utils/navigation';
import { useReleaseProducts } from './hooks/useReleaseProducts';
import { useFamilies } from './hooks/useFamilies';
import { useCategories } from './hooks/useCategories';
import { ViewSwitcher } from './components/ViewSwitcher';
import { Filters } from './components/Filters';
import { PipelineView } from './components/PipelineView';
import { TimelineView } from './components/TimelineView';
import { PanelMode } from './components/PanelMode';
import { RefreshCw, AlertCircle } from 'lucide-react';

const Container = styled.div`
  padding: 20px;
  background: white;
  min-height: 100vh;
`;

const Header = styled.div`
  margin-bottom: 24px;
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const HelperSection = styled.div`
  width: 100%;
`;

const RefreshButton = styled.button`
  background: white;
  border: 1px solid #C7CBD4;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background: #F5F5F5;
    border-color: #5992C1;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Stats = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 20px;
  padding: 16px;
  background: #F5F5F5;
  border-radius: 4px;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #11324D;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #67768E;
  margin-top: 4px;
`;

const AtRiskCount = styled(StatValue)`
  color: #EE5D50;
`;

const MessageBarContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  max-width: 400px;
`;

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.PIPELINE);
  const [filters, setFilters] = useState<FilterState>({ family: '' });
  const [message, setMessage] = useState<{ text: string; level: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  // Load configuration from custom_variables
  const config = useMemo(() => loadConfig(), []);

  // If in panel mode, render simplified view for single product
  if (config.displayMode === DisplayMode.PANEL) {
    return <PanelMode config={config} />;
  }

  // Fetch families and categories for filtering
  const { families } = useFamilies();
  const { categories } = useCategories();

  // Set initial family when families are loaded
  useEffect(() => {
    if (families.length > 0 && !filters.family) {
      setFilters({ ...filters, family: families[0].code });
    }
  }, [families]);

  // Fetch products with release tracking (only if family is selected)
  const { products, loading, error, refetch } = useReleaseProducts(
    config,
    filters.family ? filters : { ...filters, family: families[0]?.code || '' }
  );

  // Calculate statistics
  const stats = useMemo(() => {
    const atRisk = products.filter((p) => p.isAtRisk).length;
    const readyToGoLive = products.filter((p) => p.currentStage === 'go_live').length;
    const live = products.filter((p) => p.currentStage === 'live').length;
    const inProgress = products.length - readyToGoLive - live;

    return { total: products.length, atRisk, readyToGoLive, live, inProgress };
  }, [products]);

  const handleNavigateToProduct = (productUuid: string) => {
    navigateToProduct(productUuid);
  };

  const showMessage = (text: string, level: 'success' | 'error' | 'warning' | 'info') => {
    setMessage({ text, level });
    setTimeout(() => setMessage(null), 5000);
  };

  return (
    <Container>
      <Header>
        <HeaderTop>
          <SectionTitle>
            <SectionTitle.Title>Product Release Calendar</SectionTitle.Title>
          </SectionTitle>
          <HeaderActions>
            <ViewSwitcher currentView={viewMode} onViewChange={setViewMode} />
            <RefreshButton onClick={refetch} disabled={loading}>
              <RefreshCw size={16} />
              Refresh
            </RefreshButton>
          </HeaderActions>
        </HeaderTop>
        <HelperSection>
          <Helper level="info" inline={false}>
            Track products through the release pipeline from creation to go-live. Configure
            release dates, attributes and thresholds using Extension Custom Variables.
          </Helper>
        </HelperSection>
      </Header>

      {error && (
        <Helper level="error" inline={false}>
          <AlertCircle size={16} style={{ marginRight: '6px' }} />
          {error}
        </Helper>
      )}

      <Stats>
        <StatItem>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Total Products</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{stats.inProgress}</StatValue>
          <StatLabel>In Progress</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{stats.readyToGoLive}</StatValue>
          <StatLabel>Ready to Go Live</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{stats.live}</StatValue>
          <StatLabel>Live</StatLabel>
        </StatItem>
        <StatItem>
          <AtRiskCount>{stats.atRisk}</AtRiskCount>
          <StatLabel>At Risk</StatLabel>
        </StatItem>
      </Stats>

      <Filters
        filters={filters}
        onFiltersChange={setFilters}
        families={families}
        categories={categories}
        config={config}
        viewMode={viewMode}
      />

      {!filters.family ? (
        <Placeholder
          illustration={<UsersIllustration />}
          title="Select a family"
        >
          Please select a product family to view the release calendar.
        </Placeholder>
      ) : loading ? (
        <Placeholder
          illustration={<UsersIllustration />}
          title="Loading products..."
        />
      ) : products.length === 0 ? (
        <Placeholder
          illustration={<UsersIllustration />}
          title="No products found"
        >
          {filters.category || filters.stage || filters.locale || filters.searchQuery
            ? 'Try adjusting your filters to see more products.'
            : `No products found in the ${families.find(f => f.code === filters.family)?.label || filters.family} family.`}
        </Placeholder>
      ) : viewMode === ViewMode.PIPELINE ? (
        <PipelineView
          products={products}
          config={config}
          onNavigateToProduct={handleNavigateToProduct}
          onRefresh={refetch}
          onShowMessage={showMessage}
        />
      ) : (
        <TimelineView
          products={products}
          onNavigateToProduct={handleNavigateToProduct}
          selectedLocale={filters.locale}
        />
      )}

      {/* Global Message Bar - Bottom Right */}
      {message && (
        <MessageBarContainer>
          <MessageBar
            level={message.level}
            title={message.level === 'success' ? 'Success' : message.level === 'error' ? 'Error' : 'Warning'}
            dismissTitle="Close"
            onClose={() => setMessage(null)}
          >
            {message.text}
          </MessageBar>
        </MessageBarContainer>
      )}
    </Container>
  );
}

export default App;
