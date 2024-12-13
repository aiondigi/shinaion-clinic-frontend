<!-- src/lib/components/AppointmentCalendar.svelte -->
<script lang="ts">
    import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, isSameDay } from 'date-fns';
    import type { Appointment } from '$lib/types';

    export let appointments: Appointment[] = [];
    export let currentDate: Date = new Date();
    export let onDateSelect: (date: Date) => void;
    export let onAppointmentClick: (appointment: Appointment) => void;

    let weekDates: Date[] = [];

    $: {
        const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start from Monday
        const end = endOfWeek(currentDate, { weekStartsOn: 1 });
        weekDates = eachDayOfInterval({ start, end });
    }

    function getAppointmentsForDate(date: Date): Appointment[] {
        return appointments.filter(appointment => 
            isSameDay(new Date(appointment.appointment_date), date)
        );
    }

    function handlePrevWeek() {
        currentDate = subWeeks(currentDate, 1);
    }

    function handleNextWeek() {
        currentDate = addWeeks(currentDate, 1);
    }

    function getStatusColor(status: string): string {
        switch (status) {
            case 'Confirmed':
                return 'bg-green-100 text-green-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    }
</script>

<div class="bg-white shadow ring-1 ring-black ring-opacity-5">
    <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <div>
            <h2 class="text-lg font-semibold text-gray-900">
                {format(currentDate, 'MMMM yyyy')}
            </h2>
            <p class="mt-1 text-sm text-gray-500">
                Week of {format(weekDates[0], 'MMM d')} - {format(weekDates[6], 'MMM d')}
            </p>
        </div>
        <div class="flex space-x-4">
            <button
                onclick={handlePrevWeek}
                class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
                Previous
            </button>
            <button
                onclick={handleNextWeek}
                class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
                Next
            </button>
        </div>
    </div>

    <div class="grid grid-cols-7 gap-px bg-gray-200">
        {#each weekDates as date}
            <div class="bg-white">
                <button
                    type="button"
                    class="w-full py-2 px-3 border-b hover:bg-gray-50 text-left"
                    onclick={() => onDateSelect(date)}
                    onkeydown={(e) => e.key === 'Enter' && onDateSelect(date)}
                >
                    <h3 class="text-sm font-medium text-gray-900">
                        {format(date, 'EEEE')}
                    </h3>
                    <p class="mt-1 text-sm text-gray-500">
                        {format(date, 'MMM d')}
                    </p>
                </button>
                <div class="max-h-96 overflow-y-auto px-2 py-2 space-y-1">
                    {#each getAppointmentsForDate(date) as appointment}
                        <button
                            type="button"
                            class="w-full rounded-md px-2 py-1 text-sm hover:opacity-75 text-left bg-gray-50"
                            onclick={() => onAppointmentClick(appointment)}
                            onkeydown={(e) => e.key === 'Enter' && onAppointmentClick(appointment)}
                        >
                            <div class="font-medium">
                                {format(new Date(appointment.appointment_date), 'HH:mm')}
                            </div>
                            <div class="text-gray-600">
                                {appointment.patient?.full_name}
                            </div>
                            <div class="text-gray-500 text-xs">
                                Dr. {appointment.doctor?.full_name}
                            </div>
                            <span
                                class={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(appointment.status)}`}
                            >
                                {appointment.status}
                            </span>
                        </button>
                    {/each}
                </div>
            </div>
        {/each}
    </div>
</div>
