import { Component,OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent { 
  public logininfo : any=[];  
  public stdprograminfo : any=[]; 
  public togglevalue: Number=0;
  StdCategory: any;
  public errorimg: any;

  constructor( private _authenticationService: AuthenticationService, private router: Router ){}

  logout(): void {
    this._authenticationService.logout();
  }

  gotohome(){
    this.router.navigate(['/student/']);
  }
 menuchange(){

  const box = document.getElementById('appbody');

  if (this.togglevalue==0) {
     box?.classList.add('toggle-sidebar');
     this.togglevalue=1;
  }else{
    box?.classList.remove('toggle-sidebar');
    this.togglevalue=0;
  } 
 }

  ngOnInit(){ 
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)
    this.errorimg = "assets/img/profile-img.jpg"; 
    this.stdprograminfo = localStorage.getItem('studentprograms');
    this.stdprograminfo = JSON.parse(this.stdprograminfo)
    this.StdCategory =this.logininfo.stdQualification

  } 
}
