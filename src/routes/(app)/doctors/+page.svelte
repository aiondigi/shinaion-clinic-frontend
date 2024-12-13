<!-- src/routes/(app)/doctors/+page.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import doctorService from '$lib/services/doctor';
    import type { Doctor } from '$lib/types';
    import { toast } from "svelte-sonner";
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import * as Table from "$lib/components/ui/table";

    let doctors: Doctor[] = [];
    let loading = true;
    let searchQuery = '';

    onMount(async () => {
        try {
            const data = await doctorService.getDoctors();
            doctors = data;
        } catch (error) {
            toast.error('Failed to load doctors');
        } finally {
            loading = false;
        }
    });

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this doctor?')) return;

        try {
            await doctorService.deleteDoctor(id);
            doctors = doctors.filter(d => d.id !== id);
            toast.success('Doctor deleted successfully');
        } catch (error) {
            toast.error('Failed to delete doctor');
        }
    }

    $: filteredDoctors = doctors.filter(doctor =>
        doctor.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doctor.specialization?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );
</script>

<div class="space-y-6">
    <header class="border-b pb-4">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-semibold">Doctors</h1>
                <p class="text-muted-foreground">A list of all doctors in the clinic</p>
            </div>
            <Button onclick={() => goto('/doctors/new')}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="mr-2 h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                    <path d="M12 3v4"/>
                    <path d="M10 5h4"/>
                </svg>
                Add doctor
            </Button>
        </div>
    </header>

    <Card.Root>
        <Card.Header>
            <div class="flex items-center gap-4">
                <Input
                    type="text"
                    placeholder="Search doctors..."
                    bind:value={searchQuery}
                />
            </div>
        </Card.Header>
        <Card.Content>
            {#if loading}
                <div class="flex items-center justify-center py-8">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            {:else if filteredDoctors.length === 0}
                <div class="flex flex-col items-center justify-center py-8 text-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-12 w-12 text-muted-foreground/50 mb-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="8" y1="12" x2="16" y2="12"/>
                    </svg>
                    <p class="text-xl font-medium">No doctors found</p>
                    <p class="text-muted-foreground">Try adjusting your search query</p>
                </div>
            {:else}
                <div class="relative overflow-x-auto">
                    <Table.Root>
                        <Table.Header>
                            <Table.Row>
                                <Table.Head>Name</Table.Head>
                                <Table.Head>Specialization</Table.Head>
                                <Table.Head>License</Table.Head>
                                <Table.Head>Contact</Table.Head>
                                <Table.Head class="text-right">Actions</Table.Head>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {#each filteredDoctors as doctor}
                                <Table.Row>
                                    <Table.Cell class="font-medium">{doctor.full_name}</Table.Cell>
                                    <Table.Cell>{doctor.specialization || '-'}</Table.Cell>
                                    <Table.Cell>{doctor.license_number}</Table.Cell>
                                    <Table.Cell>{doctor.contact_number || '-'}</Table.Cell>
                                    <Table.Cell class="text-right">
                                        <div class="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onclick={() => goto(`/doctors/${doctor.id}`)}
                                            >
                                                View
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onclick={() => goto(`/doctors/${doctor.id}/edit`)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                class="text-destructive"
                                                onclick={() => handleDelete(doctor.id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            {/each}
                        </Table.Body>
                    </Table.Root>
                </div>
            {/if}
        </Card.Content>
    </Card.Root>
</div>
