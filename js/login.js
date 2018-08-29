$(function () {
    $("#remberMe").iCheck({
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue',
        increaseArea: '10%' /* optional */
    });
});
login = function() {
    var userName = $("#userName").val();
    var password = $("#password").val();
    if(userName == null || userName == "") {
        $("#userName").focus();
        return;
    }
    if(password == null || password == "") {
        $("#password").focus();
        return;
    }
    var data = {userName : userName, password : password};
    $.ajax({
        url: "/product/login",
        type: "POST",
        dataType: "JSON",
        data: data,
        success : function(data) {
            if(data && data.reply_code != "0") {

                 $.alert(data.reply_msg);

            } else {
                window.location.href = "../pages/user/user.html";
            }

        }
    })
}