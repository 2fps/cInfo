/*jshint esversion: 6 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const filmSchema = new Schema({
    name: String,           // 电影名字
    url: String,            // 电影链接路径
    imagePath: String,      // 电影图片url
    updateDate: Date,     // 啥时候更新的
    score: Number,          // doupan评分
    clicks: {               // 点击次数
        type: Number,
        default: 0
    }
}, {
    versionKey: false
});

// 保存电影信息
filmSchema.methods.saveFilm = function(fn) {
    this.model('film').create({
        name: this.name,
        url: this.url,
        imagePath: this.imagePath,
        updateDate: new Date(),
        clicks: this.clicks
    }, fn);
};

// 判断是否存在该数据
filmSchema.statics.isExist = function(name, fn) {
    return this.findOne({
        name: name
    }, fn);
};

// 从数据库中取start到end条数
filmSchema.statics.getFileFromNumber = function(num, fn) {
    num = num || 20;

    this.find({}, null, {
        limit: 20
    }).exec(fn);
};
// 从数据库中取start到end条数
filmSchema.statics.getNewestFilm = function(fn) {
    let nowTime = new Date();

    return this.find({
        updateDate: {
            $gt: new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate(), 0, 0, 0)
        }
    }).exec(fn);
};

module.exports = mongoose.model('film', filmSchema);