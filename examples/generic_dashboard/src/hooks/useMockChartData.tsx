import { useEffect, useState } from 'react';

/**
 * MOCK DATA HOOK - FOR DEMO PURPOSES ONLY
 *
 * This hook generates fake/mock chart data to demonstrate the dashboard UI.
 * It creates randomized statistics for product status and pricing status.
 *
 * In a real implementation, this data should be fetched from:
 * - PIM API endpoints for product completeness aggregation by family
 * - PIM API endpoints for pricing status aggregation
 *
 * The data regenerates whenever the selected family changes to simulate
 * different statistics per product family.
 */

const productChartColors = ["#9452BA", "#763E9E", "#52267D"];
const pricingChartColors = ["#9452BA", "#763E9E"];

interface ChartData {
  labels: string[];
  datasets: Array<{
    data: number[];
    backgroundColor: string[];
  }>;
}

interface MockChartDataResult {
  productStatusData: ChartData;
  pricingStatusData: ChartData;
}

/**
 * Generates mock chart data for product status and pricing status
 *
 * @param selectedFamily - The currently selected product family code
 * @returns Object containing productStatusData and pricingStatusData for charts
 */
export const useMockChartData = (selectedFamily: string | null): MockChartDataResult => {
  const [productStatusData, setProductStatusData] = useState<ChartData>({ labels: [], datasets: [] });
  const [pricingStatusData, setPricingStatusData] = useState<ChartData>({ labels: [], datasets: [] });

  useEffect(() => {
    if (selectedFamily) {

      // Generate random total products count (200-250)
      const totalProducts = 200 + Math.floor(Math.random() * 50);

      // Generate random distribution for product completeness status
      const completeAll = Math.floor(totalProducts * (0.4 + Math.random() * 0.2)); // 40-60%
      const readyForTranslation = Math.floor(totalProducts * (0.2 + Math.random() * 0.1)); // 20-30%
      const incomplete = totalProducts - completeAll - readyForTranslation;

      // Generate random pricing distribution
      const withPrice = completeAll + readyForTranslation - Math.floor(totalProducts * (0.1 + Math.random() * 0.05));
      const withoutPrice = totalProducts - withPrice;

      // Set mock product status data
      setProductStatusData({
        labels: ["Complete (all languages)", "Ready for translation (EN)", "Incomplete"],
        datasets: [{
          data: [completeAll, readyForTranslation, incomplete],
          backgroundColor: productChartColors,
        }],
      });

      // Set mock pricing status data
      setPricingStatusData({
        labels: ["Products with price", "Products without price"],
        datasets: [{
          data: [withPrice, withoutPrice],
          backgroundColor: pricingChartColors,
        }],
      });
    }
  }, [selectedFamily]);

  return { productStatusData, pricingStatusData };
};
