
$(function () {
    var token = window.sessionStorage.getItem('token');
    if (window.location.search.indexOf('?aid=') > -1) {
        var aid = window.location.search.split('?aid=')[1].split('&')[0];
        var gid = window.location.search.split('&gw=')[1];
        var menu = JSON.parse(window.sessionStorage.getItem('adminMenu'));
        var loginInfo = JSON.parse(window.sessionStorage.getItem('loginInfo'));
        $('.admin-detail-username').text(loginInfo.name);
        $('.admin-detail-avatar').attr('src', loginInfo.avatarUrl);
        $('.admin-user-avatar-head').attr('src',loginInfo.avatarUrl);
        var data = menu;
        //多级菜单
        $('#admin-detail-tree').tree({
            dataSource: function (options, callback) {
                // 模拟异步加载
                setTimeout(function () {
                    callback({ data: options.products || data });
                }, 400);
            },
            multiSelect: false,
            cacheItems: true,
            folderSelect: false
        });
        //多级菜单-跳转详情页
        $('#admin-detail-tree').on('selected.tree.amui', function (event, data) {
            var gid = data.target.id;
            window.location.href = '/detail.html?aid=' + aid + '&gw=' + gid

        });


        //点击头像跳转管理员页面
        $('.admin-user-info').on('click', function () {
            window.location.href = '/info.html?aid=' + aid;
        })
        $('.admin-user-avatar-head').on('click', function (e) {
            e.stopPropagation();
            window.location.href = '/info.html?aid=' + aid;
        })
        //获取网关信息
        $.ajax({
            type: 'GET',
            url: 'http://47.52.236.134:3389/v1/gateways/' + gid + '?aid=' + aid,
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (res) {
                if (res.code == 0) {
                    $('.admin-detail-head').text('网关#' + gid);
                    $('.admin-content-item-img').attr('src', res.gateway.qrcode);
                    $('.admin-detail-gw-name').text('网关#' + gid);
                    $('.admin-detail-gw-other-name-input').val(res.gateway.alias);
                    $('.admin-detail-item-input').text('别名：' + res.gateway.alias);
                    if (res.gateway.currentStatus == 1) {
                        $('.admin-detail-status-pause').show();
                        $('.admin-detail-status-play').hide();
                        $('.admin-content-item-status').text('使用中')
                    } else if (res.gateway.currentStatus == 0) {
                        $('.admin-detail-status-pause').hide();
                        $('.admin-detail-status-play').show();
                        $('.admin-content-item-status').text('空闲')
                    } else if (res.gateway.currentStatus == -1) {
                        $('.admin-detail-status-pause').hide();
                        $('.admin-detail-status-play').show();
                        $('.admin-content-item-status').text('禁用');
                    } else if (res.gateway.currentStatus == -2) {
                        $('.admin-content-item-status').text('电量低');
                        $('.admin-detail-status-pause').hide();
                        $('.admin-detail-status-play').show();
                    }
                    $('.admin-detail-item-input').val(res.gateway.address.formatted_address);
                    $('.admin-detail-use-count').text(res.gateway.lockList.available);
                    $('.admin-detail-device-total').text(res.gateway.lockList.total);
                    var lists = res.gateway.lockList.list;
                    var htmls = [];
                    for (var i = 0; i < lists.length; i++) {
                        var closeText = '';
                        var currentStatus = null;
                        if (lists[i].currentStatus == 1) {
                            currentStatus = '使用中'
                            closeText = '禁用'
                        } else if (lists[i].currentStatus == 0) {
                            currentStatus = '空闲'
                            closeText = '禁用'
                        } else if (lists[i].currentStatus == -1) {
                            currentStatus = '禁用'
                            closeText = '启用'
                        } else if (lists[i].currentStatus == -2) {
                            currentStatus = '电量低';
                            closeText = '禁用';
                        }
                       
                        var nickName = lists[i].currentUser.nickName ? lists[i].currentUser.nickName : '无人';
                        var alias = lists[i].alias ? lists[i].alias : '';
                        var imgSrc = lists[i].currentUser.avatarUrl ? lists[i].currentUser.avatarUrl : 'assets/img/timg.jpeg'
                        var html = '<div class="am-u-sm-12 am-u-md-6 am-u-lg-3 admin-detail-item">' +
                            '<div class="am-cf admin-detail-list">' +
                            '<img class="admin-detail-img" src="' + imgSrc + '" alt="">' +
                            '<div class="admin-detail-content">' +
                            '<div class="admin-detail-content-left">' +
                            '<span class="admin-detail-content-device-name">' + alias + '</span>' +
                            '<span class="admin-detail-content-user-name">' + nickName + '</span>' +
                            '</div>' +
                            '<div class="admin-detail-content-right">' +
                            '<span class="admin-detail-content-status">' + currentStatus + '</span>' +
                            '<div class="admin-detail-content-btns">' +
                            '<span class="admin-detail-content-open" data-index="' + i + '" data-currentstatus="' + lists[i].currentStatus + '" data-lid="' + lists[i].lid + '">打开</span>' +
                            '<span class="admin-detail-content-close" data-index="' + i + '" data-currentstatus="' + lists[i].currentStatus + '" data-lid="' + lists[i].lid + '">' + closeText + '</span>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>'
                        htmls.push(html)
                        
                    }
                    $('.admin-detail-lists').append(htmls)
                    for(var j = 0; j < lists.length; j++) {
                        // if(JSON.stringify(lists[j].currentUser) ==  '[]') {
                        //     $('.admin-detail-item').eq(j).find('.admin-detail-content-btns').hide()
                        // } else {
                        //     $('.admin-detail-item').eq(j).find('.admin-detail-content-btns').show()
                        // }
                        if (lists[j].currentStatus == 1) {
                            $('.admin-detail-item').eq(j).find('.admin-detail-list').removeClass('yellow')
                            $('.admin-detail-item').eq(j).find('.admin-detail-list').removeClass('green')
                            $('.admin-detail-item').eq(j).find('.admin-detail-list').removeClass('red')
                            $('.admin-detail-item').eq(j).find('.admin-detail-list').addClass('blue')
                        } else if (lists[j].currentStatus == 0) {
                            $('.admin-detail-item').eq(j).find('.admin-detail-list').removeClass('yellow')
                            $('.admin-detail-item').eq(j).find('.admin-detail-list').removeClass('blue')
                            $('.admin-detail-item').eq(j).find('.admin-detail-list').removeClass('red')
                            $('.admin-detail-item').eq(j).find('.admin-detail-list').addClass('green')
                        } else if (lists[j].currentStatus == -1) {
                            $('.admin-detail-item').eq(j).find('.admin-detail-list').removeClass('green')
                            $('.admin-detail-item').eq(j).find('.admin-detail-list').removeClass('blue')
                            $('.admin-detail-item').eq(j).find('.admin-detail-list').removeClass('red')
                            $('.admin-detail-item').eq(j).find('.admin-detail-list').addClass('yellow')
                        } else if (lists[j].currentStatus == -2) {
                            $('.admin-detail-item').eq(j).find('.admin-detail-list').removeClass('green')
                            $('.admin-detail-item').eq(j).find('.admin-detail-list').removeClass('blue')
                            $('.admin-detail-item').eq(j).find('.admin-detail-list').removeClass('yellow')
                            $('.admin-detail-item').eq(j).find('.admin-detail-list').addClass('red')
                        }
                    }
                    
                    for (var j = 0; j < lists.length; j++) {
                        if (lists[j].currentStatus == -2) {
                            $('.admin-detail-item').eq(j).find('.admin-detail-content-open').addClass('active')
                            $('.admin-detail-item').eq(j).find('.admin-detail-content-close').addClass('active')
                        } else if (lists[j].currentStatus == 1 || lists[j].currentStatus == -1) {
                            // $('.admin-detail-item').eq(j).find('.admin-detail-content-open').addClass('active')
                        }
                    }
                    $('.admin-detail-item-edit').on('click',function(){
                        if ($('.admin-detail-gw-other-name-input').attr('disabled')) {
                            $('.admin-detail-gw-other-name-input').attr('disabled', false)
                            $('.admin-detail-gw-other-name-input').addClass('active');
                        } else {
                            $('.admin-detail-gw-other-name-input').attr('disabled', true)
                            $('.admin-detail-gw-other-name-input').removeClass('active');
                            var addressData = {
                                "address": $('.admin-detail-item-input').val(),
                                "currentStatus": res.gateway.currentStatus,
                                "alias": $('.admin-detail-gw-other-name-input').val()
                            }
                            $.ajax({
                                type: 'POST',
                                url: 'http://47.52.236.134:3389/v1/gateways/' + gid + '?aid=' + aid,
                                headers: {
                                    'Authorization': 'Bearer ' + token
                                },
                                data: JSON.stringify(addressData),
                                success: function (res) {
                                    if (res.code == 0) {

                                    } else {
                                        $('.admin-toast').text('网络中断，请重试');
                                        $('.admin-toast').show();
                                        setTimeout(function () {
                                            $('.admin-toast').hide();
                                        }, 1500)
                                    }
                                }
                            })
                        }
                    })
                    //修改地址
                    $('.admin-content-item-edit').on('click', function () {
                        if ($('.admin-content-item-input').attr('disabled')) {
                            $('.admin-content-item-input').attr('disabled', false)
                            $('.admin-content-item-input').addClass('active');
                        } else {
                            $('.admin-content-item-input').attr('disabled', true)
                            $('.admin-content-item-input').removeClass('active');
                            var addressData = {
                                "address": $('.admin-detail-item-input').val(),
                                "currentStatus": res.gateway.currentStatus,
                                "alias": $('.admin-detail-gw-other-name-input').val()
                            }
                            $.ajax({
                                type: 'POST',
                                url: 'http://47.52.236.134:3389/v1/gateways/' + gid + '?aid=' + aid,
                                headers: {
                                    'Authorization': 'Bearer ' + token
                                },
                                data: JSON.stringify(addressData),
                                success: function (res) {
                                    if (res.code == 0) {

                                    } else {
                                        $('.admin-toast').text('网络中断，请重试');
                                        $('.admin-toast').show();
                                        setTimeout(function () {
                                            $('.admin-toast').hide();
                                        }, 1500)
                                    }
                                }
                            })
                        }
                    })
                    //修改状态
                    $('.admin-detail-status-pause').on('click', function () {
                        var addressData = {
                            "address": $('.admin-detail-item-input').val(),
                            "currentStatus": "0",
                            "alias": $('.admin-detail-gw-other-name-input').val()
                        }
                        $.ajax({
                            type: 'POST',
                            url: 'http://47.52.236.134:3389/v1/gateways/' + gid + '?aid=' + aid,
                            headers: {
                                'Authorization': 'Bearer ' + token,
                                'Content-Type': 'application/json'
                            },
                            data: JSON.stringify(addressData),
                            success: function (res) {
                                if (res.code == 0) {
                                    $('.admin-detail-status-pause').hide()
                                    $('.admin-detail-status-play').show()
                                    $('.admin-content-item-status').text('空闲')
                                } else {
                                    $('.admin-toast').text('网络中断，请重试');
                                    $('.admin-toast').show();
                                    setTimeout(function () {
                                        $('.admin-toast').hide();
                                    }, 1500)
                                }
                            }
                        })
                    })
                    $('.admin-detail-status-play').on('click', function () {
                        var addressData = {
                            "address": $('.admin-detail-item-input').val(),
                            "currentStatus": "1",
                            "alias": $('.admin-detail-gw-other-name-input').val()
                        }
                        $.ajax({
                            type: 'POST',
                            url: 'http://47.52.236.134:3389/v1/gateways/' + gid + '?aid=' + aid,
                            headers: {
                                'Authorization': 'Bearer ' + token
                            },
                            data: JSON.stringify(addressData),
                            success: function (res) {
                                if (res.code == 0) {
                                    $('.admin-detail-status-pause').show()
                                    $('.admin-detail-status-play').hide()
                                    $('.admin-content-item-status').text('使用中')
                                } else {
                                    $('.admin-toast').text('网络中断，请重试');
                                    $('.admin-toast').show();
                                    setTimeout(function () {
                                        $('.admin-toast').hide();
                                    }, 1500)
                                }
                            }
                        })
                    })

                    $('.admin-detail-content-open').unbind('click').on('click', function (e) {
                        var lid = e.target.dataset.lid;
                        var currentStatus = e.target.dataset.currentstatus;
                        var index = e.target.dataset.index;
                        
                        if (currentStatus == -2 || currentStatus == 1) return;
                        $.ajax({
                            type: "POST",
                            url: 'http://47.52.236.134:3389/v1/locks/' + lid + '/op?aid=' + aid,
                            headers: {
                                'Authorization': 'Bearer ' + token
                            },
                            success: (res) => {
                                if (res.code == 0) {
                                    // $('.admin-detail-item').eq(index).find('.admin-detail-content-status').text('使用中')
                                    // $('.admin-detail-item').eq(index).find('.admin-detail-content-close').text('禁用')
                                    // $('.admin-detail-item').eq(index).find('.admin-detail-list').removeClass('yellow')
                                    // $('.admin-detail-item').eq(index).find('.admin-detail-list').removeClass('green')
                                    // $('.admin-detail-item').eq(index).find('.admin-detail-list').removeClass('red')
                                    // $('.admin-detail-item').eq(index).find('.admin-detail-list').addClass('blue')
                                
                                }
                            }
                        })

                    })
                    $('.admin-detail-content-close').unbind('click').on('click', function(e){
                        var currentStatusDetail = e.target.dataset.currentstatus;
                        if (currentStatusDetail == -2) return;
                        $('#dialog').show();
                        $('.dialog-sure').unbind('click').on('click', function(){
                            var index = e.target.dataset.index;
                            var lid = e.target.dataset.lid;
                            console.log(index)
                            if (currentStatusDetail == 1 || currentStatusDetail == 0) {
                                data = {
                                    currentStatus: "-1"
                                }
                                $.ajax({
                                    type: "POST",
                                    url: 'http://47.52.236.134:3389/v1/locks/' + lid + '?aid=' + aid,
                                    headers: {
                                        'Authorization': 'Bearer ' + token
                                    },
                                    data: JSON.stringify(data),
                                    success: (res) => {
                                        if (res.code == 0) {
                                            $('.admin-detail-item').eq(index).find('.admin-detail-content-close').text('启用')
                                            $('.admin-detail-item').eq(index).find('.admin-detail-content-close').attr('data-currentstatus', '-1')
                                            $('.admin-detail-item').eq(index).find('.admin-detail-content-status').text('禁用')
                                            // $('.admin-detail-item').eq(index).find('.admin-detail-content-open').addClass('active')
                                            $('.admin-detail-item').eq(index).find('.admin-detail-content-open').attr('data-currentstatus', '-1')
                                            $('.admin-detail-item').eq(index).find('.admin-detail-list').removeClass('green')
                                            $('.admin-detail-item').eq(index).find('.admin-detail-list').removeClass('blue')
                                            $('.admin-detail-item').eq(index).find('.admin-detail-list').removeClass('red')
                                            $('.admin-detail-item').eq(index).find('.admin-detail-list').addClass('yellow')
                                            $('#dialog').hide();
                                        }
                                    }
                                })
                            } else if (currentStatusDetail == -1) {
                                data = {
                                    currentStatus: "1"
                                }
                                $.ajax({
                                    type: "POST",
                                    url: 'http://47.52.236.134:3389/v1/locks/' + lid + '?aid=' + aid,
                                    headers: {
                                        'Authorization': 'Bearer ' + token
                                    },
                                    data: JSON.stringify(data),
                                    success: (res) => {
                                        if (res.code == 0) {
                                            $('.admin-detail-item').eq(index).find('.admin-detail-content-close').text('禁用')
                                            $('.admin-detail-item').eq(index).find('.admin-detail-content-close').attr('data-currentstatus', '1')
                                            $('.admin-detail-item').eq(index).find('.admin-detail-content-status').text('空闲')
                                            $('.admin-detail-item').eq(index).find('.admin-detail-content-open').attr('data-currentstatus', '0')
                                            // $('.admin-detail-item').eq(index).find('.admin-detail-content-open').removeClass('active')
                                            $('.admin-detail-item').eq(index).find('.admin-detail-list').removeClass('yellow')
                                            $('.admin-detail-item').eq(index).find('.admin-detail-list').removeClass('blue')
                                            $('.admin-detail-item').eq(index).find('.admin-detail-list').removeClass('red')
                                            $('.admin-detail-item').eq(index).find('.admin-detail-list').addClass('green')
                                            $('#dialog').hide();
                                        }
                                    }
                                })
                            }
                        })
                          
                        $('.dialog-cancle').on('click', function() {
                            $('#dialog').hide();
                        })
                    })
                    // $('.admin-detail-lists').find('.admin-detail-content-close').add('#doc-confirm-toggle').
                        // on('click', function (e) {
                        //     var lid = e.target.dataset.lid;
                        //     var currentStatusDetail = e.target.dataset.currentstatus;
                        //     var index = e.target.dataset.index;
                        //    console.log(index)
                        //     if (currentStatusDetail == -2) {
                        //         // $('.admin-toast').text('低电量设备无法改变状态');
                        //         // $('.admin-toast').show();
                        //         // setTimeout(function () {
                        //         //     $('.admin-toast').hide();
                        //         // }, 1500)
                        //         return
                        //     }
                        //     $('#my-confirm').modal({
                        //         // relatedTarget: this,
                        //         onConfirm: function () {
                        //             // index = e.target.dataset.index;
                        //             console.log('sure: '+index)
                        //             currentStatusDetail = e.target.dataset.currentstatus
                      
                } else {
                    // window.location.href = '/index.html'
                }
            },
            error: function () {
                window.location.href = '/index.html'
            }
        })
    } else if(window.location.search.indexOf('?from=') > -1){
        $('.admin-detail-gateway').hide();
        $('.admin-detail-head').hide();
      
    }


})



