import { useState, useEffect } from 'react';
import { ReleaseCalendarConfig, ProductWithRelease, STAGE_CONFIG } from '../types';
import styled from 'styled-components';
import { AlertCircle, Calendar, CheckCircle } from 'lucide-react';
import { Placeholder, UsersIllustration } from 'akeneo-design-system';
import { inferProductStage, extractGoLiveDates, extractCompletenessPerLocale, isProductAtRisk, getLiveLocales } from '../utils/stageInference';
import { validateMasterLocale, validateAllLocales, triggerGoLive } from '../utils/validationActions';
import { ReleaseStage } from '../types';

interface PanelModeProps {
  config: ReleaseCalendarConfig;
}

const Container = styled.div`
  padding: 16px;
  background: white;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #11324D;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StageCard = styled.div<{ $color: string }>`
  background: ${({ $color }) => $color};
  color: white;
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 16px;
`;

const StageLabel = styled.div`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
`;

const StageDescription = styled.div`
  font-size: 12px;
  opacity: 0.9;
`;

const DateList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DateItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #F5F5F5;
  border-radius: 4px;
`;

const LocaleLabel = styled.span`
  font-weight: 600;
  color: #11324D;
  font-size: 13px;
`;

const DateValue = styled.span`
  color: #67768E;
  font-size: 13px;
`;

const MissingItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const MissingItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #FFF4F2;
  border-left: 3px solid #EE5D50;
  border-radius: 4px;
  font-size: 13px;
  color: #11324D;
`;

const ValidationButton = styled.button`
  width: 100%;
  padding: 10px 12px;
  background: #5992C1;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover {
    background: #4A7A9E;
  }

  &:disabled {
    background: #CCCCCC;
    cursor: not-allowed;
  }
`;

const InfoBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #E9F7EB;
  color: #236334;
  border-radius: 3px;
  font-size: 12px;
  font-weight: 600;
`;

const LocaleCompleteness = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CompletenessItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
`;

const CompletenessBar = styled.div`
  flex: 1;
  height: 6px;
  background: #F5F5F5;
  border-radius: 3px;
  margin: 0 12px;
  overflow: hidden;
`;

const CompletenessProgress = styled.div<{ $percentage: number }>`
  height: 100%;
  width: ${({ $percentage }) => $percentage}%;
  background: #67B373;
  border-radius: 3px;
  transition: width 0.3s;
