import { useState, useEffect } from 'react';
import { ReleaseCalendarConfig, ProductWithRelease, STAGE_CONFIG } from '../types';
import styled from 'styled-components';
import { AlertCircle, Calendar, CheckCircle } from 'lucide-react';
import { Placeholder, UsersIllustration, MessageBar } from 'akeneo-design-system';
import { inferProductStage, extractGoLiveDates, extractCompletenessPerLocale, extractValidationPerLocale, isProductAtRisk, getLiveLocales } from '../utils/stageInference';
import { validateMasterLocale, validateAllLocales } from '../utils/validationActions';
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

const LocaleCompleteness = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CompletenessItem = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr 80px;
  align-items: center;
  gap: 12px;
  font-size: 13px;
`;

const LocaleName = styled.div`
  font-weight: 500;
  color: #11324D;
`;

const CompletenessColumn = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CompletenessBar = styled.div`
  flex: 1;
  height: 6px;
  background: #F5F5F5;
  border-radius: 3px;
  overflow: hidden;
`;

const PercentageText = styled.span`
  min-width: 35px;
  text-align: right;
  color: #67768E;
`;

const CompletenessProgress = styled.div<{ $percentage: number }>`
  height: 100%;
  width: ${({ $percentage }) => $percentage}%;
  background: #67B373;
  border-radius: 3px;
  transition: width 0.3s;
`;

const ValidationIndicator = styled.div<{ $validated: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ $validated }) => ($validated ? '#67B373' : '#E0E0E0')};
  color: white;
  margin: 0 auto;
`;

const MessageBarContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  max-width: 400px;
`;

export function PanelMode({ config }: PanelModeProps) {
  const [product, setProduct] = useState<ProductWithRelease | null>(null);
  const [validationStatus, setValidationStatus] = useState<{ [locale: string]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [message, setMessage] = useState<{ text: string; level: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  useEffect(() => {
    const fetchCurrentProduct = async () => {
      try {
        // Get current product/product model from PIM context
        const context = globalThis.PIM?.context;

        // Check if context has product or productModel
        let productData: any;
        if (context && 'product' in context && context.product) {
          // Regular product
          const productUuid = context.product.uuid;
          if (!productUuid) {
            console.error('No product UUID found in context');
            setLoading(false);
            return;
          }
          productData = await globalThis.PIM.api.product_uuid_v1.get({ uuid: productUuid, withCompletenesses: true });
        } else if (context && 'productModel' in context && context.productModel) {
          // Product model or sub-product model
          const productModelCode = context.productModel.code;
          if (!productModelCode) {
            console.error('No product model code found in context');
            setLoading(false);
            return;
          }
          productData = await globalThis.PIM.api.product_model_v1.get({ code: productModelCode });
        } else {
          console.error('No product or product model context found - extension may not be in a panel position');
          setLoading(false);
          return;
        }

        // Enrich product with release tracking data
        const currentStage = inferProductStage(productData as any, config);
        const goLiveDates = extractGoLiveDates(productData as any, config);
        const completenessPerLocale = extractCompletenessPerLocale(productData as any, config);
        const validationPerLocale = extractValidationPerLocale(productData as any, config);
        const riskInfo = isProductAtRisk(productData as any, currentStage, config);
        const liveLocales = getLiveLocales(productData as any, config);

        const enrichedProduct: ProductWithRelease = {
          ...productData,
          uuid: productData.uuid || productData.code, // Use code for product models
          identifier: productData.identifier || productData.code || '',
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

        setProduct(enrichedProduct);
        setValidationStatus(validationPerLocale);
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
    setMessage(null);
    try {
      await validateMasterLocale(product.uuid, config);
      setMessage({ text: 'Master locale validated successfully!', level: 'success' });
      setTimeout(() => {
        // Refresh product data
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Failed to validate master locale:', error);
      const errorMsg = error instanceof Error && error.message.includes('validation')
        ? 'Validation attribute not found. Please check your configuration.'
        : 'Failed to validate. Please try again.';
      setMessage({ text: errorMsg, level: 'error' });
      setTimeout(() => setMessage(null), 5000);
      setIsValidating(false);
    }
  };

  const handleValidateAll = async () => {
    if (!product) return;
    setIsValidating(true);
    setMessage(null);
    try {
      await validateAllLocales(product.uuid, config);
      setMessage({ text: 'All locales validated successfully!', level: 'success' });
      setTimeout(() => {
        // Refresh product data
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Failed to validate all locales:', error);
      const errorMsg = error instanceof Error && error.message.includes('validation')
        ? 'Validation attribute not found. Please check your configuration.'
        : 'Failed to validate. Please try again.';
      setMessage({ text: errorMsg, level: 'error' });
      setTimeout(() => setMessage(null), 5000);
      setIsValidating(false);
    }
  };

  const handleGoLive = () => {
    if (!product) return;
    setMessage({
      text: 'Go live mechanism is not yet implemented. Please configure your publishing workflow in the triggerGoLive function.',
      level: 'warning'
    });
    setTimeout(() => setMessage(null), 5000);
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
    <>
      <Container>
        {/* Current Stage */}
        <Section>
        <StageCard $color={stageConfig.color}>
          <StageLabel>{stageConfig.label}</StageLabel>
          <StageDescription>{stageConfig.description}</StageDescription>
        </StageCard>
      </Section>

      {/* Release Dates */}
      <Section>
        <SectionTitle>
          <Calendar size={16} />
          Release Dates
        </SectionTitle>
        <DateList>
          {Object.entries(product.goLiveDates).map(([locale, dateStr]) => {
            return (
              <DateItem key={locale}>
                <LocaleLabel>
                  {locale}
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
        <SectionTitle>Completeness {config.validationAttribute && '& Validation'}</SectionTitle>
        <LocaleCompleteness>
          {Object.entries(product.completenessPerLocale).map(([locale, percentage]) => (
            <CompletenessItem key={locale}>
              <LocaleName>{locale}</LocaleName>
              <CompletenessColumn>
                <CompletenessBar>
                  <CompletenessProgress $percentage={percentage} />
                </CompletenessBar>
                <PercentageText>{percentage}%</PercentageText>
              </CompletenessColumn>
              {config.validationAttribute && (
                <ValidationIndicator $validated={validationStatus[locale] || false} title={validationStatus[locale] ? 'Validated' : 'Not validated'}>
                  {validationStatus[locale] && <CheckCircle size={14} />}
                </ValidationIndicator>
              )}
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
            {isValidating ? 'Validating...' : 'Validate Master'}
          </ValidationButton>
        </Section>
      )}

      {product.currentStage === ReleaseStage.GLOBAL_VALIDATION && (
        <Section>
          <ValidationButton onClick={handleValidateAll} disabled={isValidating}>
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
    </>
  );
}
