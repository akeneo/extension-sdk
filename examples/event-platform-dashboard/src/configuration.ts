export type Connection = {
    label: string;
    clientId: string;
    credentialsCode: string;
};

export type DashboardConfiguration = {
    eventPlatformUrl: string;
    pimUrl: string;
    connections: Connection[];
};

export type ApiTarget = {
    eventPlatformUrl: string;
    pimUrl: string;
    connection: Connection;
};

export type ConfigurationResult =
    | {status: 'complete'; configuration: DashboardConfiguration}
    | {status: 'incomplete'; problems: string[]};

const readString = (name: string): string => {
    const value = globalThis.PIM.custom_variables?.[name];

    return typeof value === 'string' ? value.trim() : '';
};

const withoutTrailingSlash = (url: string): string => url.replace(/\/$/, '');

const readDeclaredConnections = (): unknown[] => {
    const declared = globalThis.PIM.custom_variables?.connections;

    return Array.isArray(declared) ? declared : [];
};

const parseConnection = (candidate: unknown, index: number, problems: string[]): Connection | null => {
    if (typeof candidate !== 'object' || candidate === null) {
        problems.push(`connections[${index}] must be an object`);

        return null;
    }

    const {label, client_id: clientId, credentials_code: credentialsCode} = candidate as Record<string, unknown>;

    if (typeof clientId !== 'string' || clientId.trim() === '') {
        problems.push(`connections[${index}].client_id is missing`);

        return null;
    }

    if (typeof credentialsCode !== 'string' || credentialsCode.trim() === '') {
        problems.push(`connections[${index}].credentials_code is missing`);

        return null;
    }

    return {
        label: typeof label === 'string' && label.trim() !== '' ? label.trim() : `Connection ${index + 1}`,
        clientId: clientId.trim(),
        credentialsCode: credentialsCode.trim(),
    };
};

const readConnections = (problems: string[]): Connection[] => {
    const declared = readDeclaredConnections();

    if (declared.length > 0) {
        return declared
            .map((candidate, index) => parseConnection(candidate, index, problems))
            .filter((connection): connection is Connection => connection !== null);
    }

    const clientId = readString('pim_client_id');
    const credentialsCode = readString('credentials_code');

    if (clientId === '' || credentialsCode === '') {
        problems.push('either a "connections" list, or both "pim_client_id" and "credentials_code"');

        return [];
    }

    return [{label: 'Default connection', clientId, credentialsCode}];
};

export const readConfiguration = (): ConfigurationResult => {
    const problems: string[] = [];
    const eventPlatformUrl = readString('event_platform_url');
    const pimUrl = readString('pim_url');

    if (eventPlatformUrl === '') {
        problems.push('event_platform_url');
    }

    if (pimUrl === '') {
        problems.push('pim_url');
    }

    const connections = readConnections(problems);

    if (problems.length > 0 || connections.length === 0) {
        return {status: 'incomplete', problems};
    }

    return {
        status: 'complete',
        configuration: {
            eventPlatformUrl: withoutTrailingSlash(eventPlatformUrl),
            pimUrl: withoutTrailingSlash(pimUrl),
            connections,
        },
    };
};

export const targetFor = (configuration: DashboardConfiguration, connection: Connection): ApiTarget => ({
    eventPlatformUrl: configuration.eventPlatformUrl,
    pimUrl: configuration.pimUrl,
    connection,
});
