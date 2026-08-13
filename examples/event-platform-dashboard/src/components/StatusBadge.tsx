import {Badge, type Level} from 'akeneo-design-system';

const LEVELS: Record<string, Level> = {
    active: 'primary',
    enabled: 'primary',
    suspended: 'warning',
    revoked: 'danger',
    deleted: 'danger',
    disabled: 'tertiary',
};

const StatusBadge = ({status}: {status: string}) => (
    <Badge level={LEVELS[status.toLowerCase()] ?? 'tertiary'}>{status}</Badge>
);

export default StatusBadge;
