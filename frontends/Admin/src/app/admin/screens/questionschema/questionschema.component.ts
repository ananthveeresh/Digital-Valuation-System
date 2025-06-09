import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { QuestionschemaService } from 'src/app/core/services/questionschema.service';

@Component({
  selector: 'app-questionschema',
  templateUrl: './questionschema.component.html',
  styleUrls: ['./questionschema.component.css']
})
export class QuestionschemaComponent {

  public logininfo: any = [];
  public total_questions: any = [];
  public qschema_list: any = [];
  public ques_paper_name: any;
  public selected_qschema: any;
  public total_quesmarks = 0;
  public show_list = 0;

  public qschema_form: FormGroup;

  constructor(private fb: FormBuilder,private _questionschemaService: QuestionschemaService) {
    this.qschema_form = this.fb.group({
      question_schema: this.fb.array([])
    });
  }

  ngOnInit() {
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)
    // // // // // // console.log( this.logininfo)
    this.add_question_schema()
  }

  get_list(){
    this._questionschemaService.get_qschema().subscribe((data: any) => {
      // // // // // // console.log( data);
      this.qschema_list = data;
      this.show_list = 1;
    })
  }

  new_qschema(): FormGroup {
    return this.fb.group({
      max_questions: ['', [Validators.required]],
      comp_questions: ['', [Validators.required]],
      marks_per_questions: ['', [Validators.required]],
      total_marks: ['', [Validators.required]],
    });
  }

  question_schema_fun(): FormArray {
    return this.qschema_form.get('question_schema') as FormArray;
  }

  add_question_schema() {
    this.question_schema_fun().push(this.new_qschema());
  }

  delete_question_schema(idx: number) {
    this.question_schema_fun().removeAt(idx);
  }

  getTotalMarks(ind: any) {
    // // // // // // console.log( this.qschema_form.value.question_schema[ind])
    const questionSchemaControl: any = this.qschema_form.get(`question_schema.${ind}`) as FormGroup;
    const compQues = questionSchemaControl.get('comp_questions').value;
    const marksPerQues = questionSchemaControl.get('marks_per_questions').value;

    if (compQues !== '' && marksPerQues !== '') {
      const totalMarks = (compQues * 1) * (marksPerQues * 1);
      questionSchemaControl.patchValue({
        total_marks: totalMarks
      });
    }
    else {
      questionSchemaControl.patchValue({
        total_marks: ''
      });
    }
  }

  onSubmit() {
    this.total_questions = [];
    var filtered_questions = this.qschema_form.value.question_schema;
    var new_ques_array: any = []
    this.total_quesmarks = this.getSumElements(this.qschema_form.value.question_schema, 'total_marks')

    for (var i = 0; i < filtered_questions.length; i++) {
      for (var j = 0; j < parseInt(filtered_questions[i].max_questions); j++) {
        var obj = {
          "max_ques": parseInt(filtered_questions[i].max_questions),
          "comp_ques": parseInt(filtered_questions[i].comp_questions),
          "marks_per_ques": parseInt(filtered_questions[i].marks_per_questions),
          "total_marks": parseInt(filtered_questions[i].total_marks),
          "section": '',
          "ques_no": '',
          "ques_group_id": "group" + (i + 1),
          "ques_group_name": i,
        }
        filtered_questions[i].ques_group_id = "group" + (i + 1)
        new_ques_array.push(obj);
      }
    }

    // // // // // // console.log( new_ques_array)
    this.total_questions = new_ques_array
  }

  on_Ques_schema_add() {
    // // // // // // console.log( this.total_questions)
    if (confirm("Are you sure, Do you want to SUBMIT..?")) {
      var obj = {
        "questionSchema": this.qschema_form.value.question_schema,
        "questionDescription": this.total_questions,
        "modelName": this.ques_paper_name,
        "totalMarks": this.total_quesmarks
      }
      // // // // // // console.log( obj)

      this._questionschemaService.create_qschema(obj).subscribe((data: any) => {
        // // // // // // console.log( data);
        alert("Data Submitted Successfully..!")
        location.reload();
        // this.show_list = 1;
      })
    }
  }

  view_details(dt: any){
    // // // // // // console.log( dt)
    this.selected_qschema = dt;
  }

  onDelete(dt: any){
    // // // // // // console.log( dt)
    if(confirm("Are you Sure, Do you want to DELETE..?")){
      this._questionschemaService.delete_qschema(dt._id).subscribe((data: any) => {
        // // // // // console.log( data);
        alert("Data Deleted Successfully..!");
        location.reload();
      });
    }
  }

  check_section_name(dt: any, dt_section: any){
    // // // // // // console.log( dt_section)
    // // // // // // console.log( dt)
    for(var i=0; i<this.total_questions.length; i++){
      if(dt.ques_group_id == this.total_questions[i].ques_group_id){
        this.total_questions[i].section = dt_section
      }
    }
  }

  getSumElements(arr: any[], field: string): number {
    return arr.reduce((sum, item) => {
      const value = parseFloat(item[field]);
      return sum + (isNaN(value) ? 0 : value);
    }, 0);
  }
}

function unique(sbjnm: any, arg1: string): any {
  const uniqueValues = [...new Set(sbjnm.map((item: { [x: string]: any; }) => item[arg1]))];
  return uniqueValues;
}
