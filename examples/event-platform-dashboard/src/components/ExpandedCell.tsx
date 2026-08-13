import type {ReactNode} from 'react';
import styled from 'styled-components';
import {getColor, Table} from 'akeneo-design-system';

const Content = styled.div`
    padding: 12px 16px 16px 44px;
    background: ${getColor('grey', 20)};
`;

type ExpandedCellProps = {
    columnCount: number;
    children: ReactNode;
};

const ExpandedCell = ({columnCount, children}: ExpandedCellProps) => (
    <Table.Cell colSpan={columnCount} style={{padding: 0}}>
        <Content>{children}</Content>
    </Table.Cell>
);

export default ExpandedCell;
