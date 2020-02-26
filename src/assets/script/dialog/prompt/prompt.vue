<template>
	<div class="dialog">
		<!-- 容器 -->
		<section class="wrap" ref="wrap">
			<!-- 标题 -->
			<header class="dialog-title">
				<strong>输入框</strong>
			</header>
			<!-- 标题 end -->
			<!-- 内容 -->
			<article class="dialog-content">
				<label class="dialog-prompt-title">
					{{title}}
				</label>
				<input type="text" class="dialog-prompt-input" :value="def" ref="val">
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
		props: ['def', 'title', 'cancel'],
		methods: {
			ok: function () {
				let val = this.$refs.val.value;

				this.$root.ok(val);
			}
		}
	}
</script>

<style scoped>
	@import '../style.css';

	.dialog-prompt-title {
		font-size: 16px;
	}

	.dialog-prompt-input {
		padding: 2px 5px;
		font-size: 14px;
		min-height: 25px;
	}
</style>