<template>
	<div class="data-wrap row text-center">
		<div class="clearfix">
			<item v-for="(item, index) in data" :key="index" :img="item.img" :title="item.title" :path="'/detail/bangumi/' + strifyUrl(item.href) + '/' + item.title" />
		</div>
		<scrollToTop />

		<!-- pagination -->
		<div>
			<select class="page inline" v-model="value" @change="search">
				<option v-for="(item, index) in page" :key="index" :value="item.value">{{item.title}}</option>
			</select>
		</div>
		<!-- pagination end -->
	</div>
</template>

<style scoped>
	@import '../assets/style/style.css';
	@import '../assets/style/public.css';

	.page {
		margin: 20px auto;
		height: 35px;
		border: 1px solid rgba(0, 0, 0, .2);
		outline: none;
		background: #fff;
	}
</style>

<script>
	import search from './search'
	import item from './item'
	import scrollToTop from './scrollToTop'
	import dialog from '@/assets/script/dialog'

	export default {
		data() {
			return {
				data: [],
				page: [],
				value: ''
			}
		},
		created() {
			this.loadData();
			this.fillPage();
		},
		components: {
			item,
			scrollToTop
		},
		methods: {
			loadData() {
				let load = dialog.loading();

				this.$http.post('/php/index.php?act=update', {
					type: 'bangumi'
				}, { emulateJSON: true }).then((res) => {
					try {
						this.data = res.body;
					} catch(e) {}

					load.hide();
				});
			},
			search(e) {
				let [year, month] = [...e.target.value.split('-')],
					load = dialog.loading();

				this.$http.post('/php/index.php?act=search', {
					type: 'bangumi',
					key: year,
					page: month
				}, { emulateJSON: true }).then((res) => {
					try {
						if (res.body.length < 1 || this.data[0].title === res.body[0].title) {
							dialog.alert('已经到底了!!');
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
			fillPage() {
				let date = new Date(),
					min = 1965,
					max = date.getFullYear() + 2,
					month = date.getMonth(),
					data = [],
					list = {
						'十': 10,
						'七': 7,
						'四': 4,
						'一': 1
					};

				while (max >= min) {
					for (let mon in list) {
						data.push({
							title: `${max}年${mon}月番`,
							value: `${max}-${list[mon]}`
						})
					}

					max --;
				}

				this.page = data;
				this.value = `${date.getFullYear()}-${this.getMonth(month)}`;
			},
			getMonth(mon) {
				switch(mon) {
					case 1:
					case 2:
					case 3:
						return 1;
						break;
					case 4:
					case 5:
					case 6:
						return 4;
						break;
					case 7:
					case 8:
					case 9:
						return 7;
						break;
					case 10:
					case 11:
					case 12:
						return 10;
						break;
				}
			}
		}
	}
</script>