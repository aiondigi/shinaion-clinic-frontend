<!-- src/routes/(app)/doctors/[id]/+page.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import DoctorForm from '$lib/components/DoctorForm.svelte';
    import doctorService from '$lib/services/doctor';
    import toast from 'svelte-french-toast';
    import type { Doctor } from '$lib/types';

    let doctor: Doctor;
    let loading = false;
    let initialLoading = true;

    onMount(async () => {
        try {
            doctor = await doctorService.getDoctor($page.params.id);
        } catch (error) {
            toast.error('Failed to load doctor');
            goto('/doctors');
        } finally {
            initialLoading = false;
        }
    });

    async function handleSubmit(event: CustomEvent<Omit<Doctor, 'id' | 'created_at' | 'updated_at'>>) {
        try {
            loading = true;
            await doctorService.updateDoctor($page.params.id, event.detail);
            toast.success('Doctor updated successfully');
            goto('/doctors');
        } catch (error) {
            toast.error('Failed to update doctor');
        } finally {
            loading = false;
        }
    }
</script>

<div class="max-w-2xl mx-auto">
    <div class="sm:flex sm:items-center mb-8">
        <div class="sm:flex-auto">
            <h1 class="text-xl font-semibold text-gray-900">Edit Doctor</h1>
            <p class="mt-2 text-sm text-gray-700">Update doctor information.</p>
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
            {#if initialLoading}
                <div class="flex justify-center py-8">
                    <svg class="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            {:else}
                <DoctorForm {doctor} {loading} on:submit={handleSubmit} />
            {/if}
        </div>
    </div>
</div>
