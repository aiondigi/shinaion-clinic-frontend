<!-- src/routes/(app)/medical-records/+page.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import medicalRecordService from '$lib/services/medical-record';
    import patientService from '$lib/services/patient';
    import doctorService from '$lib/services/doctor';
    import type { MedicalRecord, Patient, Doctor } from '$lib/types/index';
    import { format } from 'date-fns';
    import { toast } from "svelte-sonner";
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import * as Select from "$lib/components/ui/select";

    let medicalRecords: MedicalRecord[] = [];
    let patients: Record<string, Patient> = {};
    let doctors: Record<string, Doctor> = {};
    let loading = true;
    let searchQuery = '';
    let selectedPatient: string | undefined;

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
            medicalRecords = await medicalRecordService.getMedicalRecords(selectedPatient);
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
    <header class="border-b pb-4">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-semibold">Medical Records</h1>
                <p class="text-muted-foreground">View and manage patient medical records</p>
            </div>
            <Button onclick={() => goto('/medical-records/new')}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="mr-2 h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <path d="M14 2v6h6"/>
                    <path d="M12 18v-6"/>
                    <path d="M9 15h6"/>
                </svg>
                New record
            </Button>
        </div>
    </header>

    <Card.Root>
        <Card.Header>
            <div class="flex items-center gap-4">
                <Select.Root  type="single" bind:value={selectedPatient}>
                    <Select.Trigger>                       
                            {selectedPatient ? 
                                patients[selectedPatient]?.full_name || 'Select patient' : 
                                'Filter by patient'
                            }                       
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Item value="">All patients</Select.Item>
                        {#each Object.values(patients) as patient}
                            <Select.Item value={patient.id}>{patient.full_name}</Select.Item>
                        {/each}
                    </Select.Content>
                </Select.Root>
                <Input
                    type="text"
                    placeholder="Search records..."
                    bind:value={searchQuery}
                />
            </div>
        </Card.Header>
        <Card.Content>
            {#if loading}
                <div class="flex items-center justify-center py-8">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            {:else if filteredRecords.length === 0}
                <div class="flex flex-col items-center justify-center py-8 text-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-12 w-12 text-muted-foreground/50 mb-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="8" y1="12" x2="16" y2="12"/>
                    </svg>
                    <p class="text-xl font-medium">No records found</p>
                    <p class="text-muted-foreground">Try adjusting your search or filter</p>
                </div>
            {:else}
                <div class="space-y-4">
                    {#each filteredRecords as record}
                        {@const patient = patients[record.patient_id]}
                        {@const doctor = doctors[record.doctor_id]}
                        {#if patient}
                            <Card.Root>
                                <Card.Header>
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <Card.Title>{patient.full_name}</Card.Title>
                                            <Card.Description>Record #{record.record_number}</Card.Description>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onclick={() => goto(`/medical-records/${record.id}`)}
                                            >
                                                View
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                class="text-destructive"
                                                onclick={() => record && record.id ? handleDelete(record.id) : null}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </Card.Header>
                                <Card.Content>
                                    <div class="grid grid-cols-2 gap-4">
                                        <div>
                                            <p class="text-sm font-medium text-muted-foreground">Doctor</p>
                                            <p>{doctor?.full_name || 'Unknown'}</p>
                                        </div>
                                        <div>
                                            <p class="text-sm font-medium text-muted-foreground">Date</p>
                                            <p>{format(new Date(record.date), 'PPP')}</p>
                                        </div>
                                        <div class="col-span-2">
                                            <p class="text-sm font-medium text-muted-foreground">Assessment</p>
                                            <p class="line-clamp-2">{record.assessment}</p>
                                        </div>
                                    </div>
                                </Card.Content>
                            </Card.Root>
                        {/if}
                    {/each}
                </div>
            {/if}
        </Card.Content>
    </Card.Root>
</div>
