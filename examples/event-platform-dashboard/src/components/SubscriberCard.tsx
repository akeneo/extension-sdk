import styled from 'styled-components';
import {getColor, SectionTitle} from 'akeneo-design-system';
import type {SubscriberWithSubscriptions} from '../types';
import {formatDateTime} from '../formatting';
import DetailList, {type Detail} from './DetailList';
import StatusBadge from './StatusBadge';
import SubscriptionTable from './SubscriptionTable';

const Card = styled.section`
    border: 1px solid ${getColor('grey', 60)};
    border-radius: 4px;
    margin-bottom: 20px;
    padding: 12px 16px 16px;
`;

const Details = styled.div`
    padding: 12px 0 16px;
`;

type SubscriberCardProps = SubscriberWithSubscriptions & {
    recentErrorCounts: Record<string, number>;
};

const detailsOf = ({subscriber}: SubscriberWithSubscriptions): Detail[] => {
    const details: Detail[] = [
        {label: 'Subscriber id', value: <code>{subscriber.id}</code>},
        {label: 'Subject', value: subscriber.subject},
        {label: 'Technical email', value: subscriber.contact.technical_email},
        {label: 'Created', value: formatDateTime(subscriber.created_at)},
        {label: 'Updated', value: formatDateTime(subscriber.updated_at)},
    ];

    if (subscriber.contact.notification_channels?.length) {
        details.push({label: 'Notification channels', value: subscriber.contact.notification_channels.join(', ')});
    }

    if (subscriber.contact.notification_webhook_url) {
        details.push({label: 'Notification webhook', value: subscriber.contact.notification_webhook_url});
    }

    return details;
};

const SubscriberCard = (props: SubscriberCardProps) => {
    const {subscriber, subscriptions, recentErrorCounts} = props;

    return (
        <Card>
            <SectionTitle>
                <SectionTitle.Title level="secondary">{subscriber.name}</SectionTitle.Title>
                <StatusBadge status={subscriber.status} />
                <SectionTitle.Spacer />
                <SectionTitle.Information>
                    {subscriptions.length} subscription{subscriptions.length === 1 ? '' : 's'}
                </SectionTitle.Information>
            </SectionTitle>
            <Details>
                <DetailList details={detailsOf(props)} />
            </Details>
            <SubscriptionTable subscriptions={subscriptions} recentErrorCounts={recentErrorCounts} />
        </Card>
    );
};

export default SubscriberCard;
