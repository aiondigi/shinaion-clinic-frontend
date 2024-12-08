<!-- src/routes/(app)/patients/+page.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import patientService from '$lib/services/patient';
    import type { Patient } from '$lib/types';
    import toast from 'svelte-french-toast';

    let patients: Patient[] = [];
    let loading = true;
    let searchQuery = '';

    onMount(async () => {
        try {
            const data = await patientService.getPatients();
            patients = data;
        } catch (error) {
            toast.error('Failed to load patients');
        } finally {
            loading = false;
        }
    });

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this patient?')) return;

        try {
            await patientService.deletePatient(id);
            patients = patients.filter(p => p.id !== id);
            toast.success('Patient deleted successfully');
        } catch (error) {
            toast.error('Failed to delete patient');
        }
    }

    $: filteredPatients = patients.filter(patient =>
        patient.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.insurance_id.toLowerCase().includes(searchQuery.toLowerCase())
    );
</script>

<div class="sm:flex sm:items-center">
    <div class="sm:flex-auto">
        <h1 class="text-xl font-semibold text-gray-900">Patients</h1>
        <p class="mt-2 text-sm text-gray-700">A list of all patients in the clinic.</p>
    </div>
    <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
            on:click={() => goto('/patients/new')}
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
        >
            Add patient
        </button>
    </div>
</div>

<div class="mt-8">
    <div class="mb-4">
        <input
            type="text"
            placeholder="Search patients..."
            bind:value={searchQuery}
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
    </div>

    {#if loading}
        <div class="flex justify-center py-8">
            <svg class="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
    {:else if filteredPatients.length === 0}
        <p class="text-center text-gray-500 py-8">No patients found.</p>
    {:else}
        <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50">
                    <tr>
                        <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Insurance ID</th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Contact</th>
                        <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span class="sr-only">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                    {#each filteredPatients as patient}
                        <tr>
                            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                {patient.full_name}
                            </td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{patient.insurance_id}</td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {patient.contact_number || '-'}
                            </td>
                            <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <button
                                    on:click={() => goto(`/patients/${patient.id}`)}
                                    class="text-indigo-600 hover:text-indigo-900 mr-4"
                                >
                                    Edit
                                </button>
                                <button
                                    on:click={() => handleDelete(patient.id)}
                                    class="text-red-600 hover:text-red-900"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
</div>
