import styled from 'styled-components';
import {Field, SelectInput} from 'akeneo-design-system';
import type {Connection} from '../configuration';

const Wrapper = styled.div`
    margin-bottom: 20px;
    max-width: 320px;
`;

type ConnectionSelectorProps = {
    connections: Connection[];
    selected: Connection;
    onSelect: (connection: Connection) => void;
};

const ConnectionSelector = ({connections, selected, onSelect}: ConnectionSelectorProps) => {
    if (connections.length < 2) {
        return null;
    }

    return (
        <Wrapper>
            <Field label="Connection">
                <SelectInput
                    emptyResultLabel="No connection"
                    openLabel="Open"
                    value={selected.credentialsCode}
                    onChange={(code: string) => {
                        const connection = connections.find(candidate => candidate.credentialsCode === code);

                        if (connection !== undefined) {
                            onSelect(connection);
                        }
                    }}
                >
                    {connections.map(connection => (
                        <SelectInput.Option key={connection.credentialsCode} value={connection.credentialsCode}>
                            {connection.label}
                        </SelectInput.Option>
                    ))}
                </SelectInput>
            </Field>
        </Wrapper>
    );
};

export default ConnectionSelector;
