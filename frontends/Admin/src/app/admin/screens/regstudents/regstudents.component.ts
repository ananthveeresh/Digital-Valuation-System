import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SemisterService } from 'src/app/core/services/semister.service';
import { DomSanitizer } from '@angular/platform-browser';
import * as ExcelReport from 'xlsx';
@Component({
  selector: 'app-regstudents',
  templateUrl: './regstudents.component.html',
  styleUrls: ['./regstudents.component.css']
})
export class RegstudentsComponent {
  public logininfo: any = [];
  public student_list: any = [];
  SemesterList:any = [];
  public show_exam_create = 0;
  selectedStudent: any = null;
  selectedStdInfo : any = [];
  language:string = '';
  public selected_certificate: any = [];
  
  public show_certificates = 0;
  ShowStd = 0
  CampusList:any = [];
  selected_type:string = ''
  PaidStd:any = [];
  UnPaidStd:any = [];
  AllStud:any = [];
  selected_campus:string = '';
  select_examId:string =  '';
  selectedValue:string = '';
  isSubmitted:number = 0;
  profile_data:any;
  CheckPercent:any
  hallticket:number = 0;
  loading: boolean = false;
  selectedexam:any;

  constructor( private router: Router, public _StudentService: SemisterService, private sanitizer: DomSanitizer) {}
  
  ngOnInit() {
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)

