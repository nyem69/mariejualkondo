<script>
  import "../app.css";

	import { preparePageTransition } from '$lib/page-transition';
	preparePageTransition();

</script>


<main class="text-slate-700 max-w-4xl m-auto">
	<slot />
</main>



