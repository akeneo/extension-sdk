import { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { pimTheme } from 'akeneo-design-system';
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
import { FamilyFilter } from './components/FamilyFilter.tsx';
import { DesignSystemSelector } from './components/DesignSystemSelector.tsx';
import { useDesignSystem } from './contexts/DesignSystemContext';
import { ShadcnDashboard } from './components/dashboards/ShadcnDashboard';
import { AkeneoDashboard } from './components/dashboards/AkeneoDashboard';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title
);

const productChartColors = ["#9452BA", "#763E9E", "#52267D"];
const pricingChartColors = ["#9452BA", "#763E9E"];

// --- App Component ---
function App() {
  const { designSystem } = useDesignSystem();
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);

  const [productStatusData, setProductStatusData] = useState<any>({ labels: [], datasets: [] });
  const [pricingStatusData, setPricingStatusData] = useState<any>({ labels: [], datasets: [] });

  const { families, loading: familiesLoading } = useFamilies();
  const { completenessData, isLoading: completenessLoading } = useLocaleCompleteness(selectedFamily);
  const products = useProducts(selectedFamily);

  // Effect to set the initial filter value
  useEffect(() => {
    if (!selectedFamily && families.length > 0) {
      setSelectedFamily(families[0].code);
    }
  }, [families, selectedFamily]);

  // Generate new fake data whenever the selected family changes
  useEffect(() => {
    if (selectedFamily) {
      console.log(`[Fake Data] Generating new chart data for family: ${selectedFamily}`);
      
      const totalProducts = 200 + Math.floor(Math.random() * 50);
      const completeAll = Math.floor(totalProducts * (0.4 + Math.random() * 0.2));
      const readyForTranslation = Math.floor(totalProducts * (0.2 + Math.random() * 0.1));
      const incomplete = totalProducts - completeAll - readyForTranslation;
      const withPrice = completeAll + readyForTranslation - Math.floor(totalProducts * (0.1 + Math.random() * 0.05));
      const withoutPrice = totalProducts - withPrice;

      setProductStatusData({
        labels: ["Complete (all languages)", "Ready for translation (EN)", "Incomplete"],
        datasets: [{
          data: [completeAll, readyForTranslation, incomplete],
          backgroundColor: productChartColors,
        }],
      });

      setPricingStatusData({
        labels: ["Products with price", "Products without price"],
        datasets: [{
          data: [withPrice, withoutPrice],
          backgroundColor: pricingChartColors,
        }],
      });
    }
  }, [selectedFamily]);

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
      </div>
    </>
  );
}

export default App;
