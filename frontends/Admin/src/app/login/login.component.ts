import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms'
import { AuthenticationService } from '../core/services/authentication.service';
import { concat } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  ipAddress: string;
  device_info: any;

  public show_log_error: string;

  logdata: FormGroup;
  constructor(private fb: FormBuilder, private _authenticationService: AuthenticationService, private router: Router) {
    this.logdata = this.fb.group({
      stdMobileNo: ['', [Validators.required]],
      stdPwd: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    // if (localStorage.getItem('logindata')) {
    //       this.router.navigate(['student']);
    // }
    this.IPAddress_get()
  }

  onLogin() {
    let stdMobileNo = this.logdata.value.stdMobileNo;
    let stdPwd = this.logdata.value.stdPwd;

    var obj = {
      "UserName": stdMobileNo,
      "Password": stdPwd,
    };
    //  // // // // // console.log( obj); 

    this._authenticationService.post_login(obj).subscribe(data => {
      //  // // // // // console.log( data);
      if (data.length == 0) {
        this.show_log_error = "Invalid Credentials";
      } else {
        this.show_log_error = '';
         localStorage.setItem('logindata',JSON.stringify(data[0]));
         window.location.href='#/admin';
      }
    });
  }

  clearfunction() {
    this.show_log_error = '';
  }

  gotoForgot() {
    window.location.href = '#/forgetpassword'
  }

  IPAddress_get() {
    this._authenticationService.getIpAddress().subscribe(data => {
      // // // // // // console.log( data)
      this.ipAddress = data.ip;
      // // // // // // console.log( 'User IP Address:', this.ipAddress);
      this.getLocation()
    })
  }

  getLocation() {
    const userAgent = navigator.userAgent;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const browserName = navigator.appName;
    const browserVersion = navigator.appVersion;
    const platform = navigator.platform;
    const language = navigator.language;
    const nominatimApiUrl = 'https://nominatim.openstreetmap.org/reverse?format=json';
  
    // Fetch IP address (you need to have this implemented, example: this.ipAddress)
    const ipAddress = this.ipAddress; // Assuming you have a way to get the IP address
  
    // Construct URL for IP geolocation
    const ipGeolocationUrl = `https://ipinfo.io/${ipAddress}/json`;
  
    fetch(ipGeolocationUrl)
      .then(response => response.json())
      .then(data => {
        const latitude = data.loc.split(',')[0]; // Extract latitude from IP geolocation
        const longitude = data.loc.split(',')[1]; // Extract longitude from IP geolocation
  
        // Optionally, use reverse geocoding using Nominatim (as in your original code)
        const nominatimUrl = `${nominatimApiUrl}&lat=${latitude}&lon=${longitude}`;
  
        fetch(nominatimUrl)
          .then(response => response.json())
          .then(data => {
            const device_address = {
              address: {
                latitude: latitude,
                longitude: longitude,
                // Parse other address components as needed
              },
              browserinfo: {
                userAgent: userAgent,
                BrowserName: browserName,
                BrowserVersion: browserVersion,
                Platform: platform,
                Language: language,
                ScreenSize: `${screenWidth}x${screenHeight}`,
              },
              ip_Address: ipAddress,
            };
  
            this.device_info = device_address;
            // // // // // // console.log( this.device_info)
            // Use device_address as needed in your application
          })
          .catch(error => {
            console.error("Error fetching address information:", error);
          });
      })
      .catch(error => {
        console.error("Error fetching IP geolocation:", error);
      });
  }
  
  // getLocation() {
  //   const userAgent = navigator.userAgent;
  //   const screenWidth = window.screen.width;
  //   const screenHeight = window.screen.height;
  //   const browserName = navigator.appName;
  //   const browserVersion = navigator.appVersion;
  //   const platform = navigator.platform;
  //   const language = navigator.language;
  //   const nominatimApiUrl = 'https://nominatim.openstreetmap.org/reverse?format=json';
  
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const latitude = position.coords.latitude;
  //         const longitude = position.coords.longitude;
  
  //         // Optionally, use reverse geocoding using Nominatim (as in your original code)
  //         const nominatimUrl = `${nominatimApiUrl}&lat=${latitude}&lon=${longitude}`;
  
  //         fetch(nominatimUrl)
  //           .then(response => response.json())
  //           .then(data => {
  //             const device_address = {
  //               address: {
  //                 latitude: latitude,
  //                 longitude: longitude,
  //                 // Parse other address components as needed
  //               },
  //               browserinfo: {
  //                 userAgent: userAgent,
  //                 BrowserName: browserName,
  //                 BrowserVersion: browserVersion,
  //                 Platform: platform,
  //                 Language: language,
  //                 ScreenSize: `${screenWidth}x${screenHeight}`,
  //               },
  //               ip_Address: null, // No need for IP address in this case
  //             };
  
  //             this.device_info = device_address;
  //             // // // // // console.log( this.device_info);
  //             // Use device_address as needed in your application
  //           })
  //           .catch(error => {
  //             console.error("Error fetching address information:", error);
  //           });
  //       },
  //       (error) => {
  //         console.error("Error getting location:", error);
  //       }
  //     );
  //   } else {
  //     console.error("Geolocation is not supported by this browser.");
  //   }
  // }

  
  @HostListener('document:keyup.enter', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.logdata.valid) {
      this.onLogin();
    }
  }

}


