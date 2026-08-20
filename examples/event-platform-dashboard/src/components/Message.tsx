import type {ReactNode} from 'react';
import {Helper} from 'akeneo-design-system';

type MessageProps = {
    level: 'info' | 'error';
    title: string;
    children?: ReactNode;
};

const Message = ({level, title, children}: MessageProps) => (
    <Helper level={level}>
        <strong>{title}</strong>
        {children}
    </Helper>
);

export default Message;
