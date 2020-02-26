import prompt from './prompt'
import Vue from 'vue'

export default function showInput(title, callback, def = '') {
	let creator = Vue.extend({
			data() {
				return {
					def,
					title
				}
			},
			template: `<prompt :def="this.def" :title="this.title" :cancel="this.cancel"></prompt>`,
			components: { prompt },
			methods: {
				close: () => {
					let $el = $(vm.$el).find('.wrap');

					$el.animate({
						scale: 0
					}, {
						step: (now) => {
							$el.css({
								transform: `scale(${now})`
							});
						},
						done: () => {
							document.body.removeChild(vm.$el);
							vm.$destroy();
						}
					});
				},
				ok: function (val) {
					this.state = 1;
					this.close();
					callback && callback.call(this, val);
				},
				cancel: function () {
					this.state = 0;
					this.close();
				}
			}
		}),
		vm;

	vm = new creator().$mount();
	document.body.appendChild(vm.$el);
}