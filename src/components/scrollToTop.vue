<template>
	<button class="scroll-to-top" title="回到顶部" @click="toTop">
		<i class="fa fa-arrow-up"></i>
	</button>
</template>

<style scoped>
	.scroll-to-top {
		display: none;
		position: fixed;
		right: 20px;
		bottom: 40px;
		width: 40px;
		border: 1px solid rgba(0, 0, 0, .2);
		outline: none;
		background: #fff;
		line-height: 40px;
	}
</style>

<script>
	export default {
		data() {
			return {
				
			}
		},
		created() {

			$(() => {
				this.$btn = $('.scroll-to-top');
				$(window).bind('scroll', this.listen.bind(this));
			});
		},
		methods: {
			listen(e) {
				let now = window.scrollY,
					winH = window.innerHeight;

				if (now > winH) {
					this.$btn.show();
				} else {
					this.$btn.hide();
				}
			},
			toTop() {
				let val = parseInt(window.scrollY);

				this.$btn.animate({
					translate: val
				}, {
					step: (now) => {
						window.scrollTo(0, val - now);
					}
				});
			}
		}
	}
</script>