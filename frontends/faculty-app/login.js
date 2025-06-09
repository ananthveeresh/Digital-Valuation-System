var app = angular.module('loginApp', []);

app.controller('loginController', function ($http, $scope, $sce, $timeout, $window, $interval) {

//  var apiurl = 'http://10.70.3.135:5006';
  var apiurl = "https://w.aditya.ac.in/digival/api"
$scope.login_form = 0
$scope.otpGenerated = false;
$scope.otpTimestamp = 0;
$scope.enteredOTP = "";
$scope.otp = ['', '', '', '', '', ''];
var OTP_TIMEOUT = 180;
$scope.countdown = 0;
var countdownInterval;
$scope.error_msg = ''


$scope.generateOTP = function (mobileno) {
    $scope.mobile_no = mobileno;
    var obj = {
        "mobileno": $scope.mobile_no
    };

    $http.post(apiurl + '/logininfo/create', obj)
        .then(function (response) {
            if (response.data.length > 0) {
                $scope.login_data = response.data[0];
                // console.log($scope.login_data)
                $scope.login_form = 1;
                $scope.otpGenerated = true; 
                $scope.error_msg = null;
            } else {
                $scope.error_msg = response.data.error;
                $scope.otpGenerated = false;
            }
        });

    $scope.otpTimestamp = new Date().getTime();
    $scope.countdown = OTP_TIMEOUT; 
    countdownInterval = $interval(function () {
        if ($scope.countdown > 0) {
            $scope.countdown--;
        } else {
            $interval.cancel(countdownInterval);
            $scope.otpGenerated = false;
            $scope.countdown = 0;
            $scope.login_form = 0; 
        }
    }, 1000);

    $timeout(function () {
        if ($scope.otpGenerated) {
            $interval.cancel(countdownInterval);
            $scope.otpGenerated = false;
            $scope.countdown = 0;
            $scope.login_form = 0; 
        }
    }, OTP_TIMEOUT * 1000);
};


$scope.OtpInput = function (event, index) {
        const input = event.target;
        $scope.otp[index] = input.value;
        // console.log($scope.otp[index])

        if (input.value.length === 1 && index < 5) {
            document.querySelectorAll('.otp-input')[index + 1].focus();
        }

        if ((event.key === 'Backspace' || event.key === 'Delete') && index > 0) {
            document.querySelectorAll('.otp-input')[index - 1].focus();
        }

        $scope.enteredOTP = $scope.otp.join('');
    };

    $scope.invalidOtp = ""


    
    $scope.verifyOtp = function () {
        var obj = {
            "mobileno": $scope.mobile_no,
            "otp": $scope.enteredOTP 
        };
    
        $http.post(apiurl + '/logininfo/validate', obj)
            .then(function (response) {
                // console.log(response)
                if (response && response.data && $scope.enteredOTP == $scope.login_data.otp) {
                    // console.log(response.data[0])
                    localStorage.setItem('empinfo', JSON.stringify(response.data[0]));
                    $scope.invalidOtp = null; 
                    // alert("OTP verified successfully!"); 
                    window.location.href = `index.html`; 
                } else {
                    $scope.invalidOtp = "Invalid OTP. Please try again.";
                    localStorage.removeItem('empinfo'); 
                }
            })
            .catch(function (error) {
                console.error('Error posting data:', error);
                $scope.invalidOtp = "An error occurred. Please try again.";
            });
    };
    $scope.formatTime = function (seconds) {

        var minutes = Math.floor(seconds / 60);
        var remainingSeconds = seconds % 60;
        return minutes + ":" + (remainingSeconds < 10 ? "0" : "") + remainingSeconds;
    };

    $scope.$on('$destroy', function () {
        if (angular.isDefined(countdownInterval)) {
            $interval.cancel(countdownInterval);
        }
    });

    $scope.clearfunction = function () {
        $scope.show_log_error = '';
    }

});
