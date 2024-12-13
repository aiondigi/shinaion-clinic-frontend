<!-- src/routes/(app)/patients/new/+page.svelte -->
<script lang="ts">
    import { goto } from '$app/navigation';
    import PatientForm from '$lib/components/PatientForm.svelte';
    import patientService from '$lib/services/patient';
    import { toast } from "svelte-sonner";
    import type { Patient } from '$lib/types/index';

    let loading = $state(false);

    async function handleSubmit(data: Omit<Patient, 'id' | 'created_at' | 'updated_at'>) {
        try {
            loading = true;
            await patientService.createPatient(data);
            toast.success('Patient created successfully');
            goto('/patients');
        } catch (error) {
            toast.error('Failed to create patient');
        } finally {
            loading = false;
        }
    }
</script>

<div class="max-w-2xl mx-auto">
    <div class="sm:flex sm:items-center mb-8">
        <div class="sm:flex-auto">
            <h1 class="text-xl font-semibold text-gray-900">New Patient</h1>
            <p class="mt-2 text-sm text-gray-700">Add a new patient to the system.</p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
                onclick={() => goto('/patients')}
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Back to list
            </button>
        </div>
    </div>

    <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
            <PatientForm {loading} onSubmit={handleSubmit} />
        </div>
    </div>
</div>
