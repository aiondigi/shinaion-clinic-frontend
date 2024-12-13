<!-- src/routes/(auth)/login/+page.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import authService from '$lib/services/auth';
	import { Toaster } from "$lib/components/ui/sonner/index.js";
    import { toast } from "svelte-sonner";
    
	let email = '';
	let password = '';
	let loading = false;

	async function handleSubmit() {
		try {
			loading = true;
			await authService.login({ email, password });
			toast.success('Login successful!');
			await goto('/dashboard');
		} catch (error: any) {
			toast.error(error.response?.data?.message || 'Login failed');
		} finally {
			loading = false;
		}
	}
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
</script>

<form on:submit|preventDefault={handleSubmit}>
	<div class="flex h-screen w-full items-center justify-center px-4">
		<Card.Root class="mx-auto w-[350px] max-w-sm">
			<Card.Header>
				<Card.Title class="text-2xl">Login</Card.Title>
				<Card.Description>Enter your email below to login to your account</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="grid gap-4">
					<div class="grid gap-2">
						<Label for="email">Email</Label>
						<Input
							id="email"
							bind:value={email}
							type="email"
							placeholder="m@example.com"
							required
						/>
					</div>
					<div class="grid gap-2">
						<div class="flex items-center">
							<Label for="password">Password</Label>
							<a href="##" class="ml-auto inline-block text-sm underline">
								Forgot your password?
							</a>
						</div>
						<Input id="password" bind:value={password} type="password" required />
					</div>
					<Button type="submit" class="w-full">Login</Button>
					<Button variant="outline" class="w-full">Login with Google</Button>
				</div>
				<div class="mt-4 text-center text-sm">
					Don't have an account?
					<a href="##" class="underline"> Sign up </a>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</form>

<Toaster />
