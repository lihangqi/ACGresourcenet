<template>
	<div class="data">
		<!-- banner -->
		<banner/>
		<!-- banner end -->
		<!-- news -->
		<section v-for="(type, key) in data" :key="key" class="data-wrap row">
			<!-- title -->
			<h3 class="data-title text-center">
				<strong class="data-title-text">{{type.name}}</strong>
			</h3>
			<!-- title end -->
			<!-- con -->
			<data_item v-for="(item, index) in type.data" :title="item.title" :img="item.img" :path="'/detail/' + key + '/' + strifyUrl(item.href) + '/' + item.title" :key="index" />
			<!-- con end -->
		</section>
		<!-- news end -->
		<!-- scroll to top -->
		<scrollToTop />
		<!-- scroll to top end -->
	</div>
</template>

<style scoped>
	@import '../assets/style/style.css';
	@import '../assets/style/public.css';

	/*
	* 标题
	*/
	.data-title-text {
		position: relative;
	}

	.data-title-text:before,
	.data-title-text:after {
		content: "";
		position: absolute;
		top: 16px;
		left: -310px;
		width: 300px;
		height: 1px;
		background: #333;
	}

	.data-title-text:after {
		left: auto;
		right: -310px;
	}

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

	@media only screen and (max-width: 768px) {
		.data-title-text:before,
		.data-title-text:after {
			left: -110px;
			width: 100px;
		}

		.data-title-text:after {
			left: auto;
			right: -110px;
		}
	}
</style>

<script>
	import dialog from '@/assets/script/dialog'
	import banner from './banner'
	import item from './item'
	import scrollToTop from './scrollToTop'

	export default {
		data() {
			return {
				banner: '',
				data: {
					news: {
						name: '资讯',
						data: []
					},
					bangumi: {
						name: '新番',
						data: []
					},
					anime: {
						name: '动漫',
						data: []
					},
					music: {
						name: '音乐',
						data: []
					},
					image: {
						name: '图片',
						data: []
					},
					game: {
						name: '游戏',
						data: []
					}
				},
				index: 0,
				load: null
			}
		},
		created() {
			this.init();
		},
		components: {
			banner,
			data_item: item,
			scrollToTop
		},
		methods: {
			init() {
				this.load = dialog.loading();

				this.loadData('news');
				this.loadData('bangumi');
				this.loadData('anime');
				this.loadData('music');
				this.loadData('image');
				this.loadData('game');
			},
			setBanner(html) {
				this.$children[0].images = html;
				this.$children[0].init();
			},
			loadData(type) {
				this.$http.post('/php/index.php?act=update', {
					type
				}, { emulateJSON: true}).then((res) => {
					try {
						this.data[type].data = res.body.splice(0, 20);
						if (type === 'image') {
							this.getBanner(this.data[type].data[0].href);
						}

						this.index ++;

						if (this.index >= Object.keys(this.data).length) {
							this.load.hide();
						}

					} catch(e) {}
				});
			},
			strifyUrl(url) {
				return url.replace(/\//ig, '%2f');
			},
			getBanner(url) {
				this.$http.post('/php/index.php?act=get', {
					type: 'image',
					url
				}, { emulateJSON: true}).then((res) => {
					this.setBanner(res.body.content);
				});
			}
		}
	}
</script>