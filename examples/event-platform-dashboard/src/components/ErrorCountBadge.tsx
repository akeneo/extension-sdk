import {Badge} from 'akeneo-design-system';

const ErrorCountBadge = ({count}: {count: number}) => (
    <Badge level="danger">
        {count} error{count === 1 ? '' : 's'}
    </Badge>
);

export default ErrorCountBadge;
