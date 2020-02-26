<template>
	<div class="banner">
		<!-- images -->
		<figure class="banner-img-wrap" v-html="images"></figure>
		<!-- images end -->
		<!-- control -->
		<div class="banner-ctl">
			<button class="banner-btn banner-btn-left">
				<i class="fa fa-angle-left"></i>
			</button>
			<button class="banner-btn banner-btn-right">
				<i class="fa fa-angle-right"></i>
			</button>
			<div class="progress-wrap">
				<div class="progress-track"></div>
			</div>
		</div>
		<!-- control end -->
	</div>
</template>

<style scoped>
	.banner {
		position: relative;
		overflow: hidden;
	}

	.banner-img-wrap {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		white-space: nowrap;
	}

	.banner-btn {
		display: none;
		position: absolute;
		top: calc(50% - 20px);
		width: 40px;
		height: 40px;
		outline: none;
		border-radius: 50%;
		border: 1px solid rgba(0, 0, 0, .2);
		background: rgba(255, 255, 255, .4);
		color: #333;
		font-size: 20px;
	}

	.banner-btn-left {
		left: 10px;
	}

	.banner-btn-right {
		right: 10px;
	}

	.progress-wrap {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		height: 10px;
		background: rgba(0, 0, 0, .2);
	}

	.progress-track {
		width: 10%;
		height: 100%;
		background: #41d0fa;
		opacity: .5;
	}
</style>

<script>
	export default {
		data() {
			return {
				images: '', // 一组图片html
				index: 0, // 按钮切换下标
				wait: false // 按钮切换是否需要等待上一次移动结束
			}
		},
		created() {
			$(() => {
				this.$wrap = $('.banner');
				this.$wrap = $('.banner');
				this.$panel = $('.banner-img-wrap');
				this.$progress_track = $('.progress-track');
				this.$left_btn = $('.banner-btn-left');
				this.$right_btn = $('.banner-btn-right');
				this.init();
			});
		},
		methods: {
			init() {
				if (!this.images) {
					this.$wrap.hide();
					return false;
				} else {
					this.$wrap.show();
				}

				this.getDom();

				// 初始化banner布局
				this.initBanner();
				/*
				* 绑定事件
				*/
				this.$left_btn.click(this.backPanel.bind(this));
				this.$right_btn.click(this.forwardPanel.bind(this));
				this.$wrap.mouseenter(this.showBtn.bind(this));
				this.$wrap.mouseleave(this.hideBtn.bind(this));
				this.$panel.mousedown(this.moveStart.bind(this));
				this.$panel.mouseup(this.moveEnd.bind(this));
				this.$panel.bind('touchstart', this.moveStart.bind(this));
				this.$panel.bind('touchend', this.moveEnd.bind(this));
			},
			/*
			* 获取dom
			*/
			getDom() {
				this.$imgs = this.$panel.find('img');

				if (this.$imgs.length < 1) {
					setTimeout(this.getDom.bind(this), 8);
				} else {
					this.$imgs.bind('load', this.resizeImage.bind(this));
				}
				
			},
			// 重置图片大小
			resizeImage(e) {
				let panel_width = parseFloat(this.$panel.width()),
					wrap_panel = parseFloat(this.$wrap.width()),
					diff = (wrap_panel / panel_width) * 100;

				$(e.currentTarget).css('height', `${this.height}px`);
				$(e.currentTarget).attr('draggable', false);

				this.$progress_track.css('width', `${diff}%`);
			},
			// 初始化banner布局
			initBanner() {
				let win_width = window.innerWidth,
					height = win_width > 768 ? 500 : (win_width > 500 ? 300 : 200);

				this.$wrap.css('height', `${height}px`);
				this.height = height;
			},
			// 按钮后称一张图片
			backPanel() {
				if (this.wait) {
					return false;
				} else {
					this.wait = true;
				}

				this.index ++;
				let width = this.$imgs.eq(this.index).width(),
					left = parseFloat(this.$panel.css('left'));

				if (this.index >= this.$imgs.length) {
					this.index = this.$imgs.length;
					this.wait = false;
					return false;
				}

				this.$panel.animate({
					left: left - width
				},
				{
					done: () => {
						let panel_width = this.$panel.width(),
							wrap_width = this.$wrap.width(),
							diff = panel_width - wrap_width;

						if (this.index === (this.$imgs.length - 1)) {
							this.$panel.css('left', `-${diff}px`);
						}

						this.wait = false;
						this.changeProgressValue();
					}
				});
			},
			// 按钮前称一张图片
			forwardPanel() {
				if (this.wait) {
					return false;
				} else {
					this.wait = true;
				}

				this.index --;
				
				if (this.index < 0) {
					this.index = 0;
					this.wait = false;
					return false;
				}

				let width = this.$imgs.eq(this.index).width(),
					left = parseFloat(this.$panel.css('left'));

				this.$panel.animate({
					left: left + width
				}, {
					done: () => {
						this.wait = false;

						if (this.index === 0) {
							this.$panel.css('left', '0px');
						}
						this.changeProgressValue();
					}
				});
			},
			// 鼠标移入显示按钮
			showBtn() {
				this.$left_btn.show();
				this.$right_btn.show();
			},
			// 鼠标移出隐藏按钮
			hideBtn() {
				this.$left_btn.hide();
				this.$right_btn.hide();
			},
			// 修改当前显示进度条
			changeProgressValue() {
				let wrap_width = this.$wrap.width(),
					panel_width = this.$panel.width(),
					left = Math.abs(parseFloat(this.$panel.css('left'))),
					diff = panel_width - wrap_width;

				this.$progress_track.css('width', `${(left / diff) * 100}%`);
			},
			// 鼠标拖动开始
			moveStart(e) {
				this.move_start = e.clientX || e.changedTouches[0].clientX;

				this.$panel.bind('mousemove', this.movePanel.bind(this));
				this.$panel.bind('touchmove', this.movePanel.bind(this));
			},
			// 鼠标拖动结束
			moveEnd(e) {
				this.move_start = null;
				this.$panel.unbind('mousemove');
			},
			// 鼠标拖动
			movePanel(e) {
				let x = e.clientX || e.changedTouches[0].clientX,
					diff = x - this.move_start,
					left = parseFloat(this.$panel.css('left')),
					wrap_width = this.$wrap.width(),
					panel_width = this.$panel.width(),
					mins = wrap_width - panel_width;

				this.$panel.css('left', Math.min(0, Math.max(left + diff, mins)) + 'px');

				this.move_start = x;

				this.changeProgressValue();
			}
		}
	}
</script>