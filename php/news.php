<?php 
	define('ACGCONFIG', true);
	require_once 'replice.php';
	require_once 'config.php';

	class News extends Replice {
		public $domain = 'https://anime.eiga.com';
		public $host = 'https://anime.eiga.com/news/news/';
		public $search_url = 'https://anime.eiga.com/search/?q=%s&t=news';

		public function __construct() {}

		public function update() {
			$html = $this->strip($this->curl($this->host));
			$html = $this->path($html, '<ul class="articleBox">', '</ul>');
			return $this->parse($html);
		}

		public function search($key, $page = 1) {
			$url = sprintf($this->search_url, urlencode($key));
			$html = $this->strip($this->curl($url));
			$html = $this->path($html, '<ul class="newsContainer">', '</ul>');
			return $this->parse($html, true);
		}

		public function parse($html, $error = null) {
			$lis = $this->tag($html, 'li');
			$data = [];

			for ($i = 0, $len = count($lis); $i < $len; $i ++) {
				$attr = $this->attr($lis[$i]);
				$a = $this->tag($lis[$i], 'a');
				$attr1 = $this->attr($a[0]);

				if ($attr['url']) {
					$temp['href'] = preg_replace('/\.cmo\/anime/', '.com', $attr['url']);
				} else {
					$temp['href'] = $this->domain . $attr['href'];
				}

				if ($error) {
					$temp['img'] = GETIMG . $attr['src'];
				} else {
					$temp['img'] = GETIMG . $attr1['src'];
				}

				$temp['title'] = $attr1['alt'];

				if (!$temp['title']) {
					$temp['title'] = $attr['text'];
				}

				$data[] = $temp;
			}	

			return $data;
		}

		public function get($url) {
			$html = $this->strip($this->curl($url));
			$path = $this->path($html, '<div class="newsDetailBox clearfix">', '<div class="articleContainer">');

			return array(
				'content' => $path,
				'download' => null,
				'extract' => null,
				'href' => null,
				'url' => $url
			);
		}
	}

	$n = new News();
	$n->search('新海誠', 1);