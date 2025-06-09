import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from 'src/app/core/services/exam.service';

@Component({
  selector: 'app-examlist',
  templateUrl: './examlist.component.html',
  styleUrls: ['./examlist.component.css']
})
export class ExamlistComponent {

  public logininfo: any = [];
  public exam_list: any = [];
  public show_exam_create = 0;

  constructor( private router: Router, public _examService: ExamService) {}
  
  ngOnInit() {
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)
    
    this._examService.get_examlist().subscribe((data: any) => {
      this.exam_list = data;
    })
  }

  get_examcreate(){
    this.show_exam_create = 1;
    this.router.navigate(['/examcreate'])
  }
  
  goto_edit(dt: any){
    localStorage.setItem('selected_exam', JSON.stringify(dt))
    this.router.navigate(['/examedit']);
  }
}
