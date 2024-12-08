<!-- src/lib/components/DiagnosisCodeList.svelte -->
<script lang="ts">
    export let diagnosisCodes: string[] = [];
    export let disabled = false;

    let newCode = '';

    function addCode() {
        if (newCode.trim()) {
            diagnosisCodes = [...diagnosisCodes, newCode.trim().toUpperCase()];
            newCode = '';
        }
    }

    function removeCode(index: number) {
        diagnosisCodes = diagnosisCodes.filter((_, i) => i !== index);
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            event.preventDefault();
            addCode();
        }
    }

    // Format ICD-10 code to standard format (e.g., A01.1)
    function formatCode(code: string): string {
        code = code.toUpperCase();
        if (code.length >= 3) {
            return code.slice(0, 3) + (code.length > 3 ? '.' + code.slice(3) : '');
        }
        return code;
    }
</script>

<div class="space-y-4">
    <div class="flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-900">Diagnosis Codes (ICD-10)</h3>
    </div>

    {#if !disabled}
        <div class="flex gap-2">
            <input
                type="text"
                bind:value={newCode}
                on:keydown={handleKeydown}
                placeholder="Enter ICD-10 code"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <button
                type="button"
                on:click={addCode}
                class="inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-3 py-2 text-sm font-medium leading-4 text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
                Add
            </button>
        </div>
    {/if}

    {#if diagnosisCodes.length === 0}
        <p class="text-sm text-gray-500">No diagnosis codes added.</p>
    {:else}
        <div class="flex flex-wrap gap-2">
            {#each diagnosisCodes as code, index}
                <span class="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800">
                    {formatCode(code)}
                    {#if !disabled}
                        <button
                            type="button"
                            on:click={() => removeCode(index)}
                            class="ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:bg-blue-500 focus:text-white focus:outline-none"
                        >
                            <span class="sr-only">Remove {code}</span>
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
