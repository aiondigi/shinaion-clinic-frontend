<!-- src/lib/components/DoctorForm.svelte -->
<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Doctor } from '$lib/types';
    import { z } from 'zod';

    export let doctor: Partial<Doctor> = {};
    export let loading = false;

    const dispatch = createEventDispatcher<{
        submit: Omit<Doctor, 'id' | 'created_at' | 'updated_at'>;
    }>();

    let errors: Record<string, string> = {};

    // Initialize availability schedule if not present
    if (!doctor.availability) {
        doctor.availability = {
            monday: { start: '09:00', end: '17:00', enabled: true },
            tuesday: { start: '09:00', end: '17:00', enabled: true },
            wednesday: { start: '09:00', end: '17:00', enabled: true },
            thursday: { start: '09:00', end: '17:00', enabled: true },
            friday: { start: '09:00', end: '17:00', enabled: true },
            saturday: { start: '09:00', end: '13:00', enabled: true },
            sunday: { start: '00:00', end: '00:00', enabled: false }
        };
    }

    const doctorSchema = z.object({
        full_name: z.string().min(1, 'Full name is required'),
        specialization: z.string().optional(),
        license_number: z.string().min(1, 'License number is required'),
        sip: z.string().min(1, 'SIP is required'),
        contact_number: z.string().optional(),
        email: z.string().email('Invalid email').optional().or(z.literal('')),
        availability: z.record(z.object({
            start: z.string(),
            end: z.string(),
            enabled: z.boolean()
        }))
    });

    const days = [
        { id: 'monday', label: 'Monday' },
        { id: 'tuesday', label: 'Tuesday' },
        { id: 'wednesday', label: 'Wednesday' },
        { id: 'thursday', label: 'Thursday' },
        { id: 'friday', label: 'Friday' },
        { id: 'saturday', label: 'Saturday' },
        { id: 'sunday', label: 'Sunday' }
    ];

    function handleSubmit() {
        try {
            const formData = {
                full_name: doctor.full_name || '',
                specialization: doctor.specialization,
                license_number: doctor.license_number || '',
                sip: doctor.sip || '',
                contact_number: doctor.contact_number,
                email: doctor.email,
                availability: doctor.availability
            };

            const validatedData = doctorSchema.parse(formData);
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
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-6">
    <div>
        <label for="full_name" class="block text-sm font-medium text-gray-700">Full Name</label>
        <input
            type="text"
            id="full_name"
            bind:value={doctor.full_name}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {#if errors.full_name}
            <p class="mt-1 text-sm text-red-600">{errors.full_name}</p>
        {/if}
    </div>

    <div>
        <label for="specialization" class="block text-sm font-medium text-gray-700">Specialization</label>
        <input
            type="text"
            id="specialization"
            bind:value={doctor.specialization}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
    </div>

    <div>
        <label for="license_number" class="block text-sm font-medium text-gray-700">License Number</label>
        <input
            type="text"
            id="license_number"
            bind:value={doctor.license_number}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {#if errors.license_number}
            <p class="mt-1 text-sm text-red-600">{errors.license_number}</p>
        {/if}
    </div>

    <div>
        <label for="sip" class="block text-sm font-medium text-gray-700">SIP (Surat Izin Praktik)</label>
        <input
            type="text"
            id="sip"
            bind:value={doctor.sip}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {#if errors.sip}
            <p class="mt-1 text-sm text-red-600">{errors.sip}</p>
        {/if}
    </div>

    <div>
        <label for="contact_number" class="block text-sm font-medium text-gray-700">Contact Number</label>
        <input
            type="tel"
            id="contact_number"
            bind:value={doctor.contact_number}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
    </div>

    <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input
            type="email"
            id="email"
            bind:value={doctor.email}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {#if errors.email}
            <p class="mt-1 text-sm text-red-600">{errors.email}</p>
        {/if}
    </div>

    <div>
        <h3 class="text-lg font-medium text-gray-900 mb-4">Availability Schedule</h3>
        <div class="space-y-4">
            {#each days as day}
                <div class="flex items-center space-x-4">
                    <div class="w-32">
                        <label class="inline-flex items-center">
                            <input
                                type="checkbox"
                                bind:checked={doctor.availability[day.id].enabled}
                                class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            <span class="ml-2 text-sm text-gray-700">{day.label}</span>
                        </label>
                    </div>
                    <div class="flex space-x-2 items-center">
                        <input
                            type="time"
                            bind:value={doctor.availability[day.id].start}
                            disabled={!doctor.availability[day.id].enabled}
                            class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
                        />
                        <span class="text-gray-500">to</span>
                        <input
                            type="time"
                            bind:value={doctor.availability[day.id].end}
                            disabled={!doctor.availability[day.id].enabled}
                            class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
                        />
                    </div>
                </div>
            {/each}
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
