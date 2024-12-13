<!-- src/lib/components/AppointmentForm.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { format, parse, isValid } from 'date-fns';
    import type { Appointment, Doctor, Patient } from '$lib/types/index';
    import doctorService from '$lib/services/doctor';
    import patientService from '$lib/services/patient';
    import appointmentService from '$lib/services/appointment';
    import { toast } from "svelte-sonner";

    let props = $props<{
        appointment?: Partial<Appointment>;
        loading?: boolean;
        onSubmit: (data: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) => void;
    }>();

    let appointment = $state<Partial<Appointment>>(props.appointment ?? {});
    let loading = $derived(props.loading ?? false);
    let errors = $state<Record<string, string>>({});
    let doctors = $state<Doctor[]>([]);
    let patients = $state<Patient[]>([]);
    let availableSlots = $state<string[]>([]);
    let selectedDate = $state('');
    let selectedTime = $state('');
    let loadingSlots = $state(false);

    function validateForm(data: Partial<Appointment>): boolean {
        const newErrors: Record<string, string> = {};

        if (!data.patient_id) {
            newErrors.patient_id = 'Patient is required';
        }
        if (!data.doctor_id) {
            newErrors.doctor_id = 'Doctor is required';
        }
        if (!selectedDate || !selectedTime) {
            newErrors.appointment_date = 'Appointment date and time is required';
        }
        if (data.status && !['Pending', 'Confirmed', 'Cancelled'].includes(data.status)) {
            newErrors.status = 'Invalid status';
        }

        errors = newErrors;
        return Object.keys(newErrors).length === 0;
    }

    onMount(async () => {
        try {
            const [doctorsData, patientsData] = await Promise.all([
                doctorService.getDoctors(),
                patientService.getPatients()
            ]);
            doctors = doctorsData;
            patients = patientsData;

            if (appointment.appointment_date) {
                const date = new Date(appointment.appointment_date);
                selectedDate = format(date, 'yyyy-MM-dd');
                selectedTime = format(date, 'HH:mm');
                if (appointment.doctor_id) {
                    await loadAvailableSlots();
                }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to load data';
            toast.error(errorMessage, {
                duration: 4000,
                position: 'top-right'
            });
        }
    });

    async function loadAvailableSlots() {
        if (!appointment.doctor_id || !selectedDate) return;

        try {
            loadingSlots = true;
            const date = parse(selectedDate, 'yyyy-MM-dd', new Date());
            if (!isValid(date)) return;

            const slots = await appointmentService.getDoctorAvailableSlots(appointment.doctor_id, date);
            availableSlots = slots;

            // If editing and the current time is not in available slots, add it
            if (selectedTime && !availableSlots.includes(selectedTime)) {
                availableSlots = [...availableSlots, selectedTime].sort();
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to load available slots';
            toast.error(errorMessage, {
                duration: 4000,
                position: 'top-right'
            });
        } finally {
            loadingSlots = false;
        }
    }

    async function handleDoctorChange() {
        selectedTime = '';
        await loadAvailableSlots();
    }

    async function handleDateChange() {
        selectedTime = '';
        await loadAvailableSlots();
    }

    function handleSubmit() {
        // Validate and prepare appointment data
        const appointmentDate = selectedDate && selectedTime ? `${selectedDate}T${selectedTime}` : '';
        const appointmentData = {
            patient_id: appointment.patient_id || '',
            doctor_id: appointment.doctor_id || '',
            appointment_date: appointmentDate,
            status: appointment.status || 'Pending',
            notes: appointment.notes
        };

        if (validateForm(appointmentData)) {
            // Dispatch the event with the data
            const event = new CustomEvent('submit', {
                detail: appointmentData
            });
            props.onSubmit(appointmentData);
        }
    }
</script>

<form onsubmit={(e) => { 
    e.preventDefault();
    handleSubmit();
}} class="space-y-6">
    <div>
        <label for="patient" class="block text-sm font-medium text-gray-700">Patient</label>
        <select
            id="patient"
            bind:value={appointment.patient_id}
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

    <div>
        <label for="doctor" class="block text-sm font-medium text-gray-700">Doctor</label>
        <select
            id="doctor"
            bind:value={appointment.doctor_id}
            onchange={handleDoctorChange}
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
        <label for="date" class="block text-sm font-medium text-gray-700">Date</label>
        <input
            type="date"
            id="date"
            bind:value={selectedDate}
            min={format(new Date(), 'yyyy-MM-dd')}
            onchange={handleDateChange}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
    </div>

    <div>
        <label for="time" class="block text-sm font-medium text-gray-700">Time</label>
        {#if loadingSlots}
            <div class="mt-1 flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading available slots...
            </div>
        {:else}
            <select
                id="time"
                bind:value={selectedTime}
                disabled={!appointment.doctor_id || !selectedDate || loadingSlots}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
            >
                <option value="">Select a time</option>
                {#each availableSlots as slot}
                    <option value={slot}>{slot}</option>
                {/each}
            </select>
        {/if}
        {#if errors.appointment_date}
            <p class="mt-1 text-sm text-red-600">{errors.appointment_date}</p>
        {/if}
    </div>

    <div>
        <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
        <select
            id="status"
            bind:value={appointment.status}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
        </select>
        {#if errors.status}
            <p class="mt-1 text-sm text-red-600">{errors.status}</p>
        {/if}
    </div>

    <div>
        <label for="notes" class="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
            id="notes"
            bind:value={appointment.notes}
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        ></textarea>
    </div>

    <div class="flex justify-end">
        <button
            type="submit"
            disabled={loading || loadingSlots}
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
