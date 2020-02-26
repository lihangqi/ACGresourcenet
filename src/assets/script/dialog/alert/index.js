import Vue from 'vue'
import alert from './alert'

export default function AlertBox(content, title = '系统消息') {
	let creator = Vue.extend({
			data() {
				return {
					content,
					title
				}
			},
			template: `<alert :content="this.content" :title="this.title" :close="this.close"></alert>`,
			components: {
				alert
			},
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
				}
			}
		}),
		vm;

	vm = new creator().$mount();

	document.body.appendChild(vm.$el);
	return vm;
}