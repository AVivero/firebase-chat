/**
 * Created by Spectre on 1/18/2017.
 */
var config = {
    apiKey: "AIzaSyD43FrEuL8qeuIFA_QCc83EelFFnypIuSs",
    authDomain: "fir-chat-48495.firebaseapp.com",
    databaseURL: "https://fir-chat-48495.firebaseio.com/",
    storageBucket: "gs://fir-chat-48495.appspot.com",
    messagingSenderId: "743967862870"
};

firebase.initializeApp(config);

var db = firebase.database().ref();

var provider = new firebase.auth.FacebookAuthProvider();
provider.addScope('public_profile');
provider.setCustomParameters({
    'display': 'popup'
});


var user = {name: 'anonymous', avatarUrl: ''};
var msgs = 0;
var message = {userName: '', text: ''};


$(document).ready(function () {

    $(document).on("click", "#loginFacebook", function () {
        loginFacebook();
    });

    $(document).on("click", "#logoutFacebook", function () {
        logoutFacebook();
    });


    $(document).on("click", "#postMsg", function () {
        if ($('#msgInput').val() !== '') {
            message.userName = user.name;
            message.text = $('#msgInput').val();
            message.avatarUrl = user.avatarUrl;
            db.push(message);
            $('#msgInput').val('');
        }
    });

    $(document).on("keydown", "#msgInput", function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            if ($('#msgInput').val() !== '' && $('#msgInput').val().length > 0) {
                message.userName = user.name;
                message.text = $('#msgInput').val();
                message.avatarUrl = user.avatarUrl;
                db.push(message);
                $('#msgInput').val('');
            }
        }
    });


    db.limitToLast(1).on('child_added', function (snapshot) {
        msgs++;
        if (msgs > 1) {
            if (snapshot.val().userName === user.name)
                addMyMessage(snapshot.val());
            else
                addOtherMessage(snapshot.val());
            // if ($('.messages').scrollTop == $('.messages').height)
        }
    });

});


function addOtherMessage(message) {
    $(`.messages`).append(`<div class='otherMessage'><img class="userPic" src="${message.avatarUrl}"/><div class='text'>${message.text}</div><div class='userName'>${message.userName}</div></div>`);
    $('.otherMessage:last').toggle('fast');
    console.log();
    setTimeout(function () {
        scrollDown();
    }, 250);
}

function addMyMessage(message) {
    $(`.messages`).append(`<div class='myMessage'><div class='text'>${message.text}</div><div class='userName'>Me</div></div>`);
    $('.myMessage:last').toggle('fast');
    setTimeout(function () {
        scrollDown();
    }, 250);
}


function startChat() {
    $(`body`).html(`<div class="main">
    <div class="userInfo">
        <img class="userPic" src="${user.avatarUrl}"/>
        <div class="userName">${user.name}</div>
        <button id="logoutFacebook">Logout</button>
    </div>
    <div class="messages">


    </div>

    <div class="insertText">
        <textarea type="text" id="msgInput" placeholder="Type your message..." autofocus></textarea>
        <button id="postMsg">SEND</button>
    </div>

</div>`);
}

function loginFacebook() {
    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        user.name = result.user.displayName;
        user.avatarUrl = result.user.photoURL;
        startChat();
    }).catch(function (error) { //CHECK THIS
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });
}

function logoutFacebook() {

    firebase.auth().signOut().then(function () {
        location.reload();
        user.name = 'anonymous';
        user.avatarUrl = '';
        goToLogin();
    }, function (error) {
        // An error happened.
        console.log(error);
    });
}

function goToLogin() {
    $(`body`).html(`<div class="mainWindow">
    <div class="logo"><img src="assets/img/logo.png" alt="">
        <h2>Chat</h2></div>
    <div class="login">
        <div class="loginFacebook">
            <button id="loginFacebook"><span class="fa fa-facebook faceIcon"></span>Login with Facebook</button>
        </div>
    </div>
</div>`);
}

function scrollDown() {

    $('.messages').scrollTop(250000);
}

