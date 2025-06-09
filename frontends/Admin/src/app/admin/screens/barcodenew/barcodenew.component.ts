
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { StudentBarcodeService } from './../../../core/services/studentbarcode.service';
import { PrintService } from 'src/app/core/services/print.service';
import { ActivatedRoute } from '@angular/router';
import * as JsBarcode from 'jsbarcode';

interface Section {
  id: number;
  section_name: string;
  course_id: number;
  course_name: string;
}

interface Student {
  id: number;
  roll_no: number;
  campus_name: string;
  name: string;
  student_no: string;
  section_name: string;
  barcode_data?: string;
  barcode_info?: string;
  board_id?: string;
}

@Component({
  selector: 'app-barcodenew',
  templateUrl: './barcodenew.component.html',
  styleUrls: ['./barcodenew.component.css']
})
export class BarcodenewComponent implements OnInit, AfterViewInit {
  @Input() section_id: any;
  @Input() typeofbarcode: any;
  @Input() campus_id: any;
  @Input() course_id: any;
  sections: Section[] = [];
  students: Student[] = [];
  showPrintButton: boolean = false;
  show_error: string | null = null; // Initialize as null

  constructor(
    private studentBarcodeService: StudentBarcodeService,
    private printService: PrintService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.show_error = null; // Reset error message
    if (this.typeofbarcode == 'SUC') {
      const postobj = {
        year: 21,
        section: this.section_id
      };
      this.studentBarcodeService.getStudents(postobj).subscribe(
        (data: any) => {
          if (data.length > 0) {
            this.show_error = null; // Clear error
            this.students = data as Student[];
            for (let student of this.students) {
              student.barcode_data = `${student.student_no}`;
              student.barcode_info = `${student.campus_name} / ${student.section_name} / ${student.roll_no}`;
            }
            this.showPrintButton = true;
            this.generateBarcodes();
          } else {
            this.show_error = "No Data Found";
          }
        },
        (error) => {
          this.show_error = "Error fetching data";
        }
      );
    } else {
      const postobj = {
        year_id: 21,
        course_id: parseInt(this.course_id),
        campus_id: parseInt(this.campus_id)
      };
      this.studentBarcodeService.get_course_barcode(postobj).subscribe(
        (data: any) => {
          if (data.length > 0) {
            this.show_error = null; // Clear error
            this.students = data as Student[];
            for (let student of this.students) {
              student.barcode_data = `${student.board_id}`;
              student.barcode_info = `${student.campus_name} / ${student.student_no}`;
            }
            this.showPrintButton = true;
            this.generateBarcodes();
          } else {
            this.show_error = "No Data Found";
          }
        },
        (error) => {
          this.show_error = "Error fetching data";
        }
      );
    }
  }

  ngAfterViewInit(): void {
    this.generateBarcodes();
  }

  generateBarcodes(): void {
    setTimeout(() => {
      for (let student of this.students) {
        if (student.barcode_data) {
          let barcodeElement = document.getElementById(`barcode-${student.student_no}`);
          if (barcodeElement) {
            JsBarcode(barcodeElement, student.barcode_data, {
              format: "CODE128",
              fontSize: 30,
              height: 50,
              textAlign: "center",
              displayValue: true,
            });
          }
        }
      }
    }, 500);
  }

  printDiv(): void {
    this.printService.printDiv('print_div');
  }
}
