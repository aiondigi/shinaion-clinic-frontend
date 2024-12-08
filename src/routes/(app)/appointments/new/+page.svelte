<!-- src/routes/(app)/appointments/new/+page.svelte -->
<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import AppointmentForm from '$lib/components/AppointmentForm.svelte';
    import appointmentService from '$lib/services/appointment';
    import toast from 'svelte-french-toast';
    import type { Appointment } from '$lib/types';

    let loading = false;
    let initialAppointment: Partial<Appointment> = {};

    // Get date from URL query parameter if present
    $: {
        const dateParam = $page.url.searchParams.get('date');
        if (dateParam) {
            initialAppointment = {
                ...initialAppointment,
                appointment_date: dateParam
            };
        }
    }

    async function handleSubmit(event: CustomEvent<Omit<Appointment, 'id' | 'created_at' | 'updated_at'>>) {
        try {
            loading = true;
            await appointmentService.createAppointment(event.detail);
            toast.success('Appointment created successfully');
            goto('/appointments');
        } catch (error) {
            toast.error('Failed to create appointment');
        } finally {
            loading = false;
        }
    }
</script>

<div class="max-w-2xl mx-auto">
    <div class="sm:flex sm:items-center mb-8">
        <div class="sm:flex-auto">
            <h1 class="text-xl font-semibold text-gray-900">New Appointment</h1>
            <p class="mt-2 text-sm text-gray-700">Schedule a new appointment.</p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
                on:click={() => goto('/appointments')}
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Back to calendar
            </button>
        </div>
    </div>

    <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
            <AppointmentForm appointment={initialAppointment} {loading} on:submit={handleSubmit} />
        </div>
    </div>
</div>
