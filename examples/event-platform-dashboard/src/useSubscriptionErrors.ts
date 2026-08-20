import {useEffect, useRef, useState} from 'react';
import {useApiTarget} from './ConfigurationContext';
import {fetchErrorLogs} from './eventPlatformClient';
import type {SelfServiceLog} from './types';

export type SubscriptionErrorsState =
    | {status: 'idle'}
    | {status: 'loading'}
    | {status: 'loaded'; logs: SelfServiceLog[]}
    | {status: 'failed'; reason: string};

export const useSubscriptionErrors = (subscriptionId: string, enabled: boolean): SubscriptionErrorsState => {
    const target = useApiTarget();
    const [state, setState] = useState<SubscriptionErrorsState>({status: 'idle'});
    const requestedKey = useRef<string | null>(null);
    const mounted = useRef(true);

    useEffect(
        () => () => {
            mounted.current = false;
        },
        [],
    );

    useEffect(() => {
        const key = `${target.connection.credentialsCode}:${subscriptionId}`;

        if (!enabled || requestedKey.current === key) {
            return;
        }

        requestedKey.current = key;
        setState({status: 'loading'});

        fetchErrorLogs(target, subscriptionId)
            .then(logs => {
                if (mounted.current) {
                    setState({status: 'loaded', logs});
                }
            })
            .catch(error => {
                requestedKey.current = null;

                if (mounted.current) {
                    setState({
                        status: 'failed',
                        reason: error instanceof Error ? error.message : 'Unknown error.',
                    });
                }
            });
    }, [enabled, target, subscriptionId]);

    return state;
};
