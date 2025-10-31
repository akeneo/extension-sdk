import { useEffect, useState } from "react";

// Type aliases for workflow types from global.d.ts
type WorkflowsList = any;
type WorkflowTasksList = any;
type Workflow = any;
type AssigneesList = any;
type RejectedAttributeValue = any;

interface WorkflowData {
    workflows: WorkflowsList | null;
    tasks: WorkflowTasksList | null;
    selectedWorkflow: Workflow | null;
    loading: boolean;
    error: string | null;
}

const useWorkflows = () => {
    const [data, setData] = useState<WorkflowData>({
        workflows: null,
        tasks: null,
        selectedWorkflow: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        const fetchWorkflowData = async () => {
            try {
                setData(prev => ({ ...prev, loading: true, error: null }));

                // Fetch workflows list
                const workflowsList = await globalThis.PIM.api.workflows_v1.list();

                // Fetch workflow tasks (searching for all tasks)
                const tasksList = await globalThis.PIM.api.workflow_tasks_v1.list('{"step_uuid":[{"operator":"=","value":"8abc19aa-e77e-472a-8994-00cc857d4f3b"}]}');

                // If there are workflows, fetch details of the first one
                let selectedWorkflow = null;
                if (workflowsList.items && workflowsList.items.length > 0 && workflowsList.items[0].uuid) {
                    selectedWorkflow = await globalThis.PIM.api.workflows_v1.get(workflowsList.items[0].uuid);
                }

                setData({
                    workflows: workflowsList,
                    tasks: tasksList,
                    selectedWorkflow,
                    loading: false,
                    error: null,
                });
            } catch (err) {
                setData(prev => ({
                    ...prev,
                    loading: false,
                    error: err instanceof Error ? err.message : 'An error occurred while fetching workflow data',
                }));
            }
        };

        fetchWorkflowData();
    }, []);

    /**
     * Start a workflow execution for a product
     */
    const startWorkflowForProduct = async (workflowUuid: string, productUuid: string): Promise<void> => {
        try {
            await globalThis.PIM.api.workflow_executions_v1.start([
                {
                    workflow: { uuid: workflowUuid },
                    product: { uuid: productUuid },
                }
            ]);
        } catch (err) {
            throw new Error(`Failed to start workflow: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    };

    /**
     * Start a workflow execution for a product model
     */
    const startWorkflowForProductModel = async (workflowUuid: string, productModelCode: string): Promise<void> => {
        try {
            await globalThis.PIM.api.workflow_executions_v1.start([
                {
                    workflow: { uuid: workflowUuid },
                    productModel: { code: productModelCode },
                }
            ]);
        } catch (err) {
            throw new Error(`Failed to start workflow: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    };

    /**
     * Complete a workflow task
     */
    const completeTask = async (taskUuid: string): Promise<void> => {
        try {
            await globalThis.PIM.api.workflow_tasks_v1.patch(taskUuid, {
                status: 'completed'
            });
        } catch (err) {
            throw new Error(`Failed to complete task: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    };

    /**
     * Approve a workflow task
     */
    const approveTask = async (taskUuid: string): Promise<void> => {
        try {
            await globalThis.PIM.api.workflow_tasks_v1.patch(taskUuid, {
                status: 'approved'
            });
        } catch (err) {
            throw new Error(`Failed to approve task: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    };

    /**
     * Reject a workflow task and send it back to a specific step
     */
    const rejectTask = async (
        taskUuid: string,
        sendBackToStepUuid: string,
        rejectedAttributes?: { [key: string]: RejectedAttributeValue[] }
    ): Promise<void> => {
        try {
            await globalThis.PIM.api.workflow_tasks_v1.patch(taskUuid, {
                status: 'rejected',
                sendBackToStepUuid,
                rejectedAttributes,
            });
        } catch (err) {
            throw new Error(`Failed to reject task: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    };

    /**
     * Get assignees for a specific workflow step
     */
    const getStepAssignees = async (stepUuid: string): Promise<AssigneesList> => {
        try {
            return await globalThis.PIM.api.workflows_v1.getStepAssignees(stepUuid, 1, 10);
        } catch (err) {
            throw new Error(`Failed to get step assignees: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    };

    return {
        ...data,
        actions: {
            startWorkflowForProduct,
            startWorkflowForProductModel,
            completeTask,
            approveTask,
            rejectTask,
            getStepAssignees,
        }
    };
};

export { useWorkflows };
