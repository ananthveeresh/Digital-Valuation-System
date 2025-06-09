import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SemisterService } from 'src/app/core/services/semister.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
@Component({
  selector: 'app-fee-concession',
  templateUrl: './fee-concession.component.html',
  styleUrls: ['./fee-concession.component.css']
})
export class FeeConcessionComponent {
  public Concession: FormGroup;
  public fileModels: { [key: string]: File } = {};
  public pterr: string = '';
  fileType: string;
  selected_certificate:any
  StdInfo:any = [];
  semdetials:any = [];
  public certificates_array: any = [];
  Previous_Student_Data: any = [];

 
  constructor(private fb: FormBuilder, private _SemisterService: SemisterService, private sanitizer: DomSanitizer, private router:Router){
    this.Concession = this.fb.group({
      examId:['Select Semester', Validators.required],
      comment: ['', Validators.required],
      authorized: ['', Validators.required],
      file: ['', Validators.required],
    });
  }
  ngOnInit(){
   
    this.StdInfo = localStorage.getItem('ConcessionStd');
    this.StdInfo = JSON.parse(this.StdInfo)
       this.Concession.patchValue({
          suc: this.StdInfo[0].student_no
        });
        this._SemisterService.get_list_by_campus(this.StdInfo[0].campus_name).subscribe(res =>{
          this.semdetials = res;
          this.Get_StdData()
          //// // // console.log(  this.semdetials)
    
        })
      
   }

   Get_StdData(){
    var obj = {
      "suc":this.StdInfo[0].student_no,
      "examId": this.semdetials[0]?.examId
  
    }
    // // // console.log( obj)
    this._SemisterService.Fee_Permission_StdData(obj).subscribe(res =>{
      // // // console.log( res);
      this.Previous_Student_Data = res
    });
   }
   pdf_url_sanitize(url: any) {
    
    let newUrl = '';
  
    if (typeof url === 'object' && url?.changingThisBreaksApplicationSecurity) {
      newUrl = url.changingThisBreaksApplicationSecurity; 
      // // // // console.log( newUrl)
    } else if (typeof url === 'string') {
      newUrl = url; 
    }
  
    if (newUrl) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(newUrl);
    }
  
    console.warn('Invalid URL:', url); 
    return this.sanitizer.bypassSecurityTrustResourceUrl('about:blank'); 
  }
   onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.fileModels[0] = file; // Save the file
      this.pterr = ''; // Clear error message
    }
  }

  uploadPhoto(): void {
    const photofile = this.fileModels[0];
    const filevault = 'https://apis.aditya.ac.in/filevault/';
    const sptoken = '9cf742e6-4d25-4b73-acfe-648911a804e8';
    const uploadUrl = filevault + 'upload?api_key=' + sptoken;
    const photoUploadPath = '/analysis/studentcertificates';

    if (!photofile) {
      this.pterr = 'Please upload a valid file';
    } else {
      this.pterr = '';
      this._SemisterService.uploadFileToUrl(photofile, uploadUrl, photoUploadPath).subscribe({
        next: (response) => {
          // // // console.log( response);
          const filekey = btoa(sptoken + response._id);
          response.docType = 'image'
          response.fileurl = filevault + "download/" + response._id + "?key=" + filekey
      
          if (this.certificates_array.length > 0) {
            let found = false;
            for (let i = 0; i < this.certificates_array.length; i++) {
              if (this.certificates_array[i].docType === 'image') {
                this.certificates_array[i] = response;
                found = true;
                break;
              }
            }

            if (!found) {
              this.certificates_array.push(response); 
            }
          } else {
            this.certificates_array.push(response);
          }

        },
        error: (error: any) => {
          console.error(error);
          this.pterr = 'An error has occurred';
        },
      });
    }
  }

 

 
  certificate_view() {
    if (this.certificates_array.length > 0) {
      var filtered_certificate = this.certificates_array.filter((e: { docType: any; }) => e.docType)
      // // // // // // console.log( filtered_certificate)
      if (filtered_certificate.length > 0) {
        if (filtered_certificate[0].mimetype == "application/pdf") {
          filtered_certificate[0].fileurl = this.sanitizer.bypassSecurityTrustResourceUrl(filtered_certificate[0].fileurl)
        }
        this.selected_certificate = filtered_certificate
      }
      else {
        this.selected_certificate = []
      }
    }
  }



  Submit(){
   // // // console.log(  this.certificates_array)
   var obj = {
    "examinfo": this.semdetials,
    "studentinfo": this.StdInfo,
     "suc": this.StdInfo[0].student_no,
     "permissionreason": this.Concession.value.comment,
     "authorizedby": this.Concession.value.authorized,
     "filepath": this.certificates_array,
   }
   // // // console.log( obj)
   this._SemisterService.Fee_Permission(obj).subscribe(data => {
    alert('Permission granted')
    location.reload();
    
   });

  }
  Back_To_Reg(){
    this.router.navigate(['/regStud'])
  }
}
