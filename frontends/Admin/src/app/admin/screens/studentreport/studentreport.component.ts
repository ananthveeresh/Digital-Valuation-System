import { Component } from '@angular/core';
import { ExamResultService } from 'src/app/core/services/examresult.service';

@Component({
  selector: 'app-studentreport',
  templateUrl: './studentreport.component.html',
  styleUrls: ['./studentreport.component.css']
})
export class StudentreportComponent {
  ExamName:any[] = [];
  examId:string = '';
  CampusId:string = ''
  exam_info:any[] = [];
  UniqueDataExamId:any[] = [];
  ResultData:any[] = [];
  marksJson:any[] = [];
  subjectmarks:number
  constructor(private _ExamResultService:ExamResultService){}

  ngOnInit() {
   
    this._ExamResultService.get_examlist().subscribe(data =>{
      this.ExamName = data;
      this.UniqueDataExamId = Array.from(new Set (this.ExamName.map(ele => ele.examId))).map(id =>{return this.ExamName.find(ele => ele.examId === id);});
    
     
    });
  }
  CheckDisablitiy(){
    if(this.examId == '' || this.CampusId == ''){
      return true;
    }
    return false;
  }

  GetResult(){
     var obj = {
      "examid": this.examId,
      "campusid": this.CampusId
    }
    // // // // // console.log( obj);
  }

}
