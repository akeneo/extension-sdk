import { useMemo } from 'react';
import styled from 'styled-components';
import { Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { loadConfig } from './utils/config';
import { calculateDueDates } from './utils/releaseLogic';
import { Product, STAGE_CONFIG } from './types';

const Container = styled.div`
  padding: 20px;
  background: white;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #F5F5F5;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #11324D;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 32px 16px;
  color: #67768E;
`;

const EmptyIcon = styled.div`
  margin-bottom: 12px;
  opacity: 0.5;
`;

const DueDateList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const DueDateCard = styled.div<{ $isAtRisk?: boolean; $isOverdue?: boolean }>`
  padding: 16px;
  border-radius: 8px;
  border: 1px solid ${({ $isAtRisk, $isOverdue }) =>
    $isOverdue ? '#EE5D50' : $isAtRisk ? '#FFA726' : '#DDDDDD'};
  background: ${({ $isAtRisk, $isOverdue }) =>
    $isOverdue ? '#FFEBEE' : $isAtRisk ? '#FFF8E1' : 'white'};
`;

const DueDateHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const LocaleInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LocaleFlag = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: #11324D;
`;

const DateInfo = styled.div<{ $isOverdue?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${({ $isOverdue }) => ($isOverdue ? '#EE5D50' : '#67768E')};
  font-weight: ${({ $isOverdue }) => ($isOverdue ? '600' : 'normal')};
`;

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const StageBadge = styled.div<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 16px;
  background: ${({ $color }) => $color}40;
  color: #11324D;
  font-size: 12px;
  font-weight: 600;
`;

const Completeness = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #11324D;
`;

const ProgressBar = styled.div`
  height: 6px;
  background: #F5F5F5;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const ProgressFill = styled.div<{ $percent: number; $color: string }>`
  height: 100%;
  width: ${({ $percent }) => $percent}%;
  background: ${({ $color }) => $color};
  transition: width 0.3s ease;
`;

const MissingItems = styled.div`
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #EEEEEE;
`;

const MissingItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #67768E;
  margin-top: 4px;
`;

function App() {
  // Get product from context
  const product: Product | null = (globalThis as any).PIM?.context?.product || null;

  // Load configuration
  const config = useMemo(() => loadConfig(), []);

  // Calculate due dates
  const dueDates = useMemo(() => {
    if (!product) return [];
    return calculateDueDates(product, config);
  }, [product, config]);

  if (!product) {
    return (
      <Container>
        <EmptyState>
          <EmptyIcon>
            <Calendar size={48} />
          </EmptyIcon>
          <div>No product data available</div>
        </EmptyState>
      </Container>
    );
  }

  if (dueDates.length === 0) {
    return (
      <Container>
        <Header>
          <Calendar size={20} />
          <Title>Release Schedule</Title>
        </Header>
        <EmptyState>
          <EmptyIcon>
            <Clock size={32} />
          </EmptyIcon>
          <div>No release dates configured for this product</div>
          <div style={{ fontSize: '12px', marginTop: '8px' }}>
            Configure release dates in Extension Custom Variables
          </div>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Calendar size={20} />
        <Title>Release Schedule</Title>
      </Header>

      <DueDateList>
        {dueDates.map((dueDate) => {
          const stageConfig = STAGE_CONFIG[dueDate.currentStage];
          const formattedDate = new Date(dueDate.dueDate!).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });

          return (
            <DueDateCard
              key={dueDate.locale}
              $isAtRisk={dueDate.isAtRisk}
              $isOverdue={dueDate.isOverdue}
            >
              <DueDateHeader>
                <LocaleInfo>
                  <LocaleFlag>{dueDate.locale}</LocaleFlag>
                  {dueDate.isOverdue && <AlertCircle size={16} color="#EE5D50" />}
                  {dueDate.currentStage === 'live' && (
                    <CheckCircle size={16} color="#66BB6A" />
                  )}
                </LocaleInfo>
                <DateInfo $isOverdue={dueDate.isOverdue}>
                  <Calendar size={14} />
                  {formattedDate}
                  {dueDate.daysUntilDue !== null && (
                    <span>
                      {dueDate.isOverdue
                        ? `(${Math.abs(dueDate.daysUntilDue)} days overdue)`
                        : `(${dueDate.daysUntilDue} days)`}
                    </span>
                  )}
                </DateInfo>
              </DueDateHeader>

              <StatusRow>
                <StageBadge $color={stageConfig.color}>{stageConfig.label}</StageBadge>
                <Completeness>{Math.round(dueDate.completeness)}% complete</Completeness>
              </StatusRow>

              <ProgressBar>
                <ProgressFill $percent={dueDate.completeness} $color={stageConfig.color} />
              </ProgressBar>

              {dueDate.missingItems.length > 0 && (
                <MissingItems>
                  {dueDate.missingItems.map((item, idx) => (
                    <MissingItem key={idx}>
                      <AlertCircle size={12} />
                      {item}
                    </MissingItem>
                  ))}
                </MissingItems>
              )}
            </DueDateCard>
          );
        })}
      </DueDateList>
    </Container>
  );
}

export default App;
