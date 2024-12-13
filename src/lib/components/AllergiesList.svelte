<!-- src/lib/components/AllergiesList.svelte -->
<script lang="ts">
    export let allergies: string[] = [];
    export let disabled = false;

    let newAllergy = '';

    function addAllergy() {
        if (newAllergy.trim()) {
            allergies = [...allergies, newAllergy.trim()];
            newAllergy = '';
        }
    }

    function removeAllergy(index: number) {
        allergies = allergies.filter((_, i) => i !== index);
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            event.preventDefault();
            addAllergy();
        }
    }
</script>

<div class="space-y-4">
    <div class="flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-900">Allergies</h3>
    </div>

    {#if !disabled}
        <div class="flex gap-2">
            <input
                type="text"
                bind:value={newAllergy}
                onkeydown={handleKeydown}
                placeholder="Add allergy"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <button
                type="button"
                onclick={addAllergy}
                class="inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-3 py-2 text-sm font-medium leading-4 text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
                Add
            </button>
        </div>
    {/if}

    {#if allergies.length === 0}
        <p class="text-sm text-gray-500">No known allergies.</p>
    {:else}
        <div class="flex flex-wrap gap-2">
            {#each allergies as allergy, index}
                <span class="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                    {allergy}
                    {#if !disabled}
                        <button
                            type="button"
                            onclick={() => removeAllergy(index)}
                            class="ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-red-400 hover:bg-red-200 hover:text-red-500 focus:bg-red-500 focus:text-white focus:outline-none"
                        >
                            <span class="sr-only">Remove {allergy}</span>
                            <svg class="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                <path stroke-linecap="round" stroke-width="1.5" d="M1 1l6 6m0-6L1 7" />
                            </svg>
                        </button>
                    {/if}
                </span>
            {/each}
        </div>
    {/if}
</div>
