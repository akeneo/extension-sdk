import type {ReactNode} from 'react';
import {SectionTitle} from 'akeneo-design-system';

type PanelProps = {
    title: string;
    aside?: ReactNode;
    children: ReactNode;
};

const Panel = ({title, aside, children}: PanelProps) => (
    <section style={{marginBottom: '30px'}}>
        <SectionTitle>
            <SectionTitle.Title>{title}</SectionTitle.Title>
            {aside !== undefined && (
                <>
                    <SectionTitle.Spacer />
                    <SectionTitle.Information>{aside}</SectionTitle.Information>
                </>
            )}
        </SectionTitle>
        {children}
    </section>
);

export default Panel;
