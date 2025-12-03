import { ProductWithRelease, STAGE_CONFIG } from '../types';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useMemo } from 'react';

interface TimelineViewProps {
  products: ProductWithRelease[];
  onNavigateToProduct: (productUuid: string) => void;
  selectedLocale?: string;
}

/**
 * Format a date as YYYY-MM-DD using local time (not UTC)
 */
function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get ISO week number for a given date
 * ISO week 1 is the week with the first Thursday of the year
 */
function getISOWeekNumber(date: Date): number {
  const target = new Date(date.valueOf());
  const dayNumber = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNumber + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
}

const Container = styled.div`
  padding: 16px 0;
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const MonthSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const NavButton = styled.button`
  background: white;
  border: 1px solid #C7CBD4;
  border-radius: 4px;
  padding: 6px 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s;

  &:hover {
    background: #F5F5F5;
    border-color: #5992C1;
  }
`;

const TodayButton = styled.button`
  background: white;
  border: 1px solid #C7CBD4;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #11324D;
  transition: all 0.2s;

  &:hover {
    background: #5992C1;
    color: white;
    border-color: #5992C1;
  }
`;

const CurrentMonth = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #11324D;
  min-width: 200px;
  text-align: center;
`;

const Legend = styled.div`
  display: flex;
  gap: 16px;
  font-size: 12px;
`;

const LegendItem = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: '';
    width: 12px;
    height: 12px;
    background: ${({ $color }) => $color};
    border-radius: 2px;
  }
`;

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const DayHeaders = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
`;

const DayHeaderSpacer = styled.div`
  min-width: 80px;
`;

const DayHeadersContainer = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
`;

const DayHeader = styled.div<{ $isWeekend?: boolean }>`
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: ${({ $isWeekend }) => ($isWeekend ? '#67768E' : '#11324D')};
  padding: 8px 4px;
  background: ${({ $isWeekend }) => ($isWeekend ? '#E8E8E8' : '#F5F5F5')};
  border-radius: 4px;
`;

const WeekRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: stretch;
`;

const WeekLabel = styled.div`
  min-width: 80px;
  font-size: 12px;
  color: #425A70;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 8px;
  background: #F5F5F5;
  border-radius: 4px;
  font-weight: 600;
`;

const DaysContainer = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
`;

const DayCell = styled.div<{ $isToday?: boolean; $isCurrentMonth?: boolean; $isWeekend?: boolean }>`
  min-height: 80px;
  border: 1px solid ${({ $isToday }) => ($isToday ? '#5992C1' : '#DDDDDD')};
  border-radius: 4px;
  padding: 4px;
  background: ${({ $isCurrentMonth, $isWeekend }) => {
    if (!$isCurrentMonth) return '#FAFAFA';
    if ($isWeekend) return '#EEEEEE';
    return 'white';
  }};
  position: relative;
  overflow: hidden;

  ${({ $isToday }) =>
    $isToday &&
    `
    box-shadow: 0 0 0 2px #B3D4F1;
  `}
`;

const DayNumber = styled.div<{ $isToday?: boolean; $isCurrentMonth?: boolean }>`
  font-size: 11px;
  font-weight: ${({ $isToday }) => ($isToday ? '700' : '600')};
  color: ${({ $isToday, $isCurrentMonth }) => {
    if ($isToday) return '#2E4E6C';
    if (!$isCurrentMonth) return '#BBBBBB';
    return '#425A70';
  }};
  margin-bottom: 4px;
`;

const ProductDot = styled.div<{ $color: string }>`
  width: 100%;
  height: 16px;
  background: ${({ $color }) => $color};
  border-radius: 2px;
  margin-bottom: 2px;
  font-size: 9px;
  color: white;
  padding: 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #67768E;
  font-style: italic;
