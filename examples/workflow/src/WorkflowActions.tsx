import { useState } from "react";
import { Button, TextInput, Helper } from "akeneo-design-system";
import { useWorkflows } from "./useWorkflows";

export const WorkflowActions = () => {
    const { workflows, tasks, actions } = useWorkflows();
    const [workflowUuid, setWorkflowUuid] = useState('');
    const [productUuid, setProductUuid] = useState('');
    const [taskUuid, setTaskUuid] = useState('');
    const [stepUuid, setStepUuid] = useState('');
    const [actionResult, setActionResult] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    const handleStartWorkflow = async () => {
        try {
            setActionError(null);
            setActionResult(null);
            await actions.startWorkflowForProduct(workflowUuid, productUuid);
            setActionResult('Workflow started successfully!');
        } catch (err) {
            setActionError(err instanceof Error ? err.message : 'Failed to start workflow');
        }
    };

    const handleCompleteTask = async () => {
        try {
            setActionError(null);
            setActionResult(null);
            await actions.completeTask(taskUuid);
            setActionResult('Task completed successfully!');
        } catch (err) {
            setActionError(err instanceof Error ? err.message : 'Failed to complete task');
        }
    };

    const handleApproveTask = async () => {
        try {
            setActionError(null);
            setActionResult(null);
            await actions.approveTask(taskUuid);
            setActionResult('Task approved successfully!');
        } catch (err) {
            setActionError(err instanceof Error ? err.message : 'Failed to approve task');
        }
    };

    const handleRejectTask = async () => {
        try {
            setActionError(null);
            setActionResult(null);
            await actions.rejectTask(taskUuid, stepUuid);
            setActionResult('Task rejected successfully!');
        } catch (err) {
            setActionError(err instanceof Error ? err.message : 'Failed to reject task');
        }
    };

    const handleGetAssignees = async () => {
        try {
            setActionError(null);
            setActionResult(null);
            const assignees = await actions.getStepAssignees(stepUuid);
            setActionResult(`Assignees: ${JSON.stringify(assignees, null, 2)}`);
        } catch (err) {
            setActionError(err instanceof Error ? err.message : 'Failed to get assignees');
        }
    };

    // Pre-populate fields with first available values if they exist
    const firstWorkflowUuid = workflows?.items?.[0]?.uuid || '';
    const firstTaskUuid = tasks?.items?.[0]?.uuid || '';

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', marginTop: '20px' }}>
            <h3>Interactive Workflow Actions</h3>

            {actionResult && (
                <div style={{ padding: '10px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px', marginBottom: '10px' }}>
                    {actionResult}
                </div>
            )}

            {actionError && (
                <div style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '10px' }}>
                    {actionError}
                </div>
            )}

            <div style={{ marginBottom: '20px' }}>
                <h4>Start Workflow for Product</h4>
                <div style={{ marginBottom: '10px' }}>
                    <label>Workflow UUID:</label>
                    <TextInput
                        value={workflowUuid}
                        onChange={setWorkflowUuid}
                        placeholder={firstWorkflowUuid || 'Enter workflow UUID'}
                    />
                    <Helper>Available: {firstWorkflowUuid || 'No workflows found'}</Helper>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Product UUID:</label>
                    <TextInput
                        value={productUuid}
                        onChange={setProductUuid}
                        placeholder="Enter product UUID"
                    />
                </div>
                <Button onClick={handleStartWorkflow}>Start Workflow</Button>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h4>Task Actions</h4>
                <div style={{ marginBottom: '10px' }}>
                    <label>Task UUID:</label>
                    <TextInput
                        value={taskUuid}
                        onChange={setTaskUuid}
                        placeholder={firstTaskUuid || 'Enter task UUID'}
                    />
                    <Helper>Available: {firstTaskUuid || 'No tasks found'}</Helper>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button onClick={handleCompleteTask}>Complete Task</Button>
                    <Button onClick={handleApproveTask}>Approve Task</Button>
                </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h4>Reject Task</h4>
                <div style={{ marginBottom: '10px' }}>
                    <label>Task UUID:</label>
                    <TextInput
                        value={taskUuid}
                        onChange={setTaskUuid}
                        placeholder={firstTaskUuid || 'Enter task UUID'}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Send Back to Step UUID:</label>
                    <TextInput
                        value={stepUuid}
                        onChange={setStepUuid}
                        placeholder="Enter step UUID"
                    />
                </div>
                <Button onClick={handleRejectTask}>Reject Task</Button>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h4>Get Step Assignees</h4>
                <div style={{ marginBottom: '10px' }}>
                    <label>Step UUID:</label>
                    <TextInput
                        value={stepUuid}
                        onChange={setStepUuid}
                        placeholder="Enter step UUID"
                    />
                </div>
                <Button onClick={handleGetAssignees}>Get Assignees</Button>
            </div>
        </div>
    );
};
