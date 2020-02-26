import Vue from 'vue'
import confirm from './confirm'

export default function AlertBox(content, ok, cancel, title = '系统消息') {
	let creator = Vue.extend({
			data() {
				return {
					content,
					title,
					state: undefined
				}
			},
			template: `<confirm :content="this.content" :title="this.title" :ok="this.ok" :cancel="this.cancel"></confirm>`,
			components: {
				confirm
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
				},
				ok: function () {
					this.state = 1;
					this.close();
					ok && ok.call(this);
				},
				cancel: function () {
					this.state = 0;
					this.close();
					cancel && cancel.call(this);
				}
			}
		}),
		vm;

	vm = new creator().$mount();

	document.body.appendChild(vm.$el);
	return vm;
}