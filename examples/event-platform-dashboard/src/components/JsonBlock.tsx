import styled from 'styled-components';
import {getColor, getFontSize} from 'akeneo-design-system';

const Block = styled.pre`
    background: ${getColor('grey', 20)};
    border: 1px solid ${getColor('grey', 60)};
    border-radius: 3px;
    padding: 8px 10px;
    margin: 0;
    max-height: 220px;
    overflow: auto;
    font-size: ${getFontSize('small')};
    white-space: pre-wrap;
    word-break: break-word;
`;

const stringify = (value: unknown): string => {
    if (typeof value === 'string') {
        return value;
    }

    try {
        return JSON.stringify(value, null, 2);
    } catch {
        return String(value);
    }
};

const JsonBlock = ({value}: {value: unknown}) => <Block>{stringify(value)}</Block>;

export default JsonBlock;
