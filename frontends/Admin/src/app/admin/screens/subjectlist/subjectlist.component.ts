import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExamService } from 'src/app/core/services/exam.service';
import { CreateFacultyService } from 'src/app/core/services/createfac.service';

@Component({
  selector: 'app-subjectlist',
  templateUrl: './subjectlist.component.html',
  styleUrls: ['./subjectlist.component.css']
})

export class SubjectlistComponent {

  constructor(public ExamService: ExamService,public _CreateFacultyService: CreateFacultyService, private router: Router) { }

  public logininfo: any = [];
  public exam_info: any[] = [];
  public staffdetails: any[] = [];
  ShowFacUpdate: number = 0;
  UpdateCheckBox: any[] = [];
  UniqueDataExamId: any[] = [];
  examName: string;
  GetExamInfoById: any[] = [];
  ExamID: any;
  papercode: any;
  selectedsubject: any;
  selectedcampus: any;
  Campus: any[] = [];
  FilteredCamp: any[] = [];
  editFacDetails: any[] = [];


  ngOnInit() {

    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)
    // console.log( this.logininfo)

    this.ExamService.get_exammasterlist().subscribe((res: any) => {
      this.exam_info = res;

      this.UniqueDataExamId = Array.from(new Set(this.exam_info.map(ele => ele.examId))).map(id => { return this.exam_info.find(ele => ele.examId === id); });
      // // // // console.log( this.UniqueDataExamId)
    });


  }
  CreateExam() {
    this.router.navigate(['/create'])
  }
  GetExamData(examInfo: any) {
    this.editFacDetails = [];
    this.ShowFacUpdate = 0;
    this.GetExamInfoById = this.exam_info.filter(e => e.examId == examInfo);
    var obj = {
      "exam_id": examInfo
    }
    this.ExamService.Get_ExamId(obj).subscribe(data => {
      // console.log( data.campus)
      this.Campus = [];
      for (var i = 0; i < data.campus.length; i++) {
        var temp = this.logininfo.UserCampus.filter((e: { campus_id: any; }) => e.campus_id == data.campus[i].campus_id)
        if (temp.length) {
          this.Campus.push(temp[0])
        }
      }
      // console.log( this.Campus)
      // // // console.log(this.GetExamInfoById)
      this.FilteredCamp = this.GetExamInfoById.filter(e => e.campus == this.Campus[0].campus_name);
      // console.log(this.FilteredCamp)
    })
  }

  selectBranch(campusName: string) {
    this.ShowFacUpdate = 0;
    this.FilteredCamp = this.GetExamInfoById.filter(e => e.campus == campusName);
  }
  
  Submit_ExamName() {
    this.ShowFacUpdate = 1;

  }
  EditFac(x: any) {
    this.ShowFacUpdate = 3;
    this.editFacDetails = [x]
    // // console.log(x)
  }
  ViewFac(data: any) {
    this.staffdetails = data;
    // // // // // console.log( this.staffdetails)
  }
  UpdatePapercode() {
    // // // // console.log( this.editFacDetails[0]._id)
    var currentId = this.editFacDetails[0]._id
    var obj = {}
    for (var i = 0; i < this.editFacDetails.length; i++) {
      obj = {
        "campus": this.editFacDetails[i].campus,
        "examId": this.editFacDetails[i].examId,
        "examName": this.editFacDetails[i].examName,
        "papercode": this.editFacDetails[i].papercode,
        "semister": this.editFacDetails[i].semister,
        "subjectId": this.editFacDetails[i].subjectId,
        "subjectName": this.editFacDetails[i].subjectName,
        "subjectcode": this.editFacDetails[i].subjectcode,
      }
    }
    // // console.log( obj)
    // // // // console.log( currentId)
    // if (confirm("Are you sure, Do you want to Update..?")) {
      this.ExamService.UpdatePaperCode(currentId, obj).subscribe(data => {
        // location.reload();
        this.ShowFacUpdate = 0;
      })
    // }
  }
  UpdateFac(satffInfo: any, examId: any, papercode: any, subjectname: any, campusname: any) {
    this.ShowFacUpdate = 2;
    this.ExamID = examId;
    this.papercode = papercode;
    this.selectedsubject = subjectname;
    this.selectedcampus = campusname;
    var obj = {
      "campus": campusname.trim().replace(/\s+/g, '')
    }
    // var obj = {
    //   "campus": campusname.trim().replace(/\s+/g, ''),
    //   "emptype" :"Valuer"
    // }
    // // // // console.log( obj)
    // this._CreateFacultyService.get_CreatedFacultyList(obj).subscribe(data => {
    this.ExamService.faculitylist(obj).subscribe(data => {
      let Finalarray = [...satffInfo];

      // // console.log(data)
      for (let i = 0; i < data.length; i++) {
        // // console.log( data[i])
        let existingStaff = Finalarray.find((staff: { paycode: any }) => staff.paycode === data[i].paycode);
        if (!existingStaff) {
          let newStaff = {
            "branch": data[i].branch,
            "paycode": data[i].paycode,
            "facultyName": data[i].facultyName,
            "subject": data[i].subject,
            "mobile": data[i].mobile,
            "email": data[i].email,
            "checked_status": false
          };
          Finalarray.push(newStaff);
        }
      }
      // // console.log(Finalarray)
      Finalarray = Finalarray.reduce((acc: any[], current: any) => {
        const existing = acc.find(item => item.paycode === current.paycode);
        if (!existing) {
          acc.push(current);
        } else if (current.checked_status === true) {
          acc = acc.map(item => item.paycode === current.paycode ? current : item);
        }
        return acc;
      }, []);
      // // console.log(this.UpdateCheckBox)
      this.UpdateCheckBox = Finalarray;
    });
  }
  Changing_Alccated_Status(x: any, checked_status: boolean) {
    if (x && x.hasOwnProperty('checked_status')) {
      if (checked_status === false) {
        x.checked_status = true;
      }
      else if (checked_status === true) {
        x.checked_status = false;
      }

    }
  }
  SubmitUpdatedAlocation() {
    var obj: { examid: any; papercode: any; staffdetails: any[]; subjectname: any; campus: any } = {
      examid: this.ExamID,
      campus: this.selectedcampus,
      papercode: this.papercode,
      subjectname: this.selectedsubject,
      staffdetails: []
    };
    for (let i = 0; i < this.UpdateCheckBox.length; i++) {
      if (this.UpdateCheckBox[i].checked_status === true) {
        var staffdata = {
          paycode: this.UpdateCheckBox[i].paycode,
          subject: this.UpdateCheckBox[i].subject,
          facultyName: this.UpdateCheckBox[i].facultyName,
          branch: this.UpdateCheckBox[i].branch,
          mobile: this.UpdateCheckBox[i].mobile,
          email: this.UpdateCheckBox[i].email,
          checked_status: this.UpdateCheckBox[i].checked_status
        };

        obj.staffdetails.push(staffdata);
      }

    }
    // return false;
    // console.log(obj)
    if(confirm("Are you sure, Do you want to submit..?")){
      this.ExamService.UpdateFaculty(obj).subscribe(res => {
        alert('Faculty Allocation Updated Successfully');
        location.reload();
      },
        err => {
          console.error('Error updating faculty allocation', err);
        }
      );
    }

  }
  BackToList() {
    this.ShowFacUpdate = 0;
  }
}

