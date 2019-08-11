$(document).ready(function(){
    $('#registration-submit').click(function(){
        var username = $('#username').val();
        var firstname = $('#fname').val();
        var lastname = $('#lname').val();
        var email = $('#email').val();
        var password = $('#password').val();
        const REGISTRATION_URL = 'http://0.0.0.0:8000/api/v1/registration/create/';
        $.ajax({
            url: REGISTRATION_URL,
            method: 'POST',
            data: {
                'username': username,
                'first_name': firstname,
                'last_name': lastname,
                'password': password,
                'email': email,
            },
            statusCode: {
                201: function(){
                    alert('Registration Successful! Please login');
                    window.location.replace('http://0.0.0.0:8000/');
                },
                400: function(){
                    alert('Error in Registration!');
                },
                404: function(){
                    alert('Invalid URL! Is server running?');
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