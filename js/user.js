var tbl_obj = null;
$(function(){
    //Date range picker
    Util.setDatePick();
    tbl_obj = Table.init();
    Util.menuActive();
    Util.bindEvt();
});
var Table = {
    init : function(){
        var obj = $('#userTab').DataTable({
            // dom: '<"col-sm-12 nopadding"l><"col-sm-5 nopadding"i><"col-sm-7 nopadding"p>frt<"col-sm-5 nopadding"i><"col-sm-7 nopadding"p>',
            autoWidth: false,
            searching: false,
            ordering: true,
            // order: [1 , 'asc'],
            lengthChange: true,
            lengthMenu: [[5, 30, 50], [10, 30, 50]],
            // pageLength: numrows,
            serverSide: true,   //开启SSP模式
            processing: true,
            stateSave: true,//保存状态
            stateDuration: -1,//sessionStorage
            ajax: function(data, callback){
                /*设置排序字段start*/
                var sort = '';
                var order = '';
                // var orderColumn = '';
                order = data.order[0].dir;

                /*设置排序字段end*/

                /*设置分页start*/
                var start = data.start;
                var pageSize = data.length;
                var pageNum = (start / pageSize) + 1;


                /*设置查询条件start*/
                var userParams = new Array();
                var s_userName = $("#s_userName").val();
                var s_mobile = $("#s_mobile").val();
                var s_address = $("#s_address").val();
                var reservation = $("#reservation").val();
                var dateall = reservation.split("~");

                if (s_userName != "" && s_userName != null && s_userName != "0") {
                    userParams.push({
                        userName : s_userName
                    })
                }
                if (s_mobile != "" && s_mobile != null && s_mobile != "0") {
                    userParams.push({
                        mobile : s_mobile
                    })
                }
                if (s_address != "" && s_address != null && s_address != "0") {
                    userParams.push({
                        address : s_address
                    })
                }
                if (reservation != "" && reservation != null && reservation != "0") {
                    userParams.push({
                        addTime : reservation
                    })
                }
                /*设置分页end*/
                $.ajax({
                    url: "/product/user/getUserList",
                    method: "POST",
                    dataType: "json",
                    async: false,
                    data: {
                        pageNum: pageNum,
                        pageSize: pageSize,
                        sort: sort,
                        order: order,
                        userName: s_userName,
                        mobile : s_mobile,
                        address : s_address,
                        startTime : dateall[0],
                        endTime :  dateall[1]
                    },
                    success: function(resp){
                        if(resp && resp.reply_code == "0"){
                            var dataObj = new Object();
                            var d = new Array();
                            $.each(resp.userPageInfo.list,function(k,v){
                                v.order = start + k + 1;
                                d.push(v);
                            });
                            dataObj.draw = 0;
                            dataObj.recordsTotal = resp.userPageInfo.total;
                            dataObj.recordsFiltered = resp.userPageInfo.total;
                            dataObj.data = d;
                            callback(dataObj);
                        }
                    }
                });
            },
            columns : [
                { data : "id", searchable : false, visible: false},
                { data : "userName", searchable : false, width:"10%" },
                { data : "mobile" , orderable: false, width:"10%"},
                { data : "address" , orderable: false, width:"10%"},
                { data : "showTime", orderable: false, width:"10%"},
                { data : "addUserName", orderable: false, width:"10%"},
                { data : "", orderable: false,
                    render: function(data, type, row) {
                    console.log(row);
                        var html ='<button class="btn btn-xs btn-primary" value="'+row.id+'" id="edit_button">编辑</button>&nbsp;&nbsp;&nbsp;&nbsp;'
                            +'<button class="btn btn-xs btn-success" value="'+row.id+'" id="check_button">查看</button>&nbsp;&nbsp;&nbsp;&nbsp;'
                            +'<button class="btn btn-xs btn-danger" value="'+row.id+'" id="delete_button">删除</button>';
                        return html;
                    }, width:"10%"
                }
            ],
            language : {
                sProcessing:        "处理中...",
                sLengthMenu:        "显示 _MENU_ 项结果",
                sZeroRecords:       "没有匹配结果",
                sInfo:          "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
                sInfoEmpty:     "显示第 0 至 0 项结果，共 0 项",
                sInfoFiltered:  "(由 _MAX_ 项结果过滤)",
                sInfoPostFix:   "",
                sSearch:            "搜索:",
                sUrl:               "",
                sEmptyTable:        "表中数据为空",
                sLoadingRecords:    "载入中...",
                sInfoThousands: ",",
                oPaginate: {
                    sFirst:     "首页",
                    sPrevious:  "上页",
                    sNext:      "下页",
                    sLast:      "末页"
                },
                oAria: {
                    sSortAscending:  ": 以升序排列此列",
                    sSortDescending: ": 以降序排列此列"
                }
            }
        });
        obj.on('order.dt search.dt',
            function () {
                obj.column(0, {
                    search: 'applied',
                    order: 'applied'
                }).nodes().each(function (cell, i) {
                    cell.innerHTML = i + 1;
                });
            }).draw();

        $("#searchBtn").on("click", function () {
            obj.ajax.reload();
        });
        $("#clearBtn").on("click", function() {
            $("#userSearchForm")[0].reset();
            obj.ajax.reload();

        })
        return obj;
    },
};
var Edit = {
    editHandler : function() {
        var userId = $("#edit_button").val();
        $("#edit_win").dialog();

    }
};

var	Util = {
    menuActive : function(){
        $('.nav collapse in').removeClass('in').attr('aria-expanded',false);
        $("#menu_user").addClass("active");
        $("#menu_userInfo").addClass('in').attr('aria-expanded',true);
    },
    setDatePick : function() {
        $('#reservation').daterangepicker({
            "timePicker": false,
            "timePicker24Hour": false,
            "linkedCalendars": false,
            "autoUpdateInput": false,
            "locale": {
                format: 'YYYY-MM-DD',
                separator: ' ~ ',
                applyLabel: "应用",
                cancelLabel: "取消",
                resetLabel: "重置",
            }
        }, function(start, end, label) {
            beginTimeStore = start;
            endTimeStore = end;
            // console.log(this.startDate.format(this.locale.format));
            // console.log(this.endDate.format(this.locale.format));
            if(!this.startDate){
                this.element.val('');
            }else{
                this.element.val(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format));
            }
        });

    },
    bindEvt : function(){
        $('#edit_button').click(Edit.editHandler);
        // $('#delete_button').click(Del.confirm);
        // $(".fa-sign-out").click(function(){
        //     tbl_obj.state.clear();
        // });

    }
};