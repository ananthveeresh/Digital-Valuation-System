import { Component } from '@angular/core';
import { flatMap } from 'rxjs';
import { ExamResultService } from 'src/app/core/services/examresult.service';
import { PaperAlloctmentService } from 'src/app/core/services/paperalloct.service';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent {
  public logininfo: any = [];
  SubjectData: any[] = [];
  examId: string = '';
  PaperCode: string = ''
  exam_info: any[] = [];
  UniqueDataExamId: any[] = [];
  ResultData: any[] = [];
  marksJson: any[] = [];
  subjectmarks: number
  newFilePath: string;
  displayedData: any[] = [];
  examsubjectinfo: any = [];
  SemesterList: any[] = [];
  CampusList: any[] = [];
  campusName: string = '';
  show_error = 0;
  show_loading = 0;
  selected_subject: any;
  StdMarksData: any[] = [];

  constructor(private _ExamResultService: ExamResultService, private _paperAlloctmentService: PaperAlloctmentService) { }

  ngOnInit() {

    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)
    // // // // console.log( this.logininfo)

    this._ExamResultService.get_sem_list().subscribe(data => {
      this.SemesterList = data
      // // // // console.log( this.SemesterList)
    })
    this._ExamResultService.get_examlist().subscribe(data => {
      var ExamName = data;
      this.examsubjectinfo = data;
      // // // // console.log( this.examsubjectinfo)
      this.UniqueDataExamId = Array.from(new Set(ExamName.map((ele: { examId: any; }) => ele.examId))).map(id => { return ExamName.find((ele: { examId: unknown; }) => ele.examId === id); });
    });
  }

  getexamId(exam_id: any) {
    this.campusName = "";
    this.PaperCode = "";
    this.CampusList = [];
    this.SubjectData = [];
    this.displayedData = [];
    this.show_error = 0;
    this.show_loading = 0;
    var campus = this.SemesterList.filter((e: { examId: any; }) => e.examId == exam_id)
    this.CampusList = [];
    for (var i = 0; i < this.logininfo.UserCampus.length; i++) {
      var temp = campus[0].campus.filter((e: any) => e == this.logininfo.UserCampus[i].campus_name)
      if (temp.length) {
        this.CampusList.push(temp[0])
      }
    }
    // // // // console.log( this.CampusList)
  }

  getcampus(campus: any) {
    this.PaperCode = "";
    this.SubjectData = [];
    this.displayedData = [];
    this._ExamResultService.get_exammasterlist(this.examId).subscribe(data => {
      // // // console.log(data)
      var filtered_campuses = this.examsubjectinfo.filter((e: { campus: any; }) => e.campus == campus.target.value)
      this.SubjectData = filtered_campuses.filter((e: { examId: string; })=> e.examId == this.examId)
      // // console.log(this.SubjectData)
    })
  }

  GetResult() {
    this.show_loading = 1;
    // // console.log(this.SubjectData)
    var post_ppcode = this.SubjectData.filter(e=> e.subjectName == this.selected_subject)
    // // console.log(post_ppcode)
    this.displayedData = [];
    var obj = {
      "examid": parseInt(this.examId),
      "papercode": this.examId=="26388" ? this.PaperCode :  post_ppcode[0].subjectcode,
      "campus": this.campusName.trim().replace(/\s+/g, '')
    }
    // // console.log(obj)
    this._ExamResultService.get_results(obj).subscribe(data => {

      this.ResultData = data;
      for (var i = 0; i < this.ResultData.length; i++) {
        let individualTotal = 0;
        for (var j = 0; j < this.ResultData[i].marksjson.length; j++) {
          individualTotal += this.ResultData[i].marksjson[j].TotalMaxmarks;
        }
        this.ResultData[i].individualTotal = individualTotal;
      }

      this.ResultData.forEach(item => {
        if (item.filepath) {
          const baseUrl = "https://w.aditya.ac.in/digival/faculty/uploads/annotated_pdfs/";
          const relativePath = item.filepath.replace("/app/uploads/", "");
          item.newFilePath = baseUrl + relativePath;
        }


      });
      this.sortData();
      this.show_loading = 0;
    });

  }

  sortData() {
    const withMarks = this.ResultData.filter(x => x.marksjson.length > 0);
    const withoutMarks = this.ResultData.filter(x => x.marksjson.length === 0);
    this.displayedData = [...withMarks, ...withoutMarks];
    this.show_error = this.displayedData.length > 0 ? 0 : 1
    // // // console.log( this.displayedData)
  }

  ViewIndividualMarks(Data: any, subjectmarks: any) {
    this.subjectmarks = subjectmarks
    this.marksJson = Data;
    this.sortQuestionsByQNo()
  }

  sortQuestionsByQNo(): void {
    this.marksJson.forEach(section => {
      section.subsections.forEach((subsection: any) => {
        subsection.Questions.sort((a: any, b: any) => a.QNo - b.QNo);
      });
    });
  }

  DeleteData(deletingdata: any) {
    var obj = {
      "paycode": deletingdata.paycode,
      "papercode": deletingdata.papercode,
      "suc": deletingdata.suc,
      "subject": deletingdata.subject
    }
    if (Object.values(obj).some(value => value === null || value === undefined)) {
      alert('One or more required fields are missing.');
      return;
    }
    if (confirm("Are you sure you want to delete")) {
      this._ExamResultService.DeletingSheet(obj).subscribe(res => {
        location.reload();
      })
    } else {
      return
    }
  }

  calculateSubsectionTotal(questions: any) {
    let totalMarks = 0;

    questions.forEach(function (question: { score_status: any; applied_marks: number; }) {
      if (question.score_status && question.applied_marks) {
        totalMarks += question.applied_marks;
      }
    });

    return totalMarks;
  };

  path_check(dt: any, df: any) {
    // // console.log( df);
    var post_ppcode = this.SubjectData.filter(e=> e.subjectName == this.selected_subject)
    // // console.log(post_ppcode)
    // return false
    var path_array = dt.split('/')
    // // console.log(path_array);

    var req_path: any = path_array[9].split('-');
    // // console.log(req_path);

    if(this.examId == "26388"){
      req_path[1] = this.PaperCode;
    }else{
      req_path[1] = post_ppcode[0].papercode;
    }

    path_array[9] = req_path.join('-');
    // // console.log( path_array);

    var path_update = path_array.join('/');
    // // console.log( path_update);
    return path_update
  }

  onPaperCodeChange(event: any) {
    const selectedPaperCode = event.target.value;
    if(this.examId == "26388"){
      var selectedSubject = this.SubjectData.find(x => x.papercode === selectedPaperCode);
    }else{
      var selectedSubject = this.SubjectData.find(x => x.subjectcode === selectedPaperCode);
    }
    // // console.log(selectedSubject)
    if (selectedSubject) {
      
    this.selected_subject = selectedSubject.subjectName;
    }
  }

  GetStdMarks() {
    this.StdMarksData = []
    // // console.log( StdData);
    var obj = {
      "examid": parseInt(this.examId),
      "papercode": this.PaperCode,
      "subject": this.selected_subject.trim().replace(/\s+/g, ''),
      "campus": this.campusName.trim().replace(/\s+/g, '')
    }
    // // console.log( obj);
    this._paperAlloctmentService.GetStdMarks(obj).subscribe(data => {
      // // // // console.log( data);

      var stdobj = {};
      for (var i = 0; i < data.length; i++) {
        let individualTotal = 0;
        for (var j = 0; j < data[i].marksjson.length; j++) {
          stdobj = {
            "Examid": data[i].examid,
            "Branch": data[i].branch,
            "Papercode": data[i].papercode,
            "Subject": data[i].subject,
            "Suc": data[i].suc,
            "Subjectmarks": data[i].subjectmarks,
            "Maxmarks": individualTotal += data[i].marksjson[j].TotalMaxmarks

          }
        }
        data[i].individualTotal = individualTotal;


        this.StdMarksData.push(stdobj)
      }
      // // // // // console.log( this.StdMarksData)
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.StdMarksData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      var filename = obj.campus + '_' + this.selected_subject.trim().replace(/\s+/g, '') + '.xlsx'
      XLSX.writeFile(wb, filename);
    });

  }

  exportToExcel(): void {
    const dataToExport = this.marksJson.flatMap(x =>
      x.subsections.flatMap((y: { Questions: any[]; }) =>
        y.Questions.map(z => ({
          'Q.No': z.Qlabel,
          'Section': x.Section,
          'Questions': z.question_description,
          'QMarks': z.Qmarks,
          'AppliedMarks': z.applied_marks,
        })
        )
      )
    );

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'MarksReport.xlsx');
  }
  
}
