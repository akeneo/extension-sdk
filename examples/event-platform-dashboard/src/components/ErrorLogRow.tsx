import {useState} from 'react';
import {Table} from 'akeneo-design-system';
import type {SelfServiceLog} from '../types';
import {formatDateTime} from '../formatting';
import DetailList, {type Detail} from './DetailList';
import ExpandButton from './ExpandButton';
import ExpandedCell from './ExpandedCell';
import JsonBlock from './JsonBlock';

type ErrorLogRowProps = {
    log: SelfServiceLog;
    subscriptionLabel?: string;
    columnCount: number;
};

const detailsOf = (log: SelfServiceLog): Detail[] => {
    const details: Detail[] = [{label: 'Log id', value: <code>{log.log_id}</code>}];

    if (log.subscription_id) {
        details.push({label: 'Subscription id', value: <code>{log.subscription_id}</code>});
    }

    if (log.subscriber_id) {
        details.push({label: 'Subscriber id', value: <code>{log.subscriber_id}</code>});
    }

    if (log.operation) {
        details.push({label: 'Operation', value: log.operation});
    }

    if (log.documentation_url) {
        details.push({label: 'Documentation', value: log.documentation_url});
    }

    if (log.request !== undefined) {
        details.push({label: 'Request', value: <JsonBlock value={log.request} />});
    }

    if (log.response !== undefined) {
        details.push({label: 'Response', value: <JsonBlock value={log.response} />});
    }

    return details;
};

const ErrorLogRow = ({log, subscriptionLabel, columnCount}: ErrorLogRowProps) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <>
            <Table.Row>
                <Table.Cell>
                    <ExpandButton
                        expanded={expanded}
                        onToggle={() => setExpanded(current => !current)}
                        label={expanded ? 'Hide error details' : 'Show error details'}
                    />
                </Table.Cell>
                <Table.Cell>{formatDateTime(log.timestamp)}</Table.Cell>
                {subscriptionLabel !== undefined && <Table.Cell>{subscriptionLabel}</Table.Cell>}
                <Table.Cell>{log.error_type || '-'}</Table.Cell>
                <Table.Cell>{log.error_reason || '-'}</Table.Cell>
                <Table.Cell>{log.error_code ?? '-'}</Table.Cell>
                <Table.Cell>{log.error_message || '-'}</Table.Cell>
            </Table.Row>
            {expanded && (
                <Table.Row>
                    <ExpandedCell columnCount={columnCount}>
                        <DetailList details={detailsOf(log)} />
                    </ExpandedCell>
                </Table.Row>
            )}
        </>
    );
};

export default ErrorLogRow;
