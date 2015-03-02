// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
var express = require('express');
var debug = require('debug')('approvalRouter');
var router = express.Router();
var _ = require("underscore"); 
var Approval = require('../service/Approval.js');

router.route('/list')
.get(function(req, res){
    // Get user infomation list (GET)
    debug(req.query);
    var approval = new Approval();
    var result;
    if(req.query.startDate == '' || req.query.endDate == ''){
        result = approval.getApprovalList().then(function(result){
            debug("Complete Select Approval List.");
            res.send(result);    
        }).catch(function(e){
            debug("Error Select Approval List.");
            res.status(500);
            res.send({
                success:false,
                message: e.message,
                error:e
            });
        });
    }else{
        result = approval.getApprovalListWhere(req.query.startDate, req.query.endDate, req.query.managerId).then(function(result){
            debug("Complete Select Approval List Where.");
            res.send(result);    
        }).catch(function(e){
            debug("Error Select Approval List Where.");
            res.status(500);
            res.send({
                success:false,
                message: e.message,
                error:e
            });
        });
    }
    
});

router.route('/appIndex')
.get(function(req, res){
    // Get user infomation list (GET)
    debug(req.query);
    var approval = new Approval();
    var result = approval.getApprovalIndex(req.query.yearmonth).then(function(result){
        debug("Complete Select Approval List Where.");
        res.send(result);    
    }).catch(function(e){
        debug("Error Select Approval List Where.");
        res.status(500);
        res.send({
            success:false,
            message: e.message,
            error:e
        });
    });
    
});

router.route('/appIndex/add')
.post(function(req, res){
    var approval = new Approval(req.body);

    approval.setApprovalIndex().then(function(e){
        debug("Complete Add Approval.");
        res.send({success:true, msg:"Complete Add Approval."})
    }).catch(function(e){
        debug("Error Add Approval.");
        res.status(500);
        res.send({
            success:false,
            message: e.message,
            error:e
        });
    });
});

router.route('/')
.post(function(req, res){
    var approval = new Approval();
    approval.insertApproval(req.body).then(function(e){
        debug("Complete Add Approval.");
        res.send({success:true, msg:"Complete Add Approval."})
    }).catch(function(e){
        debug("Error Add Approval.");
        res.status(500);
        res.send({
            success:false,
            message: e.message,
            error:e
        });
    });
})

router.route('/bulk')
.put(function(req, res) {
	debug("###############결재 수정:");
    var approval = new Approval();
    approval.updateApprovalConfirm(req.body).then(function(e){
        debug("Complete Update Approval."); 
        res.send({success:true, msg:"Complete Update Approval."});
    }).catch(function(e){
        debug("Error Update Approval.");
        res.status(500);
        res.send({
            success:false,
            message: e.message,
            error:e
        });
    });
});

module.exports = router;
