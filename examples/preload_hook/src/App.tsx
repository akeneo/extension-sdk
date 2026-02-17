import {Helper, Placeholder, UsersIllustration} from "akeneo-design-system";
import {useProductInfo} from "./useProductInfo.ts";
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
    const {productInfo, loading, error} = useProductInfo();

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

    if (!productInfo) {
        return null;
    }

    const label = productInfo.label ?? 'N/A';
    const identifier = productInfo.identifier ?? 'N/A';

    return (
        <Container>
            <Row>
                <Label>Product</Label>
                <span>{label} ({identifier})</span>
            </Row>
            <Row>
                <Label>Stock</Label>
                <Badge $color="#67b373">Available</Badge>
            </Row>
            <Row>
                <Label>Price</Label>
                <span>149.99 EUR</span>
            </Row>
            <Row>
                <Label>Compliance</Label>
                <Badge $color="#67b373">CE</Badge>
                <Badge $color="#67b373">RoHS</Badge>
            </Row>
        </Container>
    );
}

export default App;
