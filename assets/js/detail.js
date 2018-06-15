
$(function () {
    var token = window.sessionStorage.getItem('token');
    if (window.location.search.indexOf('?aid=') > -1) {
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
                    var htmls = [];
                    for (var i = 0; i < lists.length; i++) {
                        var closeText = '';
                        var currentStatus = null;
                        if (lists[i].currentStatus == 1) {
                            currentStatus = '使用中'
                            closeText = '禁用'
                        } else if (lists[i].currentStatus == 0) {
                            currentStatus = '待使用'
                            closeText = '禁用'
                        } else if (lists[i].currentStatus == -1) {
                            currentStatus = '禁用'
                            closeText = '使用'
                        } else if (lists[i].currentStatus == -2) {
                            currentStatus = '电量低';
                            closeText = '使用/禁用';
                        }
                        var nickName = lists[i].currentUser.nickName ? lists[i].currentUser.nickName : '';
                        var alias = lists[i].alias ? lists[i].alias : '';
                        var imgSrc = lists[i].currentUser.avatarUrl ? lists[i].currentUser.avatarUrl : 'assets/img/user03.png'
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

                    for (var i = 0; i < lists.length; i++) {
                        if (lists[i].currentStatus == -2) {
                            $('.admin-detail-item').eq(i).find('.admin-detail-content-open').addClass('active')
                            $('.admin-detail-item').eq(i).find('.admin-detail-content-close').addClass('active')
                        } else if (lists[i].currentStatus == 1) {
                            $('.admin-detail-item').eq(i).find('.admin-detail-content-open').addClass('active')
                        }
                    }
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
                                if (res.code == 0) {
                                    $('.admin-detail-status-pause').hide()
                                    $('.admin-detail-status-play').show()
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
                                if (res.code == 0) {
                                    $('.admin-detail-status-pause').show()
                                    $('.admin-detail-status-play').hide()
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

                    $('.admin-detail-content-open').on('click', function (e) {
                        var lid = e.target.dataset.lid;
                        var currentStatus = e.target.dataset.currentstatus;
                        var index = e.target.dataset.index;
                        if (currentStatus == -2) {
                            $('.admin-toast').text('低电量设备无法改变状态');
                            $('.admin-toast').show();
                            setTimeout(function () {
                                $('.admin-toast').hide();
                            }, 1500)
                            return
                        }
                        if (currentStatus == 1) {
                            return
                        }
                        $.ajax({
                            type: "POST",
                            url: 'http://47.52.236.134:3389/v1/locks/' + lid + '/op?aid=' + aid,
                            headers: {
                                'Authorization': 'Bearer ' + token
                            },
                            success: (res) => {
                                if (res.code == 0) {
                                    $('.admin-detail-item').eq(index).find('.admin-detail-content-status').text('使用中')
                                    $('.admin-detail-item').eq(index).find('.admin-detail-content-open').addClass('active')
                                }
                            }
                        })

                    })
                    $('.admin-detail-lists').find('.admin-detail-content-close').add('#doc-confirm-toggle').
                        on('click', function (e) {
                            var lid = e.target.dataset.lid;
                            var currentStatus = e.target.dataset.currentstatus;
                            var index = e.target.dataset.index;
                            if (currentStatus == -2) {
                                $('.admin-toast').text('低电量设备无法改变状态');
                                $('.admin-toast').show();
                                setTimeout(function () {
                                    $('.admin-toast').hide();
                                }, 1500)
                                return
                            }
                            var data = {}
                            if (currentStatus == 1) {
                                data = {
                                    currentStatus: -1
                                }
                                $('.am-modal-bd').text('确定要禁用该设备吗？')
                            } else if (currentStatus == -1) {
                                data = {
                                    currentStatus: 0
                                }
                                $('.am-modal-bd').text('确定要使用该设备吗？')
                            }
                            $('#my-confirm').modal({
                                relatedTarget: this,
                                onConfirm: function () {
                                    $.ajax({
                                        type: "POST",
                                        url: 'http://47.52.236.134:3389/v1/locks/' + lid + '?aid=' + aid,
                                        headers: {
                                            'Authorization': 'Bearer ' + token
                                        },
                                        data: JSON.stringify(data),
                                        success: (res) => {
                                            if (res.code == 0) {
                                                if (currentStatus == 1 || currentStatus == 0) {
                                                    $('.admin-detail-item').eq(index).find('.admin-detail-content-close').text('使用')
                                                    $('.admin-detail-item').eq(index).find('.admin-detail-content-close').attr('data-currentstatus', '-1')
                                                    $('.admin-detail-item').eq(index).find('.admin-detail-content-status').text('禁用')
                                                    $('.admin-detail-item').eq(index).find('.admin-detail-content-open').removeClass('active')
                                                    $('.admin-detail-item').eq(index).find('.admin-detail-content-open').attr('data-currentstatus', '-1')
                                                } else if (currentStatus == -1) {
                                                    $('.admin-detail-item').eq(index).find('.admin-detail-content-close').text('禁用')
                                                    $('.admin-detail-item').eq(index).find('.admin-detail-content-close').attr('data-currentstatus', '1')
                                                    $('.admin-detail-item').eq(index).find('.admin-detail-content-status').text('待使用')
                                                    $('.admin-detail-item').eq(index).find('.admin-detail-content-open').attr('data-currentstatus', '-1')
                                                    $('.admin-detail-item').eq(index).find('.admin-detail-content-open').removeClass('active')
                                                }
                                            }
                                        }
                                    })
                                },
                                // closeOnConfirm: false,
                                onCancel: function () {
                                }
                            });
                        });
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



