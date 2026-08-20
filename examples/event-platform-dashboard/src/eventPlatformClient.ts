import type {ApiTarget} from './configuration';
import type {SelfServiceLog, Subscriber, Subscription} from './types';

const ERROR_LOG_LIMIT = 50;

type ExternalCallEnvelope = {
    status: 'success' | 'error';
    statusCode: number;
    body: unknown;
    contentType: string;
    error: string | null;
};

type EventPlatformErrorBody = {
    errors?: {message: string}[];
    code?: string;
    message?: string;
    tokenEndpointStatusCode?: number;
};

const describeFailure = (envelope: ExternalCallEnvelope): string => {
    const body = (envelope.body ?? {}) as EventPlatformErrorBody;

    if (body.code === 'OAUTH2_TOKEN_FETCH_FAILED') {
        return `The PIM could not obtain a token from the connection (token endpoint returned ${body.tokenEndpointStatusCode ?? 'no status'}). Check the OAuth2 credential of this extension.`;
    }

    if (body.code === 'TIMEOUT_ERROR') {
        return 'The Event Platform did not answer within 5 seconds.';
    }

    if (envelope.statusCode === 401) {
        return 'The Event Platform rejected the credentials. Check that the connection used by the credential matches the client id declared for it in the custom variables.';
    }

    const reportedMessage = body.errors?.[0]?.message ?? body.message ?? envelope.error;

    return reportedMessage ?? `The Event Platform answered with status ${envelope.statusCode}.`;
};

const get = async <T>(target: ApiTarget, path: string): Promise<T> => {
    const response = await globalThis.PIM.api.external.call({
        method: 'GET',
        url: `${target.eventPlatformUrl}${path}`,
        headers: {
            'X-PIM-URL': target.pimUrl,
            'X-PIM-CLIENT-ID': target.connection.clientId,
        },
        credentials_code: target.connection.credentialsCode,
    });

    const envelope = (await response.json()) as ExternalCallEnvelope;

    if (envelope.status !== 'success' || envelope.statusCode >= 400) {
        throw new Error(describeFailure(envelope));
    }

    return envelope.body as T;
};

export const fetchSubscribers = async (target: ApiTarget): Promise<Subscriber[]> => {
    const subscribers = await get<Subscriber[] | null>(target, '/api/v1/subscribers');

    return subscribers ?? [];
};

export const fetchSubscriptions = async (target: ApiTarget, subscriberId: string): Promise<Subscription[]> => {
    const subscriptions = await get<Subscription[] | null>(
        target,
        `/api/v1/subscribers/${subscriberId}/subscriptions`,
    );

    return subscriptions ?? [];
};

export const fetchErrorLogs = async (target: ApiTarget, subscriptionId?: string): Promise<SelfServiceLog[]> => {
    const parameters = new URLSearchParams({
        log_type: 'error',
        order: 'desc',
        limit: String(ERROR_LOG_LIMIT),
    });

    if (subscriptionId !== undefined) {
        parameters.set('subscription_id', subscriptionId);
    }

    const logs = await get<{items: SelfServiceLog[] | null} | null>(target, `/api/v1/logs?${parameters.toString()}`);

    return logs?.items ?? [];
};
