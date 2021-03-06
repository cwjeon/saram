// 각 View 마다 동일한 변수나 function 이 있을경우 이곳에 추가하여 사용
// 각 View는 BaseView 를 상속 하여 생성한다.
define([
    'jquery',
	'underscore',
	'i18n!nls/common',
], function($, _, i18Common){
    var ADMIN=1,USER=0;
		var _menu=[{
		title:i18Common.MENU.TOP.BM, //기초자료
		subMenu:[{
			title:i18Common.MENU.SUB.BM.POSITION, //직급관리
			hashTag:"#positionmanager",
			auth:ADMIN,
			actionAuth:{
			add:ADMIN,
			remove:ADMIN,
			edit:ADMIN
				}
		},{
			title:i18Common.MENU.SUB.BM.DEPARTMENT, //부서관리
			hashTag:"#departmentmanager",
			auth:ADMIN,
			actionAuth:{
			add:ADMIN,
			remove:ADMIN,
			edit:ADMIN
				}
		},{
			title:i18Common.MENU.SUB.BM.PART, //파트관리
			hashTag:"#partmanager",
			auth:ADMIN,
			actionAuth:{
			add:ADMIN,
			remove:ADMIN,
			edit:ADMIN
				}
		},{
			title:i18Common.MENU.SUB.BM.HOLIDAY, //휴일 관리
			hashTag:"#holidaymanager",
			auth:ADMIN
		},{
			title:i18Common.MENU.SUB.BM.DOCUMENT, //양식관리
			hashTag:"#documentlist",
			auth:ADMIN
		},{
			title:i18Common.MENU.SUB.BM.BOOKDOCUMENT, //도서관리
			hashTag:"#bookdocument",
			auth:ADMIN
		}]
		},{
		title:i18Common.MENU.TOP.SM, //사원 관리
	    subMenu:[{
	        title:i18Common.MENU.SUB.SM.USER, //사용자 관리
	        hashTag:"#usermanager",
	        auth:USER,
	        actionAuth:{
	            add:ADMIN,
	            remove:ADMIN,
	            edit:ADMIN
	         }
	    },{
			title:i18Common.MENU.SUB.BM.ORGANIZATION, //조직도
			hashTag:"#organization",
			auth:ADMIN
		},{
	        title:"사진 등록", //사진 등록
	        hashTag:"#userpic",
	        auth:ADMIN
	    },{
	        title:i18Common.MENU.SUB.SM.VACATION, //연차 관리
	        hashTag:"#vacation",
	        auth:USER
	    }]
	        // ,{
	        //     title:i18Common.MENU.SUB.SM.REPORTCOMMUTE, //근태 레포트 
	        //     hashTag:"#reportCommute",
	        //     auth:ADMIN
	        // }]
		},{
        title:i18Common.MENU.TOP.AM,//일반관리
        subMenu:[{
			title:i18Common.MENU.SUB.AM.COMMUTE_TODAY, //"오늘의 근태 상황",
            hashTag:"#commutetoday",
            auth:USER
        },{
            title:i18Common.MENU.SUB.AM.ADD_RAW_DATA, //"출입 기록 등록",
            hashTag:"#addrawdata",
            auth:ADMIN
        },{
            title:i18Common.MENU.SUB.AM.RAW_DATA_LIST,//"출입 기록 조회",
            hashTag:"#rawdatalist",
            auth:USER
        },{
            title:i18Common.MENU.SUB.AM.CREATE_DATA, //"근태 자료 생성",
            hashTag:"#createdata",
            auth:ADMIN
        },{
            title:i18Common.MENU.SUB.AM.COMMUTE_MANAGER, //"근태 자료 관리",
            hashTag:"#commutemanager",
            auth:USER
        },{
            title:i18Common.MENU.SUB.AM.COMMUTE_MANAGER_COMMENT, //"근태 Comment 내역 관리",
            hashTag:"#commutemanager/comment",
            subTag:["/?/?"],
            auth:USER
        },{
            title:i18Common.MENU.SUB.AM.REPORT_MANAGER, //"근태 상신(list)",
            hashTag:"#reportmanager",
            auth:USER,
            actionAuth:{
                save:ADMIN
            }
        }]
		},{
		title:i18Common.MENU.TOP.RM,//회의실
        subMenu:[{
			title:i18Common.MENU.SUB.RM.ROOM_RESERVE, //"회의실 예약",
            hashTag:"#roomreserve",
            auth:USER
        }]
    }];
	return _menu;

});



