import { SectionTitle } from "akeneo-design-system";
import { ProductEnrichmentStatus } from "./components/ProductEnrichmentStatus";
import { FamilyStatistics } from "./components/FamilyStatistics";
import { ProductCompletenessWidget } from "./components/ProductCompletenessWidget";
import { ProductStockWidget } from "./components/ProductStockWidget";
import { TopCategoriesWidget } from "./components/TopCategoriesWidget";
import { useEffect, useState } from "react";

function App() {
  const [isMobile, setIsMobile] = useState(false);

  // Function to check viewport width and set responsive mode
  const checkViewportWidth = () => {
    setIsMobile(window.innerWidth < 768);
  };

  // Add event listener for window resize
  useEffect(() => {
    checkViewportWidth();
    window.addEventListener('resize', checkViewportWidth);
    return () => window.removeEventListener('resize', checkViewportWidth);
  }, []);

  // Styles with responsive adjustments
  const containerStyle = {
    padding: '16px',
    maxWidth: '100%',
    boxSizing: 'border-box' as const,
    overflowX: 'hidden' as const
  };

  const flexContainerStyle = {
    display: 'flex' as const,
    flexDirection: isMobile ? 'column' as const : 'row' as const,
    gap: '24px',
    marginTop: '24px',
    width: '100%'
  };

  const flexColumnStyle = {
    flex: isMobile ? '1 1 100%' : '1 1 50%',
    minWidth: isMobile ? '100%' : '0',
  };

  const placeholderStyle = {
    marginBottom: '24px'
  };

  return (
    <div style={containerStyle}>
      <div style={placeholderStyle}>
        <SectionTitle>
          <SectionTitle.Title>A comprehensive view of your PIM status and statistics</SectionTitle.Title>
        </SectionTitle>
      </div>

      <div style={flexContainerStyle}>
        <div style={flexColumnStyle}>
          <ProductEnrichmentStatus />
        </div>
        <div style={flexColumnStyle}>
          <FamilyStatistics />
        </div>
      </div>

      <div style={flexContainerStyle}>
        <div style={flexColumnStyle}>
          <ProductCompletenessWidget />
        </div>
        <div style={flexColumnStyle}>
          <ProductStockWidget />
        </div>
      </div>

      <div style={{ marginTop: '24px' }}>
        <TopCategoriesWidget />
      </div>
    </div>
  );
}

export default App;
