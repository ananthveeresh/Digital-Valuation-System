
import { Component, OnInit, Input } from '@angular/core';
import { StudentBarcodeService } from './../../../core/services/studentbarcode.service';
import { PrintService } from 'src/app/core/services/print.service';
import { ActivatedRoute } from '@angular/router';

interface Section {
  id: number;
  section_name: string;
  course_id: number;
  course_name: string;
}

interface Student {
  id: number;
  name: string;
  student_no: string;
  section_name: string;
  barcode_data?: string;
  barcode_info?: string;
}

@Component({
  selector: 'app-barcodehub',
  templateUrl: './barcodehub.component.html',
  styleUrls: ['./barcodehub.component.css']
})
export class BarcodehubComponent implements OnInit {
  @Input() section_id: any;
  @Input() subject_info: any;
  sections: Section[] = [];
  students: Student[] = [];
  showPrintButton: boolean = false;

  constructor(
    private studentBarcodeService: StudentBarcodeService, 
    private printService: PrintService, 
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const exam_id = 24255;  // Example value
    const section_id = this.section_id; // Use the section_id input

    const requestBody = {
      exam_id: exam_id,
      section_id: section_id
    };

    this.studentBarcodeService.getStudents(requestBody).subscribe((data: Student[]) => {
      this.students = data;
      for (let student of this.students) {
        if (this.subject_info.length > 0) {
          student.barcode_data = `${this.subject_info[0].SemName}-${this.subject_info[0].SubjectId.toString()}-${student.student_no}`;
          student.barcode_info = `SEM${this.subject_info[0].SemName}-${this.subject_info[0].ShortCode}-${student.section_name}`;
        }
      }
      this.showPrintButton = true; 
    });
  }

  printDiv(): void {
    this.printService.printDiv('print_div');
  }
}
