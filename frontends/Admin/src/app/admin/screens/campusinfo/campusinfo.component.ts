import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from 'src/app/core/services/exam.service';

@Component({
  selector: 'app-campusinfo',
  templateUrl: './campusinfo.component.html',
  styleUrls: ['./campusinfo.component.css']
})
export class CampusinfoComponent {
  public logininfo: any = [];
  public exam_info: any = [];
  public institute_list: any = [];
  public campus_list: any = [];
  public examcampus_list: any = [];
  public campus_id = 'all';
  public show_cmp_list = 0;

  constructor(public _examService: ExamService, private router: Router){}
  
  ngOnInit(){
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)
    // // // // // // console.log( this.logininfo)
    this.exam_info = localStorage.getItem('selected_exam');
    this.exam_info = JSON.parse(this.exam_info)
    // // // // // // console.log( this.exam_info)
    this.examcampus_list = this.exam_info.campusmap ? this.exam_info.campusmap : []
  }
  
  go_to_add(){
    if(this.examcampus_list.length > 0){
      this._examService.get_inst_by_ID(this.examcampus_list[0].inst_id).subscribe((data: any) => {
        // // // // // // console.log( data);
        this.institute_list = data
        this.campus_id = data[0].id
        this.campus_get(this.campus_id)
      })
    }
    else{
      this._examService.get_institute().subscribe((data: any) => {
        // // // // // // console.log( data);
        this.institute_list = data
        this.campus_list = [];
        this.campus_id = 'all';
      })
    }
    this.show_cmp_list = 1;
  }
  
  campus_get(cmp_id: any){
    this.campus_list = []
    this._examService.get_campus(cmp_id).subscribe((data: any) => {
      // // // // // // console.log( data);
      if(this.examcampus_list.length > 0){
        for(var i=0; i<data.length; i++){
          var filtered_cmp = this.examcampus_list.filter((e: { id: any; })=> e.id == data[i].id)
          // // // // // // console.log( filtered_cmp)
          if(filtered_cmp.length>0){
            data[i].checked_status = true
          }
        }
        this.campus_list = data
      }else{
        this.campus_list = data
      }
    })
  }
  
  onCampus_submit(){
    if(confirm("Are you sure, Do you want to SUBMIT..?")){
      // // // // // // console.log( this.campus_list)
      // // // // // // console.log( this.exam_info)
      var filtered_campus = this.campus_list.filter((e: { checked_status: any; })=> e.checked_status)
      // // // // // // console.log( filtered_campus)
      var post_obj = {
        "examId": this.exam_info._id,
        "campusmap": filtered_campus
      }
      // // // // // // console.log( post_obj)
      this._examService.add_campus(post_obj).subscribe((data1: any) => {
        // // // // // // console.log( data1);
        this._examService.get_exam_list_byID(this.exam_info.examId).subscribe((data2: any) => {
          // // // // // // console.log( data);
          alert("Campus Added Successfully..!")
          localStorage.setItem('selected_exam', JSON.stringify(data2[0]))
          location.reload();
        })
      })
    }
  }
  
  isSubmitDisabled(): boolean {
    return !this.campus_list.some((campus: { checked_status: any; }) => campus.checked_status);
  }
}
