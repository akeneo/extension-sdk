import {Helper, Placeholder, UsersIllustration} from "akeneo-design-system";
import {usePreLoadData} from "./usePreLoadData.ts";
import styled from "styled-components";

const Container = styled.div`
    padding: 12px 16px;
    font-size: 13px;
    color: #67768a;
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
            The {preLoadData.label} has a certificate that will expire on {preLoadData.expirationDate}.
        </Container>
    );
}

export default App;
