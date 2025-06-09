import { Component } from '@angular/core';
import { SemisterService } from 'src/app/core/services/semister.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-createsem',
  templateUrl: './createsem.component.html',
  styleUrls: ['./createsem.component.css']
})
export class CreatesemComponent {
  public logininfo : any=[];  
  exam_id: number;
  ShowData: number = 0;
  campus_list: any[] = [];
  SemisterData: any[] = [];
  FaculityName: any[] = [];
  UniqueExamId: any[] = [];
  CreatedSemData: any[] = [];
  SubData: any;
  modelindex: any;
  Final: any[] = [];
  constructor(private semService: SemisterService, private router: Router) { }
  ngOnInit(){

    
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)
    // // // // console.log( this.logininfo)
  }

  SubmitExamId() {
    this.ShowData = 0
    var obj = {
      "exam_id": this.exam_id
    }
    this.semService.Get_ExamId(obj).subscribe(data => {
      this.SemisterData = data.subject
      this.UniqueExamId = Array.from(new Set(this.SemisterData.map(ele => ele.examId))).map(id => { return this.SemisterData.find(ele => ele.examId === id); });

    })
  }
  // onCheckboxChange(event: Event, item: any) {
  //   const input = event.target as HTMLInputElement; 
  //   item.hallticketissue = input.checked ? 1 : 0;
  // }
  isDisabled() {
    return this.UniqueExamId.some(
      item =>
        !item.fromDate?.trim() ||
        !item.todate?.trim() ||
        !item.hstartdate?.trim() ||
        !item.henddate?.trim()
    );
  }




  SubmitData() {
    this.ShowData = 1;
    var obj = {}
    for (var i = 0; i < this.UniqueExamId.length; i++) {
      obj = {
        "examId": this.UniqueExamId[i].examId,
        "examName": this.UniqueExamId[i].examName,
        "examDate": this.UniqueExamId[i].examDate,
        "campus": [this.logininfo.UserCampus[0].campus_shortcode],
        "semister": this.UniqueExamId[i].semister,
        "fromDate": this.UniqueExamId[i].fromDate,
        "endDate": this.UniqueExamId[i].todate,
        "hallticketissue": this.UniqueExamId[i].hallticketissue ? this.UniqueExamId[i].hallticketissue : 0,
        "hallticketstart": this.UniqueExamId[i].hstartdate,
        "hallticketend": this.UniqueExamId[i].henddate
      }
    }
    if (confirm("Are you sure Do you want to submit this data")) {
      this.semService.create_exam(obj).subscribe(data => {
        location.reload();
      })
    } else {
      return
    }
  }
  Goto_Stdlist() {
    this.ShowData = 2

    this.semService.get_sem_list().subscribe(res => {
      this.CreatedSemData = res
    })
  }
  Goto_Create() {
    // alert("Goto Create")
    this.ShowData = 0
  }
}
