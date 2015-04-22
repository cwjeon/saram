// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
// 사용자 Service
var _ = require("underscore"); 
var Promise = require('bluebird');
var CommuteDao = require('../dao/commuteDao.js');
var ChangeHistoryDao = require('../dao/changeHistoryDao.js');
var db = require('../lib/dbmanager.js');

var Commute = function() {	
	var _getCommute = function(data) {
		return CommuteDao.selectCommute(data);
			
	};
	var _insertCommute = function(data){
		return new Promise(function(resolve, reject){
			db.getConnection().then(function(connection){
				var promiseArr = [];
				promiseArr.concat(CommuteDao.insertCommute(connection, data));
				Promise.all(promiseArr).then(function(resultArr){
					connection.commit(function(){
						connection.release();
						resolve();
					});
				},function(){
					connection.rollback(function(){
						connection.release();
						reject();
					});
				});	
			});
		});
	};
	
	var _updateCommute = function(data){
		return new Promise(function(resolve, reject){
			db.getConnection().then(function(connection){
				var promiseArr = [];
				
				promiseArr.concat(CommuteDao.updateCommute_t(connection, data.data));
				promiseArr.concat(ChangeHistoryDao.inserChangeHistory(connection, data.changeHistory));
				Promise.all(promiseArr).then(function(resultArr){
					connection.commit(function(){
						connection.release();
						resolve();
					});
				},function(){
					connection.rollback(function(){
						connection.release();
						reject();
					});
				});	
			});
		});
	};
	
	var _getCommuteDate = function(date){
		return CommuteDao.selectCommuteDate(date);
	};
	
	var _getCommuteByID = function(data){
		return CommuteDao.selectCommuteByID(data);
	};
	
	var _getLastiestDate = function(){
		return CommuteDao.getLastiestDate();
	};
	
	return {
		getCommute : _getCommute,
		updateCommute : _updateCommute,
		insertCommute : _insertCommute,
		getCommuteDate : _getCommuteDate,
		getCommuteByID: _getCommuteByID,
		getLastiestDate : _getLastiestDate
	};
};

module.exports = new Commute();
