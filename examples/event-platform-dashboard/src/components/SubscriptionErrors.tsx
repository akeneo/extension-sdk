import styled from 'styled-components';
import {getColor, getFontSize} from 'akeneo-design-system';
import type {SubscriptionErrorsState} from '../useSubscriptionErrors';
import ErrorLogTable from './ErrorLogTable';
import Message from './Message';

const Title = styled.h4`
    font-size: ${getFontSize('small')};
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: ${getColor('grey', 120)};
    margin: 20px 0 6px;
`;

const Frame = styled.div`
    background: ${getColor('white')};
`;

const SubscriptionErrors = ({state}: {state: SubscriptionErrorsState}) => {
    const count = state.status === 'loaded' && state.logs.length > 0 ? ` (${state.logs.length})` : '';

    return (
        <>
            <Title>Errors{count}</Title>
            {(state.status === 'idle' || state.status === 'loading') && <p>Loading errors for this subscription...</p>}
            {state.status === 'failed' && (
                <Message level="error" title="Could not load the errors of this subscription.">
                    <p>{state.reason}</p>
                </Message>
            )}
            {state.status === 'loaded' && state.logs.length === 0 && (
                <p>No error recorded for this subscription.</p>
            )}
            {state.status === 'loaded' && state.logs.length > 0 && (
                <Frame>
                    <ErrorLogTable logs={state.logs} />
                </Frame>
            )}
        </>
    );
};

export default SubscriptionErrors;
