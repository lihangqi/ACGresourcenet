<?php 
	define('ACGCONFIG', true);
	require_once 'news.php';

	class Bangumi extends News {
		public $domain = 'https://anime.eiga.com';
		public $host = 'https://anime.eiga.com/program/';
		public $search_url = 'https://anime.eiga.com/program/season/%u-%s/';

		public function __construct() {}

		public function update() {
			$html = $this->strip($this->curl($this->host));
			return $this->parse($html);
		}

		public function search($year, $month = 1) {
			$url = sprintf($this->search_url, (int)$year, $this->season($month));
			$html = $this->strip($this->curl($url));
			return $this->parse($html);
		}

		public function parse($html) {
			$path = $this->path($html, '<div class="seasonBoxImg">', '</div>');
			$a = $this->tag($path, 'a');

			for ($i = 0, $len = count($a); $i < $len; $i ++) {
				$attr = $this->attr($a[$i]);
				$temp = [];
				$temp['href'] = $this->domain . $attr['href'];
				$temp['title'] = $attr['alt'];
				$temp['img'] = GETIMG . $attr['src'];

				if ($temp['title']) {
					$data[] = $temp;
				}
			}

			return $data;
		}

		public function season($month) {
			if ($month >= 1 && $month < 4) {
				return 'winter';
			} else if ($month >= 4 && $month < 7) {
				return 'spring';
			} else if ($month >= 7 && $month < 10) {
				return 'summer';
			} else {
				return 'autumn';
			}
		}

		public function get($url) {
			$html = $this->strip($this->curl($url));
			$path = $this->path($html, '<div class="animeTopContainer">', '<ul id="ob" class="clearfix">');
			$path = $this->delete($path, '<dl id="detailTvSche" class="animeDetailList">', '</dl>');

			return array(
				'content' => $path,
				'download' => null,
				'extract' => null,
				'href' => null,
				'url' => $url
			);
		}
	}