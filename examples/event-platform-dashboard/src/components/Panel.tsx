import type {ReactNode} from 'react';
import styled from 'styled-components';
import {SectionTitle} from 'akeneo-design-system';

const Section = styled.section`
    margin-bottom: 30px;
`;

type PanelProps = {
    title: string;
    aside?: ReactNode;
    children: ReactNode;
};

const Panel = ({title, aside, children}: PanelProps) => (
    <Section>
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
    </Section>
);

export default Panel;
