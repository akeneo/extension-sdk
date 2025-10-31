/**
 * Standalone Workflow API Examples
 *
 * This file contains example functions demonstrating how to use the
 * Akeneo Workflow API directly without React hooks.
 *
 * You can import these functions into your components or call them
 * from the browser console for testing.
 */

// Type aliases for workflow types from global.d.ts
type StartExecutionRequest = any;
type RejectedAttributeValue = any;

/**
 * Example 1: List all workflows
 */
export async function listAllWorkflows() {
    try {
        const workflows = await globalThis.PIM.api.workflows_v1.list(1, 10);
        console.log('Workflows:', workflows);
        return workflows;
    } catch (error) {
        console.error('Error listing workflows:', error);
        throw error;
    }
}

/**
 * Example 2: Get detailed information about a specific workflow
 */
export async function getWorkflowDetails(workflowUuid: string) {
    try {
        const workflow = await globalThis.PIM.api.workflows_v1.get(workflowUuid);
        console.log('Workflow details:', workflow);
        console.log('Steps:', workflow.steps);
        return workflow;
    } catch (error) {
        console.error('Error getting workflow:', error);
        throw error;
    }
}

/**
 * Example 3: Start a workflow for a product
 */
export async function startProductWorkflow(workflowUuid: string, productUuid: string) {
    try {
        await globalThis.PIM.api.workflow_executions_v1.start([
            {
                workflow: { uuid: workflowUuid },
                product: { uuid: productUuid }
            }
        ]);
        console.log('Workflow started successfully for product:', productUuid);
    } catch (error) {
        console.error('Error starting workflow:', error);
        throw error;
    }
}

/**
 * Example 4: Start a workflow for a product model
 */
export async function startProductModelWorkflow(workflowUuid: string, productModelCode: string) {
    try {
        await globalThis.PIM.api.workflow_executions_v1.start([
            {
                workflow: { uuid: workflowUuid },
                productModel: { code: productModelCode }
            }
        ]);
        console.log('Workflow started successfully for product model:', productModelCode);
    } catch (error) {
        console.error('Error starting workflow:', error);
        throw error;
    }
}

/**
 * Example 5: Start multiple workflows at once (batch operation)
 */
export async function startMultipleWorkflows(executions: StartExecutionRequest[]) {
    try {
        await globalThis.PIM.api.workflow_executions_v1.start(executions);
        console.log(`${executions.length} workflows started successfully`);
    } catch (error) {
        console.error('Error starting workflows:', error);
        throw error;
    }
}

/**
 * Example 6: List all workflow tasks
 */
export async function listWorkflowTasks(searchQuery = '', withAttributes = false) {
    try {
        const tasks = await globalThis.PIM.api.workflow_tasks_v1.list(
            searchQuery,
            withAttributes,
            1,
            20
        );
        console.log('Tasks:', tasks);
        return tasks;
    } catch (error) {
        console.error('Error listing tasks:', error);
        throw error;
    }
}

/**
 * Example 7: Complete a workflow task
 */
export async function completeTask(taskUuid: string) {
    try {
        await globalThis.PIM.api.workflow_tasks_v1.patch(taskUuid, {
            status: 'completed'
        });
        console.log('Task completed:', taskUuid);
    } catch (error) {
        console.error('Error completing task:', error);
        throw error;
    }
}

/**
 * Example 8: Approve a workflow task
 */
export async function approveTask(taskUuid: string) {
    try {
        await globalThis.PIM.api.workflow_tasks_v1.patch(taskUuid, {
            status: 'approved'
        });
        console.log('Task approved:', taskUuid);
    } catch (error) {
        console.error('Error approving task:', error);
        throw error;
    }
}

/**
 * Example 9: Reject a task and send it back to a previous step
 */
export async function rejectTask(
    taskUuid: string,
    sendBackToStepUuid: string,
    rejectedAttributes?: { [key: string]: RejectedAttributeValue[] }
) {
    try {
        await globalThis.PIM.api.workflow_tasks_v1.patch(taskUuid, {
            status: 'rejected',
            sendBackToStepUuid,
            rejectedAttributes
        });
        console.log('Task rejected and sent back to step:', sendBackToStepUuid);
    } catch (error) {
        console.error('Error rejecting task:', error);
        throw error;
    }
}

/**
 * Example 10: Reject a task with specific attribute feedback
 */
