<template>
	<div class="app">
		<site_top />
		<site_main />
		<site_bottom />
	</div>
</template>

<style scoped>
	.app {
		overflow: hidden;
	}
</style>

<script>
	import top from './top'
	import main from './main'
	import bottom from './bottom'

	export default {
		data() {
			return {

			}
		},
		created() {

		},
		components: {
			site_top: top,
			site_main: main,
			site_bottom: bottom
		}
	}
</script>