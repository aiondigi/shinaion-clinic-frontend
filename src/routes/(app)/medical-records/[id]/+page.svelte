<!-- src/routes/(app)/medical-records/[id]/+page.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import MedicalRecordForm from '$lib/components/MedicalRecordForm.svelte';
    import medicalRecordService from '$lib/services/medical-record';
    import toast from 'svelte-french-toast';
    import type { MedicalRecord } from '$lib/types';

    let medicalRecord: MedicalRecord;
    let loading = false;
    let initialLoading = true;

    onMount(async () => {
        try {
            medicalRecord = await medicalRecordService.getMedicalRecord($page.params.id);
        } catch (error) {
            toast.error('Failed to load medical record');
            goto('/medical-records');
        } finally {
            initialLoading = false;
        }
    });

    async function handleSubmit(event: CustomEvent<FormData>) {
        try {
            loading = true;
            await medicalRecordService.updateMedicalRecord($page.params.id, event.detail);
            toast.success('Medical record updated successfully');
            goto('/medical-records');
        } catch (error) {
            toast.error('Failed to update medical record');
        } finally {
            loading = false;
        }
    }

    async function handleDeleteAttachment(event: CustomEvent<{ recordId: string; attachmentUrl: string }>) {
        try {
            loading = true;
            await medicalRecordService.deleteAttachment(event.detail.recordId, event.detail.attachmentUrl);
            toast.success('Attachment deleted successfully');
        } catch (error) {
            toast.error('Failed to delete attachment');
        } finally {
            loading = false;
        }
    }

    async function handleDelete() {
        if (!confirm('Are you sure you want to delete this medical record?')) return;

        try {
            loading = true;
            await medicalRecordService.deleteMedicalRecord($page.params.id);
            toast.success('Medical record deleted successfully');
            goto('/medical-records');
        } catch (error) {
            toast.error('Failed to delete medical record');
            loading = false;
        }
    }
</script>

<div class="max-w-2xl mx-auto">
    <div class="sm:flex sm:items-center mb-8">
        <div class="sm:flex-auto">
            <h1 class="text-xl font-semibold text-gray-900">Edit Medical Record</h1>
            <p class="mt-2 text-sm text-gray-700">Update medical record details.</p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-4">
            <button
                on:click={handleDelete}
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
                Delete
            </button>
            <button
                on:click={() => goto('/medical-records')}
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Back to records
            </button>
        </div>
    </div>

    <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
            {#if initialLoading}
                <div class="flex justify-center py-8">
                    <svg class="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            {:else}
                <MedicalRecordForm
                    {medicalRecord}
                    {loading}
                    on:submit={handleSubmit}
                    on:deleteAttachment={handleDeleteAttachment}
                />
            {/if}
        </div>
    </div>
</div>
