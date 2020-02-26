import loading from './loading'
import Vue from 'vue'

class Loading {
	constructor() {
		this.mountVue();
		this.insertToBody();
	}

	// 挂载Vue
	mountVue() {
		this.creator = Vue.extend({
			data() {
				return {

				}
			},
			components: { loading },
			template: `<loading></loading>`,
			methods: {}
		});

		this.vm = new this.creator().$mount();
		this.el = this.vm.$el;
	}

	// 将Vue生成的dom插入body
	insertToBody() {
		$('body').append(this.el);
	}

	// 移除dom，并在Vue中注销掉
	hide() {
		document.body.removeChild(this.el);
		this.vm.$destroy();
	}
}

export default function showLoading() {
	return new Loading();
}