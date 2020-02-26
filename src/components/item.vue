<template>
	<!-- con -->
	<article class="data-item col-lg-3 col-md-4 col-sm-6 col-xs-12 text-center">
		<router-link :to="path" class="data-item-link" :title="title" target="_blank">
			<figure class="data-item-img-wrap inline">
				<img :src="img" class="data-item-img" :alt="img">
			</figure>
			<figcaption class="data-item-title">
				<h4 class="data-item-title-h"><strong>{{title}}</strong></h4>
			</figcaption>
		</router-link>
	</article>
	<!-- con end -->
</template>

<style scoped>
	@import '../assets/style/public.css';
	
	/*
	* 内容显示模块
	*/
	.data-item {
		margin: 20px 0;
	}

	.data-item-img-wrap {
		overflow: hidden;
		width: 250px;
		height: 250px;
	}

	.data-item-img {
		height: 100%;
	}

	.data-item-link {
		color: #333;
		text-decoration: none;
	}

	.data-item-title-h {
		padding: 10px 0;
		margin: 10px auto;
		overflow: hidden;
		max-width: 90%;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
</style>

<script>
	export default {
		props: ['img', 'title', 'path']
	}
</script>