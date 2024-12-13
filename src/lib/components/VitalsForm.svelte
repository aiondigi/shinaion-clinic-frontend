<!-- src/lib/components/VitalsForm.svelte -->
<script lang="ts">
    import type { Vitals } from '$lib/types/index';

    const { vitals = $bindable({}), disabled = false } = $props<{
        vitals?: Partial<Vitals>;
        disabled?: boolean;
    }>();

    const calculateBMI = () => {
        if (vitals.height && vitals.weight) {
            const heightInMeters = vitals.height / 100;
            vitals.bmi = Number((vitals.weight / (heightInMeters * heightInMeters)).toFixed(1));
        }
    };

    $effect(() => {
        if (vitals.height || vitals.weight) {
            calculateBMI();
        }
    });
</script>

<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <div>
        <label for="blood_pressure" class="block text-sm font-medium text-gray-700">Blood Pressure</label>
        <input
            type="text"
            id="blood_pressure"
            bind:value={vitals.blood_pressure}
            placeholder="120/80"
            {disabled}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
    </div>

    <div>
        <label for="heart_rate" class="block text-sm font-medium text-gray-700">Heart Rate</label>
        <div class="mt-1 flex rounded-md shadow-sm">
            <input
                type="number"
                id="heart_rate"
                bind:value={vitals.heart_rate}
                placeholder="72"
                {disabled}
                class="block w-full rounded-none rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <span class="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                bpm
            </span>
        </div>
    </div>

    <div>
        <label for="temperature" class="block text-sm font-medium text-gray-700">Temperature</label>
        <div class="mt-1 flex rounded-md shadow-sm">
            <input
                type="number"
                id="temperature"
                bind:value={vitals.temperature}
                step="0.1"
                placeholder="37.0"
                {disabled}
                class="block w-full rounded-none rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <span class="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                °C
            </span>
        </div>
    </div>

    <div>
        <label for="respiratory_rate" class="block text-sm font-medium text-gray-700">Respiratory Rate</label>
        <div class="mt-1 flex rounded-md shadow-sm">
            <input
                type="number"
                id="respiratory_rate"
                bind:value={vitals.respiratory_rate}
                placeholder="16"
                {disabled}
                class="block w-full rounded-none rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <span class="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                /min
            </span>
        </div>
    </div>

    <div>
        <label for="weight" class="block text-sm font-medium text-gray-700">Weight</label>
        <div class="mt-1 flex rounded-md shadow-sm">
            <input
                type="number"
                id="weight"
                bind:value={vitals.weight}
                step="0.1"
                placeholder="70.0"
                {disabled}
                class="block w-full rounded-none rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <span class="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                kg
            </span>
        </div>
    </div>

    <div>
        <label for="height" class="block text-sm font-medium text-gray-700">Height</label>
        <div class="mt-1 flex rounded-md shadow-sm">
            <input
                type="number"
                id="height"
                bind:value={vitals.height}
                placeholder="170"
                {disabled}
                class="block w-full rounded-none rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <span class="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                cm
            </span>
        </div>
    </div>

    <div>
        <label for="bmi" class="block text-sm font-medium text-gray-700">BMI</label>
        <input
            type="number"
            id="bmi"
            value={vitals.bmi}
            disabled
            class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
    </div>

    <div>
        <label for="oxygen_saturation" class="block text-sm font-medium text-gray-700">O₂ Saturation</label>
        <div class="mt-1 flex rounded-md shadow-sm">
            <input
                type="number"
                id="oxygen_saturation"
                bind:value={vitals.oxygen_saturation}
                placeholder="98"
                {disabled}
                class="block w-full rounded-none rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <span class="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                %
            </span>
        </div>
    </div>
</div>
