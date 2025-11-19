import { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { pimTheme } from 'akeneo-design-system';
import { AppProvider } from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title,
} from 'chart.js';
import { useProducts } from "./hooks/useProducts.tsx";
import { useFamilies } from './hooks/useFamilies.tsx';
import { useLocaleCompleteness } from './hooks/useLocaleCompleteness.tsx';
import { useMockChartData } from './hooks/useMockChartData.tsx';
import { FamilyFilter } from './components/FamilyFilter.tsx';
import { DesignSystemSelector } from './components/DesignSystemSelector.tsx';
import { useDesignSystem } from './contexts/DesignSystemContext';
import { ShadcnDashboard } from './components/dashboards/ShadcnDashboard';
import { AkeneoDashboard } from './components/dashboards/AkeneoDashboard';
import { PolarisDashboard } from './components/dashboards/PolarisDashboard';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title
);

// --- App Component ---
function App() {
  const { designSystem } = useDesignSystem();
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);

  const { families, loading: familiesLoading } = useFamilies();
  const { completenessData, isLoading: completenessLoading } = useLocaleCompleteness(selectedFamily);
  const products = useProducts(selectedFamily);

  // MOCK DATA: Generate fake chart data for demo purposes
  // In production, this should be replaced with real API calls
  const { productStatusData, pricingStatusData } = useMockChartData(selectedFamily);

  // Effect to set the initial filter value
  useEffect(() => {
    if (!selectedFamily && families.length > 0) {
      setSelectedFamily(families[0].code);
    }
  }, [families, selectedFamily]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'black',
          boxWidth: 20,
          padding: 20,
        },
      },
    },
  };

  const selectedFamilyLabel = families.find(f => f.code === selectedFamily)?.label || '...';

  return (
    <>
      <DesignSystemSelector />
      <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-10 bg-background py-4 mb-8">
          <div className="flex flex-wrap justify-between items-center gap-4">
              <FamilyFilter
                  families={families}
                  selectedFamily={selectedFamily}
                  onFamilyChange={setSelectedFamily}
                  loading={familiesLoading}
              />
          </div>
        </header>

        {/* Conditional rendering based on selected design system */}
        {designSystem === 'shadcn' && (
          <ShadcnDashboard
            productStatusData={productStatusData}
            pricingStatusData={pricingStatusData}
            chartOptions={chartOptions}
            selectedFamilyLabel={selectedFamilyLabel}
            completenessData={completenessData}
            completenessLoading={completenessLoading}
            products={products}
          />
        )}

        {designSystem === 'akeneo' && (
          <ThemeProvider theme={pimTheme}>
            <AkeneoDashboard
              productStatusData={productStatusData}
              pricingStatusData={pricingStatusData}
              selectedFamilyLabel={selectedFamilyLabel}
              completenessData={completenessData}
              completenessLoading={completenessLoading}
              products={products}
            />
          </ThemeProvider>
        )}

        {designSystem === 'polaris' && (
          <AppProvider i18n={{}}>
            <PolarisDashboard
              productStatusData={productStatusData}
              pricingStatusData={pricingStatusData}
              selectedFamilyLabel={selectedFamilyLabel}
              completenessData={completenessData}
              completenessLoading={completenessLoading}
              products={products}
            />
          </AppProvider>
        )}
      </div>
    </>
  );
}

export default App;
