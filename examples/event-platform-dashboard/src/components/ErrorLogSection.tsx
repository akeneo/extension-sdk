import type {SelfServiceLog} from '../types';
import ErrorLogTable from './ErrorLogTable';
import Message from './Message';

export type ErrorLogState =
    | {status: 'loading'}
    | {status: 'loaded'; logs: SelfServiceLog[]}
    | {status: 'failed'; reason: string};

type ErrorLogSectionProps = {
    state: ErrorLogState;
    subscriptionLabels: Record<string, string>;
    subscriberNames: Record<string, string>;
};

const ErrorLogSection = ({state, subscriptionLabels, subscriberNames}: ErrorLogSectionProps) => {
    if (state.status === 'loading') {
        return <p>Loading errors...</p>;
    }

    if (state.status === 'failed') {
        return (
            <Message level="error" title="Could not load the errors.">
                <p>{state.reason}</p>
            </Message>
        );
    }

    if (state.logs.length === 0) {
        return <p>No error recorded.</p>;
    }

    return (
        <ErrorLogTable
            logs={state.logs}
            subscriptionLabels={subscriptionLabels}
            subscriberNames={subscriberNames}
        />
    );
};

export default ErrorLogSection;
