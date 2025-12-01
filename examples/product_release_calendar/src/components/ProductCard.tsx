import { ProductWithRelease, ReleaseStage, ReleaseCalendarConfig } from '../types';
import styled from 'styled-components';
import { AlertCircle, Calendar, CheckCircle } from 'lucide-react';
import { findNearestGoLiveDate } from '../utils/stageInference';
import { validateMasterLocale, validateAllLocales, triggerGoLive } from '../utils/validationActions';
import { useState } from 'react';

interface ProductCardProps {
  product: ProductWithRelease;
  onNavigate: (productUuid: string) => void;
  config: ReleaseCalendarConfig;
  onRefresh: () => void;
  showLocales?: boolean;
}

const Card = styled.div<{ $isAtRisk?: boolean }>`
  background: white;
  border: 1px solid ${({ $isAtRisk }) => ($isAtRisk ? '#EE5D50' : '#DDDDDD')};
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-color: #5992C1;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const Identifier = styled.div`
  font-weight: 600;
  color: #11324D;
  font-size: 14px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RiskIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #EE5D50;
  font-size: 12px;
  margin-top: 4px;
`;

const MissingItem = styled.div`
  font-size: 11px;
  color: #67768E;
  padding-left: 20px;
`;

const LocaleInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 8px;
`;

const LocaleBadge = styled.div<{ $isLive?: boolean }>`
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 3px;
  background: ${({ $isLive }) => ($isLive ? '#E9F7EB' : '#F5F5F5')};
  color: ${({ $isLive }) => ($isLive ? '#236334' : '#67768E')};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const DateBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #67768E;
`;

const ValidationButton = styled.button`
  width: 100%;
  padding: 8px 12px;
  margin-top: 8px;
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

export function ProductCard({ product, onNavigate, config, onRefresh, showLocales = true }: ProductCardProps) {
  const [isValidating, setIsValidating] = useState(false);

  // Find nearest go-live date (any date, past or future)
  const nearestDate = findNearestGoLiveDate(product.goLiveDates);

  const handleValidateMaster = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsValidating(true);
    try {
      await validateMasterLocale(product.uuid, config);
      onRefresh(); // Refresh to update the product stage
    } catch (error) {
      console.error('Failed to validate master locale:', error);
      alert('Failed to validate. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleValidateAll = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsValidating(true);
    try {
      await validateAllLocales(product.uuid, config);
      onRefresh(); // Refresh to update the product stage
    } catch (error) {
      console.error('Failed to validate all locales:', error);
      alert('Failed to validate. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleGoLive = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerGoLive(product.identifier);
  };

  return (
    <Card $isAtRisk={product.isAtRisk} onClick={() => onNavigate(product.uuid)}>
      <Header>
        <Identifier title={product.identifier}>{product.identifier}</Identifier>
        <span title={product.enabled ? "Product is enabled" : "Product is disabled"}>
          {product.enabled ? (
            <CheckCircle size={16} color="#67B373" />
          ) : (
            <AlertCircle size={16} color="#67768E" />
          )}
        </span>
      </Header>

      {nearestDate && (
        <DateBadge>
          <Calendar size={12} />
          {nearestDate.date.toLocaleDateString()} ({nearestDate.locale})
        </DateBadge>
      )}

      {product.isAtRisk && (
        <>
          <RiskIndicator>
            <AlertCircle size={14} />
            At Risk
          </RiskIndicator>
          {product.missingItems.map((item, idx) => (
            <MissingItem key={idx}>• {item}</MissingItem>
          ))}
        </>
      )}

      {showLocales && (
        <LocaleInfo>
          {Object.entries(product.completenessPerLocale).map(([locale, completeness]) => {
            const isLive = product.liveLocales.includes(locale);
            return (
              <LocaleBadge key={locale} $isLive={isLive} title={`${completeness}% complete`}>
                {locale}
                {isLive && ' ✓'}
              </LocaleBadge>
            );
          })}
        </LocaleInfo>
      )}

      {/* Validation buttons based on current stage */}
      {product.currentStage === ReleaseStage.MASTER_VALIDATION && (
        <ValidationButton onClick={handleValidateMaster} disabled={isValidating}>
          <CheckCircle size={16} />
          {isValidating ? 'Validating...' : 'Validate Master'}
        </ValidationButton>
      )}

      {product.currentStage === ReleaseStage.GLOBAL_VALIDATION && (
        <ValidationButton onClick={handleValidateAll} disabled={isValidating}>
          <CheckCircle size={16} />
          {isValidating ? 'Validating...' : 'Validate All Locales'}
        </ValidationButton>
      )}

      {product.currentStage === ReleaseStage.GO_LIVE && (
        <ValidationButton onClick={handleGoLive}>
          <Calendar size={16} />
          Go Live
        </ValidationButton>
      )}
    </Card>
  );
}
