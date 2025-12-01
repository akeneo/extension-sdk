import { ProductWithRelease, ReleaseStage, STAGE_CONFIG, ReleaseCalendarConfig } from '../types';
import { ProductCard } from './ProductCard';
import styled from 'styled-components';

interface PipelineViewProps {
  products: ProductWithRelease[];
  config: ReleaseCalendarConfig;
  onNavigateToProduct: (productUuid: string) => void;
  onRefresh: () => void;
}

const Container = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 16px 0;
  min-height: 400px;
`;

const Column = styled.div`
  min-width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
`;

const ColumnHeader = styled.div<{ $color: string }>`
  background: ${({ $color }) => $color};
  color: white;
  padding: 12px;
  border-radius: 4px 4px 0 0;
  font-weight: 600;
  font-size: 14px;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const ColumnDescription = styled.div`
  font-size: 11px;
  opacity: 0.9;
  margin-top: 4px;
`;

const ColumnBody = styled.div`
  background: #F5F5F5;
  border: 1px solid #DDDDDD;
  border-top: none;
  border-radius: 0 0 4px 4px;
  padding: 12px;
  flex: 1;
  overflow-y: auto;
`;

const Count = styled.span`
  opacity: 0.8;
  font-weight: normal;
  margin-left: 8px;
`;

const EmptyState = styled.div`
  color: #67768E;
  font-size: 12px;
  text-align: center;
  padding: 20px;
  font-style: italic;
`;

export function PipelineView({ products, config, onNavigateToProduct, onRefresh }: PipelineViewProps) {
  // Group products by stage
  const productsByStage: { [key in ReleaseStage]: ProductWithRelease[] } = {
    [ReleaseStage.CREATION]: [],
    [ReleaseStage.MASTER_ENRICHMENT]: [],
    [ReleaseStage.MASTER_VALIDATION]: [],
    [ReleaseStage.LOCALIZATION]: [],
    [ReleaseStage.GLOBAL_VALIDATION]: [],
    [ReleaseStage.GO_LIVE]: [],
    [ReleaseStage.LIVE]: [],
  };

  products.forEach((product) => {
    productsByStage[product.currentStage].push(product);
  });

  // Sort products within each stage by nearest go-live date
  Object.values(productsByStage).forEach((stageProducts) => {
    stageProducts.sort((a, b) => {
      const aDate = Object.values(a.goLiveDates)
        .filter((d) => d !== null)
        .map((d) => new Date(d!).getTime())
        .sort()[0];
      const bDate = Object.values(b.goLiveDates)
        .filter((d) => d !== null)
        .map((d) => new Date(d!).getTime())
        .sort()[0];

      if (!aDate && !bDate) return 0;
      if (!aDate) return 1;
      if (!bDate) return -1;
      return aDate - bDate;
    });
  });

  const stages = Object.values(ReleaseStage);

  return (
    <Container>
      {stages.map((stage) => {
        const stageConfig = STAGE_CONFIG[stage];
        const stageProducts = productsByStage[stage];

        return (
          <Column key={stage}>
            <ColumnHeader $color={stageConfig.color}>
              {stageConfig.label}
              <Count>({stageProducts.length})</Count>
              <ColumnDescription>{stageConfig.description}</ColumnDescription>
            </ColumnHeader>
            <ColumnBody>
              {stageProducts.length === 0 ? (
                <EmptyState>No products</EmptyState>
              ) : (
                stageProducts.map((product) => (
                  <ProductCard
                    key={product.uuid}
                    product={product}
                    config={config}
                    onNavigate={onNavigateToProduct}
                    onRefresh={onRefresh}
                    showLocales={false}
                  />
                ))
              )}
            </ColumnBody>
          </Column>
        );
      })}
    </Container>
  );
}
