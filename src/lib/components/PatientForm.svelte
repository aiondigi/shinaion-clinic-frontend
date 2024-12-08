<!-- src/lib/components/PatientForm.svelte -->
<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Patient, Gender } from '$lib/types';
    import { z } from 'zod';

    export let patient: Partial<Patient> = {};
    export let loading = false;

    const dispatch = createEventDispatcher<{
        submit: Omit<Patient, 'id' | 'created_at' | 'updated_at'>;
    }>();

    let errors: Record<string, string> = {};

    const patientSchema = z.object({
        full_name: z.string().min(1, 'Full name is required'),
        date_of_birth: z.string().min(1, 'Date of birth is required'),
        gender: z.enum(['Male', 'Female', 'Other'] as const),
        contact_number: z.string().optional(),
        email: z.string().email('Invalid email').optional().or(z.literal('')),
        address: z.string().optional(),
        insurance_id: z.string().min(1, 'Insurance ID is required'),
    });

    function handleSubmit() {
        try {
            const formData = {
                full_name: patient.full_name || '',
                date_of_birth: patient.date_of_birth || '',
                gender: patient.gender || 'Male',
                contact_number: patient.contact_number,
                email: patient.email,
                address: patient.address,
                insurance_id: patient.insurance_id || '',
            };

            const validatedData = patientSchema.parse(formData);
            errors = {};
            dispatch('submit', validatedData);
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

    const genders: Gender[] = ['Male', 'Female', 'Other'];
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-6">
    <div>
        <label for="full_name" class="block text-sm font-medium text-gray-700">Full Name</label>
        <input
            type="text"
            id="full_name"
            bind:value={patient.full_name}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {#if errors.full_name}
            <p class="mt-1 text-sm text-red-600">{errors.full_name}</p>
        {/if}
    </div>

    <div>
        <label for="date_of_birth" class="block text-sm font-medium text-gray-700">Date of Birth</label>
        <input
            type="date"
            id="date_of_birth"
            bind:value={patient.date_of_birth}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {#if errors.date_of_birth}
            <p class="mt-1 text-sm text-red-600">{errors.date_of_birth}</p>
        {/if}
    </div>

    <div>
        <label for="gender" class="block text-sm font-medium text-gray-700">Gender</label>
        <select
            id="gender"
            bind:value={patient.gender}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
            {#each genders as gender}
                <option value={gender}>{gender}</option>
            {/each}
        </select>
        {#if errors.gender}
            <p class="mt-1 text-sm text-red-600">{errors.gender}</p>
        {/if}
    </div>

    <div>
        <label for="contact_number" class="block text-sm font-medium text-gray-700">Contact Number</label>
        <input
            type="tel"
            id="contact_number"
            bind:value={patient.contact_number}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {#if errors.contact_number}
            <p class="mt-1 text-sm text-red-600">{errors.contact_number}</p>
        {/if}
    </div>

    <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input
            type="email"
            id="email"
            bind:value={patient.email}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {#if errors.email}
            <p class="mt-1 text-sm text-red-600">{errors.email}</p>
        {/if}
    </div>

    <div>
        <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
        <textarea
            id="address"
            bind:value={patient.address}
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        ></textarea>
        {#if errors.address}
            <p class="mt-1 text-sm text-red-600">{errors.address}</p>
        {/if}
    </div>

    <div>
        <label for="insurance_id" class="block text-sm font-medium text-gray-700">Insurance ID</label>
        <input
            type="text"
            id="insurance_id"
            bind:value={patient.insurance_id}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {#if errors.insurance_id}
            <p class="mt-1 text-sm text-red-600">{errors.insurance_id}</p>
        {/if}
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
