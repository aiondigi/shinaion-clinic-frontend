<!-- src/lib/components/MedicalRecordForm.svelte -->
<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    import type { MedicalRecord, Doctor, Patient } from '$lib/types';
    import doctorService from '$lib/services/doctor';
    import patientService from '$lib/services/patient';
    import VitalsForm from './VitalsForm.svelte';
    import MedicationList from './MedicationList.svelte';
    import AllergiesList from './AllergiesList.svelte';
    import DiagnosisCodeList from './DiagnosisCodeList.svelte';
    import { z } from 'zod';
    import toast from 'svelte-french-toast';

    export let medicalRecord: Partial<MedicalRecord> = {};
    export let loading = false;
    export let patientId: string | undefined = undefined;

    const dispatch = createEventDispatcher<{
        submit: FormData;
        deleteAttachment: { recordId: string; attachmentUrl: string };
    }>();

    let errors: Record<string, string> = {};
    let doctors: Doctor[] = [];
    let patients: Patient[] = [];
    let attachmentFiles: FileList | null = null;
    let existingAttachments: string[] = medicalRecord.attachments?.map(a => a.url) || [];

    const medicalRecordSchema = z.object({
        patient_id: z.string().min(1, 'Patient is required'),
        doctor_id: z.string().min(1, 'Doctor is required'),
        record_number: z.string().min(1, 'Record number is required'),
        status: z.enum(['Draft', 'Final', 'Amended']),
        chief_complaint: z.string().min(1, 'Chief complaint is required'),
        subjective: z.string().min(1, 'Subjective notes are required'),
        objective: z.string().min(1, 'Objective notes are required'),
        assessment: z.string().min(1, 'Assessment is required'),
        plan: z.string().min(1, 'Plan is required')
    });

    onMount(async () => {
        try {
            const [doctorsData, patientsData] = await Promise.all([
                doctorService.getDoctors(),
                patientId ? patientService.getPatient(patientId) : patientService.getPatients()
            ]);
            doctors = doctorsData;
            patients = patientId ? [patientsData] : patientsData;
        } catch (error) {
            toast.error('Failed to load data');
        }
    });

    function handleSubmit() {
        try {
            const formData = {
                patient_id: medicalRecord.patient_id || patientId || '',
                doctor_id: medicalRecord.doctor_id || '',
                record_number: medicalRecord.record_number || '',
                status: medicalRecord.status || 'Draft',
                chief_complaint: medicalRecord.chief_complaint || '',
                subjective: medicalRecord.subjective || '',
                objective: medicalRecord.objective || '',
                assessment: medicalRecord.assessment || '',
                plan: medicalRecord.plan || ''
            };

            const validatedData = medicalRecordSchema.parse(formData);
            errors = {};

            // Create FormData object for file upload
            const formDataObj = new FormData();
            Object.entries(validatedData).forEach(([key, value]) => {
                formDataObj.append(key, value);
            });

            // Add vitals if present
            if (medicalRecord.vitals) {
                formDataObj.append('vitals', JSON.stringify(medicalRecord.vitals));
            }

            // Add medications if present
            if (medicalRecord.medications) {
                formDataObj.append('medications', JSON.stringify(medicalRecord.medications));
            }

            // Add allergies if present
            if (medicalRecord.allergies) {
                formDataObj.append('allergies', JSON.stringify(medicalRecord.allergies));
            }

            // Add diagnosis codes if present
            if (medicalRecord.diagnosis_codes) {
                formDataObj.append('diagnosis_codes', JSON.stringify(medicalRecord.diagnosis_codes));
            }

            // Add follow up date if present
            if (medicalRecord.follow_up_date) {
                formDataObj.append('follow_up_date', medicalRecord.follow_up_date);
            }

            // Add attachments if any
            if (attachmentFiles) {
                Array.from(attachmentFiles).forEach(file => {
                    formDataObj.append('attachments', file);
                });
            }

            dispatch('submit', formDataObj);
        } catch (error) {
            if (error instanceof z.ZodError) {
                errors = error.errors.reduce((acc, curr) => {
                    const field = curr.path[0] as string;
                    acc[field] = curr.message;
                    return acc;
                }, {} as Record<string, string>);
            }
        }
    }

    function handleDeleteAttachment(attachmentUrl: string) {
        if (!medicalRecord.id) return;
        if (confirm('Are you sure you want to delete this attachment?')) {
            dispatch('deleteAttachment', {
                recordId: medicalRecord.id,
                attachmentUrl
            });
            existingAttachments = existingAttachments.filter(url => url !== attachmentUrl);
        }
    }

    function getFileNameFromUrl(url: string): string {
        const parts = url.split('/');
        return parts[parts.length - 1];
    }
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-6">
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {#if !patientId}
            <div>
                <label for="patient" class="block text-sm font-medium text-gray-700">Patient</label>
                <select
                    id="patient"
                    bind:value={medicalRecord.patient_id}
                    disabled={!!patientId || loading}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                    <option value="">Select a patient</option>
                    {#each patients as patient}
                        <option value={patient.id}>{patient.full_name}</option>
                    {/each}
                </select>
                {#if errors.patient_id}
                    <p class="mt-1 text-sm text-red-600">{errors.patient_id}</p>
                {/if}
            </div>
        {/if}

        <div>
            <label for="doctor" class="block text-sm font-medium text-gray-700">Doctor</label>
            <select
                id="doctor"
                bind:value={medicalRecord.doctor_id}
                disabled={loading}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
                <option value="">Select a doctor</option>
                {#each doctors as doctor}
                    <option value={doctor.id}>{doctor.full_name} ({doctor.specialization || 'General'})</option>
                {/each}
            </select>
            {#if errors.doctor_id}
                <p class="mt-1 text-sm text-red-600">{errors.doctor_id}</p>
            {/if}
        </div>

        <div>
            <label for="record_number" class="block text-sm font-medium text-gray-700">Record Number</label>
            <input
                type="text"
                id="record_number"
                bind:value={medicalRecord.record_number}
                disabled={loading}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {#if errors.record_number}
                <p class="mt-1 text-sm text-red-600">{errors.record_number}</p>
            {/if}
        </div>

        <div>
            <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
            <select
                id="status"
                bind:value={medicalRecord.status}
                disabled={loading}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
                <option value="Draft">Draft</option>
                <option value="Final">Final</option>
                <option value="Amended">Amended</option>
            </select>
            {#if errors.status}
                <p class="mt-1 text-sm text-red-600">{errors.status}</p>
            {/if}
        </div>
    </div>

    <!-- Vitals Section -->
    <div class="border-t border-gray-200 pt-6">
        <VitalsForm bind:vitals={medicalRecord.vitals} disabled={loading} />
    </div>

    <!-- Chief Complaint -->
    <div>
        <label for="chief_complaint" class="block text-sm font-medium text-gray-700">Chief Complaint</label>
        <input
            type="text"
            id="chief_complaint"
            bind:value={medicalRecord.chief_complaint}
            disabled={loading}
            placeholder="Patient's main complaint"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {#if errors.chief_complaint}
            <p class="mt-1 text-sm text-red-600">{errors.chief_complaint}</p>
        {/if}
    </div>

    <!-- SOAP Notes -->
    <div class="space-y-4">
        <div>
            <label for="subjective" class="block text-sm font-medium text-gray-700">Subjective</label>
            <textarea
                id="subjective"
                bind:value={medicalRecord.subjective}
                disabled={loading}
                rows="3"
                placeholder="Patient's symptoms and complaints"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            ></textarea>
            {#if errors.subjective}
                <p class="mt-1 text-sm text-red-600">{errors.subjective}</p>
            {/if}
        </div>

        <div>
            <label for="objective" class="block text-sm font-medium text-gray-700">Objective</label>
            <textarea
                id="objective"
                bind:value={medicalRecord.objective}
                disabled={loading}
                rows="3"
                placeholder="Clinical observations and measurements"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            ></textarea>
            {#if errors.objective}
                <p class="mt-1 text-sm text-red-600">{errors.objective}</p>
            {/if}
        </div>

        <div>
            <label for="assessment" class="block text-sm font-medium text-gray-700">Assessment</label>
            <textarea
                id="assessment"
                bind:value={medicalRecord.assessment}
                disabled={loading}
                rows="3"
                placeholder="Diagnosis and clinical impressions"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            ></textarea>
            {#if errors.assessment}
                <p class="mt-1 text-sm text-red-600">{errors.assessment}</p>
            {/if}
        </div>

        <div>
            <label for="plan" class="block text-sm font-medium text-gray-700">Plan</label>
            <textarea
                id="plan"
                bind:value={medicalRecord.plan}
                disabled={loading}
                rows="3"
                placeholder="Treatment plan and next steps"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            ></textarea>
            {#if errors.plan}
                <p class="mt-1 text-sm text-red-600">{errors.plan}</p>
            {/if}
        </div>
    </div>

    <!-- Diagnosis Codes -->
    <div class="border-t border-gray-200 pt-6">
        <DiagnosisCodeList
            bind:diagnosisCodes={medicalRecord.diagnosis_codes}
            disabled={loading}
        />
    </div>

    <!-- Medications -->
    <div class="border-t border-gray-200 pt-6">
        <MedicationList
            bind:medications={medicalRecord.medications}
            disabled={loading}
        />
    </div>

    <!-- Allergies -->
    <div class="border-t border-gray-200 pt-6">
        <AllergiesList
            bind:allergies={medicalRecord.allergies}
            disabled={loading}
        />
    </div>

    <!-- Follow-up Date -->
    <div>
        <label for="follow_up_date" class="block text-sm font-medium text-gray-700">Follow-up Date</label>
        <input
            type="date"
            id="follow_up_date"
            bind:value={medicalRecord.follow_up_date}
            disabled={loading}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
    </div>

    <!-- Attachments -->
    <div>
        <label class="block text-sm font-medium text-gray-700">Attachments</label>
        
        {#if existingAttachments.length > 0}
            <div class="mt-2 space-y-2">
                {#each existingAttachments as attachment}
                    <div class="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md">
                        <a
                            href={attachment}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-sm text-indigo-600 hover:text-indigo-900"
                        >
                            {getFileNameFromUrl(attachment)}
                        </a>
                        <button
                            type="button"
                            on:click={() => handleDeleteAttachment(attachment)}
                            disabled={loading}
                            class="text-sm text-red-600 hover:text-red-900"
                        >
                            Delete
                        </button>
                    </div>
                {/each}
            </div>
        {/if}

        <div class="mt-2">
            <input
                type="file"
                multiple
                bind:files={attachmentFiles}
                disabled={loading}
                class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
        </div>
    </div>

    <div class="flex justify-end">
        <button
            type="submit"
            disabled={loading}
            class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
            {#if loading}
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
            {:else}
                Save
            {/if}
        </button>
    </div>
</form>
