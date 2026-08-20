import type {ReactNode} from 'react';
import styled from 'styled-components';
import {getColor, Table} from 'akeneo-design-system';

const Cell = styled(Table.Cell)`
    padding: 0;
`;

const Content = styled.div`
    padding: 12px 16px 16px 44px;
    background: ${getColor('grey', 20)};
`;

type ExpandedCellProps = {
    columnCount: number;
    children: ReactNode;
};

const ExpandedCell = ({columnCount, children}: ExpandedCellProps) => (
    <Cell colSpan={columnCount}>
        <Content>{children}</Content>
    </Cell>
);

export default ExpandedCell;
