<template>
	<section class="content-wrap text-center">
		<!-- title -->
		<h3 class="content-title"><strong>{{title}}</strong></h3>
		<!-- title end -->
		<!-- content -->
		<article class="content-text" v-html="data.content"></article>
		<!-- content end -->
		<!-- other info -->
		<article class="other-info t40">
			<p v-if="data.href">
				<span>下载地址:</span>
				<a :href="data.href" target="_blank">{{data.href}}</a>
			</p>
			<p v-if="data.download">
				<span>提取密码:</span>
				<input type="text" :value="data.download">
			</p>
			<p v-if="data.extract">
				<span>解压密码:</span>
				<input type="text" :value="data.extract">
			</p>
			<p v-if="data.url">
				<span>页面原地址:</span>
				<a :href="data.url" target="_blank">{{data.url}}</a>
			</p>
		</article>
		<!-- other info end -->
	</section>
</template>

<style scoped>
	@import '../assets/style/public.css';

	.content-title {
		margin: 30px 20px;
	}

	.content-wrap {
		margin: 10px auto 50px;
	}

	.other-info {
		display: inline-block;
		text-align: left;
	}

	.other-info span {
		margin-right: 10px;
		display: inline-block;
		width: 6em;
		text-align: right;
	}

	.other-info > p > input {
		padding: 3px 5px;
		border: 1px solid rgba(0, 0, 0, .1);
		outline: none;
	}

	.other-info a {
		overflow: hidden;
		display: inline-block;
		max-width: 90%;
		line-height: 12px;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
</style>

<script>
	import dialog from '@/assets/script/dialog'

	export default {
		data() {
			return {
				data: {
					content: '',
					download: '',
					extract: '',
					href: '',
					url: '',
					type: '',
					title: ''
				}
			}
		},
		created() {
			this.type = this.$route.params['type'];
			this.url = this.$route.params['url'];
			this.title = this.$route.params['title'];
			this.get(this.type, this.url);
		},
		methods: {
			get(type, url) {
				let load = dialog.loading();

				this.$http.post('/php/index.php?act=get', {
					type,
					url
				}, { emulateJSON: true }).then((res) => {
					this.data = res.body;
					load.hide();
				});
			}
		}
	}
</script>