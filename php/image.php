<?php 
	define('ACGCONFIG', true);
	require_once 'replice.php';
	require_once 'config.php';
	
	class Image extends Replice {
		public $domin = 'http://moe.005.tv/';
		public $host = 'http://moe.005.tv/moeimg/';
		public $search_url = 'http://www.005.tv/plus/search.php?keyword=%s&searchtype=titlekeyword&channeltype=0&orderby=&kwtype=0&pagesize=10&typeid=1&PageNo=%u';

		public function __construct() {}

		public function update() {
			$html = $this->strip($this->curl($this->host));
			$data = [];
			$path = $this->path($html, '<!-- 主题列表 -->', '<!-- 主题列表 -->');
			$lis = $this->tag($path, 'li');

			for ($i = 0, $len = count($lis); $i < $len; $i ++) {
				$attr = $this->attr($lis[$i]);
				$title = $this->attr($this->tag($lis[$i], 'a')[0])['content'];
				$temp = [];
				$temp['href'] = $attr['href'];
				$temp['img'] = $attr['src'];
				$temp['title'] = $title;
				$data[] = $temp;
			}

			return $data;
		}

		public function search($key, $page = 1) {
			$url = sprintf($this->search_url, urlencode($key), $page);
			$html = $this->strip($this->curl($url));
			$path = $this->path($html, '<div class="resultlist">', '</div>');
			$lis = $this->tag($path, 'li');

			for ($i = 0, $len = count($lis); $i < $len; $i ++) {
				$attr = $this->attr($lis[$i]);
				$a = $this->tag($lis[$i], 'a');
				$title = $this->attr($a[0])['content'];
				$href = $this->attr($a[1])['href'];
				$tepm = [];
				$temp['title'] = $title;
				$temp['href'] = $href;
				$temp['img'] = DEFIMG;
				$data[] = $temp;
			}

			return $data;
		}

		public function get($url) {
			$base = $url;
			$html = $this->strip($this->curl($url));
			$page = $this->path($html, '<!-- 分页 -->', '<!--相关推荐 -->');
			$a = $this->tag($page, 'a');
			$urls = [];

			for ($i = 0, $len = count($a); $i < $len; $i ++) {
				$attr = $this->attr($a[$i]);
				$url = $this->domin . $attr['href'];

				if (!in_array($url, $urls)) {
					$urls[] = $url;
				}
			}

			for ($i = 0, $len = count($urls); $i < $len; $i ++) {
				$html .= $this->strip($this->curl($urls[$i]));
			}

			$path = $this->path($html, '<!--内容 -->', '<!--内容 -->');
			$img = $this->tag($path, 'img');

			$html = '';

			for ($i = 0, $len = count($img); $i < $len; $i ++) {
				$src = GETIMG . $this->attr($img[$i])['src'];
				$html .= sprintf('<img src="%s" >', $src);
			}

			return array(
				'content' => $html,
				'download' => null,
				'extract' => null,
				'href' => null,
				'url' => $base
			);
		}
	}