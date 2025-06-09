import { Component } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { SemisterService } from "src/app/core/services/semister.service";

@Component({
  selector: "app-editstddetails",
  templateUrl: "./editstddetails.component.html",
  styleUrls: ["./editstddetails.component.css"],
})
export class EditstddetailsComponent {
  selectedStdInfo: any;
  updatedFiles: any[] = [];
  editingIndex: number | null = null;
  MongoId: any;
  selectedDocType: any;
  public fileModels: { [key: string]: File } = {};
  public pterr: string = "";
  public certificates_array: any = [];
  public selected_course_info: any = [];
  constructor(
    private router: Router,
    private sanitizer: DomSanitizer,
    private SemService: SemisterService
  ) {}
  ngOnInit(): void {
    this.selectedStdInfo = history.state.selectedStdInfo;
    // // // // console.log( this.selectedStdInfo);
    this.certificates_array = this.selectedStdInfo.certificates;
    
  }
  back() {
    this.router.navigate(["/regStud"]);
  }
  pdf_url_sanitize(url: any) {
    let newUrl = "";
    if (typeof url === "object" && url?.changingThisBreaksApplicationSecurity) {
      newUrl = url.changingThisBreaksApplicationSecurity;
    } else if (typeof url === "string") {
      newUrl = url;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      newUrl || "about:blank"
    );
  }

  editCertificate(index: number, selecteddoc: any) {
    this.selectedDocType = selecteddoc;
    this.editingIndex = index;
  }

  cancelEdit() {
    this.editingIndex = null;
  }

  onFileUpload(event: Event, index: any, docType: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const validExtensions: any = {
        "Passport Photo": ["image/jpeg", "image/png"],
        "Student Signature": ["image/jpeg", "image/png"],
        "SSC Certificate": ["application/pdf"],
        "Intermediate Certificate": ["application/pdf"],
        "Student Aadhar": ["application/pdf"],
        OAMDC: ["application/pdf"],
        "Caste Certificate": ["application/pdf"],
      };

      // Check if the file type is valid for the specific document type
      if (validExtensions[docType]?.includes(file.type)) {
        this.fileModels[docType] = file; // Save the file if valid
        this.pterr = ""; // Clear error message
      } else {
        // Invalid file type: Show an alert and reset the input
        alert(`Invalid file type for ${docType}. Please upload a valid file.`);
        input.value = ""; // Reset the input field
      }
    }
  }

  saveCertificate(index: number, docType: any) {
    // // // // console.log( docType);
    const photofile = this.fileModels[docType];
    const filevault = "https://apis.aditya.ac.in/filevault/";
    const sptoken = "9cf742e6-4d25-4b73-acfe-648911a804e8";
    const uploadUrl = filevault + "upload?api_key=" + sptoken;
    const photoUploadPath = "/analysis/studentcertificates";

    if (!photofile) {
      this.pterr = "Please upload a valid file";
    } else {
      this.pterr = "";
      this.SemService.uploadFileToUrl(
        photofile,
        uploadUrl,
        photoUploadPath
      ).subscribe({
        next: async (response) => {
          // // // // // // console.log( response);
          response.docType = docType;
          var filekey = btoa(sptoken + response._id);
          response.fileurl =
            filevault + "download/" + response._id + "?key=" + filekey;
          //   // // // // // console.log( this.fileModels)
          // // // // // // console.log( this.files)
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

          // this.uploadedFilesStatus[docType] = true;
          // // // // // // console.log( this.certificates_array)
        },
        error: (error) => {
          console.error(error);
          this.pterr = "An error has occurred";
        },
      });
    }
  }

  SubmitEditedData(Id: any) {
    // // // // // console.log( this.certificates_array);
    this.selectedStdInfo.certificates = this.certificates_array;
    this.MongoId = Id;
    // // // // console.log( this.MongoId);
    // // // // console.log( this.selectedStdInfo);
    this.SemService.Update_Std_Details( this.MongoId, this.selectedStdInfo).subscribe((data) => {
      // // // // console.log( data);
      this.router.navigate(["/regStud"]);
      alert("Student Details updated successfully");
    });
  }
}
