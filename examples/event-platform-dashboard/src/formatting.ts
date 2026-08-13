const pad = (value: number): string => String(value).padStart(2, '0');

export const formatDateTime = (value: string): string => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

    return `${day} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const formatBoolean = (value: boolean): string => (value ? 'Yes' : 'No');
