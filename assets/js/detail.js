
$(function () {
    var token = window.sessionStorage.getItem('token');
    var aid = window.location.search.split('?aid=')[1].split('&')[0];
    var gid = window.location.search.split('&gw=')[1];
    var menu = JSON.parse(window.sessionStorage.getItem('adminMenu'));
    var loginInfo = JSON.parse(window.sessionStorage.getItem('loginInfo'));
    $('.admin-detail-username').text(loginInfo.name);
    $('.admin-detail-avatar').attr('src', loginInfo.avatarUrl);
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
                $('.admin-detail-gw-other-name').text('别名：' + res.gateway.alias);
                $('.admin-detail-item-input').text('别名：' + res.gateway.alias);
                if (res.gateway.currentStatus == 1) {
                    $('.admin-detail-status-offline').hide();
                    $('.admin-detail-status-pause').show();
                    $('.admin-detail-status-play').hide();
                } else if (res.gateway.currentStatus == 0) {
                    $('.admin-detail-status-offline').hide();
                    $('.admin-detail-status-pause').hide();
                    $('.admin-detail-status-play').show();
                } else if (res.gateway.currentStatus == -1) {
                    $('.admin-detail-status-offline').show();
                    $('.admin-detail-status-pause').hide();
                    $('.admin-detail-status-play').hide();
                }
                $('.admin-detail-item-input').val(res.gateway.address.formatted_address);
                $('.admin-detail-use-count').text(res.gateway.lockList.available);
                $('.admin-detail-device-total').text(res.gateway.lockList.total);
                var lists = res.gateway.lockList.list;
                var htmls = []
                for (var i = 0; i < lists.length; i++) {
                    var currentStatus = null;
                    if (lists[i].currentStatus == 1) {
                        currentStatus = '正常'
                    } else if (lists[i].currentStatus == 0) {
                        currentStatus = '离线'
                    } else if (lists[i].currentStatus == -1) {
                        currentStatus = '禁用'
                    }
                    var html = '<div class="am-u-sm-12 am-u-md-6 am-u-lg-3 admin-detail-item">' +
                        '<div class="am-cf admin-detail-list">' +
                        '<img class="admin-detail-img" src="' + lists[i].currentUser.avatarUrl + '" alt="">' +
                        '<div class="admin-detail-content">' +
                        '<div class="admin-detail-content-left">' +
                        '<span class="admin-detail-content-device-name">设备名：' + lists[i].alias + '</span>' +
                        '<span class="admin-detail-content-user-name">用户名：' + lists[i].currentUser.nickName + '</span>' +
                        '</div>' +
                        '<div class="admin-detail-content-right">' +
                        '<span class="admin-detail-content-status">' + currentStatus + '</span>' +
                        '<div class="admin-detail-content-btns">' +
                        '<span class="admin-detail-content-open" data-lid="' + lists[i].lid + '">打开</span>' +
                        '<span class="admin-detail-content-close" data-lid="' + lists[i].lid + '">停用</span>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>'
                    htmls.push(html)
                }
                $('.admin-detail-lists').append(htmls)
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
                            "currentStatus": res.gateway.currentStatus
                        }
                        $.ajax({
                            type: 'POST',
                            url: 'http://47.52.236.134:3389/v1/gateways/' + gid + '?aid=' + aid,
                            headers: {
                                'Authorization': 'Bearer ' + token
                            },
                            data: JSON.stringify(addressData),
                            success: function (res) {
                                console.log(res)
                            }
                        })
                    }
                })
                //修改状态
                $('.admin-detail-status-pause').on('click', function(){
                    var addressData = {
                        "address": $('.admin-detail-item-input').val(),
                        "currentStatus": "0"
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
                            if(res.code == 0) {
                                $('.admin-detail-status-pause').hide()
                                $('.admin-detail-status-play').show()
                            }
                        }
                    })
                })
                $('.admin-detail-status-play').on('click', function(){
                    var addressData = {
                        "address": $('.admin-detail-item-input').val(),
                        "currentStatus": "1"
                    }
                    $.ajax({
                        type: 'POST',
                        url: 'http://47.52.236.134:3389/v1/gateways/' + gid + '?aid=' + aid,
                        headers: {
                            'Authorization': 'Bearer ' + token
                        },
                        data: JSON.stringify(addressData),
                        success: function (res) {
                            if(res.code == 0) {
                                $('.admin-detail-status-pause').show()
                                $('.admin-detail-status-play').hide()
                            }
                        }
                    })
                })
            } else {
                window.location.href = '/index.html'
            }
        },
        error: function () {
            window.location.href = '/index.html'
        }
    })

})



