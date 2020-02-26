<template>
	<div class="dialog">
		<!-- 容器 -->
		<section class="wrap" ref="wrap">
			<!-- 标题 -->
			<header class="dialog-title">
				<strong>{{title}}</strong>
			</header>
			<!-- 标题 end -->
			<!-- 内容 -->
			<article class="dialog-content">
				{{content}}
			</article>
			<!-- 内容 end -->
			<!-- 关闭按钮 -->
			<button class="dialog-btn" @click.prevent.stop="ok">确认</button>
			<button class="dialog-btn" @click.prevent.stop="cancel">取消</button>
			<!-- 关闭按钮 end -->
		</section>
		<!-- 容器 end -->
	</div>
</template>

<script>
	export default {
		name: 'confirm',
		data() {
			return {
				$el: null
			}
		},
		created() {
			$(() => {
				let $el = $(this.$refs.wrap),
					height = $el.height(),
					winHeight = window.innerHeight;

				$el.css({
					display: 'block',
					position: 'relative',
					top: ((winHeight - height) / 2) + 'px',
					transform: 'scale(0)'
				});

				$el.animate({
					scale: 1
				}, {
					step: (now) => {
						$el.css({
							transform: `scale(${now})`
						})
					}
				});
			});
		},
		props: ['content', 'title', 'ok', 'cancel']
	}
</script>

<style scoped>
	@import '../style.css';
</style>