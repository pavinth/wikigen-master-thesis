$(document).ready(function(){
  $('#login-submit').click(function(){
      var username = $('#username').val();
      var password = $('#password').val();
      var LOGIN_URL = 'http://0.0.0.0:8000/api/v1/registration/login/';
      $.ajax({
          url: LOGIN_URL,
          method: 'POST',
          data: {
              'username': username,
              'password': password
          },
          crossDomain: true,
          statusCode: {
              200: function(){
                  $("#LoginSuccessful")
                      .prepend("<h2 style ='font-style: italic;background:white;width:300px;border-radius:4px;position:relative;right:100px;float:right;'>Login Successful </h2> ")
                       .children(':first')
                       .fadeOut(2000);
                            setTimeout(function () {
                            window.location.replace('http://0.0.0.0:8000/');
                            },
                         2000);
                  },
              400: function(){
                  alert('Error in Login! Are you registered?');
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

        var LOGOUT_URL = 'http://0.0.0.0:8000/api/v1/registration/logout/';
        $.ajax({
          url: LOGOUT_URL,
          method: 'GET',
          statusCode: {
              200: function(){

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