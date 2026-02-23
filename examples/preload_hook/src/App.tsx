import {Helper, InfoRoundIcon, Placeholder, UsersIllustration} from "akeneo-design-system";
import {usePreLoadData} from "./usePreLoadData.ts";
import styled from "styled-components";

const Container = styled.div`
    padding: 12px 16px;
    font-size: 15px;
    color: #000000;
    background-color: #fac365;
    display: flex;
    align-items: center;
    gap: 6px;
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
            <InfoRoundIcon size={16} color="#000000" />
            The {preLoadData.label} has a certificate that will expire on <b>{preLoadData.expirationDate}</b>.
        </Container>
    );
}

export default App;
