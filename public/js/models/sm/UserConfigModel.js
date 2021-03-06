define([
  'jquery',
  'underscore',
  'backbone', 
], function($, _,Backbone){
    var UserConfigModel=Backbone.Model.extend({
        urlRoot: '/user/config',
        idAttribute:"_id",
        initialize: function () {
            _.bindAll(this, "remove");
            _.bindAll(this, "validation");
        },
    	validation:function(attrs){
    	    for(var name in attrs){
    	        var value=attrs[name];
    	        if (_.has(this.default, name)){//default에 있는 필드만 유효성 검사
        	        if (_.isUndefined(value) || _.isNull(value) || _.isEmpty(value)){
        	            return name + " field is require."
        	        }    
    	        }
    	    }
    	},        
        remove:function(){
            return this.destroy(); 
        },
        getCustomUrl: function (method) {//idAttribute값을 사용하지 않고 id로 할때
            switch (method) {
                case 'read':
                    return this.urlRoot + "/" + this.attributes.id;
                    break;
                case 'create':
                    return this.urlRoot;
                    break;
                case 'update':
                    return this.urlRoot + "/" + this.attributes.id;
                    break;
                case 'delete':
                    return this.urlRoot + "/" + this.attributes.id;
                    break;
            }
        },
        sync: function (method, model, options) {
            options || (options = {});
            options.url = this.getCustomUrl(method.toLowerCase());
            return Backbone.sync.apply(this, arguments);
        },
        default:{
            id:null,
            password: null,
            new_password:null
        },
        
    });
    
    return UserConfigModel;
});