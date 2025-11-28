import { ProductWithRelease } from '../types';
import { Badge } from 'akeneo-design-system';
import styled from 'styled-components';
import { AlertCircle, Calendar, CheckCircle } from 'lucide-react';

interface ProductCardProps {
  product: ProductWithRelease;
  onNavigate: (productUuid: string) => void;
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

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
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

export function ProductCard({ product, onNavigate, showLocales = true }: ProductCardProps) {
  // Find nearest go-live date
  const nearestDate = Object.entries(product.goLiveDates)
    .filter(([_, date]) => date !== null)
    .map(([locale, date]) => ({ locale, date: new Date(date!) }))
    .sort((a, b) => a.date.getTime() - b.date.getTime())[0];

  return (
    <Card $isAtRisk={product.isAtRisk} onClick={() => onNavigate(product.uuid)}>
      <Header>
        <Identifier title={product.identifier}>{product.identifier}</Identifier>
        {product.enabled ? (
          <CheckCircle size={16} color="#67B373" />
        ) : (
          <AlertCircle size={16} color="#67768E" />
        )}
      </Header>

      <StatusRow>
        {product.validation.masterValidated && (
          <Badge level="tertiary">Master ✓</Badge>
        )}
        {product.validation.centralValidated && (
          <Badge level="tertiary">Central ✓</Badge>
        )}
      </StatusRow>

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
    </Card>
  );
}
