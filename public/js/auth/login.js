

// with otp login


$(document).on('click','#loginBtn',function(){

    let UserId=document.getElementById('UserId').value;
    let UserPass=document.getElementById('UserPass').value;


// Here we can check user type 

$.ajax({
    url:`/login_check/${UserId}`,
    type:'post',
    data:{UserPass:UserPass},
    success:function(response){

        if(response.page=='notfounduser'){
            Swal.fire({
                title: "Enter Correct User or Password",
                text: "User Not Found Check Again",
                icon: "error"
         
            });
        }else{


            if(response.page=='getOtp_login'){

                 window.location.href = `/getotp_login/${UserId}`
            }






        }
    
    }


})


})