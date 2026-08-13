import {Table} from 'akeneo-design-system';
import type {SelfServiceLog} from '../types';
import ErrorLogRow from './ErrorLogRow';

type ErrorLogTableProps = {
    logs: SelfServiceLog[];
    subscriptionLabels?: Record<string, string>;
    subscriberNames?: Record<string, string>;
};

const labelFor = (
    log: SelfServiceLog,
    subscriptionLabels: Record<string, string>,
    subscriberNames: Record<string, string>,
): string => {
    if (log.subscription_id !== '') {
        return subscriptionLabels[log.subscription_id] ?? log.subscription_id;
    }

    if (log.subscriber_id !== '') {
        return `${subscriberNames[log.subscriber_id] ?? log.subscriber_id} (never created)`;
    }

    return 'Not created';
};

const ErrorLogTable = ({logs, subscriptionLabels, subscriberNames = {}}: ErrorLogTableProps) => {
    const showSubscription = subscriptionLabels !== undefined;
    const columnCount = showSubscription ? 7 : 6;

    return (
        <Table>
            <Table.Header>
                <Table.HeaderCell>{''}</Table.HeaderCell>
                <Table.HeaderCell>When</Table.HeaderCell>
                {showSubscription && <Table.HeaderCell>Subscription</Table.HeaderCell>}
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Reason</Table.HeaderCell>
                <Table.HeaderCell>Code</Table.HeaderCell>
                <Table.HeaderCell>Message</Table.HeaderCell>
            </Table.Header>
            <Table.Body>
                {logs.map(log => (
                    <ErrorLogRow
                        key={log.log_id}
                        log={log}
                        columnCount={columnCount}
                        subscriptionLabel={
                            subscriptionLabels === undefined ? undefined : labelFor(log, subscriptionLabels, subscriberNames)
                        }
                    />
                ))}
            </Table.Body>
        </Table>
    );
};

export default ErrorLogTable;
