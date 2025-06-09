import { Component } from '@angular/core';
import { CampusmasterService } from 'src/app/core/services/campusmaster.service';

@Component({
  selector: 'app-campusmaster',
  templateUrl: './campusmaster.component.html',
  styleUrls: ['./campusmaster.component.css']
})
export class CampusmasterComponent {
  public logininfo: any = [];
  public campus_list: any = [];

  constructor(private _CampusmasterService: CampusmasterService) { }

  ngOnInit() {
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)
    // // // // console.log( this.logininfo)

    this._CampusmasterService.get_campus_list().subscribe(data => {
      // // // console.log(data)
      this.campus_list = data
    })
  }
}
