// Author: sanghee park <novles@naver.com>
// Create Date: 2014.12.18
define([
  'jquery',
  'underscore',
  'backbone',
  'log',
  'schemas',
  'dialog',
  'datatables',
  'util',
  'text!templates/default/button.html',
  //'fnFindCellRowIndexes',
  'text!templates/component/grid.html',
  ], function($, _, Backbone, log, Schemas, Dialog, Datatables, Util, ButtonHTML, GridHTML){
    var LOG=log.getLogger('Grid');
    var gridId=0;
    var _glyphiconSchema=Schemas.getSchema('glyphicon');
    var _defaultGroupBtnTag='<span class="input-group-btn"></span>';
    var _defaultBtnTag='<button class="btn btn-default btn-sm btn-success grid-btn" type="button"></button>';
    
    var Grid = Backbone.View.extend({
    	initialize:function(options){
    	    var grid=this;
    	    $(window).on("resize", function(){
    	        LOG.debug("siba");
    	        grid.updateCSS(grid);     
    	    });
    	    
            this.options=options;
            this.buttonid=[]
            
            var _btns=this.options.buttons;
            if (_.isUndefined(_btns) || _.isNull(_btns) || _btns.length <= 0){
                _btns=["search"];
                LOG.debug(_btns);
                this.options.buttons=_btns;    
            }
            this.options.format=this.format;
            
            if (_.isUndefined(this.options.id) || _.isNull(this.options.id)){
                this.options.id = "grid-"+(gridId++);
            }
            
    		_.bindAll(this, 'render');
    		_.bindAll(this, 'getSelectItem');
    	    _.bindAll(this, 'updateRow');
    		_.bindAll(this, 'removeRow');
    		_.bindAll(this, 'search');
    		this.render();
    	},
    	updateCSS:function(){
    	    var width=$(window).width();
    	    var _padding=38;
    	    var API=this.DataTableAPI;

            var _columns = this.columns;
            var _cTotallWidth=0;
            var column;
            if (width > 768) {
                for (var index in _columns){
                    column=API.column(index);
                    column.visible(index > 0);
                }
            } else if ( width  < 768) {
                
                API.column(index).visible(true);
                 for (var index in _columns){
                    column=API.column(index);
                    
                    var header=column.header();
                    //var _pWidth= header.parentNode.offsetWidth;
                    var _cWidth = header.offsetWidth;
                    _cTotallWidth=_cTotallWidth+_cWidth;
                    
                    if (width < _cTotallWidth+_padding){
                        column.visible(false);
                    } else {
                        column.visible(true);
                    }
                }
            }
    	},
    	format : function (rowData) {
    	    var _result=$('<div></div>');
    	    var _subTable=$('<table class="subTable" cellpadding="5" cellspacing="0" border="0" ></table>');
    	    
    	    for (var name in rowData){
    	        var index=_.indexOf(this.dataschema, name);
    	        if (-1 < index){
    	            var _column=this.column[index];
    	            var _value;
    	            if (_.isObject(_column)){
    	                if (!_.isUndefined(_column.render)){
    	                    _value=_column.render({},{},rowData);
    	                    if(_.isNull(_value)){
    	                        _value ="";
    	                    }
    	                } else {
    	                    _value=rowData[name];
    	                }
    	                _column=_column.title;
    	            }   else {
	                    _value=rowData[name];
	                }
    	            
    	            _subTable.append(
        	            '<tr>'
        	                +'<td>'+_column+'</td>'
                            +'<td>'+_value+'</td>'
                        +'</tr>'
        	        );
    	        }
    	        
    	    }
    	    _result.append(_subTable);
    	    
            return _result.html();
        },
    	getSelectItem:function(){//선택된 row 가져오기
    	    if (_.isUndefined(this.DataTableAPI)){
    	       return _.noop(); 
    	    }
    	    var selectItem=this.DataTableAPI.row('.selected').data();
    	    return selectItem;
    	},
    	getDataAt:function(idx){ // 데이터 배열에서 index 값으로 가져오기 
    	    if (_.isUndefined(this.DataTableAPI)){
    	       return _.noop(); 
    	    }
    	    var selectItem=this.DataTableAPI.row(idx).data();
    	    return selectItem;
    	},
    	getNodeAt:function(rowIndex, colIndex){
    	    if (_.isUndefined(this.DataTableAPI)){
    	       return _.noop(); 
    	    }
    	    var selectedNode=this.DataTableAPI.cell({row : rowIndex, column : colIndex}).node();
    	    return selectedNode;
    	},
    	getRowNodeAt:function(rowIdx){
    	    if (_.isUndefined(this.DataTableAPI)){
    	       return _.noop(); 
    	    }
    	    var selectedNode=this.DataTableAPI.row(rowIdx).node();
    	    return selectedNode;
    	},
    	getColumnNodeAt:function(colIdx){
    	    if (_.isUndefined(this.DataTableAPI)){
    	       return _.noop(); 
    	    }
    	    var selectedNode=this.DataTableAPI.row(colIdx).node();
    	    return selectedNode;
    	},
    	removeRow:function(item, index){//선택된 row 삭제 //default 선택된 아이템  index로 하려면. index 를 넣어주세요
    	    if (_.isUndefined(index)){
    	        this.DataTableAPI.row('.selected').remove().draw( false );
    	    } else if (_.isNumber(index)){
    	        this.DataTableAPI.row(index).remove().draw( false );
    	    }
    	},
    	addRow:function(item, index){//add row 
    	    this.DataTableAPI.row.add(item).draw();
    	},
    	updateRow:function(item, index){//default 선택된 아이템  index로 하려면. index 를 넣어주세요.
    	    if (_.isUndefined(index)){
    	        this.DataTableAPI.row('.selected').data(item).draw();
    	    } else if (_.isNumber(index)){
    	        this.DataTableAPI.row(index).data(item).draw();
    	    }
    	},
    	search:function(value, regex, smart){
    	    this.DataTableAPI.search(
                value,
                _.isUndefined(regex)?false:regex,
                _.isUndefined(smart)?false:smart
            ).draw();
    	},
    	_crteateDefaultButton:function(id, name){
    	    var _buttonIcon=$(ButtonHTML);
    	    //_buttonIcon.attr("id", id);
            _buttonIcon.addClass(_glyphiconSchema.value(name));
            
            var _button=$(_defaultBtnTag);
            _button.attr("id", id);
            _button.append(_buttonIcon);
            this._defatulInputGroup.append($(_defaultGroupBtnTag).append(_button));       
            return _button;
    	},
    	_crteateCustomButton:function(obj){
    	    var _grid=this;
    	    var _buttonIcon=$(ButtonHTML);
    	    var _btnId=this.options.id +"_custom_"+ obj.name +"_Btn";
    	    //_buttonIcon.attr("id", _btnId);
            _buttonIcon.addClass(_glyphiconSchema.value(obj.name));

            this.buttonid[obj.name] = _btnId;
            var _button=$(_defaultBtnTag);
            _button.attr("id", _btnId);
            _button.append(_buttonIcon);
            this._defatulInputGroup.append($(_defaultGroupBtnTag).append(_button));
            _button.click(function(){
                if(_.isFunction(obj.click)){
                    var callback=obj.click;
                    callback(_grid);
                }
            })
    	},
    	_createSearchButton:function(name){
    	    var _grid=this;
    	    var _btnId=this.options.id +"_"+ name +"_Btn";
    	    
    	    var _defaultSearchInput=$('<input type="text" class="form-control" placeholder="Search">');
    	    _defaultSearchInput.addClass('yes-form-control');
    	    this._defatulInputGroup.append(_defaultSearchInput);
    	    this._defatulInputGroup.css({display:"table"});
    	    
    	    _defaultSearchInput.on('keyup',function(key){
    	         _grid.search(this.value,false,true);          
    	    });
    	    this.buttonid["search"] = _btnId;
    	    this._crteateDefaultButton(_btnId, name);
    	},
    	_createRefreshButton:function(name){
    	    var _grid=this;
    	    var _btnId=this.options.id +"_"+ name +"_Btn";
    	    var _btn=this._crteateDefaultButton(_btnId, name);
    	    this.buttonid["refresh"] = _btnId;
    	     //refresh event
    	    _btn.click(function(){
                _grid.render();//ew.render();
            });
    	},
    	_drawButtons:function(){//button draw
    	    var _grid=this;
    	    var _btns=this.options.buttons;
            
    	    //Button Group
    	    if($("#"+this.options.el).find(".input-group")){
    	        $("#"+this.options.el).find(".input-group").remove();
    	    }
    	    this._defatulInputGroup=$('<div class="input-group input-group-sm"></div>');
    	    
    	    for (var index in _btns){
    	        var obj = _btns[index];
    	        var name;
    	        if (_.isString(obj)){
    	            name=obj;
    	        } else if (_.isObject(obj)){
    	            if (_.isUndefined(obj.type) || _.isNull(obj.type) || _.isEmpty(obj.type)){
    	                continue;
    	            }
    	            
    	            name=obj.type;
    	        }
    	        switch (name) {
    	            case "search" :
                	    this._createSearchButton(name);
    	                break;
    	            case "custom" :
    	                this._crteateCustomButton(obj);
    	                break;
                    case "refresh" :
                        this._createRefreshButton(name);
                        break;
    	        }
    	    }
            
    	    $("#"+this.options.el).append(this._defatulInputGroup);
    	},
    	_draw:function(){
    	    var _grid = this;
    	    
    	    this._drawButtons();
    	
    	    if($.fn.DataTable.isDataTable($("#"+this.options.el).find("#"+this.options.id))){//
    	        $("#"+this.options.el).find("#"+this.options.id).parent().remove();
    	    }
    	    
    	    var _columns=[];
    	    if(this.options.detail){
                _columns.push({
                    "className":      'details-control',
                    "orderable":      false,
                    "data":           null,
                    "defaultContent": ''
                });
    	    }
            
    	    for (var i=0; i < this.options.column.length; i++){// 컬럼 만들기.
    	        var _column=this.options.column[i];
    	        if (_.isObject(_column)){
    	            _columns.push(_column);
    	        } else {
    	            _columns.push({ "title":this.options.column[i], "data" : this.options.dataschema[i] });
    	        }
    	    }
    	    
    	    this.columns= _columns;
    	    
    	    //dataTable reander
    	    var _dataTable=$(GridHTML);
            $("#"+this.options.el).append(_dataTable);
    	    _dataTable.attr("id", this.options.id);
            _dataTable.dataTable({
                "lengthChange": false,
                "sDom": '<"top">rt<"bottom"ip>',// _dataTable display controll
     	        "data" : this.options.collection.toJSON(),
     	        "columns" : _columns,
     	        "rowCallback" : _.isUndefined(this.options.rowCallback) ? null : this.options.rowCallback
     	    });
     	    
     	    //ROW click
     	    _dataTable.find("tbody").on( 'click', 'tr', function () {
                if ( $(this).hasClass('selected') ) {
                    $(this).removeClass('selected');
                }
                else {
                    _dataTable.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                }
            } );
            
            //dataTableAPI
            var _tableAPI=_dataTable.dataTable().api();
            
            if(this.options.detail){//상세 페이지.
                $("#"+this.options.id+" tbody").on('click', 'td.details-control', function () {
                    var tr = $(this).closest('tr');
                    var row = _tableAPI.row( tr );
                
                    if ( row.child.isShown() ) {
                        // This row is already open - close it
                        row.child.hide();
                        tr.removeClass('shown');
                    }
                    else {
                        // Open this row
                        row.child( _grid.options.format(row.data())).show();
                        tr.addClass('shown');
                    }
                });
            }
            this.DataTableAPI=_tableAPI;
            this.updateCSS();
    	},
    	getButton: function(name){
    	    return this.buttonid[name];
    	    
    	},
    	render:function(){
    	   var grid = this;
    	   
    	   if(Util.isNull(this.options.fetch) || this.options.fetch === true){
    	       var _defaultFetchParams={
        	       success: function(){
        	           grid._draw();
        	       }
        	   };
    	       if (!_.isUndefined(this.options.fetchParam)){
    	           _defaultFetchParams=_.extend(_defaultFetchParams, this.options.fetchParam);
    	       }
        	   this.options.collection.fetch(_defaultFetchParams);    
    	   }else{
    	       grid._draw();
    	   }
    	   return grid;
     	},
     	renderDfd:function(){
     	    var dfd= new $.Deferred();
     	    var grid = this;
    	   
    	   if(Util.isNull(this.options.fetch) || this.options.fetch === true){
    	       var _defaultFetchParams={
        	       success: function(){
        	           grid._draw();
        	           dfd.resolve();
        	       }
        	   };
    	       if (!_.isUndefined(this.options.fetchParam)){
    	           _defaultFetchParams=_.extend(_defaultFetchParams, this.options.fetchParam);
    	       }
        	   this.options.collection.fetch(_defaultFetchParams);    
    	   }else{
    	       grid._draw();
    	       dfd.resolve();
    	   }
    	   return dfd.promise();
     	}
    });
    return Grid;
});