<template>
	<div class="row data-wrap row text-center">
		<!-- search -->
		<search />
		<!-- search end -->
		<!-- con -->
		<div class="clearfix">
			<item v-for="(item, index) in data" :key="index" :img="item.img" :title="item.title" :path="'/detail/' + type + '/' + strifyUrl(item.href) + '/' + item.title" />
		</div>
		<!-- con end -->
		<!-- pagination -->
		<ul class="pagination" v-if="is_search">
			<li><a href="javascript:void(0)" @click="changePage" data-index="1">&laquo;</a></li>
			<li v-for="index in max_page" :class="(index + (page - 1)) === (page - 0) && 'active'"><a href="javascript:void(0)" @click="changePage" :data-index="index + (page - 1)">{{index + (page - 1)}}</a></li>
		</ul>
		<!-- pagination end -->
		<!-- 回到顶部 -->
		<scrollToTop />
		<!-- 回到顶部 end -->
	</div>
</template>

<style scoped>
	@import '../assets/style/style.css';
	@import '../assets/style/public.css';
</style>

<script>
	import search from './search'
	import item from './item'
	import scrollToTop from './scrollToTop'
	import dialog from '@/assets/script/dialog'

	export default {
		data() {
			return {
				keyword: '',
				page: 1,
				data: [],
				max_page: 5,
				is_search: false
			}
		},
		created() {
			this.loadData();
		},
		methods: {
			loadData() {
				let load = dialog.loading();

				this.$http.post('/php/index.php?act=update', {
					type: this.type
				}, { emulateJSON: true }).then((res) => {
					try {
						this.data = res.body;
					} catch(e) {}

					load.hide();
				});
			},
			search(key, page = 1) {
				this.is_search = true;
				let load = dialog.loading();

				this.$http.post('/php/index.php?act=search', {
					type: this.type,
					key: this.keyword,
					page: this.page
				}, { emulateJSON: true }).then((res) => {
					try {
						if (res.body.length < 1 || this.data[0].title === res.body[0].title) {
							dialog.alert('已经到底了!!');
							this.max_page = parseInt(this.page);
						} else {
							this.data = res.body;
						}

					} catch(e) {}

					load.hide();
					window.scrollTo(0, 0);
				});
			},
			strifyUrl(url) {
				return url.replace(/\//ig, '%2f');
			},
			changePage(e) {
				let index = e.target.dataset.index;
				this.search(this.keyword, index);
				this.page = index;
			}
		},
		components: {
			search,
			item,
			scrollToTop
		},
		props: ['type']
	}
</script>