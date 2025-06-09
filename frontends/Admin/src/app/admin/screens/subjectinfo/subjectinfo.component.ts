import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from 'src/app/core/services/exam.service';
import { SubjectService } from 'src/app/core/services/subject.service'; 
import { QuestionschemaService } from 'src/app/core/services/questionschema.service';

@Component({
  selector: 'app-subjectinfo',
  templateUrl: './subjectinfo.component.html',
  styleUrls: ['./subjectinfo.component.css']
})
export class SubjectinfoComponent {
  public logininfo: any = [];
  public exam_info: any = [];
  public subjectmaster_list: any = [];
  public semester_list: any = [];
  public final_subject_list: any = [];
  public model_paper_list: any = [];
  public examsubject_list: any = [];
  public show_sub_list = 0;

  constructor(public _examService: ExamService, public _subjectService: SubjectService, private router: Router, private _questionschemaService: QuestionschemaService){}
  
  ngOnInit(){
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)
    // // // // // // console.log( this.logininfo)
    this.exam_info = localStorage.getItem('selected_exam');
    this.exam_info = JSON.parse(this.exam_info)
    // // // // // console.log( this.exam_info)
    this.examsubject_list = this.exam_info.subjectmap ? this.exam_info.subjectmap : []
    this._subjectService.get_subjectmasterlist().subscribe((data: any) => {
      // // // // // // console.log( data);
      this.subjectmaster_list = data;
    })
    
    this._questionschemaService.get_qschema().subscribe((data: any) => {
      // // // // // // console.log( data);
      this.model_paper_list = data;
    })
  }
  
  go_to_add(){
    if(this.examsubject_list.length > 0){
      var unique_sem = unique_value(this.examsubject_list, 'SemId');
      // // // // // // console.log( unique_sem)
      this.semester_list = unique_sem;
      // // // // // // console.log( this.semester_list);
      this.get_subjects();
      this.show_sub_list = 1;
    }else{  
      
      if(this.subjectmaster_list.length > 0){
        this.semester_list = uniqueSem(this.subjectmaster_list, 'SemName')
      }
      this.final_subject_list = [];
      this.show_sub_list = 1;
    }
  }

  get_subjects(){
    // // // // // // console.log( this.semester_list)
    var filtered_semes = this.semester_list.filter((e: { subject_checked_status: boolean; })=> e.subject_checked_status == true )
    // // // // // // console.log( filtered_semes)
    this.final_subject_list = [];
    var total_filtered_subjectmaster: any = []
    for(var i=0; i<filtered_semes.length; i++){
      var filtered_subjectmaster = this.subjectmaster_list.filter((e: { SemName: any; })=> e.SemName == filtered_semes[i].semester)
      // // // // // // console.log( filtered_subjectmaster)

      if(this.examsubject_list.length > 0){
        for(var k=0; k<filtered_subjectmaster.length; k++){
          var filtered_exam_sub = this.examsubject_list.filter((e: { SubjectId: any; })=> e.SubjectId == filtered_subjectmaster[k].SubjectId)
          // // // // // // console.log( filtered_exam_sub)
          if(filtered_exam_sub.length>0){
            filtered_subjectmaster[k].modelpaper_id = filtered_exam_sub[0].ModelId.toString()
          }
          else{
            filtered_subjectmaster[k].modelpaper_id = ''
          }
        }
      }
      else{
        for(var k=0; k<filtered_subjectmaster.length; k++){
          filtered_subjectmaster[k].modelpaper_id = ''
        }
      }

      let subjec_unique = unique(filtered_subjectmaster , 'SubjectName')
      total_filtered_subjectmaster.push({ "sem" : subjec_unique });
    }
    // // // // // // console.log( total_filtered_subjectmaster)
    this.final_subject_list = total_filtered_subjectmaster
  }
  
  onSubject_submit(){
    if(confirm("Are you sure, Do you want to SUBMIT..?")){
      // // // // // // console.log( this.final_subject_list)
      var filtered_subject = []
      for(var i=0; i<this.final_subject_list.length; i++){
        for(var j=0; j<this.final_subject_list[i].sem.length; j++){
          if(this.final_subject_list[i].sem[j].modelpaper_id && this.final_subject_list[i].sem[j].modelpaper_id!=''){
            var sub_obj = {
                "SemId" : i+1,
                "Subject" : this.final_subject_list[i].sem[j].SubjectName,
                "SubjectId": this.final_subject_list[i].sem[j].SubjectId,
                "GroupName": this.final_subject_list[i].sem[j].GroupName,
                "ShortCode": this.final_subject_list[i].sem[j].ShortCode,
                "UniversityName": this.final_subject_list[i].sem[j].UniversityName,
                "ModelId": this.final_subject_list[i].sem[j].modelpaper_id *1 ,
                "ModelName": this.model_paper_list.filter((e: { modelId: any; })=> e.modelId == this.final_subject_list[i].sem[j].modelpaper_id)[0].modelName
            }
            filtered_subject.push(sub_obj)
          }
        }
      }
      // // // // // // console.log( filtered_subject)
      var post_obj = {
        "examId": this.exam_info._id,
        "subjectmap": filtered_subject
      }
      // // // // // // console.log( post_obj)
      this._examService.add_subject(post_obj).subscribe((data1: any) => {
        // // // // // // console.log( data1);
        this._examService.get_exam_list_byID(this.exam_info.examId).subscribe((data2: any) => {
          // // // // // // console.log( data);
          alert("Subject Added Successfully..!");
          localStorage.setItem('selected_exam', JSON.stringify(data2[0]))
          location.reload();
        })
      })
    }
  }
  
  isAnySemesterChecked(): boolean {
    return this.semester_list.some((semester: { subject_checked_status: any; }) => semester.subject_checked_status);
  }

}

function unique_value(sbjnm: any, arg1: string): any {
  const uniqueValues = [...new Set(sbjnm.map((item: { [x: string]: any; }) => item[arg1 ]))];
  return uniqueValues.map(value => ({ semester: value, subject_checked_status: true }));
}

function uniqueSem(sbjnm: any, arg1: string): any {
  const uniqueValues = [...new Set(sbjnm.map((item: { [x: string]: any; }) => item[arg1]))];
  return uniqueValues.map(value => ({ semester: value, subject_checked_status: false }));
}

function unique(sbjnm: any[], arg1: string): any[] {
  const uniqueMap = new Map();

  sbjnm.forEach(item => {
    const key = item[arg1];
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, {
        SubjectName: item.SubjectName,
        SubjectId: item.SubjectId,
        UniversityName: item.UniversityName,
        GroupName: item.GroupName,
        SemName: item.SemName,
        ShortCode: item.ShortCode,
        modelpaper_id: item.modelpaper_id
      });
    }
  });

  return Array.from(uniqueMap.values());
}