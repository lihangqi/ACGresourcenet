<template>
	<section class="dialog">
		<div class="load-wrap">
			<div class="circle-outer">
			</div>
			<div class="circle-inner"></div>
		</div>
	</section>
</template>

<style scoped>
	@import '../style.css';

	/* 设置容器 */
	.load-wrap {
		position: relative;
		top: calc(50% - 50px);
		left: calc(50% - 50px);
		width: 100px;
		height: 100px;
		box-shadow: 0px 0px 10px 3px rgba(0, 0, 0, .4);
		border-radius: 50%;
	}

	/* 设置两个圆的基本样式 */
	.circle-outer,
	.circle-inner {
		position: absolute;
		width: calc(100% - 20px);
		height: calc(100% - 20px);
		border: 10px solid #fff;
		border-radius: 50%;
	}

	/* 分别设置圆的边框和动画 */
	.circle-outer {
		border-left-color: transparent;
		border-right-color: transparent;
		-webkit-animation: rotate_one ease 1s infinite;
		animation: rotate_one ease 1s infinite;
	}

	.circle-inner {
		top: 10px;
		left: 10px;
		width: 60px;
		height: 60px;
		border-top-color: transparent;
		border-bottom-color: transparent;
		box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, .4);
		-webkit-animation: rotate_two 2s ease-in-out infinite;
		animation: rotate_two 2s ease-in-out infinite;
	}

	@-webkit-keyframes rotate_one {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes rotate_one {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@-webkit-keyframes rotate_two {
		from {
			transform: rotate(360deg);
		}
		to {
			transform: rotate(0deg);
		}
	}

	@keyframes rotate_two {
		from {
			transform: rotate(360deg);
		}
		to {
			transform: rotate(0deg);
		}
	}
</style>