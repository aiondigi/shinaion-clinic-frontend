<!-- src/routes/(app)/medical-records/+page.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import medicalRecordService from '$lib/services/medical-record';
    import patientService from '$lib/services/patient';
    import doctorService from '$lib/services/doctor';
    import toast from 'svelte-french-toast';
    import type { MedicalRecord, Patient, Doctor } from '$lib/types';
    import { format } from 'date-fns';

    let medicalRecords: MedicalRecord[] = [];
    let patients: Record<string, Patient> = {};
    let doctors: Record<string, Doctor> = {};
    let loading = true;
    let searchQuery = '';
    let selectedPatient = '';

    onMount(async () => {
        try {
            // Load patients and doctors first
            const [patientsData, doctorsData] = await Promise.all([
                patientService.getPatients(),
                doctorService.getDoctors()
            ]);

            // Create lookup maps
            patients = patientsData.reduce((acc: Record<string, Patient>, patient: Patient) => {
                acc[patient.id] = patient;
                return acc;
            }, {} as Record<string, Patient>);

            doctors = doctorsData.reduce((acc: Record<string, Doctor>, doctor: Doctor) => {
                acc[doctor.id] = doctor;
                return acc;
            }, {} as Record<string, Doctor>);

            // Get initial medical records
            await loadMedicalRecords();
        } catch (error) {
            toast.error('Failed to load data');
        } finally {
            loading = false;
        }
    });

    async function loadMedicalRecords() {
        try {
            loading = true;
            medicalRecords = await medicalRecordService.getMedicalRecords(selectedPatient || undefined);
        } catch (error) {
            toast.error('Failed to load medical records');
        } finally {
            loading = false;
        }
    }

    $: filteredRecords = medicalRecords.filter(record => {
        const patient = patients[record.patient_id];
        const doctor = doctors[record.doctor_id];
        const searchString = searchQuery.toLowerCase();

        return (
            record.record_number.toLowerCase().includes(searchString) ||
            patient?.full_name.toLowerCase().includes(searchString) ||
            doctor?.full_name.toLowerCase().includes(searchString) ||
            record.assessment.toLowerCase().includes(searchString)
        );
    });

    $: {
        if (selectedPatient) {
            loadMedicalRecords();
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this medical record?')) return;

        try {
            loading = true;
            await medicalRecordService.deleteMedicalRecord(id);
            medicalRecords = medicalRecords.filter(record => record.id !== id);
            toast.success('Medical record deleted successfully');
        } catch (error) {
            toast.error('Failed to delete medical record');
        } finally {
            loading = false;
        }
    }
</script>

<div class="space-y-6">
    <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
            <h1 class="text-xl font-semibold text-gray-900">Medical Records</h1>
            <p class="mt-2 text-sm text-gray-700">View and manage patient medical records.</p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
                on:click={() => goto('/medical-records/new')}
                class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
                New record
            </button>
        </div>
    </div>

    <div class="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div class="flex-1">
            <label for="search" class="sr-only">Search</label>
            <input
                type="search"
                id="search"
                bind:value={searchQuery}
                placeholder="Search records..."
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
        </div>
        <div class="sm:w-64">
            <select
                bind:value={selectedPatient}
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
                <option value="">All Patients</option>
                {#each Object.values(patients) as patient}
                    <option value={patient.id}>{patient.full_name}</option>
                {/each}
            </select>
        </div>
    </div>

    {#if loading}
        <div class="flex justify-center py-8">
            <svg class="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
    {:else if filteredRecords.length === 0}
        <div class="text-center py-8">
            <p class="text-sm text-gray-500">No medical records found.</p>
        </div>
    {:else}
        <div class="overflow-hidden bg-white shadow sm:rounded-md">
            <ul role="list" class="divide-y divide-gray-200">
                {#each filteredRecords as record}
                    {@const patient: Patient | undefined = patients[record.patient_id]}
                    {@const doctor = doctors[record.doctor_id]}
                    {#if patient}
                        <li>
                            <div class="block hover:bg-gray-50">
                                <div class="px-4 py-4 sm:px-6">
                                    <div class="flex items-center justify-between">
                                        <div class="flex-1">
                                            <p class="truncate text-sm font-medium text-indigo-600">
                                                Record #{record.record_number}
                                            </p>
                                            <div class="mt-2 flex">
                                                <div class="flex items-center text-sm text-gray-500">
                                                    <span class="truncate">Patient: {patient.full_name}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="ml-4 flex flex-shrink-0 space-x-4">
                                            <button
                                                on:click={() => goto(`/medical-records/${record.id}`)}
                                                class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                            >
                                                View
                                            </button>
                                            <button
                                                on:click={() => handleDelete(record.id)}
                                                class="inline-flex items-center rounded-md border border-transparent bg-red-100 px-3 py-2 text-sm font-medium leading-4 text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    <div class="mt-2 sm:flex sm:justify-between">
                                        <div class="sm:flex">
                                            <p class="flex items-center text-sm text-gray-500">
                                                Doctor: {doctor?.full_name || 'Unknown'}
                                            </p>
                                        </div>
                                        <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                            <p>
                                                Created: {format(new Date(record.created_at), 'PPP')}
                                            </p>
                                        </div>
                                    </div>
                                    <div class="mt-2">
                                        <p class="text-sm text-gray-900">
                                            Assessment: {record.assessment}
                                        </p>
                                    </div>
                                    {#if record.attachments && record.attachments.length > 0}
                                        <div class="mt-2">
                                            <p class="text-sm text-gray-500">
                                                Attachments: {record.attachments.length}
                                            </p>
                                        </div>
                                    {/if}
                                </div>
                            </div>
                        </li>
                    {:else}
                        <li>
                            <div class="block hover:bg-gray-50">
                                <div class="px-4 py-4 sm:px-6">
                                    <div class="flex items-center justify-between">
                                        <div class="flex-1">
                                            <p class="truncate text-sm font-medium text-indigo-600">
                                                Record #{record.record_number}
                                            </p>
                                        </div>
                                        <div class="ml-4 flex flex-shrink-0 space-x-4">
                                            <button
                                                on:click={() => goto(`/medical-records/${record.id}`)}
                                                class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                            >
                                                View
                                            </button>
                                            <button
                                                on:click={() => handleDelete(record.id)}
                                                class="inline-flex items-center rounded-md border border-transparent bg-red-100 px-3 py-2 text-sm font-medium leading-4 text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    <div class="mt-2">
                                        <p class="text-sm text-gray-500">
                                            Patient not found
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    {/if}
                {/each}
            </ul>
        </div>
    {/if}
</div>
