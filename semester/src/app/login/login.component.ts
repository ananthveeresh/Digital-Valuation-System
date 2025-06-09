import { Component,HostListener  } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms'
import { AuthenticationService } from '../core/services/authentication.service';  
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {


 

  public show_log_error =''; 
  verifyStd:any =[]

  logdata: FormGroup;   
  constructor(private fb: FormBuilder, private _authenticationService: AuthenticationService, private router: Router) { 
    this.logdata = this.fb.group({
      stdMobileNo: ['', [Validators.required]],
      stdPwd: ['', [Validators.required]],
    }); 
  }
  ngOnInit(){
    // if (localStorage.getItem('logindata')) {
    //       this.router.navigate(['student']);
    // }
    
  }

  onLogin() {
    // //// // // // // console.log(this.logdata.value)
    let stdMobileNo = this.logdata.value.stdMobileNo;
    let stdPwd = this.logdata.value.stdPwd;

    var obj = {
      "stdMobileNo": stdMobileNo,
      "stdPwd": stdPwd,
    };
    //  // // // // console.log(obj); 
    this._authenticationService.post_login(obj).subscribe(data => {

    
      if(data.result.length==0 || data.result=="Mobile number not registered"){
        this.show_log_error = "Invalid Credentials";   
      }else{
       
          this.show_log_error = '';   
      
          localStorage.setItem('logindata',JSON.stringify(data.result[0]));
          this.router.navigate(['/student'])
         }
       
      
    });
  }

  clearfunction(){
    this.show_log_error = '';  
  }

  gotoForgot(){
    window.location.href='#/forgetpassword'  
  } 

  @HostListener('document:keyup.enter', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.logdata.valid) {
      this.onLogin();
    }
  }

}


function generateRandomString() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}