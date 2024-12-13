<!-- src/routes/(app)/appointments/+page.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { startOfWeek, endOfWeek } from 'date-fns';
    import appointmentService from '$lib/services/appointment';
    import AppointmentCalendar from '$lib/components/AppointmentCalendar.svelte';
    import type { Appointment } from '$lib/types/index';
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import { toast } from "svelte-sonner";

    let appointments = $state<Appointment[]>([]);
    let loading = $state(true);
    let currentDate = $state(new Date());

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

    $effect(() => {
        if (currentDate) {
            loadAppointments();
        }
    });

    function handleDateSelect(date: Date) {
        goto('/appointments/new?date=' + date.toISOString());
    }

    function handleAppointmentClick(appointment: Appointment) {
        goto(`/appointments/${appointment.id}`);
    }
</script>

<div class="space-y-6">
    <header class="border-b pb-4">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-semibold">Appointments</h1>
                <p class="text-muted-foreground">View and manage appointments</p>
            </div>
            <Button onclick={() => goto('/appointments/new')}>
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
                    <line x1="12" x2="12" y1="5" y2="19" />
                    <line x1="5" x2="19" y1="12" y2="12" />
                </svg>
                New Appointment
            </Button>
        </div>
    </header>

    <Card.Root>
        <Card.Content class="pt-6">
            {#if loading}
                <div class="flex items-center justify-center py-8">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            {:else}
                <AppointmentCalendar
                    {appointments}
                    bind:currentDate
                    onAppointmentClick={handleAppointmentClick}
                    onDateSelect={handleDateSelect}
                />
            {/if}
        </Card.Content>
    </Card.Root>
</div>
