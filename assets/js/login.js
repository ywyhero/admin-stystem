
$(function () {
    $('#login-btn').on('click', function () {
        var USERNAME = $('#user-name').val().trim();
        var PASSWORD = $('#user-password').val().trim();
        if (USERNAME === '' || PASSWORD === '') {
            $('.admin-toast').show();
            $('.admin-toast').text('用户名或密码不能为空');
            setTimeout(function () {
                $('.admin-toast').hide();
            }, 1500)
            return
        }
        $.ajax({
            type: 'GET',
            headers: {
                "Authorization": "Basic " + btoa(USERNAME + ":" + PASSWORD)
            },
            dataType: 'json',
            url: "http://47.52.236.134:3389/v1/admins/token",
            success: function (res) {
                if (res.code == 0) {
                    var token = res.data.token;
                    window.sessionStorage.setItem('token', token)
                    window.sessionStorage.setItem('aid', res.data.id)
                    window.location.href = '/main.html'
                } else {
                    $('.admin-toast').show();
                    $('.admin-toast').text('用户名或密码错误');
                    setTimeout(function () {
                        $('.admin-toast').hide();
                    }, 1500)
                }
            }
        })
    })
})