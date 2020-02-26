<?php 
	define('ACGCONFIG', true);
	require_once 'game.php';
	
	class Anime extends Game {
		public $host = 'https://www.mikuclub.org/anime';
		public $filter = '/cos|COS|图片|音乐|资讯|MMD|mmd|主题|图包|游戏|gal|GAL|安装|stream|STREAM/';
		public $search_url = 'https://www.mikuclub.org/search/%s/page/%u?cat=942';

		public function __construct() {}
	}
