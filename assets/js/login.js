
document.addEventListener("DOMContentLoaded", function () {
    document.body.scrollTop; //force css repaint to ensure cssom is ready

    var timeout; //global timout variable that holds reference to timer

    var captcha = new $.Captcha({
        onFailure: function () {

            $(".captcha-chat .wrong").show({
                duration: 30,
                done: function () {
                    var that = this;
                    clearTimeout(timeout);
                    $(this).removeClass("shake");
                    $(this).css("animation");
                    //Browser Reflow(repaint?): hacky way to ensure removal of css properties after removeclass
                    $(this).addClass("shake");
                    var time = parseFloat($(this).css("animation-duration")) * 1000;
                    timeout = setTimeout(function () {
                        $(that).removeClass("shake");
                    }, time);
                }
            });
            setTimeout(function(){
                $(".captcha-chat .wrong").hide()
            }, 2000)

        },
        onSuccess: function () {

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
                },
                error: function(){
                    $('.admin-toast').show();
                    $('.admin-toast').text('用户名或密码错误');
                    setTimeout(function () {
                        $('.admin-toast').hide();
                    }, 1500)
                }
            })
        }
    })
    captcha.generate();
});
