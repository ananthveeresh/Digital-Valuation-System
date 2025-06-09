import { Component, Input } from '@angular/core'; 
import { SemesterService } from 'src/app/core/services/semester.service';
import { PrintService } from 'src/app/utilities/print.service';
import { Router } from '@angular/router';

import jspdf, { jsPDF } from 'jspdf';  // Correct import for jspdf
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-downloadhallticket',
  templateUrl: './downloadhallticket.component.html',
  styleUrls: ['./downloadhallticket.component.css']
})
export class DownloadhallticketComponent {
  @Input() examid: any;  
  public semdetials: any = [];
  public logininfo: any = [];
  StdPro: any = [];
  SelectedSemName: string = "";
  subject_list: any = [];
  sem_name: string = "";
  boardId: any[] = [];
  exams_list: any = [];

  constructor(private semester: SemesterService, private printService: PrintService, private router: Router) { }

  ngOnInit() {
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)
    // // // console.log(this.logininfo)
    var campusname = this.logininfo.stdCampus
    this.semester.getboardId(this.logininfo.stdSuc).subscribe((id: any) => {
      // // // console.log(id[0].board_id)
      this.boardId = id[0].board_id
    })
    
    
    this.semester.exam_hallticket(this.logininfo.stdSuc).subscribe((data: any) => {
      // // console.log(data)
      this.exams_list = data
    })

    this.semester.get_list_by_campus(campusname).subscribe(res => {
      // // console.log(res)
      this.semdetials = res;
      this.semester.get_profile_data(this.logininfo.stdSuc).subscribe((data: any) => {
        this.StdPro = data
        this.get_hall_ticket()
      })
    })
  }

  get_hall_ticket(){
    // // console.log(this.examid)
    var filtered_exam = this.exams_list.filter((e: { examId: any; })=> e.examId == this.examid)
    // // console.log(filtered_exam)
    var post_obj = {
      "exam_id": filtered_exam[0].examId,
      "campus": filtered_exam[0].campus,
      "hallticket": filtered_exam[0].studentId
    }
    
    this.semester.get_exam_sublist(post_obj).subscribe((data1: any)=> {
      // console.log(data1)
      if(data1.length > 0 && data1[0].matchedSubjects.length > 0){
        this.subject_list = data1[0].matchedSubjects.sort((a: any, b: any) => {
          return new Date(a.examDate).getTime() - new Date(b.examDate).getTime();
        });
        
        
        this.sem_name = data1[0].examName
      }
      // this.semdetials = res;
    })
  }

  fetchDataForSubject() {
    var obj = {
      "year": 21,
      "section": this.StdPro[0].studentinfo[0].sec_id,
      "exam": [
        {
          "course_type": this.StdPro[0].course[0].course_type,
          "exam_id": this.semdetials[0].examId,
          "exam_name": this.semdetials[0].examName,
          "exam_date": this.semdetials[0].createdAt
        }
      ]
    }
    // // // console.log(obj)
    this.semester.get_semSubjects(obj).subscribe(data => {
      this.subject_list = data
      var sem = this.subject_list.subject_list.find((a: { exam_name: any; }) => a.exam_name)
      this.sem_name = sem.exam_name.split('End')[0]
    });

  }

  downloadPDF() {

    var obj = {
      "role": "student",
      "userinfo": [this.logininfo],
      "examinfo": [
        {
          "course_type": this.StdPro[0].course[0].course_type,
          "exam_id": this.semdetials[0].examId,
          "exam_name": this.semdetials[0].examName,
          "exam_date": this.semdetials[0].createdAt
        }
      ],
      "suc": this.logininfo.stdSuc
    }
    this.semester.downloadtracker(obj).subscribe(trackingdata => {

      var data = document.getElementById('content');

      if (!data) {
        console.error('Element with id "content" not found!');
        return;
      }
      data.classList.add('pdf-style');
      html2canvas(data, {
        useCORS: true,
        allowTaint: true
      }).then(canvas => {
        var imgWidth = 178;
        var pageHeight = 295;
        var imgHeight = canvas.height * imgWidth / canvas.width;
        var heightLeft = imgHeight;


        const contentDataURL = canvas.toDataURL('image/jpg');

        let pdf = new jspdf('p', 'mm', 'a4');

        var topMargin = 20;
        var positionX = (pdf.internal.pageSize.width - imgWidth) / 2;
        var positionY = topMargin;

        pdf.addImage(contentDataURL, 'JPG', positionX, positionY, imgWidth, imgHeight);

        pdf.save('HallTicket.pdf');
      }).catch(error => {
        console.error('Error generating PDF:', error);
      }).finally(() => {
        data!.classList.remove('pdf-style');
      });
    })
  }

  printDiv() {
    this.printService.printDiv('print_div');
  }
  back() {
    history.back()
  }
}
