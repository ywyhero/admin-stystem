$(function () {
    var loginInfo = JSON.parse(window.sessionStorage.getItem('loginInfo'));//获取左侧菜单用户信息
    var token = window.sessionStorage.getItem('token'); //获取token
    $('.admin-info-usename').text(loginInfo.name);
    $('.admin-user-avatar-head').attr('src', loginInfo.avatarUrl);
    var id = window.location.href.split('?aid=')[1];
    var menu = JSON.parse(window.sessionStorage.getItem('adminMenu'));
    //多级菜单
    $('#admin-info-tree').tree({
        dataSource: function (options, callback) {
            // 模拟异步加载
            setTimeout(function () {
                callback({ data: options.products || menu });
            }, 400);
        },
        multiSelect: false,
        cacheItems: true,
        folderSelect: false
    });
    //多级菜单点击事件-跳转详情页
    $('#admin-info-tree').on('selected.tree.amui', function (event, data) {
        var gid = data.target.id;
        window.location.href = '/detail.html?aid=' + id + '&gw=' + gid;
    });
    //获取管理员信息
    $.ajax({
        type: 'GET',
        url: 'http://47.52.236.134:3389/v1/admins?aid=' + id,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function (res) {
            if (res.code == 0) {
                $('.admin-info-item-img').attr('src', res.admin.info.avatarUrl)
                $('.admin-info-name').text(res.admin.info.nickName)
                $('.admin-info-level').text('级别：' + res.admin.level)
                $('.admin-info-owenr-company').text(res.admin.owner.address)
                $('.admin-info-item-login').text(res.admin.info.login)
                var status = null;
                if (res.admin.status == 1) {
                    status = '正常'
                } else if (res.admin.status == 0) {
                    status = '离线'
                } else if (res.admin.status == -1) {
                    status = '禁用'
                }
                $('.admin-info-item-status').text(status);
                $('.admin-info-item-password').val(res.admin.info.passwd);
                //修改密码
                $('.admin-info-btn').on('click', function () {
                    if ($('.admin-info-item-password').attr('disabled')) {
                        $('.admin-info-item-password').attr('disabled', false)
                        $('.admin-info-item-password').addClass('active');

                    } else {
                        var newPwd = $('.admin-info-item-password').val().trim();
                        if(res.admin.info.passwd == newPwd) {
                            return
                        }
                        if(newPwd === ''){
                            $('.admin-toast').show();
                            $('.admin-toast').text('密码不能为空');
                            setTimeout(function () {
                                $('.admin-toast').hide();
                            }, 1500)
                            return 
                        }
                        var changeData = {
                            "oldPasswd": res.admin.info.passwd,
                            "newPasswd": newPwd
                        }
                        $.ajax({
                            type: 'POST',
                            url: 'http://47.52.236.134:3389/v1/admins?aid=' + id,
                            data: JSON.stringify(changeData),
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + token
                            },
                            success: function (res) {
                                if(res.code == 0) {
                                    //修改成功后跳转页面
                                    $('.admin-info-item-password').attr('disabled', true)
                                    $('.admin-info-item-password').removeClass('active');
                                    window.location.href = '/index.html'
                                } else {
                                    window.location.href = '/index.html'
                                }
                            },
                            error: function(){
                                window.location.href = '/index.html'
                            }
                        })
                    }
                })
            }

        }
    })

})

