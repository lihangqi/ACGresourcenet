<?php
	class Replice {
		// 自闭合标签
		public $clsTag = ['meta','base','br','hr','img','input','col','frame','link','area','param','object','embed','keygen','source'];

		public function __construct() {}

		/*
		* 获取网页内容
		*　@param String $url 网页地址
		* @param Array $data　需要发送的数据/post　| array('key' => 'val')
		* @return String 网页内容
		*/
		public function curl($url, $data = null, $follow = true) {
			if (!$url) {
				return false;
			}

			$ci = curl_init();
			curl_setopt($ci, CURLOPT_URL, $url);
			curl_setopt($ci, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($ci, CURLOPT_ENCODING, 'gzip, deflate');
			
			if ($follow) {
				curl_setopt($ci, CURLOPT_FOLLOWLOCATION, 1);
			}

			if ($data) {
				curl_setopt($ci, CURLOPT_POST, 1);
				curl_setopt($ci, CURLOPT_POSTFIELDS, $data);
				curl_setopt($ci, CURLOPT_SSL_VERIFYPEER, false);
				curl_setopt($ci, CURLOPT_SSL_VERIFYHOST, false);
			}

			try {
				return curl_exec($ci);
			} catch(Exception $e) {
				return '';
			}
		}

		/*
		* 去除文本中的换行
		*　@param String $con 文本内容
		*　@return String 处理后的文本
		*/
		public function strip($con) {
			return preg_replace("/[\r\n]/", '', $con);
		}

		/*
		* 从指定文本中提取一段内容
		*　@param String $con 文本内容
		*　@param　String　$start　开始提取的位置
		*　@param　String $end 提取结束的位置
		* @return String 提取到的文本内容
		*/
		public function path($con, $start, $end) {
			$start = $this->complie($start);
			$end = $this->complie($end);
			$reg = sprintf('/%s.+?%s/', $start, $end);

			preg_match_all($reg, $con, $res);

			return join('', $res[0]);
		}

		/*
		* 将一个字符串转换成正则表达式
		*　@param String $str 需要转换的文本
		* @return String 正则表达式
		*/
		public function complie($str) {
			return preg_replace_callback('/[\s\'\"\/\-\?\+\$\#\~\!\*\.\[\]\{\}\(\)\,\=]{1}/', function ($word) {
				if ($word[0] === ' ') {
					return '\\s';
				} else {
					return '\\'.$word[0];
				}
			}, $str);
		}

		/*
		* 从html文本中提取一个或多个标签
		*　@param String $con html文本
		* @param String $tag 需要提取的标签名称
		* @return Array 一个或多个标签文本
		*/
		public function tag($con, $tag) {
			if (in_array($tag, $this->clsTag)) {
				$reg = sprintf('/<%s.+?>/', $tag, $tag, $tag);
			} else {
				$reg = sprintf('/<%s.+?>.+?<\/%s>/', $tag, $tag, $tag);
			}

			preg_match_all($reg, $con, $res);

			return $res[0];
		}

		/*
		* 解析html标签属性
		* @param String $con html文本
		* @return Array | array('key' => 'val')
		*/
		public function attr($con) {
			$data = [];

			preg_match_all('/\w+\=(\'|\")(|.+?)\1/', $con, $res);

			$attr = $res[0];

			for ($i = 0, $len = count($attr); $i < $len; $i ++) {
				$temp = explode('=', $attr[$i]);
				$key = $temp[0];
				array_shift($temp);
				$val = join('=', $temp);
				$data[$key] = preg_replace('/[\s\'\"]/', '', $val);
			}

			try {
				$data['content'] = preg_replace('/[\t\r\n]/', '', preg_replace('/<.+?>/', '', $con));
			} catch (Exception $e) {}

			return $data;
		}

		/*
		* 删除一段内容
		* @param String $con 需要删除的文本
		* @param String $start 删除的开始
		* @param String $end 删除的结束
		* @return String 删除后的文本
		*/
		public function delete($con, $start, $end) {
			$start = $this->complie($start);
			$end = $this->complie($end);
			$reg = sprintf('/%s.+?%s/', $start, $end);
			return preg_replace($reg, '', $con);
		}
	}