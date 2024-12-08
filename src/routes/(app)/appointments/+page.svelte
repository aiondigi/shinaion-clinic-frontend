<!-- src/routes/(app)/appointments/+page.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { startOfWeek, endOfWeek } from 'date-fns';
    import appointmentService from '$lib/services/appointment';
    import AppointmentCalendar from '$lib/components/AppointmentCalendar.svelte';
    import type { Appointment } from '$lib/types';
    import toast from 'svelte-french-toast';

    let appointments: Appointment[] = [];
    let loading = true;
    let currentDate = new Date();

    async function loadAppointments() {
        try {
            loading = true;
            const start = startOfWeek(currentDate, { weekStartsOn: 1 });
            const end = endOfWeek(currentDate, { weekStartsOn: 1 });
            const data = await appointmentService.getAppointments(start, end);
            appointments = data;
        } catch (error) {
            toast.error('Failed to load appointments');
        } finally {
            loading = false;
        }
    }

    onMount(loadAppointments);

    $: {
        // Reload appointments when currentDate changes
        if (!loading) {
            loadAppointments();
        }
    }

    function handleDateSelect(date: Date) {
        goto('/appointments/new?date=' + date.toISOString());
    }

    function handleAppointmentClick(appointment: Appointment) {
        goto(`/appointments/${appointment.id}`);
    }
</script>

<div class="space-y-6">
    <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
            <h1 class="text-xl font-semibold text-gray-900">Appointments</h1>
            <p class="mt-2 text-sm text-gray-700">View and manage appointments.</p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
                on:click={() => goto('/appointments/new')}
                class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
                New appointment
            </button>
        </div>
    </div>

    {#if loading}
        <div class="flex justify-center py-8">
            <svg class="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
    {:else}
        <AppointmentCalendar
            {appointments}
            bind:currentDate
            onDateSelect={handleDateSelect}
            onAppointmentClick={handleAppointmentClick}
        />
    {/if}
</div>
