import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ExamService } from 'src/app/core/services/exam.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-examcreate',
  templateUrl: './examcreate.component.html',
  styleUrls: ['./examcreate.component.css']
})

export class ExamcreateComponent {
  public logininfo: any = [];
  public todayDate: string;
  public exam_create_form: FormGroup
constructor(private fb: FormBuilder, public _examService: ExamService, private router: Router) {
    this.exam_create_form = this.fb.group({
      exam_name: ['', [Validators.required]],
      exam_date: ['', [Validators.required]],
      exam_description: ['', [Validators.required]]
    })
  }

  ngOnInit() {
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)
    this.todayDate = new Date().toISOString().split('T')[0];
  }

  get_examlist() {
    this.router.navigate(['/examlist'])
  }

  onSubmit() {
    if(confirm("Are you sure, Do you want to SUBMIT..?")){
      var obj = {
        "examName": this.exam_create_form.value.exam_name,
        "examDescription": this.exam_create_form.value.exam_description,
        "examDate": this.exam_create_form.value.exam_date
      }
      this._examService.create_exam(obj).subscribe((data: any) => {
        alert("Data Submitted Successfully..!")
        location.reload();
      })
    }
  }
}
