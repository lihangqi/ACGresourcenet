import image from './image'
import Vue from 'vue'

export default function showImage(url) {
	let creator = Vue.extend({
			data() {
				return {
					url
				}
			},
			template: `<m_image :url="this.url"></m_image>`,
			components: {
				'm_image': image
			},
			methods: {

			}
		}),
		vm;

	vm = new creator().$mount();
	document.body.appendChild(vm.$el);
}