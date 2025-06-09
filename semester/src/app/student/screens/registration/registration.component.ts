import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistrationService } from 'src/app/core/services/registration.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';



@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  public registration_form: FormGroup;
  public formDataArray: any = [];
  public logininfo: any = {};
  public student_profile_data: any = [];
  public imageData: SafeResourceUrl | undefined;
  public selected_file: any | undefined;
  public files: { [key: string]: { file: File | null, preview: SafeResourceUrl | null, type: string | null } } = {};
  public std_main_course_data: any = [];
  public selected_course_info: any = [];
  public reservation_category: any = [];


  public fileModels: { [key: string]: File } = {};
  public pterr: string = '';
  public certificates_array: any = [];
  public selected_certificate: any = [];
  public uploadedFilesStatus: { [key: string]: boolean } = {
    'Passport Photo': false,
    'Student Signature': false,
    'SSC Certificate': false,
    'Intermediate Certificate': false,
    'Student Aadhar': false,
    'OAMDC': false,
  };
  public selcted_reservation: any;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private _registrationService: RegistrationService, private sanitizer: DomSanitizer) {
    this.registration_form = this.fb.group({
      course: ['', [Validators.required]],
      language: ['TELUGU', [Validators.required]],
      suc: ['', [Validators.required, Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^[0-9]*$')]],
      studentname: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      religion: ['', Validators.required],
      reservation: ['', Validators.required],
      physicallychallenged: ['NOT APPLICABLE', Validators.required],
      studentemail: ['', [Validators.required, Validators.email]],
      studentmobilenumber: ['', [Validators.required, Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^[0-9]*$')]],
      studentwhatsappnumber: ['', [Validators.required, Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^[0-9]*$')]],
      studentaddress: ['', Validators.required],
      studentaadhaarnumber: ['', [Validators.required, Validators.minLength(12),
      Validators.maxLength(13),
      Validators.pattern('^[0-9]*$')]],
      mole1: ['', Validators.required],
      mole2: ['', Validators.required],
      fathername: ['', Validators.required],
      fathermobilenumber: ['', [Validators.required, Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^[0-9]*$')]],
      fatheremail: ['', Validators.email],
      mothername: ['', Validators.required],
      mothermobilenumber: ['', [Validators.required, Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^[0-9]*$')]],
      motheremail: ['', Validators.email],
      sscboard: ['STATE', Validators.required],
      sschallticketnumber: ['', [Validators.required,
      Validators.maxLength(15),
      Validators.pattern('^[0-9]*$')]],
      sscgpa: ['', Validators.required],
      sscyearofpass: ['2024', Validators.required],
      interboard: ['BIEAP', Validators.required],
      interhallticketnumber: ['', [Validators.required,
      Validators.maxLength(30)]],
      interpercentage: ['', Validators.required],
      interyearofpass: ['2024', Validators.required],
      confirmation: ['', Validators.required],
      passportphot: ['', Validators.required],
      studentsignature: ['', Validators.required],
      ssccertificate: ['', Validators.required],
      intermediatecertificate: ['', Validators.required],
      studentaadhaar: ['', Validators.required],
      oamdc: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.logininfo = localStorage.getItem("logindata");
    this.logininfo = JSON.parse(this.logininfo);
    // // // console.log(this.logininfo)

    var random_number = this.route.snapshot.params['rdm_id'];
    let decoded = window.atob(random_number);

    this._registrationService.studentprofile(this.logininfo.stdSuc).subscribe(data => {
      this.student_profile_data = data[0]
      //  // // console.log(this.student_profile_data)    

      this._registrationService.studentmaincourse(this.logininfo.stdInst).subscribe(data => {
        this.std_main_course_data = data
        // // // // console.log(this.std_main_course_data)
        this.selected_course_info = this.std_main_course_data.filter((e: { id: any; }) => e.id == this.student_profile_data.main_course_id)
        //  // // console.log(this.selected_course_info)

        if (this.student_profile_data) {
          this.registration_form.patchValue({
            suc: this.student_profile_data.student_no,
            course: this.selected_course_info[0]?.full_course_name,
            studentname: this.student_profile_data.student_name,
            dob: this.convertDateToISO(this.student_profile_data.dob),
            gender: this.student_profile_data.gender,
            religion: this.student_profile_data.religion,
            reservation: this.student_profile_data.caste,
            studentemail: this.student_profile_data.email,
            studentmobilenumber: this.student_profile_data.mobile_no,
            studentaddress: this.student_profile_data.street,
            studentaadhaarnumber: this.student_profile_data.aadhar_no,
            fathername: this.student_profile_data.father_name,
            mothername: this.student_profile_data.mother_name,
          });
        }
      })

    })

  }


  convertDateToISO(dateString: string): string {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // onFileSelected(event: Event, docType: string): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     this.fileModels[docType] = input.files[0];
  //     // // // // // console.log(this.fileModels)
  //   }
  // }

  onFileSelected(event: Event, docType: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const validExtensions: any = {
        'Passport Photo': ['image/jpeg', 'image/png'],
        'Student Signature': ['image/jpeg', 'image/png'],
        'SSC Certificate': ['application/pdf'],
        'Intermediate Certificate': ['application/pdf'],
        'Student Aadhar': ['application/pdf'],
        'OAMDC': ['application/pdf'],
        'Caste Certificate': ['application/pdf']
      };

      // Check if the file type is valid for the specific document type
      if (validExtensions[docType]?.includes(file.type)) {
        this.fileModels[docType] = file; // Save the file if valid
        this.pterr = ''; // Clear error message
      } else {
        // Invalid file type: Show an alert and reset the input
        alert(`Invalid file type for ${docType}. Please upload a valid file.`);
        input.value = ''; // Reset the input field

      }
    }
  }


  uploadPhoto(docType: string): void {
    // // // // // console.log(this.fileModels)
    // // // // // console.log(docType)
    const photofile = this.fileModels[docType];
    const filevault = "https://apis.aditya.ac.in/filevault/"
    const sptoken = '9cf742e6-4d25-4b73-acfe-648911a804e8';
    const uploadUrl = filevault + 'upload?api_key=' + sptoken;
    const photoUploadPath = '/analysis/studentcertificates';

    if (!photofile) {
      this.pterr = 'Please upload a valid file';
    } else {
      this.pterr = '';
      this._registrationService.uploadFileToUrl(photofile, uploadUrl, photoUploadPath).subscribe({
        next: async (response) => {
          // // // // // console.log(response);
          response.docType = docType
          var filekey = btoa(sptoken + response._id);
          response.fileurl = filevault + "download/" + response._id + "?key=" + filekey
          //   // // // // console.log(this.fileModels)
          // // // // // console.log(this.files)
          if (this.certificates_array.length > 0) {
            let found = false;
            for (let i = 0; i < this.certificates_array.length; i++) {
              if (this.certificates_array[i].docType === docType) {
                this.certificates_array[i] = response;
                found = true;
                break;
              }
            }

            if (!found) {
              this.certificates_array.push(response); // Push the new object if no match was found
            }
          } else {
            this.certificates_array.push(response); // Handle the empty array case
          }

          this.uploadedFilesStatus[docType] = true;
          // // // // // console.log(this.certificates_array)
        },
        error: (error) => {
          console.error(error);
          this.pterr = 'An error has occurred';
        },
      });
    }
  }

  check_upload(type: any) {
    // // // // console.log(this.fileModels.hasOwnProperty(type))
    return this.fileModels.hasOwnProperty(type);
  }

  check_preview(type: any) {
    var filtered_certificate = this.certificates_array.filter((e: { docType: any; }) => e.docType == type)
    if (filtered_certificate.length > 0) {
      return true;
    }
    else {
      return false
    }
  }

  certificate_view(type: any) {
    if (this.certificates_array.length > 0) {
      var filtered_certificate = this.certificates_array.filter((e: { docType: any; }) => e.docType == type)
      // // // // // console.log(filtered_certificate)
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

  areAllFilesUploaded(): boolean {
    const filesToCheck = Object.keys(this.uploadedFilesStatus).filter(key => key !== 'Caste Certificate');
    return filesToCheck.every(docType => this.uploadedFilesStatus[docType]);
  }


  onSubmit() {

    const randomString = generateRandomString();
    var obj = {
      "course": this.selected_course_info,
      "language": this.registration_form.value.language,
      "studentinfo": this.student_profile_data,
      "suc": this.registration_form.value.suc,
      "studentname": this.registration_form.value.studentname,
      "dob": this.registration_form.value.dob,
      "gender": this.registration_form.value.gender,
      "religion": this.registration_form.value.religion,
      "reservation": this.registration_form.value.reservation,
      "physicallychallenged": this.registration_form.value.physicallychallenged,
      "studentemail": this.registration_form.value.studentemail,
      "studentmobilenumber": this.registration_form.value.studentmobilenumber,
      "studentwhatsappnumber": this.registration_form.value.studentwhatsappnumber,
      "studentaddress": this.registration_form.value.studentaddress,
      "studentaadhaarnumber": this.registration_form.value.studentaadhaarnumber,
      "mole1": this.registration_form.value.mole1,
      "mole2": this.registration_form.value.mole2,
      "fathername": this.registration_form.value.fathername,
      "fathermobilenumber": this.registration_form.value.fathermobilenumber,
      "fatheremail": this.registration_form.value.fatheremail,
      "mothername": this.registration_form.value.mothername,
      "mothermobilenumber": this.registration_form.value.mothermobilenumber,
      "motheremail": this.registration_form.value.motheremail,
      "sscboard": this.registration_form.value.sscboard,
      "sschallticketnumber": this.registration_form.value.sschallticketnumber,
      "sscgpa": this.registration_form.value.sscgpa,
      "sscyearofpass": this.registration_form.value.sscyearofpass,
      "interboard": this.registration_form.value.interboard,
      "interhallticketnumber": this.registration_form.value.interhallticketnumber,
      "interpercentage": this.registration_form.value.interpercentage,
      "interyearofpass": this.registration_form.value.interyearofpass,
      "certificates": this.certificates_array,
      "board_id": this.registration_form.value.suc

    }
    //  // // // console.log(obj)

    if (confirm("Are You Sure Do You Want to Submit ?")) {
      this._registrationService.student_reg_create(obj).subscribe((data) => {
        // // // // console.log(data)
        if (data) {
          let encoded_obj = window.btoa(randomString);
          this.router.navigate(['/student/payfee', encoded_obj]);
        }
      })
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