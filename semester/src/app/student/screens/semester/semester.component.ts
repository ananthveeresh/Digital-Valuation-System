import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SemesterService } from 'src/app/core/services/semester.service';

@Component({
  selector: 'app-semester',
  templateUrl: './semester.component.html',
  styleUrls: ['./semester.component.css']
})
export class SemesterComponent {

  public logininfo: any = [];
  public student_profile_data: any = [];
  public exams_list: any = [];
  public std_info: any = [];
  public total_exams_list: any = [];

  constructor(private router: Router, private _semesterService: SemesterService) { }

  ngOnInit() {

    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)
    // // // // // console.log(this.logininfo)

    this._semesterService.get_profile_data(this.logininfo.stdSuc).subscribe(prodata => {
      var verifyStd = prodata

      if (verifyStd.length > 0) {
        const randomString = generateRandomString();
        let encoded_obj = window.btoa(randomString);
        this.router.navigate(['/student/payfee', encoded_obj]);
      }
    });

    this._semesterService.get_list(this.logininfo.stdCampus).subscribe(sms_data => {
      // // // // // console.log(sms_data)
      this.exams_list = sms_data

      this._semesterService.get_std_profile(this.logininfo.stdSuc).subscribe((std_data: any) => {
        // // // // // console.log(std_data)
        this.student_profile_data = std_data
        // // // console.log(this.student_profile_data[0].smc_order)
        const filteredData = this.exams_list.filter((e: { semister: any; }) => {
          const smcOrder = this.student_profile_data[0].smc_order;
          return e.semister == (smcOrder !== null ? smcOrder.toString() : smcOrder);
        });
        // // // console.log(filteredData)
        const today = new Date();
        this.total_exams_list = filteredData.filter((e: { endDate: string | number | Date; }) => new Date(e.endDate) >= today);

        // // // console.log(this.total_exams_list)
      })
    })
  }

  navigateToRegistration() {
    const randomString = generateRandomString();
    // // // // // console.log(post_obj)
    this._semesterService.registeration_check(this.logininfo.stdSuc).subscribe(data => {
      // // // // // console.log(data)
      // this.router.navigate(['/student/registration']);
      if (data.length > 0) {

        let encoded_obj = window.btoa(randomString);
        this.router.navigate(['/student/payfee', encoded_obj]);
      }
      else {

        let encoded_obj = window.btoa(randomString);
        this.router.navigate(['/student/registration', encoded_obj]);
      }
    })
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