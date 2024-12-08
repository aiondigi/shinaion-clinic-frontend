<!-- src/routes/(app)/doctors/new/+page.svelte -->
<script lang="ts">
    import { goto } from '$app/navigation';
    import DoctorForm from '$lib/components/DoctorForm.svelte';
    import doctorService from '$lib/services/doctor';
    import toast from 'svelte-french-toast';
    import type { Doctor } from '$lib/types';

    let loading = false;

    async function handleSubmit(event: CustomEvent<Omit<Doctor, 'id' | 'created_at' | 'updated_at'>>) {
        try {
            loading = true;
            await doctorService.createDoctor(event.detail);
            toast.success('Doctor created successfully');
            goto('/doctors');
        } catch (error) {
            toast.error('Failed to create doctor');
        } finally {
            loading = false;
        }
    }
</script>

<div class="max-w-2xl mx-auto">
    <div class="sm:flex sm:items-center mb-8">
        <div class="sm:flex-auto">
            <h1 class="text-xl font-semibold text-gray-900">New Doctor</h1>
            <p class="mt-2 text-sm text-gray-700">Add a new doctor to the system.</p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
                on:click={() => goto('/doctors')}
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Back to list
            </button>
        </div>
    </div>

    <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
            <DoctorForm {loading} on:submit={handleSubmit} />
        </div>
    </div>
</div>
