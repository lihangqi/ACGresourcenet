<template>
	<footer class="foot text-center" :style="this.style">
		<p>本站内容来源分别由网络爬虫在目标网站爬取</p>
		<p>{{`2018 - ${(new Date()).getFullYear()} ACG资源网`}}</p>
	</footer>
</template>

<style scoped>
	@import '../assets/style/style.css';
</style>

<script>
	export default {
		data() {
			return {
				style: {},
				index: 0
			}
		},
		created() {
			
		},
		methods: {
			
		}
	}
</script>