`;

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  products: ProductWithRelease[];
}

export function TimelineView({ products, onNavigateToProduct, selectedLocale }: TimelineViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Generate calendar days for the current month
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Start from the Monday of the week containing the first day
    const startDate = new Date(firstDay);
    const dayOfWeek = firstDay.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate.setDate(firstDay.getDate() - diff);

    // End on the Sunday of the week containing the last day
    const endDate = new Date(lastDay);
    const endDayOfWeek = lastDay.getDay();
    const endDiff = endDayOfWeek === 0 ? 0 : 7 - endDayOfWeek;
    endDate.setDate(lastDay.getDate() + endDiff);

    const days: CalendarDay[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      const dateStr = formatLocalDate(current);

      // Find products with go-live dates on this day
      const dayProducts = products.filter((product) => {
        // If a locale is selected, only show products with go-live dates for that locale
        if (selectedLocale) {
          const goLiveDate = product.goLiveDates[selectedLocale];
          if (!goLiveDate) return false;
          const productDateStr = formatLocalDate(new Date(goLiveDate));
          return productDateStr === dateStr;
        }

        // If no locale selected, show products with go-live dates for any locale
        return Object.values(product.goLiveDates).some((goLiveDate) => {
          if (!goLiveDate) return false;
          const productDateStr = formatLocalDate(new Date(goLiveDate));
          return productDateStr === dateStr;
        });
      });

      days.push({
        date: new Date(current),
        isCurrentMonth: current.getMonth() === month,
        products: dayProducts,
      });

      current.setDate(current.getDate() + 1);
    }

    return days;
  }, [currentDate, products, selectedLocale]);

  // Group days into weeks
  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const today = formatLocalDate(new Date());

  // Filter products with go-live dates
  const productsWithDates = products.filter((p) =>
    Object.values(p.goLiveDates).some((d) => d !== null)
  );

  if (productsWithDates.length === 0) {
    return (
      <EmptyState>
        No products with scheduled go-live dates found.
        <br />
        Set go-live dates on products to see them in the timeline view.
      </EmptyState>
    );
  }

  return (
    <Container>
      <Controls>
        <MonthSelector>
          <NavButton onClick={goToPreviousMonth}>
            <ChevronLeft size={16} />
          </NavButton>
          <CurrentMonth>
            {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate)}
          </CurrentMonth>
          <NavButton onClick={goToNextMonth}>
            <ChevronRight size={16} />
          </NavButton>
          <TodayButton onClick={goToToday}>Today</TodayButton>
        </MonthSelector>

        <Legend>
          {Object.entries(STAGE_CONFIG).map(([stageKey, stageConfig]) => (
            <LegendItem key={stageKey} $color={stageConfig.color}>
              {stageConfig.label}
            </LegendItem>
          ))}
          <LegendItem $color="#EE5D50">At Risk</LegendItem>
        </Legend>
      </Controls>

      <DayHeaders>
        <DayHeaderSpacer />
        <DayHeadersContainer>
          <DayHeader>Mon</DayHeader>
          <DayHeader>Tue</DayHeader>
          <DayHeader>Wed</DayHeader>
          <DayHeader>Thu</DayHeader>
          <DayHeader>Fri</DayHeader>
          <DayHeader $isWeekend>Sat</DayHeader>
          <DayHeader $isWeekend>Sun</DayHeader>
        </DayHeadersContainer>
      </DayHeaders>

      <Timeline>
        {weeks.map((week, weekIdx) => {
          const weekStart = week[0].date;
          const weekEnd = week[6].date;
          const isoWeekNumber = getISOWeekNumber(weekStart);

          return (
            <WeekRow key={weekIdx}>
              <WeekLabel>
                <div>Week {isoWeekNumber}</div>
                <div style={{ fontSize: '10px', fontWeight: 'normal', marginTop: '4px' }}>
                  {weekStart.getDate()}/{weekStart.getMonth() + 1} - {weekEnd.getDate()}/
                  {weekEnd.getMonth() + 1}
                </div>
              </WeekLabel>

              <DaysContainer>
                {week.map((day, dayIdx) => {
                  const dateStr = formatLocalDate(day.date);
                  const isToday = dateStr === today;
                  const dayOfWeek = day.date.getDay();
                  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

                  return (
                    <DayCell
                      key={dayIdx}
                      $isToday={isToday}
                      $isCurrentMonth={day.isCurrentMonth}
                      $isWeekend={isWeekend}
                    >
                      <DayNumber $isToday={isToday} $isCurrentMonth={day.isCurrentMonth}>
                        {day.date.getDate()}
                      </DayNumber>
                      {day.products.slice(0, 3).map((product) => {
                        const stageConfig = STAGE_CONFIG[product.currentStage];
                        const color = product.isAtRisk
                          ? '#EE5D50'
                          : stageConfig.color;

                        return (
                          <ProductDot
                            key={product.uuid}
                            $color={color}
                            title={`${product.displayLabel} (ID: ${product.identifier}) - ${stageConfig.label}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigateToProduct(product.uuid);
                            }}
                          >
                            {product.displayLabel}
                          </ProductDot>
                        );
                      })}
                      {day.products.length > 3 && (
                        <div style={{ fontSize: '9px', color: '#67768E' }}>
                          +{day.products.length - 3} more
                        </div>
                      )}
                    </DayCell>
                  );
                })}
              </DaysContainer>
            </WeekRow>
          );
        })}
      </Timeline>
    </Container>
  );
}
