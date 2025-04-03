$(document).ready(function(){




var code;
function createCaptcha() {
  //clear the contents of captcha div first 
  document.getElementById('captcha').innerHTML = "";
  var charsArray =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var lengthOtp = 6;
  var captcha = [];
  for (var i = 0; i < lengthOtp; i++) {
    //below code will not allow Repetition of Characters
    var index = Math.floor(Math.random() * charsArray.length + 1); 
    if (captcha.indexOf(charsArray[index]) == -1)
      captcha.push(charsArray[index]);
    else i--;
  }
  var canv = document.createElement("canvas");
  canv.id = "captchaz";
  canv.width = 100;
  canv.height = 50;

  var ctx = canv.getContext("2d");
  ctx.font = "bold 25px Roboto";
  ctx.fillStyle = '#000';
  ctx.fillText(captcha.join(""), 0, 30);
  //storing captcha so that can validate you can save it somewhere else according to your specific requirements
  code = captcha.join("");
  document.getElementById("captcha").appendChild(canv); // adds the canvas to the body element
}
function validateCaptcha() {
  event.preventDefault();
  debugger
  if (document.getElementById("cpatchaTextBox").value == code) {

    alert('Matched')

    $('.otpdata').removeClass('d-none');
    $('#submitCaptcha').attr("disabled",true)   
    $('#resetCaptcha').attr("disabled",true)
    $('#cpatchaTextBox').attr("disabled",true)

$('.Otp_Container').addClass("d-none");

    otp();



  }else{



    Swal.fire({
        title: "Incorrect Captcha",
        text: "Incorrect, please try again",
        icon: "warning",
        timer: 1500
    });
    // createCaptcha();
    // $('#cpatchaTextBox').val('')
  }
}

createCaptcha()






$(document).on('click','#submitCaptcha',function(){
    validateCaptcha()
})
$(document).on('click','#resetCaptcha',function(){
    createCaptcha()
    $('#cpatchaTextBox').val('')

})

// Here i gernate and save otp in database

function otp(){
    function countdown() {

        var seconds = 30;

        function tick() {
            var counter = document.getElementById("element");
            var minutesDisplay = Math.floor(seconds / 60);
            var secondsDisplay = seconds % 60;
            counter.innerHTML = minutesDisplay + ":" + (secondsDisplay < 10 ? "0" : "") + secondsDisplay;

            if (seconds > 0) {
                $('#resetotp').prop('disabled', true);

                seconds--;
                setTimeout(tick, 1000);
            } else {
                $('#resetotp').prop('disabled', false);
             
                counter.innerHTML = ""; // Clear the timing display
              
             
            }
        }

        tick();
    
    
}

countdown();


var mobile_no=$('#mobileno').val();
var user_id=$('#UserId').val();

$.ajax({
    url:`/save_otp/${user_id}`,
    type:'post',
    data:{mobile_no:mobile_no},
    success:function(res){

    alert(res.OTP)

    }
})

}





$(document).on('click','#logindata',function(){

    let UserId=document.getElementById("UserId").value;

    let otp = document.getElementById("otptext").value;

$.ajax({
    url:'/compare_otp',
    type:'post',
    dataType:'json',
    data:{otp:otp,UserId:UserId},
    success:function(response){


        if(response.msg=='success'){

            if(otp==response.result[0].OTP){


            }else{
                Swal.fire({
                        title: "Invalid OTP",
                        text: "You entered a wrong OTP",
                        icon: "warning",
                
                });

            }



        }else{
            Swal.fire({
                title: "OTP Expired",
                text: "The OTP has expired",
                icon: "warning"
            
            });


        }

    }

})

})







})
