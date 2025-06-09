import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RegistrationService } from 'src/app/core/services/registration.service'; 


@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  registered_data: any = [];
  logininfo: any = {};
  student_profile_data: any = [];
  selected_certificate: any = {};
  sanitizedFileUrl: any;

  constructor(private router: Router,private sanitizer: DomSanitizer, private _registrationService: RegistrationService) { }

  ngOnInit(): void {
    this.logininfo = localStorage.getItem("logindata");
    // this.logininfo = JSON.parse(this.logininfo);
    this.registered_data = localStorage.getItem('registrationdata')
    this.registered_data = JSON.parse(this.registered_data);
    // // // // console.log(this.registered_data)
    // // // // // console.log(this.registered_data[0].studentinfo)
    this.student_profile_data.push(this.registered_data[0].studentinfo)
    // // // // // console.log(this.student_profile_data)

  }

  preview_certificate(data: any) {
    if (data.mimetype == "application/pdf") {
        this.sanitizedFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data.fileurl);
    } else {
        this.sanitizedFileUrl = data.fileurl;
    }
    this.selected_certificate = data;
    // // // // console.log(this.selected_certificate);
}


  onSubmit() {

    var obj = {
      "course": this.registered_data[0].course,
      "language": this.registered_data[0].language,
      "studentinfo": this.student_profile_data,
      "suc": this.registered_data[0].suc,
      "studentname": this.registered_data[0].studentname,
      "dob": this.registered_data[0].dob,
      "gender": this.registered_data[0].gender,
      "religion": this.registered_data[0].religion,
      "reservation": this.registered_data[0].reservation,
      "physicallychallenged": this.registered_data[0].physicallychallenged,
      "studentemail": this.registered_data[0].studentemail,
      "studentmobilenumber": this.registered_data[0].studentmobilenumber,
      "studentwhatsappnumber": this.registered_data[0].studentwhatsappnumber,
      "studentaddress": this.registered_data[0].studentaddress,
      "studentaadhaarnumber": this.registered_data[0].studentaadhaarnumber,
      "mole1": this.registered_data[0].mole1,
      "mole2": this.registered_data[0].mole2,
      "fathername": this.registered_data[0].fathername,
      "fathermobilenumber": this.registered_data[0].fathermobilenumber,
      "fatheremail": this.registered_data[0].fatheremail,
      "mothername": this.registered_data[0].mothername,
      "mothermobilenumber": this.registered_data[0].mothermobilenumber,
      "motheremail": this.registered_data[0].motheremail,
      "sscboard": this.registered_data[0].sscboard,
      "sschallticketnumber": this.registered_data[0].sschallticketnumber,
      "sscgpa": this.registered_data[0].sscgpa,
      "sscyearofpass": this.registered_data[0].sscyearofpass,
      "interboard": this.registered_data[0].interboard,
      "interhallticketnumber": this.registered_data[0].interhallticketnumber,
      "interpercentage": this.registered_data[0].interpercentage,
      "interyearofpass": this.registered_data[0].interyearofpass,
      //  "certificates": this.files,
      "board_id": this.registered_data[0].suc

    }
    // // // // console.log(obj)

    if (confirm("Are You Sure Do You Want to Submit ?")) {
      this._registrationService.student_reg_create(obj).subscribe((data) => {
        // // // // console.log(data)
        if(data){
          this.router.navigate(['/student/payfee']); 
        }
      })
    }
  }

}
