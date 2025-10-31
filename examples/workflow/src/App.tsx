import {Information, Link, SectionTitle, UsersIllustration} from "akeneo-design-system";
import {useGetProduct} from "./useGetProduct.ts";
import {useWorkflows} from "./useWorkflows.ts";
import {WorkflowActions} from "./WorkflowActions.tsx";

function App() {
  const PIMContext = globalThis.PIM.context;
  const PIMUser = globalThis.PIM.user
  const productList = useGetProduct();
  const { workflows, tasks, selectedWorkflow, loading, error } = useWorkflows();

  return <>
    <Information
      illustration={<UsersIllustration />}
      title="Welcome to the Akeneo custom component SDK!"
    >
      See the <Link href="https://github.com/akeneo/extension-sdk/blob/init/README.md" target="_blank">Readme</Link> of the SDK to explore capabilities and see implementation examples.<br/>
      Link to the UI Extension component  <Link href="https://api.akeneo.com/extensions/overview.html" target="_blank">documentation</Link>.<br/>
    </Information>

    <SectionTitle>
      <SectionTitle.Title level="secondary">Available PIM Context information within the custom component context (depend of the displayed page)</SectionTitle.Title>
    </SectionTitle>
    <pre>{JSON.stringify(PIMContext)}</pre>
    <SectionTitle>
      <SectionTitle.Title level="secondary">Available PIM User information within the custom component context</SectionTitle.Title>
    </SectionTitle>
    <pre>{JSON.stringify(PIMUser)}</pre>

    <SectionTitle>
      <SectionTitle.Title level="secondary">Workflow API - Workflows List</SectionTitle.Title>
    </SectionTitle>
    {loading && <p>Loading workflows...</p>}
    {error && <p style={{color: 'red'}}>Error: {error}</p>}
    {workflows && <pre>{JSON.stringify(workflows, null, 4)}</pre>}

    <SectionTitle>
      <SectionTitle.Title level="secondary">Workflow API - Tasks List</SectionTitle.Title>
    </SectionTitle>
    {tasks && <pre>{JSON.stringify(tasks, null, 4)}</pre>}

    <SectionTitle>
      <SectionTitle.Title level="secondary">Workflow API - Selected Workflow Details</SectionTitle.Title>
    </SectionTitle>
    {selectedWorkflow && <pre>{JSON.stringify(selectedWorkflow, null, 4)}</pre>}

    <SectionTitle>
      <SectionTitle.Title level="secondary">Workflow API - Interactive Actions</SectionTitle.Title>
    </SectionTitle>
    <WorkflowActions />

    <SectionTitle>
      <SectionTitle.Title level="secondary">Workflow API - Available Actions Reference</SectionTitle.Title>
    </SectionTitle>
    <pre>{`Available workflow actions:
- startWorkflowForProduct(workflowUuid, productUuid)
- startWorkflowForProductModel(workflowUuid, productModelCode)
- completeTask(taskUuid)
- approveTask(taskUuid)
- rejectTask(taskUuid, sendBackToStepUuid, rejectedAttributes?)
- getStepAssignees(stepUuid)

Example usage in code:
  import { useWorkflows } from './useWorkflows';

  const MyComponent = () => {
    const { workflows, tasks, actions } = useWorkflows();

    // Start a workflow
    await actions.startWorkflowForProduct(workflowUuid, productUuid);

    // Complete a task
    await actions.completeTask(taskUuid);
  };`}</pre>
  </>
}

export default App
