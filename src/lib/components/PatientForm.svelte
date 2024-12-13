<!-- src/lib/components/PatientForm.svelte -->
<script lang="ts">
    import type { Patient, Gender } from '$lib/types/index';

    const { patient = {}, loading = false, onSubmit } = $props<{
        patient?: Partial<Patient>;
        loading?: boolean;
        onSubmit: (data: Omit<Patient, 'id' | 'created_at' | 'updated_at'>) => void;
    }>();

    let errors = $state<Record<string, string>>({});
    let form: HTMLFormElement;

    const validateForm = () => {
        errors = {};
        
        if (!patient.full_name?.trim()) {
            errors.full_name = 'Full name is required';
        }
        
        if (!patient.gender) {
            errors.gender = 'Gender is required';
        }
        
        if (!patient.date_of_birth) {
            errors.date_of_birth = 'Date of birth is required';
        }
        
        if (!patient.contact_number?.trim()) {
            errors.contact_number = 'Contact number is required';
        }
        
        if (!patient.email?.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patient.email)) {
            errors.email = 'Invalid email address';
        }
        
        if (!patient.address?.trim()) {
            errors.address = 'Address is required';
        }
        
        if (!patient.insurance_id?.trim()) {
            errors.insurance_id = 'Insurance ID is required';
        }

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = () => {
        if (loading) return;

        if (validateForm()) {
            onSubmit({
                full_name: patient.full_name!,
                gender: patient.gender!,
                date_of_birth: patient.date_of_birth!,
                contact_number: patient.contact_number!,
                email: patient.email!,
                address: patient.address!,
                insurance_id: patient.insurance_id!,
            });
        }
    };

    const genders: Gender[] = ['Male', 'Female', 'Other'];
</script>

<form onsubmit={(e) => { 
    e.preventDefault();
    handleSubmit();
}} class="space-y-6">
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
