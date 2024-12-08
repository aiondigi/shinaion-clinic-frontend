<!-- src/lib/components/MedicationList.svelte -->
<script lang="ts">
    export let medications: Array<{
        name: string;
        dosage: string;
        frequency: string;
        duration: string;
    }> = [];

    export let disabled = false;

    function addMedication() {
        medications = [
            ...medications,
            { name: '', dosage: '', frequency: '', duration: '' }
        ];
    }

    function removeMedication(index: number) {
        medications = medications.filter((_, i) => i !== index);
    }
</script>

<div class="space-y-4">
    <div class="flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-900">Medications</h3>
        {#if !disabled}
            <button
                type="button"
                on:click={addMedication}
                class="inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-3 py-2 text-sm font-medium leading-4 text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
                Add Medication
            </button>
        {/if}
    </div>

    {#if medications.length === 0}
        <p class="text-sm text-gray-500">No medications prescribed.</p>
    {:else}
        <div class="space-y-4">
            {#each medications as medication, index}
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-4 border rounded-md p-4 relative">
                    {#if !disabled}
                        <button
                            type="button"
                            on:click={() => removeMedication(index)}
                            class="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    {/if}

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            bind:value={medication.name}
                            {disabled}
                            placeholder="Medication name"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Dosage</label>
                        <input
                            type="text"
                            bind:value={medication.dosage}
                            {disabled}
                            placeholder="e.g., 500mg"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Frequency</label>
                        <input
                            type="text"
                            bind:value={medication.frequency}
                            {disabled}
                            placeholder="e.g., 3 times daily"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Duration</label>
                        <input
                            type="text"
                            bind:value={medication.duration}
                            {disabled}
                            placeholder="e.g., 7 days"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
