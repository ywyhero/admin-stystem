(function () {
    $('#login-btn').on('click', function(){
        var USERNAME = $('#user-name').val();
        var PASSWORD = $('#user-password').val();
        if(USERNAME === '' || PASSWORD === '') {
            $('#doc-modal-1').on('open.modal.amui', function(){
                $('.modal-content').html('登陆名或密码为空')
            });
            return
        }
        $.ajax({
            type: 'GET',
            headers: {
                "Authorization": "Basic " + btoa(USERNAME + "." + PASSWORD)
            },
            url: "http://47.52.236.134:3389/v1/admins/token",
            success: function (res) {
                console.log(res)
            }
        })
    })
})()