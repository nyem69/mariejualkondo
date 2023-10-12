<script>
  import "../app.css";

	import { preparePageTransition } from '$lib/page-transition';
	preparePageTransition();

</script>


<main class="text-slate-700 m-auto">
	<slot />
</main>



