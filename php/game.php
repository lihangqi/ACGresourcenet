<?php 
	define('ACGCONFIG', true);
	require_once 'replice.php';
	require_once 'config.php';
	
	class Game extends Replice {
		public $host = 'https://www.mikuclub.org/game';
		public $filter = '/cos|COS|图片|音乐|资讯|MMD|mmd|主题|番|图包|PV|pv/';
		public $search_url = 'https://www.mikuclub.org/search/%s/page/%u?cat=182';

		public function __construct() {}

		public function update() {
			$html = $this->strip($this->curl($this->host));
			return $this->parse($html);
		}

		public function search($key, $page = 1) {
			$url = sprintf($this->search_url, urlencode($key), $page);
			$html = $this->strip($this->curl($url));
			return $this->parse($html);
		}

		public function get($url) {
			$html = $this->strip($this->curl($url));
			$content = $this->tag($html, 'article')[0];

			$content = preg_replace_callback('/<img.+?>/', function ($img) {
				$img = $img[0];
				$attr = $this->attr($img);

				if (preg_match('/^\/\//', $attr['file'])) {
					$prefix = 'https:';
				}

				if ($attr['file']) {
					return sprintf('<img src="%s" >',GETIMG . $prefix . $attr['file']);
				} else {
					return '';
				}
			}, $content);

			$down = $this->path($html, '<div class="down-part">', '</div>');

			$input = $this->tag($down, 'input');
			$a = $this->tag($down, 'a');

			$down_pass = $this->attr($input[0])['value'];
			$extra_pass = $this->attr($input[1])['value'];
			$href = $this->attr($a[0])['href'];

			return array(
				'content' => $content,
				'download' => $down_pass,
				'extract' => $extra_pass,
				'href' => $href,
				'url' => $url
			);
		}

		public function parse($html) {
			$data = [];
			$tags = $this->tag($html, 'article');

			for ($i = 0, $len = count($tags); $i < $len; $i ++) {
				$a = $this->tag($tags[$i], 'a')[0];
				$attr = $this->attr($a);
				$temp = [];
				$temp['href'] = $attr['href'];
				$temp['img'] = GETIMG . $attr['file'];
				$temp['title'] = $attr['title'];

				preg_match_all($this->filter, $attr['title'], $res);

				if (count($res[0]) < 1) {
					$data[] = $temp;
				}
			}

			return $data;
		}
	}