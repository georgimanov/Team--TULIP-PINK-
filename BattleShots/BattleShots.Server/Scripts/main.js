var baseUrl = "http://localhost:32033/api/";
//var baseUrl = "http://battleshots-1.apphb.com/api/";
var gameAcces = false;
var selectBar = false;
var userName = localStorage.getItem('userName');
var animationSpeed = 1200;
var data = dataRepositories.get(baseUrl);
if (userName == null) {
    userName = "Example User";
}
$(document).ready(function () {
    checkGameAcces();
});

function checkGameAcces() {
    if (localStorage.getItem("sessionKey") == null) {
        showLogin();
    } else {
        userName = localStorage.getItem('userName');
        $('#username').html(userName);
        $('#user-box').fadeIn(animationSpeed);
        if (selectBar == true) {
            showArena();
        } else {
            showBars();
        }
    }
}

function showLogin() {
    $('.basic-element').hide();
    $('#login-box').fadeIn(animationSpeed);
}
function showJoin() {
    $('.basic-element').hide();
    $('#join-box').fadeIn(animationSpeed);
}
function showArena() {
    $('.basic-element').hide();
    $('#arena').fadeIn(animationSpeed);
}

function showBars() {
    $('.basic-element').hide();
    $('#bars-box').show();
    $('#bars-box').on("click", ".table-cell .btn", function (e) {
        var id = e.target.id;
        var pass = $(e.target).parent().parent().find("input").val();
        console.log(pass);
        data.games.join(id, pass)
        .then(function (data) {
            console.log(data);
        },
        function (err) {
            showError(error);
        });
    });
    $("<div />").load("Partials/lobby-tables.html", function (html) {
        data.games.open()
            .then(function (data) {
                $(data).each(function (el) {
                    var result = parseTemplate(html, { title: data[el].Title, i: data[el].Id });
                    $("#bars-box").append(result);
                });
            }, function (error) {
                showError(error);
            });
        setInterval(function () {
            data.games.open()
            .then(function (data) {
                $("#bars-box").html("");
                $(data).each(function (el) {
                    var result = parseTemplate(html, { title: data[el].Title, i: data[el].Id });
                    $("#bars-box").append(result);
                });
            }, function (error) {
                showError(error);
            });
        }, 5000);
    });

    $("#create-table-form").load("Partials/create-table-form.html", function () {
        $("#create-table-form").on("click", "#create-table-btn", function (e) {
            var tableName = $("#table-name").val();
            var tablePass = $("#table-pass").val();
            var confirmPass = $("#confirm-pass").val();

            if (tablePass == confirmPass) {
                var pass = SHA1(tablePass);
                data.games.newGame(tableName, tablePass)
                .then(function (data) {
                    $("#table-name").val("");
                    $("#table-pass").val("");
                    $("#confirm-pass").val("");
                }, function (err) {
                });
            }
            else {
                showError('The passwords do not match.');
            }
        })
    });
}

function registerUser() {
    var loginName = $('#username-join').val();
    var userPass = $('#password-join').val();
    var userPass2 = $('#password-2-join').val();
    if (userPass === userPass2) {
        var pass = SHA1(userPass);

        var data = {
            "username": loginName,
            "password": pass
        };
        httpRequester.postJson(baseUrl + 'account/register', data, {})
            .then(function (data) {
                var DataUserName = data['Username'];
                var dataSessionKey = data['SessionKey'];
                localStorage.setItem('userName', DataUserName);
                localStorage.setItem('sessionKey', dataSessionKey);

                checkGameAcces();
            }, function (error) {
                showError(error);
            });
    } else {
        showError('Incorrect password!');
    }

}

function checkLogin() {

    var loginName = $('#username-login').val();
    var userPass = $('#password-login').val();
    var passSha1 = SHA1(userPass);
    var data = {
        'username': loginName,
        'password': passSha1
    };
    httpRequester.postJson(baseUrl + 'account/login', data, {})
        .then(function (data) {

            var DataUserName = data['Username'];
            var dataSessionKey = data['SessionKey'];
            localStorage.setItem('userName', DataUserName);
            localStorage.setItem('sessionKey', dataSessionKey);

            checkGameAcces();

        }, function (error) {
            console.log(error);
            showError(error);
        });
}


function showError(error) {
    var text = '';
    if (typeof (error) == "object") {
        var err = JSON.parse(error.responseText);
        text = err['Message'];
    } else {
        text = error;
    }
    $('#error-dialog').html(text).dialog({ modal: true });
}

function logOut() {
    var sk = localStorage.getItem('sessionKey');
    var headers = {
        'X-SessionKey': sk
    }
    httpRequester.putJson(baseUrl + 'account/logout', {}, headers)
        .then(function (data) {
            $('#user-box').fadeOut(animationSpeed);
            localStorage.removeItem('userName');
            localStorage.removeItem('sessionKey');
            location.reload();
            checkGameAcces();
        }, function (error) {
            showError(error);
        });
}