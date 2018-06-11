/*jshint esversion: 6 */
const cheerio = require('cheerio');
const http = require('http');
const Film = require('../schema/filmSchema.js');
const url = 'http://www.btrenren.com/';
// 用来存储请求网页的整个html内容
let html = '';

let StartBTHeaven = function() {
    this.startCrawl = function() {
        http.get(url, dealReq).on('error', function (err) {
            console.log(err);
        });
    };
};

function dealReq(res) {
    res.setEncoding('utf-8');   // 防止中文乱码
    //监听data事件，每次取一块数据
    res.on('data', function (chunk) {
        html += chunk;
    });
    //监听end事件，如果整个网页内容的html都获取完毕，就执行回调函数
    res.on('end', dealInfo);
    res.on('error', dealError);
    console.log(333333);
}

function dealInfo() {
    var $ = cheerio.load(html); //采用cheerio模块解析html
    var data = {
        newestFilms: $('.ml').find('div.item.cl'),
        names: []
    };
    console.log(11111);
    var showData = [];
    var ht = '<div>';

    if (data.newestFilms) {
        for (let i = 0; i < data.newestFilms.length; ++i) {
            showData.push({
                name: data.newestFilms.eq(i).find('p.tt').find('a').attr('title'),
                url: url + data.newestFilms.eq(i).find('p.tt').find('a').attr('href').substring(1),
                imagePath: url + data.newestFilms.eq(i).find('.litpic').find('img').attr('src').substring(1),
                score: data.newestFilms.eq(i).find('p.rt').find('strong').text() + '.' + data.newestFilms.eq(i).find('p.rt').find('em.fm').text() || '0'
            });
        }
    }

    showData.forEach(function(value) {
        let film = new Film({
            name: value.name,
            url: value.url,
            imagePath: value.imagePath,
            score: value.score
        });

        Film.isExist(value.name, function(err, doc) {
            if (err) {
                return console.log('something error');
            }
            if (doc) {
                return console.log('isExist');
            }
            film.saveFilm();
        });
    });
};

function dealError(err) {
    console.log(err);
}


module.exports = new StartBTHeaven();