`;

export function PanelMode({ config }: PanelModeProps) {
  const [product, setProduct] = useState<ProductWithRelease | null>(null);
  const [loading, setLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    const fetchCurrentProduct = async () => {
      try {
        // Get current product from PIM context
        const context = globalThis.PIM?.context;

        // Type guard to check if context has product
        if (!context || !('product' in context)) {
          console.error('No product context found - extension may not be in product panel position');
          setLoading(false);
          return;
        }

        const productUuid = context.product.uuid;

        if (!productUuid) {
          console.error('No product UUID found in context');
          setLoading(false);
          return;
        }

        // Fetch the product data
        const productData: any = await globalThis.PIM.api.product_uuid_v1.get({ uuid: productUuid });

        // Ensure UUID exists (identifier can be empty)
        if (!productData.uuid) {
          console.error('Invalid product data received - no UUID');
          setLoading(false);
          return;
        }

        // Enrich product with release tracking data
        const currentStage = inferProductStage(productData as any, config);
        const goLiveDates = extractGoLiveDates(productData as any, config);
        const completenessPerLocale = extractCompletenessPerLocale(productData as any, config);
        const riskInfo = isProductAtRisk(productData as any, currentStage, config);
        const liveLocales = getLiveLocales(productData as any, config);

        const enrichedProduct: ProductWithRelease = {
          ...productData,
          uuid: productData.uuid,
          identifier: productData.identifier || '',
          enabled: productData.enabled ?? true,
          currentStage,
          goLiveDates,
          completenessPerLocale,
          validation: {
            masterValidated: false,
            centralValidated: false,
          },
          liveLocales,
          isAtRisk: riskInfo.isAtRisk,
          missingItems: riskInfo.missingItems,
        };

        console.log("enrichedProduct", enrichedProduct)
        setProduct(enrichedProduct);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentProduct();
  }, [config]);

  const handleValidateMaster = async () => {
    if (!product) return;
    setIsValidating(true);
    try {
      await validateMasterLocale(product.uuid, config);
      // Refresh product data
      window.location.reload();
    } catch (error) {
      console.error('Failed to validate master locale:', error);
      alert('Failed to validate. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleValidateAll = async () => {
    if (!product) return;
    setIsValidating(true);
    try {
      await validateAllLocales(product.uuid, config);
      // Refresh product data
      window.location.reload();
    } catch (error) {
      console.error('Failed to validate all locales:', error);
      alert('Failed to validate. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleGoLive = () => {
    if (!product) return;
    triggerGoLive(product.identifier);
  };

  if (loading) {
    return (
      <Container>
        <Placeholder
          illustration={<UsersIllustration />}
          title="Loading..."
        />
      </Container>
    );
  }

  if (!product) {
    return (
      <Container>
        <Placeholder
          illustration={<UsersIllustration />}
          title="No product found"
        >
          Unable to load product release information.
        </Placeholder>
      </Container>
    );
  }

  const stageConfig = STAGE_CONFIG[product.currentStage];

  return (
    <Container>
      {/* Current Stage */}
      <Section>
        <StageCard $color={stageConfig.color}>
          <StageLabel>{stageConfig.label}</StageLabel>
          <StageDescription>{stageConfig.description}</StageDescription>
        </StageCard>
        {product.enabled && (
          <InfoBadge>
            <CheckCircle size={14} />
            Product Enabled
          </InfoBadge>
        )}
      </Section>

      {/* Release Dates */}
      <Section>
        <SectionTitle>
          <Calendar size={16} />
          Release Dates
        </SectionTitle>
        <DateList>
          {Object.entries(product.goLiveDates).map(([locale, dateStr]) => {
            const isLive = product.liveLocales.includes(locale);
            return (
              <DateItem key={locale}>
                <LocaleLabel>
                  {locale} {isLive && '✓'}
                </LocaleLabel>
                <DateValue>
                  {dateStr ? new Date(dateStr).toLocaleDateString() : 'Not set'}
                </DateValue>
              </DateItem>
            );
          })}
        </DateList>
      </Section>

      {/* Completeness per Locale */}
      <Section>
        <SectionTitle>Completeness</SectionTitle>
        <LocaleCompleteness>
          {Object.entries(product.completenessPerLocale).map(([locale, percentage]) => (
            <CompletenessItem key={locale}>
              <span>{locale}</span>
              <CompletenessBar>
                <CompletenessProgress $percentage={percentage} />
              </CompletenessBar>
              <span>{percentage}%</span>
            </CompletenessItem>
          ))}
        </LocaleCompleteness>
      </Section>

      {/* Missing Items / At Risk */}
      {product.isAtRisk && product.missingItems.length > 0 && (
        <Section>
          <SectionTitle>
            <AlertCircle size={16} color="#EE5D50" />
            Missing Items
          </SectionTitle>
          <MissingItemsList>
            {product.missingItems.map((item, idx) => (
              <MissingItem key={idx}>
                <AlertCircle size={14} />
                {item}
              </MissingItem>
            ))}
          </MissingItemsList>
        </Section>
      )}

      {/* Validation Buttons */}
      {product.currentStage === ReleaseStage.MASTER_VALIDATION && (
        <Section>
          <ValidationButton onClick={handleValidateMaster} disabled={isValidating}>
            <CheckCircle size={16} />
            {isValidating ? 'Validating...' : 'Validate Master'}
          </ValidationButton>
        </Section>
      )}

      {product.currentStage === ReleaseStage.GLOBAL_VALIDATION && (
        <Section>
          <ValidationButton onClick={handleValidateAll} disabled={isValidating}>
            <CheckCircle size={16} />
            {isValidating ? 'Validating...' : 'Validate All Locales'}
          </ValidationButton>
        </Section>
      )}

      {product.currentStage === ReleaseStage.GO_LIVE && (
        <Section>
          <ValidationButton onClick={handleGoLive}>
            <Calendar size={16} />
            Go Live
          </ValidationButton>
        </Section>
      )}
    </Container>
  );
}
