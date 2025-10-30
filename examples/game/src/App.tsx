import {Information, Link, SectionTitle, UsersIllustration} from "akeneo-design-system";
import RunnerGame from "./RunnerGame";

function App() {

  return <>
    <Information
      illustration={<UsersIllustration />}
      title="Welcome to the Akeneo custom component SDK!"
    >
      See the <Link href="https://github.com/akeneo/extension-sdk/blob/init/README.md" target="_blank">Readme</Link> of the SDK to explore capabilities and see implementation examples.<br/>
      Link to the UI Extension component  <Link href="https://api.akeneo.com/extensions/overview.html" target="_blank">documentation</Link>.<br/>
    </Information>

    <SectionTitle>
      <SectionTitle.Title level="secondary">Runner Game (CSP-Compliant)</SectionTitle.Title>
    </SectionTitle>
    <div style={{ marginTop: '20px', marginBottom: '20px' }}>
      <RunnerGame />
    </div>
  </>
}

export default App
