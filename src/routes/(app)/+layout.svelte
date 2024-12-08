<!-- src/routes/(app)/+layout.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import authService from '$lib/services/auth';

    onMount(() => {
        if (!authService.isAuthenticated()) {
            goto('/login');
        }
    });

    const navigation = [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Medical Records', href: '/medical-records' },
        { name: 'Patients', href: '/patients' },
        { name: 'Doctors', href: '/doctors' },
        { name: 'Appointments', href: '/appointments' }
    ];
</script>

<div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex">
                    <div class="flex-shrink-0 flex items-center">
                        <a href="/dashboard" class="text-xl font-bold text-indigo-600">
                            Shinaion Clinic
                        </a>
                    </div>
                    <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                        {#each navigation as item}
                            <a
                                href={item.href}
                                class={`${
                                    $page.url.pathname === item.href
                                        ? 'border-indigo-500 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                            >
                                {item.name}
                            </a>
                        {/each}
                    </div>
                </div>
                <div class="flex items-center">
                    <button
                        on:click={() => authService.logout()}
                        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Mobile menu -->
    <div class="sm:hidden" id="mobile-menu">
        <div class="pt-2 pb-3 space-y-1">
            {#each navigation as item}
                <a
                    href={item.href}
                    class={`${
                        $page.url.pathname === item.href
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                            : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                    } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                >
                    {item.name}
                </a>
            {/each}
        </div>
    </div>

    <main>
        <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <slot />
        </div>
    </main>
</div>
