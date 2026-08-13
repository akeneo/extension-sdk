import {Table} from 'akeneo-design-system';
import type {Subscription} from '../types';
import SubscriptionRow from './SubscriptionRow';

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
                <Table.HeaderCell>{''}</Table.HeaderCell>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Source</Table.HeaderCell>
                <Table.HeaderCell>Events</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Recent errors</Table.HeaderCell>
                <Table.HeaderCell>Updated</Table.HeaderCell>
            </Table.Header>
            <Table.Body>
                {subscriptions.map(subscription => (
                    <SubscriptionRow
                        key={subscription.id}
                        subscription={subscription}
                        recentErrorCount={recentErrorCounts[subscription.id] ?? 0}
                    />
                ))}
            </Table.Body>
        </Table>
    );
};

export default SubscriptionTable;
