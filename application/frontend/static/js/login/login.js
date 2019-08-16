$(document).ready(function(){
  $('#login-submit').click(function(){
      var username = $('#username').val();
      var password = $('#password').val();
      const LOGIN_URL = 'http://0.0.0.0:8000/api/v1/registration/login/';
      $.ajax({
          url: LOGIN_URL,
          method: 'POST',
          data: {
              'username': username,
              'password': password,
          },
          crossDomain: true,
          statusCode: {
              200: function(){
                  alert('Login Successful!');
                  window.location.replace('http://0.0.0.0:8000/');
              },
              400: function(){
                  alert('Error in Loggin in! Are you registered?');
              },
              404: function(){
                  alert('Invalid URL! Is server running?');
              },
              403: function(){
                 alert('please enter correct user name and password');
              }
          }
      })
  });
  // logout code is article_selection.js
  $("#logout-submit").on("click", function(e){
        e.preventDefault();
        if($(this).hasClass("open")) {
            $(this).removeClass("open");
            $(this).children("ul").slideUp("fast");
        } else {
            $(this).addClass("open");
            $(this).children("ul").slideDown("fast");
        }
        const LOGOUT_URL = 'http://0.0.0.0:8000/api/v1/registration/logout/';
        $.ajax({
          url: LOGOUT_URL,
          method: 'GET',
          statusCode: {
              200: function(){
                  alert('Logout Successful!');
                  window.location.replace('http://0.0.0.0:8000/');
              },
              400: function(){
                  alert('Error in Loggin in! Are you registered?');
              },
              404: function(){
                  alert('Invalid URL! Is server running?');
              },
              403: function(){
                 alert('please enter correct user name and password');
              }
          }
      })
    });

    $(".fa.fa-columns ").on("click", function(e){
        window.open('dashboard.html', '_self');

    });


  $('.fas.fa-times').click(function(){
   window.location.href="http://0.0.0.0:8000/";
});

    $(".toggle-password").click(function() {

        $(this).toggleClass("zmdi-eye zmdi-eye-off");
        var input = $($(this).attr("toggle"));
        if (input.attr("type") === "password") {
            input.attr("type", "text");
        } else {
            input.attr("type", "password");
        }
    });
});