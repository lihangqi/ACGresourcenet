<template>
	<div class="search-box">
		<form class="search-form inline" action="javascript:void(0)">
			<input type="text" class="search-text" v-model="$parent.keyword" @keydown.13.prevent="runSearch">
			<button class="serch-btn" @click="runSearch">
				<i class="fa fa-search"></i>
				<span>搜索</span>
			</button>
		</form>
	</div>
</template>

<style scoped>
	input,
	button {
		outline: none;
	}

	.search-box {
		padding: 20px 0;
	}

	.search-text,
	.serch-btn {
		padding: 3px 5px;
		width: 50%;
		height: 35px;
		border: 1px solid rgba(0, 0, 0, .2);
		background: #fff;
	}

	.serch-btn {
		padding: 3px 10px;
		width: auto;
	}
</style>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			runSearch(e) {
				this.$parent.search();
			}
		}
	}
</script>