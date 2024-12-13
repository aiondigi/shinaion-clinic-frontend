<!-- src/routes/(app)/+layout.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import authService from '$lib/services/auth';
    import { Button } from "$lib/components/ui/button";
    import * as Sheet from "$lib/components/ui/sheet";

    onMount(() => {
        if (!authService.isAuthenticated()) {
            goto('/login');
        }
    });

    let isMobileMenuOpen = false;

    const navigation = [
        { 
            name: 'Dashboard', 
            href: '/dashboard',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>`
        },
        { 
            name: 'Medical Records', 
            href: '/medical-records',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="M9 15h6"/></svg>`
        },
        { 
            name: 'Patients', 
            href: '/patients',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
        },
        { 
            name: 'Doctors', 
            href: '/doctors',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M12 3v4"/><path d="M10 5h4"/></svg>`
        },
        { 
            name: 'Appointments', 
            href: '/appointments',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`
        }
    ];
</script>

<div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <div class="hidden lg:flex lg:flex-shrink-0">
        <div class="flex w-64 flex-col">
            <div class="flex min-h-0 flex-1 flex-col border-r bg-white">
                <div class="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                    <div class="flex flex-shrink-0 items-center px-4">
                        <a href="/dashboard" class="text-xl font-bold text-primary">
                            Shinaion Clinic
                        </a>
                    </div>
                    <nav class="mt-8 flex-1 space-y-1 px-2">
                        {#each navigation as item}
                            <a
                                href={item.href}
                                class={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                    $page.url.pathname === item.href
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:bg-muted'
                                }`}
                            >
                                {@html item.icon}
                                <span class="ml-3">{item.name}</span>
                            </a>
                        {/each}
                    </nav>
                </div>
                <div class="flex flex-shrink-0 border-t p-4">
                    <Button variant="outline" class="w-full" onclick={() => authService.logout()}>
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    </div>

    <!-- Mobile menu -->
    <div class="lg:hidden">
        <Sheet.Root bind:open={isMobileMenuOpen}>
            <Sheet.Trigger>
                <Button variant="outline" size="icon" class="fixed left-4 top-4" onclick={() => isMobileMenuOpen = true}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="3" x2="21" y1="6" y2="6"/>
                        <line x1="3" x2="21" y1="12" y2="12"/>
                        <line x1="3" x2="21" y1="18" y2="18"/>
                    </svg>
                </Button>
            </Sheet.Trigger>
            <Sheet.Content side="left" class="w-[300px] sm:w-[400px]">
                <nav class="flex flex-col gap-4">
                    <div class="px-4 py-6">
                        <h2 class="mb-2 px-2 text-lg font-semibold tracking-tight">
                            Menu
                        </h2>
                        {#each navigation as item}
                            <a
                                href={item.href}
                                class={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                    $page.url.pathname === item.href
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:bg-muted'
                                }`}
                            >
                                {@html item.icon}
                                <span class="ml-3">{item.name}</span>
                            </a>
                        {/each}
                    </div>
                </nav>
            </Sheet.Content>
        </Sheet.Root>
    </div>

    <!-- Main content -->
    <div class="flex flex-1 flex-col overflow-hidden">
        <main class="flex-1 overflow-y-auto bg-muted/20">
            <div class="py-6">
                <div class="mx-auto px-4 sm:px-6 lg:px-8">
                    <slot />
                </div>
            </div>
        </main>
    </div>
</div>
