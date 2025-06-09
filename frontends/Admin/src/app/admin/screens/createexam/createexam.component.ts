import { Component } from '@angular/core';
import { ExamService } from 'src/app/core/services/exam.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-createexam',
  templateUrl: './createexam.component.html',
  styleUrls: ['./createexam.component.css']
})
export class CreateexamComponent {
  public logininfo : any=[];  
  exam_id:number;
  ShowData:number = 0;
  SubjectData:any[] = [];
  FaculityName:any[] = [];
  SubData: any;
  modelindex:any;
  Final:any[] = [];
  campus_data:any[] = [];
  GetList:any[] = [];
  Branchname:string
  selected_sub: boolean[] = []; 
  selectedCampuses: any[] = [];
  Campus:any[] = [];
  selectedBranch:string = '';
  modelSelectSubData:any = [];
  FinalData:any[] = [];
  check_Proceed:boolean = false;
    constructor(private examService:ExamService,private router: Router){  }

  ngOnInit(){
    
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)
    // // // // console.log( this.logininfo)
  }

  SubmitExam(){
    this.ShowData = 1
    var obj = {
      "exam_id":this.exam_id
  }
  this.examService.Get_ExamId(obj).subscribe(data => {
    this.SubjectData = data.subject
    // for(var i=0; i<this.logininfo.UserCampus.length; i++){
    //   var temp = data.campus.filter(e=> e.campus_id == this.logininfo.UserCampus[i].campus_id)
    // }
    this.Campus = data.campus
    this.selected_sub = this.Campus.map(() => true);

    // // // // console.log( this.Campus)

  })
  
  }
  
  
  GetSub(){
    this.check_Proceed = true;
  this.selectedCampuses = this.Campus.filter((_, index) => this.selected_sub[index])
 

  }
  
  ViewModal(SubData:any, Indx:number){
    this.modelSelectSubData = SubData;
   this.modelindex  = Indx
  }

  getFaculity(){
    var obj=  {
      "campus":this.selectedBranch.trim().replace(/\s+/g, ''),
      "subject": this.modelSelectSubData.subjectName
  }
  // // // // console.log( obj)
  this.examService.faculitylist(obj).subscribe(data => {  
   
    this.FaculityName = data
    this.FaculityName.sort((a, b) => a.subject[0].localeCompare(b.subject[0]));
    // // // // console.log( this.FaculityName)
  });

  }
  insrFac(subData: any, Index: any) {
    if (!this.SubjectData[this.modelindex].staffdetails) {
      this.SubjectData[this.modelindex].staffdetails = [];
    }
    const isDuplicate = this.SubjectData[this.modelindex].staffdetails.some(
      (item: any) => item._id === subData._id
    );
    if (!isDuplicate) {
      this.SubjectData[this.modelindex].staffdetails.push(subData);
    }
  }
  
  insertCampus(modalix:any){
    // // // // console.log( modalix)
    // this.SubjectData[modalix].campus = this.selectedCampuses
    // // // // console.log( this.selectedCampuses)
  }
  SubmitData(){
    
    this.FinalData = [];
    for(var i = 0; i < this.SubjectData.length; i++){
      for(var j = 0; j < this.Campus.length; j++){
        var obj = {
          examDate:this.SubjectData[i].examDate,
          examId: this.SubjectData[i].examId,
          examName: this.SubjectData[i].examName,
          semister: this.SubjectData[i].semister,
          subjectId: this.SubjectData[i].subjectId,
          subjectName: this.SubjectData[i].subjectName,
          papercode: this.SubjectData[i].papercode,
          subjectcode: this.SubjectData[i].subjectcode,
          campus: this.Campus[j].campus_name,
          staffdetails: this.SubjectData[i].staffdetails || []
  
        }
        this.FinalData.push(obj)
      }
     
    }
    // // // // console.log( this.FinalData)

    this.examService.MapFaculty(this.FinalData).subscribe(res =>{

    for(let i=0; i<this.FinalData.length; i++) {
     
        var kafkaobj ={
          "data":{
            "examid": this.FinalData[i].examId,
            "branch": this.FinalData[i].campus.trim().replace(/\s+/g, ''),
            "papercode": this.FinalData[i].subjectcode,
            "subjectname":this.FinalData[i].subjectName
          }
  }
  // // // // console.log( kafkaobj)
  this.examService.PostKafka(kafkaobj).subscribe(res =>{
            });
 
      }
      alert("Data Submitted Successfully..!")
          location.reload();
   
    
  
})
}
Goto_sublist(){
this.router.navigate(['/subjectlist'])
}
}
