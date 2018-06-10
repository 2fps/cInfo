/*jshint esversion: 6 */
const nodemailer = require('nodemailer'),
    schedule = require("node-schedule"),
    btHeaven = require('./controller/BTHeaven.js'),
    Film = require('./schema/filmSchema.js'),
    secret = require('../secret.js'),
    searchTime = new schedule.RecurrenceRule(),
    sendTime = new schedule.RecurrenceRule();

// 设置搜索时间
searchTime.hour = 1;
searchTime.minute = 0;
// 设置发送邮件的时间
sendTime.hour = 3;
sendTime.minute = 0;

// 开启搜索，即爬
function startFileCrawl() {
    schedule.scheduleJob(searchTime, function() {
        // BT天堂的爬虫
        btHeaven.startCrawl();
    });
}

// 推送邮件
function startSendMail() {
    schedule.scheduleJob(sendTime, function() {
        let data = Film.getNewestFilm(function(err, docs) {
            if (err) {
                return console.log('get film error');
            }
            if (0 === docs.length) {
                return console.log('no films');
            }
            let mailOptions = {
                from: secret.mailFrom,  //发件人
                to: secret.mailTo,  //收件人，可以设置多个
                subject: '测试-电影',  //邮件主题
                text: '',  //邮件文本
                html: ''  //html格式文本
            },
                transport = nodemailer.createTransport(secret.mailUrl);
                ht = '<div>';
            for (let i = 0; i < docs.length; ++i) {
                ht += '<div style="text-align:center;">';
                ht += '<a target="_blank" style="display: inline-block;" href="' + docs[i].url + '">';
                ht += '<img style="display: block;" src="' + docs[i].imagePath + '" />';
                ht += '<span style="display: block;">' + docs[i].name + '</span>';
                ht += '<span style="display: block;">' + docs[i].grade + '</span>';
                ht += '</a>';
                ht += '</div>';
            }
            ht += '</div>';
            mailOptions.html = ht;

            transport.sendMail(mailOptions, function(err, info){
                if (err){
                    return console.log('mail error', err);
                }
                console.log('Message sent: ' + info.response);
            });
        });
    });
}

function filmStart() {
    startFileCrawl();
    startSendMail();
}


exports.filmStart = filmStart;