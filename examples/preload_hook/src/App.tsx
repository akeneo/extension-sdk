import {Helper, Placeholder, UsersIllustration} from "akeneo-design-system";
import {usePreLoadData} from "./usePreLoadData.ts";
import styled from "styled-components";

const Container = styled.div`
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 13px;
    color: #67768a;
`;

const Row = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const Label = styled.span`
    font-weight: 700;
    min-width: 100px;
`;

const Badge = styled.span<{$color: string}>`
    display: inline-block;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 700;
    color: white;
    background-color: ${({$color}) => $color};
`;

function App() {
    const {preLoadData, loading, error} = usePreLoadData();

    if (loading) {
        return (
            <Placeholder
                illustration={<UsersIllustration />}
                title="Loading product information.."
            />
        );
    }

    if (error) {
        return (
            <Helper level="error" inline={false}>
                {error}
            </Helper>
        );
    }

    if (!preLoadData) {
        return null;
    }

    return (
        <Container>
            <Row>
                <Label>Product</Label>
                <span>{preLoadData.label}</span>
            </Row>
            <Row>
                <Label>Certification</Label>
                <Badge $color="#67b373">CE Certificate valid until 15/09/2027</Badge>
            </Row>
            <Row>
                <Label>Expiration</Label>
                <Badge $color="#67b373">Product expiration date: 01/03/2028</Badge>
            </Row>
        </Container>
    );
}

export default App;
