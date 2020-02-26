<template>
	<header class="head">
		<!-- logo -->
		<h1 class="logo-wrap">
			<router-link to="/" class="logo-link">
				<img src="../assets/images/logo-black.png" class="logo-img">
				<strong class="logo-title">ACG资源网</strong>
			</router-link>
		</h1>
		<!-- logo end -->
		<!-- menu btn -->
		<button class="menu-btn" @click="navCtl">
			<i :class="'fa fa-' + (this.nav_is_show ? 'close' : 'bars')"></i>
		</button>
		<!-- menu btn end -->
		<!-- menu wrap -->
		<nav class="menu-wrap">
			<router-link v-for="(nav_item, i) in nav" class="menu-nav-item" :to="nav_item.path" :key="i"><strong>{{nav_item.name}}</strong></router-link>
		</nav>
		<!-- menu wrap end -->
	</header>
</template>

<style scoped>
	@import '../assets/style/style.css';
	@import '../assets/style/public.css';
</style>

<script>
	export default {
		data() {
			return {
				// 导航列表
				nav: [
					{
						path: '/',
						name: '首页'
					},
					{
						path: '/news',
						name: '资讯'
					},
					{
						path: '/bangumi',
						name: '新番'
					},
					{
						path: '/anime',
						name: '动漫'
					},
					{
						path: '/music',
						name: '音乐'
					},
					{
						path: '/image',
						name: '图片'
					},
					{
						path: '/game',
						name: '游戏'
					}
				],
				// 当前导航是否显示的flag
				nav_is_show: false
			}
		},
		created() {
			$(() => {
				this.init();
			});
		},
		methods: {
			init() {
				this.$nav_wrap = $('.menu-wrap'); // 导航面板
				this.$menu_btn = $('.menu-btn'); // 导航按钮

				this.initNavWrap(); // 设置导航面板的定位
			},
			// 响应点击事件,按钮导航的显示与隐藏
			navCtl (e) {
				if (!this.nav_is_show) {
					this.showNav();
				} else {
					this.hideNav();
				}

				this.changeBtn();
			},
			// 显示导航
			showNav() {
				this.$nav_wrap.css('display', 'block');

				this.$nav_wrap.animate({
					opacity: 1,
					right: 0
				}, {
					done: () => {
						this.nav_is_show = true;
					}
				});
			},
			// 设置导航面板的定位
			initNavWrap() {
				let width = parseFloat(this.$nav_wrap.css('width'));

				this.$nav_wrap.css({
					right: `-${width}px`
				});

				this.nav_width = width;
			},
			// 隐藏导航
			hideNav() {
				this.$nav_wrap.animate({
					opacity: 0,
					right: -this.nav_width
				},
				{
					done: () => {
						this.nav_is_show = false;
					}
				});
			},
			// 修改按钮icon
			changeBtn() {
				this.$menu_btn.animate({
					scale: 2
				},{
					step: (now) => {
						this.$menu_btn.css('transform', `scale(${2 - now})`);
					},
					done: () => {
						this.$menu_btn.animate({
							scale: 2
						},{
							step: (now) => {
								this.$menu_btn.css('transform', `scale(${now})`);
							}
						});
					}
				});
			}
		}
	}
</script>