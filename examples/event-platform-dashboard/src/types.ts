export type Subscriber = {
    id: string;
    name: string;
    subject: string;
    status: string;
    contact: {
        technical_email: string;
        notification_channels?: string[];
        notification_webhook_url?: string;
    };
    created_at: string;
    updated_at: string;
};

export type Subscription = {
    id: string;
    config: Record<string, unknown>;
    events: string[];
    type: string;
    source: string;
    subject: string;
    status: string;
    subscriber_id: string;
    created_at: string;
    updated_at: string;
    filter?: string;
    send_product_identifier: boolean;
    options?: {
        send_product_identifier_in_changes: boolean;
    };
};

export type SelfServiceLog = {
    log_id: string;
    log_type: 'action' | 'error';
    timestamp: string;
    operation?: string;
    subscriber_id: string;
    subscription_id: string;
    error_type?: string;
    error_reason?: string;
    error_code?: number;
    error_message?: string;
    request?: unknown;
    response?: unknown;
    documentation_url?: string;
};

export type SubscriberWithSubscriptions = {
    subscriber: Subscriber;
    subscriptions: Subscription[];
};
