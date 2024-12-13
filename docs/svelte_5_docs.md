# $state

The $state rune allows you to create reactive state, which means that your UI reacts when it changes.

<script>
	let count = $state(0);
</script>

<button onclick={() => count++}>
	clicks: {count}
</button>
Unlike other frameworks you may have encountered, there is no API for interacting with state — count is just a number, rather than an object or a function, and you can update it like you would update any other variable.

Deep state
If $state is used with an array or a simple object, the result is a deeply reactive state proxy. Proxies allow Svelte to run code when you read or write properties, including via methods like array.push(...), triggering granular updates.

Classes like Set and Map will not be proxied, but Svelte provides reactive implementations for various built-ins like these that can be imported from svelte/reactivity.

State is proxified recursively until Svelte finds something other than an array or simple object. In a case like this...


let todos = $state([
	{
		done: false,
		text: 'add more todos'
	}
]);
...modifying an individual todo’s property will trigger updates to anything in your UI that depends on that specific property:


todos[0].done = !todos[0].done;
If you push a new object to the array, it will also be proxified:


todos.push({
	done: false,
	text: 'eat lunch'
});
When you update properties of proxies, the original object is not mutated.

Note that if you destructure a reactive value, the references are not reactive — as in normal JavaScript, they are evaluated at the point of destructuring:


let { done, text } = todos[0];

// this will not affect the value of `done`
todos[0].done = !todos[0].done;
Classes
You can also use $state in class fields (whether public or private):


class Todo {
	done = $state(false);
	text = $state();

	constructor(text) {
		this.text = text;
	}

	reset() {
		this.text = '';
		this.done = false;
	}
}
The compiler transforms done and text into get / set methods on the class prototype referencing private fields. This means the properties are not enumerable.

When calling methods in JavaScript, the value of this matters. This won’t work, because this inside the reset method will be the <button> rather than the Todo:


<button onclick={todo.reset}>
	reset
</button>
You can either use an inline function...


<button onclick={() => todo.reset()}>
	reset
</button>
...or use an arrow function in the class definition:


class Todo {
	done = $state(false);
	text = $state();

	constructor(text) {
		this.text = text;
	}

	reset = () => {
		this.text = '';
		this.done = false;
	}
}
$state.raw
In cases where you don’t want objects and arrays to be deeply reactive you can use $state.raw.

State declared with $state.raw cannot be mutated; it can only be reassigned. In other words, rather than assigning to a property of an object, or using an array method like push, replace the object or array altogether if you’d like to update it:


let person = $state.raw({
	name: 'Heraclitus',
	age: 49
});

// this will have no effect
person.age += 1;

// this will work, because we're creating a new person
person = {
	name: 'Heraclitus',
	age: 50
};
This can improve performance with large arrays and objects that you weren’t planning to mutate anyway, since it avoids the cost of making them reactive. Note that raw state can contain reactive state (for example, a raw array of reactive objects).

$state.snapshot
To take a static snapshot of a deeply reactive $state proxy, use $state.snapshot:


<script>
	let counter = $state({ count: 0 });

	function onclick() {
		// Will log `{ count: ... }` rather than `Proxy { ... }`
		console.log($state.snapshot(counter));
	}
</script>
This is handy when you want to pass some state to an external library or API that doesn’t expect a proxy, such as structuredClone.

Passing state into functions
JavaScript is a pass-by-value language — when you call a function, the arguments are the values rather than the variables. In other words:

index

function add(a: number, b: number) {
	return a + b;
}

let a = 1;
let b = 2;
let total = add(a, b);
console.log(total); // 3

a = 3;
b = 4;
console.log(total); // still 3!
If add wanted to have access to the current values of a and b, and to return the current total value, you would need to use functions instead:

index

function add(getA: () => number, getB: () => number) {
	return () => getA() + getB();
}

let a = 1;
let b = 2;
let total = add(() => a, () => b);
console.log(total()); // 3

a = 3;
b = 4;
console.log(total()); // 7
State in Svelte is no different — when you reference something declared with the $state rune...


let a = $state(1);
let b = $state(2);
...you’re accessing its current value.

Note that ‘functions’ is broad — it encompasses properties of proxies and get/set properties...

index

function add(input: { a: number, b: number }) {
	return {
		get value() {
			return input.a + input.b;
		}
	};
}

let input = $state({ a: 1, b: 2 });
let total = add(input);
console.log(total.value); // 3

input.a = 3;
input.b = 4;
console.log(total.value); // 7
...though if you find yourself writing code like that, consider using classes instead.

# $derived

derived state is declared with the $derived rune:
<script>
	let count = $state(0);
	let doubled = $derived(count * 2);
</script>

<button onclick={() => count++}>
	{doubled}
</button>

<p>{count} doubled is {doubled}</p>
The expression inside $derived(...) should be free of side-effects. Svelte will disallow state changes (e.g. count++) inside derived expressions.

As with $state, you can mark class fields as $derived.

Code in Svelte components is only executed once at creation. Without the $derived rune, doubled would maintain its original value even when count changes.

$derived.by
Sometimes you need to create complex derivations that don’t fit inside a short expression. In these cases, you can use $derived.by which accepts a function as its argument.


<script>
	let numbers = $state([1, 2, 3]);
	let total = $derived.by(() => {
		let total = 0;
		for (const n of numbers) {
			total += n;
		}
		return total;
	});
</script>

<button onclick={() => numbers.push(numbers.length + 1)}>
	{numbers.join(' + ')} = {total}
</button>
In essence, $derived(expression) is equivalent to $derived.by(() => expression).

Understanding dependencies
Anything read synchronously inside the $derived expression (or $derived.by function body) is considered a dependency of the derived state. When the state changes, the derived will be marked as dirty and recalculated when it is next read.

To exempt a piece of state from being treated as a dependency, use untrack.