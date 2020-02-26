import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import data from '@/components/data'
import news from '@/components/news'
import music from '@/components/music'
import game from '@/components/game'
import image from '@/components/image'
import anime from '@/components/anime'
import bangumi from '@/components/bangumi'
import detail from '@/components/detail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      children: [
      	{
      		path: '/',
      		component: data,
      		name: '最新数据'
      	},
      	{
      		path: '/news',
      		component: news,
      		name: 'ACG资讯'
      	},
      	{
      		path: '/music',
      		component: music,
      		name: 'ACG音乐'
      	},
      	{
      		path: '/game',
      		component: game,
      		name: 'ACG游戏'
      	},
      	{
      		path: '/image',
      		component: image,
      		name: 'ACG图片'
      	},
      	{
      		path: '/anime',
      		component: anime,
      		name: 'ACG新番'
      	},
      	{
      		path: '/bangumi',
      		component: bangumi,
      		name: 'ACG动漫资源'
      	},
            {
                  path: '/detail/:type/:url/:title',
                  component: detail,
                  name: '查看内容'
            }
      ]
    }
  ]
})
