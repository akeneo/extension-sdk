import { ViewMode } from '../types';
import { Button } from 'akeneo-design-system';
import styled from 'styled-components';
import { Columns, Calendar } from 'lucide-react';

interface ViewSwitcherProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const Container = styled.div`
  display: flex;
  gap: 8px;
`;

const ViewButton = styled(Button)<{ $active: boolean }>`
  opacity: ${({ $active }) => ($active ? 1 : 0.6)};
`;

export function ViewSwitcher({ currentView, onViewChange }: ViewSwitcherProps) {
  return (
    <Container>
      <ViewButton
        level={currentView === ViewMode.PIPELINE ? 'primary' : 'secondary'}
        size="small"
        $active={currentView === ViewMode.PIPELINE}
        onClick={() => onViewChange(ViewMode.PIPELINE)}
      >
        <Columns size={16} style={{ marginRight: '6px' }} />
        Pipeline View
      </ViewButton>
      <ViewButton
        level={currentView === ViewMode.TIMELINE ? 'primary' : 'secondary'}
        size="small"
        $active={currentView === ViewMode.TIMELINE}
        onClick={() => onViewChange(ViewMode.TIMELINE)}
      >
        <Calendar size={16} style={{ marginRight: '6px' }} />
        Timeline View
      </ViewButton>
    </Container>
  );
}
