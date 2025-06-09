import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SemisterService } from 'src/app/core/services/semister.service';
import { DomSanitizer } from '@angular/platform-browser';
import * as ExcelReport from 'xlsx';

@Component({
  selector: 'app-sem2',
  templateUrl: './sem2.component.html',
  styleUrls: ['./sem2.component.css']
})
export class Sem2Component {

  public logininfo: any = [];
  public total_std_list: any = [];
  public student_list: any = [];
  public show_certificates = 0;
  public selectedStdInfo: any = [];
  public campus_list: any = [];
  public selected_campus: any = '';
  public profile_data: any = [];
  public hallticket: number = 0;

  constructor(private router: Router, public _StudentService: SemisterService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)
    // // console.log(this.logininfo)

    this._StudentService.std_sem2().subscribe(data => {
      // // console.log(data)
      if (data.length > 0) {
        var std_data = data;
        var unique_cmp = [...new Set(data.flatMap((item: { studentinfo: any[]; }) => item.studentinfo.map((info: { campus_name: any; }) => info.campus_name)))];
        // // console.log(unique_cmp)
        // // console.log(this.logininfo.UserCampus)
        var filtered_cmp_wise_list: any = [];
        for (var i = 0; i < unique_cmp.length; i++) {
          var filtered_cmp = this.logininfo.UserCampus.filter((e: { campus_name: unknown; }) => e.campus_name == unique_cmp[i])
          // // console.log(filtered_cmp)
          if(filtered_cmp.length > 0){
            this.campus_list.push(filtered_cmp[0])
          }
          var cmp_wise_data = std_data.filter((e: { studentinfo: { campus_name: unknown; }[]; }) => e.studentinfo[0].campus_name == unique_cmp[i])
          var obj = {
            "campus_name": unique_cmp[i],
            "std_info": cmp_wise_data
          }
          filtered_cmp_wise_list.push(obj)
        }
        // // console.log(this.campus_list)
        // // console.log(filtered_cmp_wise_list)
        this.total_std_list = filtered_cmp_wise_list
      } else {
        this.campus_list = [];
        this.student_list = [];
        this.total_std_list = [];
      }
      this.student_list = data;
    })

  }

  on_cmp_change() {
    this.student_list = [];
    this.show_certificates = 0;
  }

  GetResult() {
    this.student_list = this.total_std_list.filter((e: { campus_name: any; }) => e.campus_name == this.selected_campus)[0].std_info;
    // // console.log(this.student_list)
    this.show_certificates = 1;
  }

  getPreview(stdInfo: any) {
    this.show_certificates = 2;
    this.selectedStdInfo = stdInfo;
  }

  pdf_url_sanitize(url: any) {
    function extractUrl(obj: any): string {
      if (typeof obj === 'string') {
        return obj;
      } else if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
          return extractUrl(obj[key]); // Recursively extract the URL
        }
      }
      return '';
    }
    const sanitizedUrl = extractUrl(url);
    if (sanitizedUrl) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(sanitizedUrl);
    }
    console.warn('Invalid URL:', url);
    return this.sanitizer.bypassSecurityTrustResourceUrl('about:blank');
  }

  getHallTicket(index: any, suc: any, campus: any) {
    this._StudentService.get_profile_data(suc).subscribe(data => {
      this.profile_data = data[0]
      var obj = {
        "student_id": this.profile_data.studentinfo[0]?.std_id,
        "year_id": this.profile_data.studentinfo[0]?.year_id,
        "section_id": this.profile_data.studentinfo[0]?.sec_id,
      }
      this._StudentService.VerifyStdAttendance(obj).subscribe((data: any) => {

        var PresentDays = 0; var WorkingDays = 0;
        for (var i = 0; i < data.result.length; i++) {
          PresentDays += data.result[i].presentdays
          WorkingDays += data.result[i].workingdays

        }
        // this.CheckPercent = Math.round(PresentDays / WorkingDays * 100);
        var curentStd = { "campus_name": campus, "suc": suc }
        localStorage.setItem('CurrentStudent', JSON.stringify(curentStd))
        this.show_certificates = 0;
        this.hallticket = 1;
      });
    });
  }

  update_hallticket(dt: any) {
    this.hallticket = 0;
    this.show_certificates = 1;
  }

    exportToExcel(): void {
      var ExcelArray = []; var obj = {}
        for(let i = 0; i < this.student_list.length; i++) {
          obj = {
            "campusname":this.student_list[i].studentinfo[0].campus_name,
            "section_name":this.student_list[i].studentinfo[0].section_name,
            "cousre":this.student_list[i].course[0].full_course_name,
            "language": this.student_list[i].language,
            "suc": this.student_list[i].suc,
            "stdName": this.student_list[i].studentname,
            "email": this.student_list[i].studentemail,
            "mobile": this.student_list[i].studentmobilenumber,
            "AadharNumber": this.student_list[i].studentaadhaarnumber,
            "FeeStatus": 'Paid'
          }
          ExcelArray.push(obj);
        }
     
      const ws: ExcelReport.WorkSheet = ExcelReport.utils.json_to_sheet(ExcelArray);
      const wb: ExcelReport.WorkBook = ExcelReport.utils.book_new();
      ExcelReport.utils.book_append_sheet(wb, ws, 'Sheet1');
      ExcelReport.writeFile(wb, 'sem2_paid_list.xlsx');
    }
}
