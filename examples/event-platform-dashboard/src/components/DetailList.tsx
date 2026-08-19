import type {ReactNode} from 'react';
import styled from 'styled-components';
import {getColor, getFontSize} from 'akeneo-design-system';

export type Detail = {
    label: string;
    value: ReactNode;
};

const List = styled.dl`
    display: grid;
    grid-template-columns: 170px minmax(0, 1fr);
    row-gap: 6px;
    align-items: baseline;
`;

const Label = styled.dt`
    font-size: ${getFontSize('small')};
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: ${getColor('grey', 120)};
`;

const Value = styled.dd`
    word-break: break-word;
    color: ${getColor('grey', 140)};
`;

const Row = styled.div`
    display: contents;
`;

const DetailList = ({details}: {details: Detail[]}) => (
    <List>
        {details.map(({label, value}) => (
            <Row key={label}>
                <Label>{label}</Label>
                <Value>{value}</Value>
            </Row>
        ))}
    </List>
);

export default DetailList;