    this._StudentService.get_sem_list().subscribe(data => {
      // // console.log(data)
      this.SemesterList = data.filter((e: { hallticketissue: number; })=> e.hallticketissue == 1);
    })
    this._StudentService.get_sem_student().subscribe((data: any) => {
      // // console.log( data);
      this.student_list = data;
    })
  }
  get_examId(examId:any){
    this.CampusList = [];
    this.selected_campus = "";
    this.selectedValue = "";
    this.AllStud = [];
    this.PaidStd = [];
    this.UnPaidStd = [];
    this.isSubmitted = 0;
    var campus = this.SemesterList.filter((e: { examId: any; }) => e.examId ==examId.target.value)
    // // // console.log(campus[0].campus)
    // // // console.log(this.logininfo.UserCampus)
    if(campus.length>0){
      for(var i=0; i<this.logininfo.UserCampus.length; i++){
        var temp = campus[0].campus.filter((e: any)=> e == this.logininfo.UserCampus[i].campus_name)
        if(temp.length>0){
          this.CampusList.push(temp[0])
        }
      }
    }
    // // console.log(this.CampusList)
  }
 
  get_Campus(campus_name: any){
    this.selectedValue = "";
    this.AllStud = [];
    this.PaidStd = [];
    this.UnPaidStd = [];
    this.isSubmitted = 0;
    this.selected_campus = campus_name.target.value;
  }
  SelectedType(type:any){
    this.AllStud = [];
    this.PaidStd = [];
    this.UnPaidStd = [];
    this.isSubmitted = 0;
    this.selectedValue = type.target.value; 
  }
  isDisabled(): boolean {
    return !(this.selectedValue?.length > 0 && this.selected_campus?.length > 0);
  }
    
  GetResult() {
    this.isSubmitted = 1;
    this.show_certificates = 0;
    const filterByCampus = this.selected_campus !== 'All';
    if (this.selectedValue === 'Paid') {
      
      this.ShowStd = 1;
      this.PaidStd = this.student_list.filter((e: any) => {
        const campusMatch = filterByCampus ? e.studentinfo?.[0]?.campus_name === this.selected_campus : true;
        const hasPaymentInfo = e.paymentinfo && e.paymentinfo.length > 1;
  
        if (this.PaidStd && this.PaidStd.length > 0) {
          const certificates = this.PaidStd[0].certificates.map((certificate: { fileurl: { changingThisBreaksApplicationSecurity: any; }; }) => {
            return {
              ...certificate,
              fileurl: typeof certificate.fileurl === 'object'
                ? certificate.fileurl.changingThisBreaksApplicationSecurity
                : certificate.fileurl
            };
          });
  
          this.selected_certificate = certificates;
        }
        return campusMatch && hasPaymentInfo;
      });
    } else if (this.selectedValue === 'Not Paid') {
      this.ShowStd = 2;
      this.UnPaidStd = this.student_list.filter((e: any) => {
        const campusMatch = filterByCampus ? e.studentinfo?.[0]?.campus_name === this.selected_campus : true;
        const hasPaymentInfo = e.paymentinfo && e.paymentinfo.length === 1;
        return campusMatch && hasPaymentInfo;
        
      });
      // // // // console.log( this.UnPaidStd)
    } else if (this.selectedValue === 'All') {
      this.ShowStd = 0;
      
      this.AllStud = this.student_list.filter((e: any) => {
        const campusMatch = filterByCampus ? e.studentinfo?.[0]?.campus_name === this.selected_campus : true;
  
        if (this.AllStud && this.AllStud.length > 0) {
          const certificates = this.AllStud[0].certificates.map((certificate: { fileurl: { changingThisBreaksApplicationSecurity: any; }; }) => {
            return {
              ...certificate,
              fileurl: typeof certificate.fileurl === 'object'
                ? certificate.fileurl.changingThisBreaksApplicationSecurity
                : certificate.fileurl
            };
          });
  
          this.selected_certificate = certificates;
        }
        return campusMatch;
      });

      
      // // // // console.log( this.AllStud)
     
    }
    // else if(this.selectedValue == 'Issued'){
    //   var obj = {
    //     "examId" : this.select_examId,
    //     "campus": this.selected_campus,
    //     "type" : this.selectedValue
    //   }


    // }
  }
  getHallTicket(index:any,suc:any, campus:any){
    this._StudentService.get_profile_data(suc).subscribe(data =>{
      this.profile_data = data[0]
      var obj = {
        "student_id": this.profile_data.studentinfo[0]?.std_id,
        "year_id": this.profile_data.studentinfo[0]?.year_id,
        "section_id": this.profile_data.studentinfo[0]?.sec_id,
      }
      this._StudentService.VerifyStdAttendance(obj).subscribe((data:any) =>{
       
        var PresentDays = 0; var WorkingDays = 0;
        for(var i = 0; i < data.result.length; i++) {
          PresentDays += data.result[i].presentdays
          WorkingDays += data.result[i].workingdays

        }
        this.CheckPercent = Math.round(PresentDays / WorkingDays * 100);
        var curentStd = { "campus_name": campus, "suc": suc }
        localStorage.setItem('CurrentStudent', JSON.stringify(curentStd))
        this.hallticket = 1
      });
    });
  }

  getPreview(stdInfo: any) {
    this.show_certificates =  1;
    this.selectedStdInfo = stdInfo;
  }
  Get_Concession(stdInfo: any) {
    // // // // console.log( stdInfo)
    localStorage.setItem('ConcessionStd', JSON.stringify(stdInfo))
    this.router.navigate(['/fee'])
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
  openPdfInNewTab(url: any) {
    window.open(url.changingThisBreaksApplicationSecurity, '_blank');
  }
  back(){
   this.show_certificates = 0
  }
  Edit(){
    this.router.navigate(['/edit'], { state: { selectedStdInfo: this.selectedStdInfo } });

  }
  
  get_back_to_sem(){
    this.router.navigate(['/createSem']);

  }
  exportToExcel(): void {
    var ExcelArray = []; var obj = {}
    if(this.selectedValue == 'Paid'){
      for(let i = 0; i < this.PaidStd.length; i++) {
        obj = {
          "campusname":this.PaidStd[i].studentinfo[0].campus_name,
          "section_name":this.PaidStd[i].studentinfo[0].section_name,
          "cousre":this.PaidStd[i].course[0].full_course_name,
          "language": this.PaidStd[i].language,
          "suc": this.PaidStd[i].suc,
          "stdName": this.PaidStd[i].studentname,
          "email": this.PaidStd[i].studentemail,
          "mobile": this.PaidStd[i].studentmobilenumber,
          "AadharNumber": this.PaidStd[i].studentaadhaarnumber,
          "FeeStatus": 'Paid'
        }
        ExcelArray.push(obj);
      }
    }else if(this.selectedValue == 'Not Paid'){
      for(let i = 0; i < this.UnPaidStd.length; i++) {
        obj = {
          "campusname":this.UnPaidStd[i].studentinfo[0].campus_name,
          "section_name":this.UnPaidStd[i].studentinfo[0].section_name,
          "cousre":this.UnPaidStd[i].course[0].full_course_name,
          "language": this.UnPaidStd[i].language,
          "suc": this.UnPaidStd[i].suc,
          "stdName": this.UnPaidStd[i].studentname,
          "email": this.UnPaidStd[i].studentemail,
          "mobile": this.UnPaidStd[i].studentmobilenumber,
          "AadharNumber": this.UnPaidStd[i].studentaadhaarnumber,
          "FeeStatus": 'Not Paid'
        }
        ExcelArray.push(obj);
      }
    }else if(this.selectedValue == 'All'){
      for(let i = 0; i < this.AllStud.length; i++) {
        obj = {
          "campusname":this.AllStud[i].studentinfo[0].campus_name,
          "section_name":this.AllStud[i].studentinfo[0].section_name,
          "cousre":this.AllStud[i].course[0].full_course_name,
          "language": this.AllStud[i].language,
          "suc": this.AllStud[i].suc,
          "stdName": this.AllStud[i].studentname,
          "email": this.AllStud[i].studentemail,
          "mobile": this.AllStud[i].studentmobilenumber,
          "AadharNumber": this.AllStud[i].studentaadhaarnumber,
          "FeeStatus": this.AllStud[i].paymentinfo.length > 0 ? 'Paid' : 'Not Paid'
        }
        ExcelArray.push(obj);
      }
    }
   
    const ws: ExcelReport.WorkSheet = ExcelReport.utils.json_to_sheet(ExcelArray);
    const wb: ExcelReport.WorkBook = ExcelReport.utils.book_new();
    ExcelReport.utils.book_append_sheet(wb, ws, 'Sheet1');
    ExcelReport.writeFile(wb, 'SemisterStudentsList.xlsx');
  }
  update_hallticket(dt: any){
    this.hallticket = 0
  }
}
  