

import { Component, OnInit } from '@angular/core';
import { StudentBarcodeService } from './../../../core/services/studentbarcode.service';
import { SubjectService } from 'src/app/core/services/subject.service';
import { PrintService } from 'src/app/core/services/print.service';
import { Router } from '@angular/router';



interface Student {
  id: number;
  name: string;
  student_no: string;
  section_name: string;
}

@Component({
  selector: 'app-studentbarcode',
  templateUrl: './studentbarcode.component.html',
  styleUrls: ['./studentbarcode.component.css']
})
export class StudentBarcodeComponent implements OnInit {
  public logininfo: any = [];
  public sections: any = [];
  public students: Student[] = [];
  public subject_list: any = [];
  public subject_id: any = null;
  public showPrintButton: boolean = false;
  public selected_section_id: number | null = null;
  public show_barcode = 0;
  public showErrorMessage: boolean = false;
  public campus_name: any = [];
  public inst_names: any = [];
  public master_campus_name: any
  public selected_campus_id: number | null = null;
  public campussectionlist: any = [];

  public barcode_type: String | null = null;
  public show_select = 0;
  public course_data: any = [];
  public selected_course: String | null = null;

  constructor(private studentBarcodeService: StudentBarcodeService, public _subjectService: SubjectService, private printService: PrintService, private router: Router) { }

  ngOnInit(): void {
    
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)
    // // // // console.log( this.logininfo)
    this.show_barcode = 0;
    this.campus_name = this.logininfo.UserCampus
    // // // // console.log( this.campus_name)
  }


  get_section_info() {
    this.selected_course = "";
    this.show_barcode = 0;
  }

  get_course_info() {
    this.show_barcode = 0;
  }

  getCampusinfo() {
    this.show_barcode = 0;
    this.campussectionlist = [];
    this.course_data = [];
    this.show_select = 0;
    this.barcode_type = null;
    this.studentBarcodeService.getSections(21, this.selected_campus_id).subscribe((data: any) => {
      //// // // // // console.log(  data);
      // this.campussectionlist = data;
      this.campussectionlist = data.sort((a: { course_order: number; }, b: { course_order: number; }) => a.course_order - b.course_order);

    });

    this.studentBarcodeService.get_courses(this.selected_campus_id).subscribe((data) => {
      // // // // // console.log(  data);
      // this.course_data = data
      this.course_data = data.sort((a: { course_order: number; }, b: { course_order: number; }) => a.course_order - b.course_order);
      //// // // // // console.log( this.campus_name)
    })
  }

  onSubmit(): void {   
    this.show_barcode = 0;
    if(this.barcode_type == 'SUC'){
      if (!this.selected_section_id) {
        this.showErrorMessage = true;
        this.show_barcode = 0;
        return;
      }
      this.showErrorMessage = false;
      this.show_barcode = 1;
    }else{
      if (!this.selected_course) {
        this.showErrorMessage = true;
        this.show_barcode = 0;
        return;
      }
      this.showErrorMessage = false;
      this.show_barcode = 1;
    }
  }

  getBarcodeType(){
    this.show_barcode = 0;
    // // // // // console.log( this.barcode_type)
    if(this.barcode_type == 'SUC'){
      this.show_select = 1;
      this.selected_section_id = null;
      this.selected_course = null;
    }else if(this.barcode_type == 'Hall Ticket'){
      this.selected_section_id = null;
      this.selected_course = null;
      this.show_select = 2;
    }else{
      this.show_select = 0;
    }
  }

  printDiv(): void {
    this.printService.printDiv('print_div');
  }
}
