import {Field, SelectInput} from 'akeneo-design-system';
import type {Connection} from '../configuration';

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
        <div style={{marginBottom: '20px', maxWidth: '320px'}}>
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
        </div>
    );
};

export default ConnectionSelector;
