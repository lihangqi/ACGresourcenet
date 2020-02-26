<template>
	<section class="dialog" @click.prevent.stop="destory">
		<img :src="url" class="dialog-image-img">
	</section>
</template>

<style scoped>
	@import '../style.css';

	.dialog-image-img {
		position: relative;
		display: block;
		margin: 0 auto;
		border-radius: 8px;
		padding: 10px;
		background: #fff;
		border: 1px solid rgba(0, 0, 0, .2);
		transform: scale(0);
	}
</style>

<script>
	export default {
		props: ['url'],
		created() {
			$(() => {
				let $img = $('.dialog-image-img'),
					height = $img.height(),
					winH = window.innerHeight;

				this.$img = $img;

				$img.css({
					top: (winH - height) / 2 + 'px'
				});

				$img.animate({
					scale: 1
				}, {
					step: (now) => {
						$img.css({
							transform: `scale(${now})`
						});
					}
				});
			});
		},
		methods: {
			destory: function () {
				this.$img.animate({
					scale: 0
				}, {
					step: (now) => {
						this.$img.css({
							transform: `scale(${now})`
						});
					},
					done: () => {
						document.body.removeChild(this.$root.$el);
						this.$root.$destroy();
					}
				});
			}
		}
	}
</script>