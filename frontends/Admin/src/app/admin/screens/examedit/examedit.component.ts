import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; 

@Component({
  selector: 'app-examedit',
  templateUrl: './examedit.component.html',
  styleUrls: ['./examedit.component.css']
})
export class ExameditComponent {

  public logininfo: any = [];
  public exam_info: any = [];

  constructor(private router: Router) {}
  
  ngOnInit(){
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)
    // // // // // // console.log( this.logininfo)
    this.exam_info = localStorage.getItem('selected_exam');
    this.exam_info = JSON.parse(this.exam_info)
    // // // // // // console.log( this.exam_info)

  }
  
  get_campus_info(){
    // location.reload()
  }

  get_subject_info(){
    // location.reload()
  }
  
  get_upload_info(){
    // location.reload()
  }

  go_to_back(){
    this.router.navigate(['/examlist'])
  }
}
