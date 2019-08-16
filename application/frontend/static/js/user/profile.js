$(document).ready(function(){
    function showProfile(username){
        $('#login').hide();
        $('#register').hide();
        $('#lusername').text(username);
        $('.logged-in-user').show()
    }

    USER_PROFILE_URL = 'http://0.0.0.0:8000/api/v1/profile/profile/';
    
    $.ajax({
        url: USER_PROFILE_URL,
        method: 'GET',
        statusCode: {
            200: function(res){
                showProfile(res.username);
            },
            400: function(){
                alert('Error in API! Are you registered?');
            },
        }
    })
});
