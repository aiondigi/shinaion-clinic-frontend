<!-- src/routes/(app)/dashboard/+page.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import api from '$lib/services/api';
    import type { Appointment } from '$lib/types';
    import toast from 'svelte-french-toast';

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
            toast.error('Failed to load dashboard data');
        } finally {
            loading = false;
        }
    });
</script>

<div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
        
        <!-- Stats Grid -->
        <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <!-- Total Patients -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="p-5">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div class="ml-5 w-0 flex-1">
                            <dl>
                                <dt class="text-sm font-medium text-gray-500 truncate">Total Patients</dt>
                                <dd class="text-lg font-semibold text-gray-900">{stats.totalPatients}</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Total Doctors -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="p-5">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div class="ml-5 w-0 flex-1">
                            <dl>
                                <dt class="text-sm font-medium text-gray-500 truncate">Total Doctors</dt>
                                <dd class="text-lg font-semibold text-gray-900">{stats.totalDoctors}</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Total Appointments -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="p-5">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div class="ml-5 w-0 flex-1">
                            <dl>
                                <dt class="text-sm font-medium text-gray-500 truncate">Total Appointments</dt>
                                <dd class="text-lg font-semibold text-gray-900">{stats.totalAppointments}</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Upcoming Appointments -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="p-5">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div class="ml-5 w-0 flex-1">
                            <dl>
                                <dt class="text-sm font-medium text-gray-500 truncate">Upcoming Appointments</dt>
                                <dd class="text-lg font-semibold text-gray-900">{stats.upcomingAppointments}</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Today's Appointments -->
        <div class="mt-8">
            <div class="bg-white shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <h2 class="text-lg leading-6 font-medium text-gray-900">Today's Appointments</h2>
                    <div class="mt-5">
                        {#if loading}
                            <div class="flex justify-center">
                                <svg class="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                        {:else if todayAppointments.length === 0}
                            <p class="text-gray-500">No appointments scheduled for today.</p>
                        {:else}
                            <div class="mt-4 divide-y divide-gray-200">
                                {#each todayAppointments as appointment}
                                    <div class="py-4">
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <p class="text-sm font-medium text-gray-900">
                                                    {appointment.patient?.full_name}
                                                </p>
                                                <p class="text-sm text-gray-500">
                                                    Dr. {appointment.doctor?.full_name}
                                                </p>
                                                <p class="text-xs text-gray-400">
                                                    {new Date(appointment.appointment_date).toLocaleTimeString()}
                                                </p>
                                            </div>
                                            <div>
                                                <span
                                                    class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                        ${appointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                        appointment.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                                                        appointment.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-yellow-100 text-yellow-800'}`}
                                                >
                                                    {appointment.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
