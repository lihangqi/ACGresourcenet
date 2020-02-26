<?php
	define('ACGCONFIG', true);
	require_once 'replice.php';
	require_once 'config.php';

	class Music extends Replice {
		public $host = 'http://www.acgjc.com/yy/';

		public function __construct() {
			parent::__construct();
		}

		public function update() {
			$html = $this->strip($this->curl($this->host));
			return $this->parse($html);
		}

		public function search($key, $page = 1) {
			$url = sprintf('http://www.acgjc.com/page/%u/?s=%s', $page, urlencode($key));
			$html = $this->strip($this->curl($url));
			
			return $this->parse($html);
		}

		public function parse($html) {
			$path = $this->path($html, '<div id="main">', '<!-- /#main -->');
			$tags = $this->tag($path, 'article');
			$data = [];

			for ($i = 0, $len = count($tags); $i < $len; $i ++) {
				$img = $this->attr($this->tag($tags[$i], 'img')[0]);
				$as = $this->tag($tags[$i], 'a');
				$attr = $this->attr($as[0]);
				$temp = [];

				preg_match_all('/'. $this->complie('www.acgjc.com/yy') .'/', $attr['href'], $res);

				if (count($res[0]) > 0) {
					$temp['href'] = $attr['href'];
					$temp['title'] = $img['alt'];
					$temp['img'] = GETIMG . $img['src'];

					$data[] = $temp;
				}
			}

			return $data;
		}

		public function get($url) {
			$data = [];
			$html = $this->strip($this->curl($url));
			$path = $this->path($html, '<div class="entry-content content-reset">', '<!-- entry-circle -->');

			$path = preg_replace_callback('/http\:\/\/img.+?\.jpg/', function ($src) {
				return GETIMG . $src[0];
			}, $path);

			$data['content'] = $path;

			$a = $this->path($html, '<a class="meta meta-post-storage"', '</a>');
			
			if (strlen($a) > 5) {
				$href = $this->attr($a)['href'];
				$html = $this->strip($this->curl($href));
				$path = $this->path($html, '<div class="post-download">', '<!-- /.fieldset-content -->');
				$input = $this->tag($path, 'input');
				$a = $this->tag($path, 'a');

				for ($i = 0, $len = count($input); $i < $len; $i ++) {
					$temp = $this->attr($input[$i]);
					$key = preg_replace('/.+?(\w+)\-\w+$/', '$1', $temp['id']);
					$val = $temp['value'];

					$data[$key] = $val;
				}

				for ($i = 0, $len = count($a); $i < $len; $i ++) {
					$temp = $this->attr($a[$i]);
					$data['href'] = $temp['href'];
				}
			}

			$data['url'] = $url;

			return $data;
		}

	}