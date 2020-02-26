class CanvasEngine {
	/*
	* 构造函数
	* @param object option 画布全局参数设置
	 */
	constructor(option) {
		this.data = {}; // 元素数据
		this.imageCache = {}; // 已经加载过的图片
		this.groupData = {}; // 组数据
		this.eventData = {}; // 事件函数
		this.globalEvent = {}; // 全局事件
		this.ceid = 1; // 元素id，用于后面操作元素
		this.lastScale = {x: 0, y: 0};
		this.canvas = document.getElementById(option.el); // 画布dom
		this.ctx = this.canvas.getContext('2d'); // 上下文
		this.bindEvent();
		this.baseCtx = this.copyCtx(); // 复制上下文
		option.style && this.setCanvasStyle(option.style); // 设置画布css样式
		this.offset = this.getCanvasOffset();
	}

	/*
	* 获取画布的偏移
	 */
	getCanvasOffset() {
		let el = this.canvas,
			top = el.offsetTop,
			left = el.offsetLeft,
			position = this.style(el, 'position');

		while ((el = el.parentNode).tagName.toLowerCase() !== 'body') {
			if (this.style(el, 'position') !== 'static') {
				left += el.offsetLeft;
				top += el.offsetTop;
			}
		}

		return {
			left,
			top
		};
	}

	/*
	* 获取css样式
	 */
	 style(el, attr) {
	 	let style = window.getComputedStyle ? getComputedStyle(el, null) : el.currentStyle;

	 	return style[attr];
	 }

	/*
	* 复制上下文
	 */
	copyCtx() {
		let ctx = {};

		this.each(this.ctx, (key, value) => {
			if (typeof value !== 'function' && typeof value !== 'object') {
				ctx[key] = value;
			}
		});

		return ctx;
	}

	/*
	* 设置画布样式
	* @param object style 样式键值
	 */
	setCanvasStyle(style, noDraw) {
		this.canvas.width = parseInt(style.width);
		this.canvas.height = parseInt(style.height);

		this.each(style, (key, value) => {
			if (key !== 'width' && key !== 'height') {
				this.canvas.style[key] = value;
			}
		});

		noDraw || this.draw();
	}

	/*
	* 迭代器
	* @param object object 需要迭代的对象
	* @param function fn 回调
	 */
	each(object, fn) {
		if (this.isArray(object)) {
			for (let i = 0, len = object.length; i < len; i ++) {
				fn && fn.call(this, i, object[i]);
			}
		} else if (typeof object === 'object') {
			for (let key in object) {
				fn && fn.call(this, key, object[key]);
			}
		}
	}

	/*
	* 矩形
	* @param object option 参数设置
	 */
	rect(option) {
		this.ctx.rect(option.x, option.y, option.width, option.height);
	}

	/*
	* 圆
	 */
	arc(option) {
		this.ctx.arc(option.x, option.y, option.radius, option.start * Math.PI, option.end * Math.PI, option.dir);
	}

	/*
	* ֱ线
	 */
	line(option) {
		this.ctx.moveTo(option.x, option.y);
		this.ctx.lineTo(option.ex, option.ey);
	}

	/*
	* 多边形
	 */
	poly(option) {
		let data = [].concat(option.edge), // 复制一份来操作，不改变原数据
			start = data.shift();

		this.ctx.moveTo(start.x, start.y);
		
		this.each(option.edge, (key, item) => {
			this.ctx.lineTo(item.x, item.y);
		});
	}

	/*
	* 弧
	 */
	arcTo(option) {
		this.ctx.moveTo(option.x, option.y);
		this.ctx.arcTo(option.sx, option.sy, option.ex, option.ey, option.radius);
	}

	/*
	* 贝塞尔曲线
	 */
	bezier(option) {
		this.ctx.moveTo(option.x, option.y);
		this.ctx.bezierCurveTo(option.cx, option.cy, option.cx1, option.cy1, option.ex, option.ey);
	}

	/*
	* 二次贝塞尔曲线
	 */
	quad(option) {
		this.ctx.moveTo(option.x, option.y);
		this.ctx.quadraticCurveTo(option.cx, option.cy, option.ex, option.ey);
	}

	/*
	* 图片
	 */
	image(option) {
		if (typeof option.url === 'string') {
			this.loadSource(option.url, (source) => {
				option.url = source;
				this.draw();
			});

			return false;
		}

		this.ctx.drawImage(option.url, option.ox || 0, option.oy || 0, option.sx || option.url.naturalWidth, option.sy || option.url.naturalHeight, option.x, option.y, option.width * (option.sx > option.sy ? (option.sx / option.sy) : 1), option.height * (option.sy > option.sx ? (option.sy / option.sx) : 1));
	}

	/*
	* 填充矩形
	 */
	 frect(option) {
	 	this.ctx.fillRect(option.x, option.y, option.width, option.height);
	 }

	 /*
	 * 字体
	  */
	 sfont(option) {
	 	this.setFont(option);
	 	this.ctx.strokeText(option.text, option.x, option.y, option.width || window.innerWidth);
	 }

	 ffont(option) {
	 	this.setFont(option);
	 	this.ctx.fillText(option.text, option.x, option.y, option.width || window.innerWidth);
	 }

	 /*
	 * 设置字体参数
	  */
	 setFont(option) {
	 	let font = this.getFont();

	 	if (!option.size) {
	 		option.size = font.size;
	 	}

	 	if (!option.font) {
	 		option.font = font.font;
	 	}
	 	
	 	this.ctx.font = `${option.size}px ${option.font}`;
	 }

	 /*
	 * 获取当前上下文中的字体设置
	  */
	  getFont() {
	  	let font = this.ctx.font.split(' ');

	  	return {
	 		size: parseFloat(font[0]),
	 		font: font[1]
	 	};
	  }

	 /*
	* 清除画布
	 */
	 clear(option) {
	 	this.ctx.clearRect(option.x, option.y, option.width, option.height);
	 }

	 /*
	 * 剪切
	  */
	 clip() {
	 	this.ctx.clip();
	 }

	/*
	* 开始绘制，控制所有元素的绘制
	 */
	draw() {
		this.cls(); // 清除上一次绘制
		let ctx = this.ctx,
			gData = null;

		this.each(this.data, (key, item) => {
			if (item.hide) {
				return false;
			}

			if (this.isArray(item)) {
				if (item.length < 1) {
					return false;
				}

				gData = this.groupData[item[0].group] || {};

				// 整个组隐藏
				if (gData.hide) {
					return false;
				}

				this.each(item, (i, gItem) => {
					if (!gItem) {
						return false;
					} else if (gItem.hide) {
						return false;
					}

					gItem.data.x = gItem.base.x + (gData.x || 0);
					gItem.data.y = gItem.base.y + (gData.y || 0);

					if (gData.alpha) {
						gItem.data.alpha = (gItem.data.alpha || 0) + gData.alpha;
					}

					this.simpleDraw(gItem, key);
				});
			} else {
				this.simpleDraw(item, key);
			}
		});
	}

	/*
	* 公共的绘制操作
	 */
	simpleDraw(item, key) {
		let ctx = this.ctx;

		this.save();
		ctx.beginPath();
		this.setPathStyle(item.style);
		item.opera && this.setGlobalCompositeOperation(item.opera);
		item.strokeStyle && this.setDisplayStyle(item, 'strokeStyle');
		item.fillStyle && this.setDisplayStyle(item, 'fillStyle');
		item.data.alpha && this.setPathAlpha(item.data.alpha);
		item.shadow && this.setPathShadow(item.shadow);
		item.data.translate && this.translate(item);
		item.data.scale && this.scale(item);
		item.data.rotate && this.rotate(item);
		this[item.type](item.data);
		item.control && this.display(item.control);
		item.clip && this.clip();
		ctx.closePath();
		this.restore();
	}

	/*
	* 设置堆叠
	 */
	setGlobalCompositeOperation(data = 'source-over') {
		this.ctx.globalCompostieOperation = data;
	}

	/*
	* 旋转
	 */
	rotate(option, ctx, sizedata) {
		let size = this.getSize(option);

		ctx = ctx || this.ctx;

		if (option.type === 'arc') {
			ctx.translate(option.data.x, option.data.y);
			ctx.rotate((option.data.rotate / 2) * Math.PI / 180);
			ctx.translate(-option.data.x, -option.data.y);
		} else {
			ctx.translate(option.data.x + (size.width / 2), option.data.y + (size.height / 2));
			ctx.rotate((option.data.rotate / 2) * Math.PI / 180);
			ctx.translate(-option.data.x + (size.width / 2) - size.width, -option.data.y + (size.height / 2) - size.height);
		}
	}

	/*
	* 获取元素宽高
	 */
	getSize(option) {
		let type = option.type,
			size;

		switch (type) {
			case 'rect':
			case 'frect':
			case 'image':
			case 'clear':
			case 'clip':
				size = {
					width: option.data.width,
					height: option.data.height
				};
				break;
			case 'arcTo':
					size = {
						width: Math.abs(option.data.ex - option.data.x),
						height: option.data.radius
					};
				break;
			case 'line':
					size = {
						width: Math.abs(option.data.ex - option.data.x),
						height: Math.abs(option.data.ey- option.data.y)
					};
				break;
			case 'sfont':
			case 'ffont':
					size = {
						width: option.data.size * (option.data.text.length / 2),
						height: 0
					};
				break;

		}

		return size;
	}

	/*
	* 缩放
	 */
	scale(option) {
		let scale = option.data.scale;

		if (scale.x === 0) {
			scale.x = 0.0000001;
		}

		if (scale.y === 0) {
			scale.y = 0.0000001;
		}

		switch (option.type) {
			case 'rect':
			case 'image':
			case 'frect':
			case 'clear':
			case 'clip':
					option.data.width = option.base.width * scale.x || 1;
					option.data.height = option.base.height * (scale.y || 1);
				break;
			case 'arc':
					option.data.radius = option.base.radius * scale.x;
				break;
			case 'sfont':
			case 'ffont':
					option.data.size = (option.base.size || 0) * scale.x;
				break;
			default: 
					this.ctx.scale(scale.x || 1, scale.y || 1);
				break;
		}
	}

	/*
	* 数组判断
	 */
	isArray(object) {
		return Object.prototype.toString.call(object) === '[object Array]';
	}

	/*
	* 清除上一次的绘制
	 */
	cls() {
		this.ctx.clearRect(-(2 * this.canvas.width), -(2 * this.canvas.height), 4 * this.canvas.width, 4 * this.canvas.height);
	}

	/*
	* 偏移
	 */
	translate(option) {
		let data = option.data,
			gData = this.groupData[option.group] || {};
		
		data.x = option.base.x + (data.translate ? (data.translate.left || 0) + (gData.left || 0) : 0);
		data.y = option.base.y + (data.translate ? (data.translate.top || 0) + (gData.top || 0) : 0);
	}

	/*
	* 设置元素阴影
	 */
	setPathShadow(option) {
		this.ctx.shadowColor = option.color;
		this.ctx.shadowOffsetX = option.x;
		this.ctx.shadowOffsetY = option.y;
		this.ctx.shadowBlur = option.blur;
	}

	/*
	* 设置元素透明度
	 */
	setPathAlpha(alpha) {
		this.ctx.globalAlpha = alpha / 100;
	}

	/*
	* 设置元素样式
	 */
	setPathStyle(style) {
		this.resetStyle(); // 重置元素样式

		this.each(style, (key, value) => {
			this.ctx[key] = value;
		})
	}

	/*
	* 重置元素样式
	 */
	 resetStyle() {
	 	this.each(this.baseCtx, (key, value) => {
	 		this.ctx[key] = value;
	 	});
	 }

	/*
	* 设置颜色，图案，渐变等
	 */
	setDisplayStyle(option, type) {
		let object = option[type],
			proxy = object;

		if (typeof object === 'object') {
			if (/(?:jpg|jpeg|png|webp|\.|\.\.|http)/ig.test(object.url)) {
				// 设置一个代理
				proxy = this.getRandColor();
				
				this.loadSource(object.url, (source) => {
					option[type] = this.createPattern(source, object.type || 'repeat');
					this.draw();
				});
			} else if (object.type === 'linear') {
				proxy = this.linearGradient(object);
			} else if (object.type === 'radial') {
				proxy = this.radialGradient(object);
			} else if (Object.prototype.toString.call(object) !== '[object CanvasPattern]') {
				proxy = this.createPattern(object.url, object.type || 'repeat');
			}
		}

		this.ctx[type] = proxy;
	}

	/*
	* 线性渐变
	 */
	linearGradient(data) {
		let gradient = this.ctx.createLinearGradient(data.x, data.y, data.width, data.height);
		this.addGradientColors(gradient, data.color);
		return gradient;
	}

	/*
	* 径向渐变
	 */
	radialGradient(data) {
		let gradient = this.ctx.createRadialGradient(data.x, data.y, data.radius, data.x1, data.y1, data.radius1);
		this.addGradientColors(gradient, data.color);
		return gradient;
	}

	/*
	* 添加渐变颜色
	* @param object gradient 渐变颜色对象
	* @param Array color 颜色组，例: ['0 red', '1 green']
	 */
	addGradientColors(gradient, color) {
		let item;
		this.each(color, (i, value) => {
			item = value.split(' ');
			gradient.addColorStop(item[0], item[1]);
		});
	}

	/*
	* 获取随机RGB颜色
	 */
	getRandColor() {
		let r = parseInt(Math.random() * 255),
			g = parseInt(Math.random() * 255),
			b = parseInt(Math.random() * 255);

		return `rgb(${r}, ${g}, ${b})`;
	}

	/*
	* 创建图案
	 */
	createPattern(img, type) {
		return this.ctx.createPattern(img, type);
	}

	/*
	* 加载资源
	* @param string url 资源地址
	* @param function fn 回调
	* @param string tag html标签，默认为img
	 */
	loadSource(url, fn, tag = 'img') {
		if (this.imageCache[url]) {
			fn && fn.call(this, this.imageCache[url]);
			return false;
		}

		let source = document.createElement(tag);

		source.crossOrigin = 'Anonymous';
		source.src = url;
		source.addEventListener('load', () => {
			this.imageCache[url] = source;
			fn && fn.call(this, source);
		}, false);
	}

	/*
	* 填充和描边
	 */
	display(control) {
		let ctl = control.split('|');

		if (ctl.indexOf('fill') > -1) {
			this.fill();
		}

		if (ctl.indexOf('stroke') > -1) {
			this.stroke();
		}
	}		

	/*
	* 填充
	 */
	fill() {
		this.ctx.fill();
	}

	/*
	* 描边
	 */
	stroke() {
		this.ctx.stroke();
	}

	/*
	* 注册一个元素
	 */
	reg(option, group) {
		let id = group || this.ceid ++,
			groupData = this.data[group],
			gid = groupData && groupData[groupData.length - 1] ? groupData[groupData.length - 1].gid + 1 : 0;

		option.base = (() => {
			let data = {};

			this.each(option.data, (key, value) => {
				data[key] = value;
			});

			return data;
		})();

		if (group) {
			option.group = group;
			option.gid = gid;
			groupData.push(option);
		} else {
			this.data[id] = option;
		}

		// 判断并添加事件
		this.regEvent(option.event || {}, id, gid);

		this.draw();

		return group > -1 ? gid : id;
	}

	/*
	* 注册元素事件
	*/
	regEvent(data, id, gid) {
		this.each(data, (key, fn) => {
			fn.id = id;
			fn.gid = gid;
			this.addEvent(id, key, fn);
		});
	}

	/*
	* 注册一个组
	 */
	group(option) {
		let id = this.ceid ++,
			g = [];

		this.data[id] = g;
		this.groupData[id] = option || {};

		return id;
	}

	/*
	* 删除组元素
	*/
	g_delete(id, gid) {
		let index = this.g_find(id, gid),
			event = this.data[id][index].event;

		if (event) {
			this.each(event, (key, fn) => {
				this.removeEvent(key, fn);
			});
		}

		this.data[id].splice(index, 1);

		this.draw();
	}

	/*
	* 查找组元素
	*/
	g_find(id, gid) {
		try {
			let data = this.data[id],
				i = 0,
				len = data.length;

			for (; i < len; i ++) {
				if (data[i].gid === gid) {
					return i;
				}
			}
		} catch(e) {}

		return -1;
	}

	/*
	* 组属性的修改
	 */
	g_config(id, option) {
		let data = this.groupData[id];

		if (!data) {
			data = this.groupData[id] = {};
		}

		if (typeof option === 'object') {
			this.each(option, (key, value) => {
				data[key] = value;
			});

			this.draw();
		} else {
			return data[option];
		}
	}

	/*
	* 保存状态
	 */
	save() {
		this.ctx.save();
	}

	/*
	* 恢复状态
	 */
	restore() {
		this.ctx.restore();
	}

	/*
	* 转成base64图片数据
	 */
	toDataUrl(type = 'image/png') {
		return this.canvas.toDataURL(type);
	}

	/*
	* 获取画布dom
	 */
	get() {
		return this.canvas;
	}

	/*
	* 获取上下文
	 */
	getContext() {
		return this.ctx;
	}

	/*
	* 创建Image对象
	* @param function fn 回调，填充图片颜色
	 */
	createImage(width, height, fn) {
		let image = this.ctx.createImageData(width, height);
		fn && fn.call(this, image);
		return this;
	}

	/*
	* 获取颜色数据
	 */
	getImageData(x, y, width, height) {
		return this.ctx.getImageData(x, y, width, height);
	}

	/*
	* 写入颜色数据
	* @param ImageData img 图片数据对象
	* @param int x,y 写入的位置
	 */
	putImageData(img, x, y) {
		this.ctx.putImageData(img, x, y);
		return this;
	}

	/*
	* 画布绑定事件
	 */
	bindEvent() {
		// 修改和设置事件对象
		let triggle = (e) => {
			let force = 1, 
				identifier = 0, 
				radius = 1, 
				rotationAngle = 0, 
				target = e.target, 
				event,
				offset = this.getPostion(e),
				wheel = 0,
				altKey = false,
				ctrlKey = false,
				code = null,
				key = null,
				keyCode = null,
				repeat = false,
				shiftKey = false,
				object;

				// 触摸事件
				if (/touch/ig.test(e.type)) {
					force = e.changedTouches[0].force;
					identifier = e.changedTouches[0].identifier;
					rotationAngle = e.changedTouches[0].rotationAngle;
					target = e.changedTouches[0].rotationAngle;
					radius = parseInt(e.changedTouches[0].radiusX);
				}

				// 鼠标滚动
				if (e.type === 'mousewheel') {
					wheel = e.wheelDelta;
				}

				// 键盘事件
				if (/key/ig.test(e.type)) {
					altKey = e.altKey;
					ctrlKey = e.ctrlKey;
					code = e.code;
					key = e.key;
					keyCode = e.keyCode;
					repeat = e.repeat;
					shiftKey = e.shiftKey;
				}

				// 新事件对象
				event = {
					event: e,
					x: offset.x,
					y: offset.y,
					force,
					identifier,
					radius,
					rotationAngle,
					targetElement: target,
					type: e.type,
					wheel,
					code,
					key,
					keyCode,
					altKey,
					ctrlKey,
					shiftKey,
					repeat
				};

				// 执行全局事件
				this.each(this.globalEvent, (key, fn) => {
					if (e.type === key) {
						fn && fn.call(this, event);
					}
				}); 
				
				// 检测与分发事件
				this.each(this.eventData, (key, item) => {
					if (e.type === key) {
						this.each(item, (i, fn) => {
							try {
								object = this.isArray(this.data[fn.id]);

								if (!object) {
									object = this.data[fn.id];

									if (object.hide || this.config(fn.id, 'hide')) {
										return false;
									}

									(/key/ig.test(key) ? true : (this.inPath(this.data[fn.id], event.x, event.y)) && !this.data[fn.id].hide) && fn && fn.call(this, event, fn.id, this.data[fn.id]);
								} else {
									if (object.hide || this.g_config(fn.id, 'hide') || this.config(fn.id, 'hide', fn.gid)) {
										return false;
									}

									// 组元素事件修理
									(/key/ig.test(key) ? true : (this.inPath(this.data[fn.id][this.g_find(fn.id, fn.gid)], event.x, event.y)) && !this.data[fn.id][this.g_find(fn.id, fn.gid)].hide) && fn && fn.call(this, event, fn.id, this.data[fn.id][this.g_find(fn.id, fn.gid)]);
								}
							} catch(e) {
								return false;
							}
						});
					}
				});
			};

		// 给画布绑定全局事件
		'click touchstart mousewheel mousemove touchmove touchend keydown keypress keyup mousedown mouseup'.replace(/\w+/ig, (key) => {
			let el = /key/ig.test(key) ? window : this.canvas;

			if (el.addEventListener) {
				el.addEventListener(key, triggle, false);
			} else if (el.attchEvent) {
				el.attchEvent('on' + key, triggle);
			} else {
				el['on' + key] = triggle;
			}
		});
	}

	/*
	* 判断点是否在元素上
	 */
	inPath(option, x, y) {
		let size = this.getSize(option),
			sx = option.data.x,
			sy = option.data.y,
			ex,
			ey,
			r = 0;

		switch (option.type) {
			case 'sfont':
			case 'ffont':
			case 'rect':
			case 'image':
			case 'frect':
			case 'arcTo':
			case 'clear':
			case 'clip':
					// 处理字体
					if (/font/ig.test(option.type)) {
						size.height = option.data.size + (size.width / 10);
						sy /= 2;
					}

					[ex, ey] = [size.width + sx, size.height + sy];

					if (/font/ig.test(option.type)) {
						ey -= sy;
					}

					// 处理描边
					if (option.style && option.style.lineWidth) {
						sx -= option.style.lineWidth;
						sy -= option.style.lineWidth;
						ex += option.style.lineWidth;
						ey += option.style.lineWidth;
						r += option.style.lineWidth;
					}

					if (x >= sx && x <= ex && y >= sy && y <= ey) {
						return true;
					}
				break;
			case 'arc':
					if ((Math.pow(x - option.data.x, 2) + Math.pow(y - option.data.y, 2)) <= Math.pow(r + option.data.radius, 2)) {
						return true;
					}
				break;
			case 'line':
					ex = option.data.ex;
					ey = option.data.ey;

					let slope = (ey - sy) / (ex - sx);

					if (x < option.data.x - r || x > option.data.x + size.width - r) {
						return false;
					}

					for (let i = 0, len = option.style.lineWidth || 0; i <= len; i ++) {
						if (this.pointSkew(sx + i, sy, x, y, slope)) {
							return true;
						}

						if (this.pointSkew(sx - i, sy, x, y, slope)) {
							return true;
						}
					}
				break;
			case 'poly':
					let cross = 0,
						k,
						edge = option.data.edge,
						cond1, cond2, above;

					// 判断点是否在多边形内算法
					for (let i = 0, len = edge.length - 1; i < len; i ++) {
						k = (edge[i + 1].y - edge[i].y) / (edge[i + 1].x - edge[i].x);
						cond1 = (edge[i].x <= x) && (x < edge[i + 1].x);
						cond2 = (edge[i + 1].x <= x) && (edge[i].x > x);
						above = y < (k * (x - edge[i].x) + edge[i].y);

						if ((cond1 || cond2) && above) {
							cross += 1;
						}
					}

					return cross % 2 !== 0;
				break;
		}

		return false;
	}

	/*
	* 点斜式
	* @param int (x, y)/(x1,y1) 两个点
	* @param int k 斜率
	 */
	pointSkew(x, y, x1, y1, k) {
		return (y - y1) === k * (x - x1);
	}

	/*
	* 获取统一的鼠标位置
	* @param object e 事件对象
	 */
	getPostion(e) {
		let x, y,
			browser = this.browser();

		e = e || window.event;

		if (/touch/ig.test(e.type)) {
			x = parseInt(e.changedTouches[0].pageX) - this.offset.left;
			y = parseInt(e.changedTouches[0].pageY) - this.offset.top;
		} else {
			x = (e.layerX || e.offsetX) - (browser.name !== 'chrome' && browser.name !== 'opera' ? this.offset.left: 0);
			y = (e.layerY || e.offsetY) - (browser.name !== 'chrome' && browser.name !== 'opera' ? this.offset.top: 0);
		}

		return {
			x,
			y
		};
	}

	/*
	* 添加事件
	* @param int id 绑定事件的id，目前没用到这个参数
	* @param string type 事件类型
	* @param fn 事件回调
	*/
	addEvent(id, type, fn) {
		if (!this.eventData[type]) {
			this.eventData[type] = [];
		}

		this.eventData[type].push(fn);
	}

	/*
	* 移除事件
	* @param string type 事件类型
	* @param function fn 事件绑定的函数
	*/
	removeEvent(type, fn) {
		let index = this.eventData[type].indexOf(fn);

		if (index < 0) {
			return false;
		}

		this.eventData[type].splice(index, 1);

		return this;
	}

	/*
	* 删除元素
	* @param int id 元素下标
	*/
	delete(id) {
		try {
			let isArray = this.isArray(this.data[id]),
				event = this.data[id].event;

			// 清除事件
			if (event) {
				this.each(event, (key, fn) => {
					this.removeEvent(key, fn);
				});
			}

			// 清除组
			if (this.data[id] && isArray) {
				this.each(this.data[id], (i, arr) => {
					if (arr.event) {
						this.each(arr.event, (key, fn) => {
							this.removeEvent(key, fn);
						});
					}
				});

				delete this.groupData[id];
			}

			if (this.data[id]) {
				delete this.data[id];
			}
		} catch(e) {}

		this.draw();
	}

	/*
	* 修改元素设置
	* @param int id 元素/组的id
	* @param object option 修改的属性
	* @param int gid 组元素的下标
	* @param boolean noDraw 是否不重绘
	*/
	config(id, option, gid, noDraw) {
		if (typeof option === 'string') {
			let data = gid > -1 ? this.data[id][this.g_find(id, gid)] : this.data[id];

			if (data[option]) {
				return data[option];
			} else {
				return data.data[option];
			}
		} else {
			this.each(option, (key, value) => {
				if (typeof value === 'object') {
					this.change(id, key, value, gid, false);
				} else {
					if (gid > -1) {
						this.data[id][this.g_find(id, gid)][key] = value;
					} else {
						this.data[id][key] = value;
					}
				}
			});

			noDraw || this.draw();
			return this;
		}
	}

	/*
	* 修改值为对象的值
	* @param int id 元素/组的id
	* @param string name 需要修改的键
	* @param object option 修改的属性
	* @param int gid 组元素的下标
	* @param bool draw 是否立刻重绘
	*/
	change(id, name, option, gid, draw = true) {
		this.each(option, (key, value) => {
			if (gid > -1) {
				try {
					this.data[id][this.g_find(id, gid)][name][key] = value;
				} catch(e) {}
			} else {
				if (!this.data[id][name]) {
					this.data[id][name] = {};
				}

				this.data[id][name][key] = value;
			}
		});

		draw && this.draw();
	}

	/*
	* 图片播放
	* @param int id 图片元素的下标
	* @param Array image 图片组
	* @param int time 每一图片切换间隔
	* @param bool loop 是否循环
	* @param int gid 组id
	*/
	gif(id, image, time, loop, gid) {
		let check = [],
			checkLoad = () => {
				if (/false/ig.test(check.join(','))) {
					setTimeout(checkLoad, 8);
				} else {
					run(0);
				}
			},
			run = (i) => {
				if (!this.data[id]) {
					return false;
				}

				if (i >= image.length && !loop) {
					return false;
				} else if (loop) {
					i %= image.length;
				}

				this.config(id, {
					data: {
						url: image[i],
						rotate: gid > -1 ? this.data[id][this.g_find(id, gid)].data.rotate : this.data[id].data.rotate
					}
				}, gid);

				setTimeout(() => {
					run(i + 1);
				}, time);
			};

		this.each(image, (i, url) => {
			if (typeof url === 'string') {
				check[i] = false;
				this.loadSource(url, (source) => {
					image[i] = source;
					check[i] = true;
				});
			} else {
				check[i] = true;
			}
		});

		checkLoad();
	}

	/*
	* 动画处理(偏移、旋转、透明度、缩放)
	* @param object option 需要修改的属性
	* @param object setting 动画参数
	*/
	animate(id, option, setting, gid) {
		let check = {},
			temp,
			object = gid > -1 ? this.data[id][this.g_find(id, gid)] : this.data[id];

		// 执行开始回调
		setting.start && setting.start.call(this, id, this.ctx, gid);

		this.each(option, (key, value) => {
			// 这里处理一些数值问题和value为0时的bug
			if (/scale/ig.test(key)) {
				value *= 100;

				if (value <= 0) {
					value = 0.1;
				}
			}

			if (key === 'rotate') {
				value *= 2;
			}

			if (key === 'alpha' && value === 0) {
				value = 0.1;
			}

			let diff,
				deg = 0,
				speed = this.getSpeed(value, this.setting(id, key, null, gid), setting.time, setting.frame || 60, setting.speedType || 'linear'),
				step = 0,
				oldValue = value,
				plus_minus;

			check[key] = false;

			this.runTime(setting.frame || 60, () => {
				let now = this.setting(id, key, null, gid);

				if (setting.speedType && setting.speedType !== 'linear') {
					speed = this.getSpeed(value, this.setting(id, key, null, gid), setting.time, setting.frame || 60, setting.speedType);
				}

				if (/[\-\+]{2}$/.test(value)) {
					speed = /\-{2}$/.test(value) ? -parseFloat(value) : parseFloat(value);

					if (setting.step && setting.step.call(this, now, value)) {
						check[key] = true;
						return false;
					}

					this.setting(id, key, now + speed, gid);
					this.draw();
				} else {
					if ((now > 0 ? Math.ceil(now) : now) !== value) {
						diff = parseFloat((value - now).toFixed(2));

						// 处理负数停不下来问题
						if ((speed >= 0) && Math.abs(diff) < (speed > 10 ? speed : 6)) {
							speed = diff;
						} else if (speed < 0 && diff > (speed < -10 ? speed : -6)) {
							speed = diff;
						}

						this.setting(id, key, now + speed, gid);
						this.draw();
					} else {
						check[key] = true;
						return false;
					}

					// 强制停止hook
					if (setting.step && setting.step.call(this, now, value)) {
						check[key] = true;
						return false;
					}
				}
			});
		});

		this.runTime(setting.frame || 60, () => {
			if (!(/false/ig.test(JSON.stringify(check)))) {
				// 执行结束回调
				setting.done && setting.done.call(this, id, this.ctx, gid);
				return false;
			}
		});
	}

	/*
	* 获取动画速度
	*/
	getSpeed(target, base, time, frame, type = 'linear') {
		switch (type) {
			case 'linear':
				return parseFloat(((target - base) / (time / frame)).toFixed(2));
			break;
			case 'easy-out':
					return (target - base) / 10;
				break;
		}
	}

	/*
	* 获取和设置属性--动画用
	*/
	setting(id, key, value, gid) {
		let object;

		if (gid > -1) {
			object = this.data[id][this.g_find(id, gid)];
		} else {
			object = this.data[id];
		}

		switch(key) {
			case 'left':
			case 'top':
					if (value || value === 0) {
						if (!object.data.translate) {
							object.data.translate = {};
						}

						object.data.translate[key] = value;
					} else {
						return object.data.translate ? (object.data.translate[key] || 0) : 0;
					}
				break;
			case 'scale_x':
			case 'scale_y':
					let keys = key.split('_');

					key = keys[1];

					if (!object.data.scale) {
						object.data.scale = {};
					}

					if (value || value === 0) {
						object.data.scale[key] = value / 100;
					} else {
						return (object.data.scale[key] === undefined ? 1 : object.data.scale[key]) * 100;
					}
				break;
			default:
					if (value || value === 0) {
						if (this.isArray(object)) {
							this.groupData[id][key] = value;
						} else {
							object.data[key] = value;
						}
					} else {
						if (this.isArray(object)) {
							return this.groupData[id][key] ? parseFloat(this.groupData[id][key].toFixed(2)) : ((key === 'alpha' && this.groupData[id][key] !== 0) ? 100 : 0);
						} else {
							return object.data[key] ? parseFloat(object.data[key].toFixed(2)) : ((key === 'alpha' && object.data[key] !== 0) ? 100 : 0);
						}
					}
				break;
		}
	}

	/*
	* 定时重复执行函数
	* @param int time 每次执行间隔
	* @param function fn 回调
	* 回调中返回false 可以停止
	*/
	runTime(time, fn) {
		let run = () => {
			if (fn && (fn() !== false)) {
				setTimeout(run, time);
			}
		};

		run();
	}

	/*
	* 浏览器判断
	*/
	browser() {
		let ua = navigator.userAgent,
		match = /(opera|opr)(\/|\s)\d{1,}(\.\d{1,})*/i.exec(ua) ||
				/(msie|edge)(\/|\s)\d{1,}(\.\d{1,})*/i.exec(ua) ||
				/(\.net4)/i.exec(ua) && /(rv\:\d*(|\.\d*))/i.exec(ua) ||
				/(chrome)(\/|\s)\d{1,}(\.\d{1,})*/i.exec(ua) ||
				/(firefox)(\/|\s)\d{1,}(\.\d{1,})*/i.exec(ua) ||
				/(safari)(\/|\s)\d{1,}(\.\d{1,})*/i.exec(ua) && /(version)(\/|\s)\d{1,}(\.\d{1,})*/i.exec(ua),
		info = match[0].replace(/\//, ' ').split(/[\s|\:]/),
		name = info[0].toLowerCase(),
		ver = info[1],
		system = /(windows)/i.exec(ua) || /(android)/i.exec(ua) || /(iphone)/i.exec(ua) || /(ipad)/i.exec(ua);

		return {
			name: name === 'opr' || name === 'opera' ? 'opera' : (name === 'version' ? 'safari' : (name === 'msie' || name === 'rv' ? 'ie' : name)),
			version: ver,
			isChrome: name === 'chrome',
			isIE: name === 'msie' || name === 'rv',
			isOpera: name === 'opera' || name === 'opr',
			isFirefox: name === 'firefox',
			isSafari: name === 'version',
			system: system && system[0]
		};
	}

	/* 不绘制元素 */
	hide(id, gid) {
		let data;

		if (gid > -1) {
			data = this.data[id][this.g_find(id, gid)];
		} else {
			data = this.data[id];
		}

		data['hide'] = true;
	}

	/* 重新绘制元素 */
	show(id, gid) {
		let data;

		if (gid > -1) {
			data = this.data[id][this.g_find(id, gid)];
		} else {
			data = this.data[id];
		}

		data['hide'] = false;
	}

	/* 全局事件 */
	addGlobalEvent(key, fn) {
		this.globalEvent[key] = fn;
		return this;
	}
}

export default CanvasEngine