export async function rejectTaskWithAttributeFeedback(
    taskUuid: string,
    sendBackToStepUuid: string,
    attributeCode: string,
    comment: string,
    locale: string | null = null,
    scope: string | null = null
) {
    try {
        const rejectedAttributes = {
            [attributeCode]: [
                {
                    locale,
                    scope,
                    comment
                }
            ]
        };

        await globalThis.PIM.api.workflow_tasks_v1.patch(taskUuid, {
            status: 'rejected',
            sendBackToStepUuid,
            rejectedAttributes
        });
        console.log('Task rejected with attribute feedback:', attributeCode);
    } catch (error) {
        console.error('Error rejecting task:', error);
        throw error;
    }
}

/**
 * Example 11: Get assignees for a workflow step
 */
export async function getStepAssignees(stepUuid: string) {
    try {
        const assignees = await globalThis.PIM.api.workflows_v1.getStepAssignees(
            stepUuid,
            1,
            50
        );
        console.log('Step assignees:', assignees);
        return assignees;
    } catch (error) {
        console.error('Error getting step assignees:', error);
        throw error;
    }
}

/**
 * Example 12: Complete workflow - from list to task completion
 */
export async function completeWorkflowExample() {
    try {
        // 1. List all workflows
        console.log('Step 1: Listing workflows...');
        const workflows = await listAllWorkflows();

        if (!workflows.items || workflows.items.length === 0) {
            console.log('No workflows found');
            return;
        }

        // 2. Get first workflow details
        const firstWorkflow = workflows.items[0];
        console.log('Step 2: Getting workflow details...');
        await getWorkflowDetails(firstWorkflow.uuid!);

        // 3. Start workflow for current product (if in product context)
        const context = globalThis.PIM.context;
        if ('product' in context) {
            console.log('Step 3: Starting workflow for current product...');
            await startProductWorkflow(firstWorkflow.uuid!, context.product.uuid);
        }

        // 4. List tasks
        console.log('Step 4: Listing workflow tasks...');
        const tasks = await listWorkflowTasks();

        // 5. Complete first task if available
        if (tasks.items && tasks.items.length > 0) {
            const firstTask = tasks.items[0];
            console.log('Step 5: Completing first task...');
            await completeTask(firstTask.uuid!);
        }

        console.log('Workflow example completed successfully!');
    } catch (error) {
        console.error('Error in complete workflow example:', error);
        throw error;
    }
}

/**
 * Example 13: Workflow with product enrichment cycle
 */
export async function workflowEnrichmentCycle(
    workflowUuid: string,
    productUuid: string,
    enrichmentData: { [key: string]: any }
) {
    try {
        console.log('Starting enrichment workflow cycle...');

        // 1. Start workflow
        await startProductWorkflow(workflowUuid, productUuid);
        console.log('✓ Workflow started');

        // 2. Get product and update values
        const product = await globalThis.PIM.api.product_uuid_v1.get({ uuid: productUuid });
        console.log('✓ Product retrieved');

        // 3. Update product with enrichment data
        await globalThis.PIM.api.product_uuid_v1.patch({
            uuid: productUuid,
            data: {
                values: {
                    ...product.values,
                    ...enrichmentData
                }
            }
        });
        console.log('✓ Product updated');

        // 4. List tasks to find our workflow task
        const tasks = await listWorkflowTasks(`product.uuid="${productUuid}"`);
        console.log('✓ Tasks retrieved');

        if (tasks.items && tasks.items.length > 0) {
            // 5. Complete the task
            await completeTask(tasks.items[0].uuid!);
            console.log('✓ Task completed');
        }

        console.log('Enrichment cycle completed successfully!');
    } catch (error) {
        console.error('Error in enrichment cycle:', error);
        throw error;
    }
}

// Export all functions for easy access
export const workflowExamples = {
    listAllWorkflows,
    getWorkflowDetails,
    startProductWorkflow,
    startProductModelWorkflow,
    startMultipleWorkflows,
    listWorkflowTasks,
    completeTask,
    approveTask,
    rejectTask,
    rejectTaskWithAttributeFeedback,
    getStepAssignees,
    completeWorkflowExample,
    workflowEnrichmentCycle
};

// Make examples available in window for browser console testing
if (typeof window !== 'undefined') {
    (window as any).workflowExamples = workflowExamples;
    console.log('Workflow examples loaded! Access via window.workflowExamples');
}
