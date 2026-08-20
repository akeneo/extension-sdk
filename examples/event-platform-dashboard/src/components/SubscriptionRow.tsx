import {useState} from 'react';
import {Table} from 'akeneo-design-system';
import type {Subscription} from '../types';
import {formatBoolean, formatDateTime, formatFieldName, formatUnknown} from '../formatting';
import {useSubscriptionErrors} from '../useSubscriptionErrors';
import DetailList, {type Detail} from './DetailList';
import ErrorCountBadge from './ErrorCountBadge';
import ExpandButton from './ExpandButton';
import ExpandedCell from './ExpandedCell';
import StatusBadge from './StatusBadge';
import SubscriptionErrors from './SubscriptionErrors';

type SubscriptionRowProps = {
    subscription: Subscription;
    recentErrorCount: number;
    columnCount: number;
};

const destinationOf = (subscription: Subscription): string => {
    const url = subscription.config?.url;

    return typeof url === 'string' ? url : '-';
};

const detailsOf = (subscription: Subscription): Detail[] => {
    const details: Detail[] = [
        {label: 'Subscription id', value: <code>{subscription.id}</code>},
        {label: 'Destination', value: destinationOf(subscription)},
        {
            label: 'Events',
            value: subscription.events.map(event => <div key={event}>{event}</div>),
        },
        {label: 'Filter', value: subscription.filter || 'None'},
        {label: 'Subject', value: subscription.subject},
        {label: 'Product identifier', value: formatBoolean(subscription.send_product_identifier)},
    ];

    Object.entries(subscription.options ?? {}).forEach(([option, value]) => {
        details.push({label: formatFieldName(option), value: formatUnknown(value)});
    });

    details.push(
        {label: 'Created', value: formatDateTime(subscription.created_at)},
        {label: 'Updated', value: formatDateTime(subscription.updated_at)},
    );

    return details;
};

const SubscriptionRow = ({subscription, recentErrorCount, columnCount}: SubscriptionRowProps) => {
    const [expanded, setExpanded] = useState(false);
    const [firstEvent, ...otherEvents] = subscription.events;
    const errorsState = useSubscriptionErrors(subscription.id, expanded);

    return (
        <>
            <Table.Row>
                <Table.Cell>
                    <ExpandButton
                        expanded={expanded}
                        onToggle={() => setExpanded(current => !current)}
                        label={expanded ? 'Hide subscription details' : 'Show subscription details'}
                    />
                </Table.Cell>
                <Table.Cell>{subscription.type}</Table.Cell>
                <Table.Cell>{subscription.source}</Table.Cell>
                <Table.Cell>
                    {firstEvent}
                    {otherEvents.length > 0 && ` +${otherEvents.length}`}
                </Table.Cell>
                <Table.Cell>
                    <StatusBadge status={subscription.status} />
                </Table.Cell>
                <Table.Cell>{recentErrorCount > 0 ? <ErrorCountBadge count={recentErrorCount} /> : null}</Table.Cell>
                <Table.Cell>{formatDateTime(subscription.updated_at)}</Table.Cell>
            </Table.Row>
            {expanded && (
                <Table.Row>
                    <ExpandedCell columnCount={columnCount}>
                        <DetailList details={detailsOf(subscription)} />
                        <SubscriptionErrors state={errorsState} />
                    </ExpandedCell>
                </Table.Row>
            )}
        </>
    );
};

export default SubscriptionRow;
