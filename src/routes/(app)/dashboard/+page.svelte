<!-- src/routes/(app)/dashboard/+page.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import api from '$lib/services/api';
    import type { Appointment } from '$lib/types';
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    

    let todayAppointments: Appointment[] = [];
    let loading = true;
    let stats = {
        totalPatients: 0,
        totalDoctors: 0,
        totalAppointments: 0,
        upcomingAppointments: 0
    };

    onMount(async () => {
        try {
            const [appointmentsRes, statsRes] = await Promise.all([
                api.get('/appointments/today'),
                api.get('/dashboard/stats')
            ]);
            todayAppointments = appointmentsRes.data;
            stats = statsRes.data;
        } catch (error: any) {
           // toast.error('Failed to load dashboard data');
        } finally {
            loading = false;
        }
    });
</script>

<div class="h-full">
    <!-- Header -->
    <header class="border-b">
        <div class="px-4 sm:px-6 lg:px-8 py-4">
            <h1 class="text-2xl font-semibold">Dashboard</h1>
        </div>
    </header>

    <div class="p-4 sm:p-6 lg:p-8 space-y-8">
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card.Root>
                <Card.Header class="flex flex-row items-center justify-between pb-2 space-y-0">
                    <Card.Title class="text-sm font-medium">Total Patients</Card.Title>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        class="h-4 w-4 text-muted-foreground"
                    >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                </Card.Header>
                <Card.Content>
                    <div class="text-2xl font-bold">{stats.totalPatients}</div>
                    <p class="text-xs text-muted-foreground">Registered patients</p>
                </Card.Content>
            </Card.Root>

            <Card.Root>
                <Card.Header class="flex flex-row items-center justify-between pb-2 space-y-0">
                    <Card.Title class="text-sm font-medium">Total Doctors</Card.Title>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        class="h-4 w-4 text-muted-foreground"
                    >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                </Card.Header>
                <Card.Content>
                    <div class="text-2xl font-bold">{stats.totalDoctors}</div>
                    <p class="text-xs text-muted-foreground">Active doctors</p>
                </Card.Content>
            </Card.Root>

            <Card.Root>
                <Card.Header class="flex flex-row items-center justify-between pb-2 space-y-0">
                    <Card.Title class="text-sm font-medium">Total Appointments</Card.Title>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        class="h-4 w-4 text-muted-foreground"
                    >
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                        <line x1="16" x2="16" y1="2" y2="6" />
                        <line x1="8" x2="8" y1="2" y2="6" />
                        <line x1="3" x2="21" y1="10" y2="10" />
                    </svg>
                </Card.Header>
                <Card.Content>
                    <div class="text-2xl font-bold">{stats.totalAppointments}</div>
                    <p class="text-xs text-muted-foreground">Total appointments</p>
                </Card.Content>
            </Card.Root>

            <Card.Root>
                <Card.Header class="flex flex-row items-center justify-between pb-2 space-y-0">
                    <Card.Title class="text-sm font-medium">Upcoming Appointments</Card.Title>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        class="h-4 w-4 text-muted-foreground"
                    >
                        <path d="M12 8v4l3 3" />
                        <circle cx="12" cy="12" r="10" />
                    </svg>
                </Card.Header>
                <Card.Content>
                    <div class="text-2xl font-bold">{stats.upcomingAppointments}</div>
                    <p class="text-xs text-muted-foreground">Scheduled appointments</p>
                </Card.Content>
            </Card.Root>
        </div>

        <!-- Today's Appointments -->
        <Card.Root>
            <Card.Header>
                <Card.Title>Today's Appointments</Card.Title>
                <Card.Description>Overview of appointments scheduled for today</Card.Description>
            </Card.Header>
            <Card.Content>
                {#if loading}
                    <div class="flex items-center justify-center p-4">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                {:else if todayAppointments.length === 0}
                    <div class="text-center py-6">
                        <p class="text-muted-foreground">No appointments scheduled for today</p>
                    </div>
                {:else}
                    <div class="space-y-4">
                        {#each todayAppointments as appointment}
                            <div class="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <h3 class="font-medium">{appointment.patient?.full_name}</h3>
                                    <p class="text-sm text-muted-foreground">{new Date(appointment.appointment_date).toLocaleTimeString()}</p>
                                </div>
                                <Button variant="outline" size="sm">View Details</Button>
                            </div>
                        {/each}
                    </div>
                {/if}
            </Card.Content>
        </Card.Root>
    </div>
</div>
