<?php 
	define('ACGCONFIG', true);
	require_once 'replice.php';
	require_once 'config.php';

	class Index {
		public function __construct() {
			$this->re = new Replice();
			$this->switch($_GET['act']);
		}

		protected function switch($act) {
			switch($act) {
				case 'readImg':
					$this->readImg();
					break;
				case 'update':
					$this->readUpdate($_POST['type']);
					break;
				case 'get':
					$this->readDetail();
					break;
				case 'search':
					$this->getSearch();
					break;
			}
		}

		public function readImg() {
			$img = $_GET['img'];
			preg_match_all('/jpg|jpeg|png|gif|webp|JPG|JPEG|PNG|GIF|WEBP/', $img, $res);

			if (count($res[0]) > 0) {
				$prefix = $res[0][0];
			} else {
				$prefix = 'jpg';
			}

			header(sprintf('Content-Type: image/%s', $prefix));
			echo $this->re->curl($img);
		}

		public function readUpdate($type) {
			$mod = $this->loadMod($type);
			echo json_encode($mod->update());
		}

		public function loadMod($type) {
			require_once $type . '.php';

			switch ($type) {
				case 'image':
					return new Image();
					break;
				case 'news':
					return new News();
					break;
				case 'bangumi':
					return new Bangumi();
					break;
				case 'anime':
					return new Anime();
					break;
				case 'music':
					return new Music();
					break;
				case 'game':
					return new Game();
					break;
			}
		}

		public function readDetail() {
			$type = $_POST['type'];
			$url = $_POST['url'];
			$mod = $this->loadMod($type);

			echo json_encode($mod->get($url));
		}

		public function getSearch() {
			$type = $_POST['type'];
			$mod = $this->loadMod($type);
			$key = $_POST['key'];
			$page = $_POST['page'];

			echo json_encode($mod->search($key, $page));
		}
	}

	$index = new Index();