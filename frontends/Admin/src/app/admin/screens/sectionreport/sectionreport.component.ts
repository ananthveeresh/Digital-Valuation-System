import { Component } from '@angular/core';
import { SectionReportService } from 'src/app/core/services/sectionreport.service';
import { ExamResultService } from 'src/app/core/services/examresult.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-sectionreport',
  templateUrl: './sectionreport.component.html',
  styleUrls: ['./sectionreport.component.css']
})
export class SectionreportComponent {
  public logininfo: any = [];
  ExamName: any[] = [];
  examId: string = '';
  Sec_id: string = ''
  exam_info: any[] = [];
  UniqueDataExamId: any[] = [];
  SectionReportData: any[] = [];
  marksJson: any[] = [];
  subjectmarks: number
  newFilePath: string;
  displayedData: any[] = [];
  Sectionslist: any[] = [];
  campus_data: any[] = [];
  Branch: string = '';
  SemesterList: any[] = [];
  show_data = 0;
  constructor(private _SectionReportService: SectionReportService, private _ExamResultService: ExamResultService) { }

  ngOnInit() {

    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)
    // // // // console.log( this.logininfo)

    // this._SectionReportService.get_campus().subscribe(camp =>{
    //   // // console.log( camp)
    //   this.campus_data = [];
    //   for(var i=0; i<this.logininfo.UserCampus.length; i++){
    //     var temp = camp.filter((e: { campus_id: any; })=> e.campus_id == this.logininfo.UserCampus[i].campus_id)
    //     if(temp.length>0){
    //       this.campus_data.push(temp[0])
    //     }
    //   }
    //   // // // // console.log( this.campus_data)
    //  })
    this._SectionReportService.get_examlist().subscribe(data => {
      this.ExamName = data;
      this.UniqueDataExamId = Array.from(new Set(this.ExamName.map(ele => ele.examId))).map(id => { return this.ExamName.find(ele => ele.examId === id); });
      // // // // // console.log( this.UniqueDataExamId)
    });

  }

  get_campus_list(exam_id: any) {

    this.campus_data = [];
    this.Sectionslist = [];
    this.Sec_id = "";
    this.Branch = "";
    this.show_data = 0
    this._ExamResultService.get_sem_list().subscribe(data => {
      this.SemesterList = data
      // // // console.log(exam_id)
      // // // console.log( this.SemesterList)
      var campus = this.SemesterList.filter((e: { examId: any; }) => e.examId == exam_id)
      // // // console.log(campus)
      if (campus.length > 0) {
        var filtering_campuse: any = [];
        for (var i = 0; i < this.logininfo.UserCampus.length; i++) {
          var temp = campus[0].campus.filter((e: any) => e == this.logininfo.UserCampus[i].campus_name)
          if (temp.length) {
            filtering_campuse.push(temp[0])
          }
        }

        for (var j = 0; j < filtering_campuse.length; j++) {
          var camp_filtered = this.logininfo.UserCampus.filter((e: { campus_name: any; }) => e.campus_name == filtering_campuse[j])
          if (camp_filtered.length) {
            this.campus_data.push(camp_filtered[0])
          }
        }
      }

      // // // console.log(this.campus_data)
    })
  }

  getExamId(examid: any, campus: any) {
    // // // console.log( examid)
    // // // console.log( campus)

    this.Sectionslist = [];
    this.Sec_id = "";
    this.show_data = 0
    this._SectionReportService.get_sectionslist(examid, campus).subscribe(data => {
      // // // console.log(data)
      this.Sectionslist = data

    });
  }
  GetResult() {
    this.show_data = 0
    var obj = {
      "exam_id": parseInt(this.examId),
      "section_id": parseInt(this.Sec_id)
    }
    this._SectionReportService.get_sectionwise(obj).subscribe(data => {
      this.SectionReportData = data;
      // // // console.log(this.SectionReportData);
      if (this.SectionReportData.length > 0) {
        this.SectionReportData.forEach(student => {
          student.totalMarks = student.marksobj.reduce((sum: number, markObj: { marks?: number }) => {
            return sum + (markObj.marks || 0); // Add mark only if it exists, otherwise add 0
          }, 0); // Initialize sum as 0
        });
      } else {
        this.show_data = 1;
      }
      
      // // // console.log( this.SectionReportData)
    });

  }
  exportToExcel(): void {
    const headers = ['S.No', 'Branch', 'Roll', 'Suc', 'Student Name', 'Group'];
    const subjectHeaders = this.SectionReportData[0].marksobj.map((x: any) => x.subject);
    const fullHeaders = [...headers, ...subjectHeaders];
    const dataToExport = this.SectionReportData.map((x: any, index: number) => {
      const rowData: { [key: string]: any } = {
        'S.No': index + 1,
        'Branch': x.branch,
        'Roll': x.roll_no,
        'Suc': x.suc,
        'Student Name': x.studentName,
        'Group': x.course
      };
      x.marksobj.forEach((y: any, subjectIndex: number) => {
        rowData[subjectHeaders[subjectIndex]] = y.marks;
      });
      return rowData;
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport, { header: fullHeaders });
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'MarksReport');
    XLSX.writeFile(wb, 'StudentReport.xlsx');
  }
}
