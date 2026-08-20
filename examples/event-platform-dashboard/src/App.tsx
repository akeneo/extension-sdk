import {useEffect, useMemo, useState} from 'react';
import styled from 'styled-components';
import {getColor} from 'akeneo-design-system';
import {readConfiguration, targetFor, type Connection} from './configuration';
import {ApiTargetProvider} from './ConfigurationContext';
import {fetchErrorLogs, fetchSubscribers, fetchSubscriptions} from './eventPlatformClient';
import type {SelfServiceLog, SubscriberWithSubscriptions} from './types';
import ConnectionSelector from './components/ConnectionSelector';
import ErrorLogSection, {type ErrorLogState} from './components/ErrorLogSection';
import Message from './components/Message';
import Panel from './components/Panel';
import SubscriberCard from './components/SubscriberCard';

type SubscriberState =
    | {status: 'loading'}
    | {status: 'loaded'; subscribers: SubscriberWithSubscriptions[]}
    | {status: 'failed'; reason: string};

const Page = styled.div`
    padding: 20px;
`;

const ProblemList = styled.ul`
    margin-top: 8px;
    padding-left: 20px;
`;

const LoadingMessage = styled.p`
    color: ${getColor('grey', 120)};
`;

const reasonOf = (error: unknown): string => (error instanceof Error ? error.message : 'Unknown error.');

const countRecentErrors = (logs: SelfServiceLog[]): Record<string, number> =>
    logs.reduce<Record<string, number>>((counts, log) => {
        counts[log.subscription_id] = (counts[log.subscription_id] ?? 0) + 1;

        return counts;
    }, {});

const labelSubscriptions = (subscribers: SubscriberWithSubscriptions[]): Record<string, string> => {
    const labels: Record<string, string> = {};

    subscribers.forEach(({subscriber, subscriptions}) => {
        subscriptions.forEach(subscription => {
            labels[subscription.id] = `${subscriber.name} · ${subscription.type}`;
        });
    });

    return labels;
};

const App = () => {
    const configurationResult = useMemo(readConfiguration, []);
    const configuration = configurationResult.status === 'complete' ? configurationResult.configuration : null;

    const [selectedConnection, setSelectedConnection] = useState<Connection | null>(
        configuration?.connections[0] ?? null,
    );
    const [subscriberState, setSubscriberState] = useState<SubscriberState>({status: 'loading'});
    const [errorLogState, setErrorLogState] = useState<ErrorLogState>({status: 'loading'});

    const target = useMemo(
        () => (configuration !== null && selectedConnection !== null ? targetFor(configuration, selectedConnection) : null),
        [configuration, selectedConnection],
    );

    useEffect(() => {
        if (target === null) {
            return;
        }

        let cancelled = false;
        setSubscriberState({status: 'loading'});
        setErrorLogState({status: 'loading'});

        const loadSubscribers = async () => {
            try {
                const subscribers = await fetchSubscribers(target);
                const withSubscriptions = await Promise.all(
                    subscribers.map(async subscriber => ({
                        subscriber,
                        subscriptions: await fetchSubscriptions(target, subscriber.id),
                    })),
                );

                if (!cancelled) {
                    setSubscriberState({status: 'loaded', subscribers: withSubscriptions});
                }
            } catch (error) {
                if (!cancelled) {
                    setSubscriberState({status: 'failed', reason: reasonOf(error)});
                }
            }
        };

        const loadErrorLogs = async () => {
            try {
                const logs = await fetchErrorLogs(target);

                if (!cancelled) {
                    setErrorLogState({status: 'loaded', logs});
                }
            } catch (error) {
                if (!cancelled) {
                    setErrorLogState({status: 'failed', reason: reasonOf(error)});
                }
            }
        };

        void loadSubscribers();
        void loadErrorLogs();

        return () => {
            cancelled = true;
        };
    }, [target]);

    const recentErrorCounts = useMemo(
        () => (errorLogState.status === 'loaded' ? countRecentErrors(errorLogState.logs) : {}),
        [errorLogState],
    );

    const subscriberNames = useMemo(() => {
        if (subscriberState.status !== 'loaded') {
            return {};
        }

        return subscriberState.subscribers.reduce<Record<string, string>>((names, {subscriber}) => {
            names[subscriber.id] = subscriber.name;

            return names;
        }, {});
    }, [subscriberState]);

    const subscriptionLabels = useMemo(
        () => (subscriberState.status === 'loaded' ? labelSubscriptions(subscriberState.subscribers) : {}),
        [subscriberState],
    );

    if (configuration === null || target === null || selectedConnection === null) {
        return (
            <Page>
                <Message level="error" title="This extension is not configured yet.">
                    <p>Fix the following custom variables, then reload the page:</p>
                    <ProblemList>
                        {(configurationResult.status === 'incomplete' ? configurationResult.problems : []).map(
                            problem => (
                                <li key={problem}>
                                    <code>{problem}</code>
                                </li>
                            ),
                        )}
                    </ProblemList>
                </Message>
            </Page>
        );
    }

    return (
        <ApiTargetProvider value={target}>
            <Page>
                <ConnectionSelector
                    connections={configuration.connections}
                    selected={selectedConnection}
                    onSelect={setSelectedConnection}
                />

                <Panel
                    title="Errors"
                    aside={
                        errorLogState.status === 'loaded'
                            ? `${errorLogState.logs.length} in the latest logs`
                            : undefined
                    }
                >
                    <ErrorLogSection
                        state={errorLogState}
                        subscriptionLabels={subscriptionLabels}
                        subscriberNames={subscriberNames}
                    />
                </Panel>

                {subscriberState.status === 'loading' && (
                    <LoadingMessage>Loading your Event Platform subscriptions...</LoadingMessage>
                )}

                {subscriberState.status === 'failed' && (
                    <Message level="error" title="Could not reach the Event Platform.">
                        <p>{subscriberState.reason}</p>
                    </Message>
                )}

                {subscriberState.status === 'loaded' && subscriberState.subscribers.length === 0 && (
                    <Message level="info" title="No subscriber found for this connection.">
                        <p>Subscribers are scoped to the PIM connection used by this extension.</p>
                    </Message>
                )}

                {subscriberState.status === 'loaded' &&
                    subscriberState.subscribers.map(({subscriber, subscriptions}) => (
                        <SubscriberCard
                            key={subscriber.id}
                            subscriber={subscriber}
                            subscriptions={subscriptions}
                            recentErrorCounts={recentErrorCounts}
                        />
                    ))}
            </Page>
        </ApiTargetProvider>
    );
};

export default App;
