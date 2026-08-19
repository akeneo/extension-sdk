import {Table} from 'akeneo-design-system';
import type {Subscription} from '../types';
import SubscriptionRow from './SubscriptionRow';

const COLUMNS = ['', 'Type', 'Source', 'Events', 'Status', 'Recent errors', 'Updated'];

type SubscriptionTableProps = {
    subscriptions: Subscription[];
    recentErrorCounts: Record<string, number>;
};

const SubscriptionTable = ({subscriptions, recentErrorCounts}: SubscriptionTableProps) => {
    if (subscriptions.length === 0) {
        return <p>No subscription on this subscriber.</p>;
    }

    return (
        <Table>
            <Table.Header>
                {COLUMNS.map(column => (
                    <Table.HeaderCell key={column}>{column}</Table.HeaderCell>
                ))}
            </Table.Header>
            <Table.Body>
                {subscriptions.map(subscription => (
                    <SubscriptionRow
                        key={subscription.id}
                        subscription={subscription}
                        recentErrorCount={recentErrorCounts[subscription.id] ?? 0}
                        columnCount={COLUMNS.length}
                    />
                ))}
            </Table.Body>
        </Table>
    );
};

export default SubscriptionTable;
