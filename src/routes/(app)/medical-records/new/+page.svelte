<!-- src/routes/(app)/medical-records/new/+page.svelte -->
<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import MedicalRecordForm from '$lib/components/MedicalRecordForm.svelte';
    import medicalRecordService from '$lib/services/medical-record';
    import { toast } from "svelte-sonner";

    let loading = false;
    const patientId = $page.url.searchParams.get('patient_id') || undefined;

    let onDeleteAttachment: (data: { recordId: string; attachmentUrl: string; }) => void = (data) => {
        const { recordId, attachmentUrl } = data;
        // Logic to handle deletion of the attachment
        console.log(`Deleting attachment with id: ${recordId}`);
    };

    async function handleSubmit(formData: FormData) {
        try {
            loading = true;
            await medicalRecordService.createMedicalRecord(formData);
            toast.success('Medical record created successfully');
            goto('/medical-records');
        } catch (error) {
            toast.error('Failed to create medical record');
        } finally {
            loading = false;
        }
    }
</script>

<div class="max-w-2xl mx-auto">
    <div class="sm:flex sm:items-center mb-8">
        <div class="sm:flex-auto">
            <h1 class="text-xl font-semibold text-gray-900">New Medical Record</h1>
            <p class="mt-2 text-sm text-gray-700">Create a new medical record for a patient.</p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
                onclick={() => goto('/medical-records')}
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Back to records
            </button>
        </div>
    </div>

    <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
            <MedicalRecordForm {loading} patientId={patientId} onSubmit={handleSubmit} onDeleteAttachment={onDeleteAttachment} />
        </div>
    </div>
</div>
