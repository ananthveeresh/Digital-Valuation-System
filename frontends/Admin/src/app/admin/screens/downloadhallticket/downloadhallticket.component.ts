import { Component, EventEmitter, Output } from '@angular/core';
import { SemisterService } from 'src/app/core/services/semister.service';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { ActivatedRoute, Router } from '@angular/router';
import { PrintService } from 'src/app/utilities/print.service';


@Component({
  selector: 'app-downloadhallticket',
  templateUrl: './downloadhallticket.component.html',
  styleUrls: ['./downloadhallticket.component.css']
})
export class DownloadhallticketComponent {

  public semdetials: any = [];
  StdPro: any = [];
  SelectedSemName: string = "";
  Academic: any = [];
  sem_name: string = "";
  public currentStdInfo: any = [];
  public logininfo: any = [];
  boardId: any = [];
  exams_list: any = [];
  subject_list: any = [];
  show_examslist = 0;
  selected_examid : any = "";

  @Output() RegistrationStd = new EventEmitter<any>();

  constructor(private _SemesterService: SemisterService, private router: Router, private route: ActivatedRoute, private printService: PrintService) {

  }
  ngOnInit() {

    this.StdPro = [];
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)
    this.currentStdInfo = localStorage.getItem('CurrentStudent');
    this.currentStdInfo = JSON.parse(this.currentStdInfo)
    this._SemesterService.getboardId(this.currentStdInfo.suc).subscribe((id: any) => {
      this.boardId = id[0].board_id
    })

    this._SemesterService.exam_hallticket(this.currentStdInfo.suc).subscribe((data: any) => {
      console.log(data)
      this.exams_list = data;

    })


    this._SemesterService.get_list_by_campus(this.currentStdInfo.campus_name).subscribe(res => {
      this.semdetials = res;
      this._SemesterService.get_profile_data(this.currentStdInfo.suc).subscribe((data: any) => {
        this.StdPro = data
        // this.get_hall_ticket();
      })
    })

  }


  get_hall_ticket() {
    // // console.log(this.examid)
    var filtered_exam = this.exams_list.filter((e: { examId: any; }) => e.examId == this.selected_examid)
    // // console.log(filtered_exam)
    var post_obj = {
      "exam_id": filtered_exam[0].examId,
      "campus": filtered_exam[0].campus,
      "hallticket": filtered_exam[0].studentId
    }

    this._SemesterService.get_exam_sublist(post_obj).subscribe((data1: any) => {
      // console.log(data1)
      if (data1.length > 0 && data1[0].matchedSubjects.length > 0) {
        //this.subject_list = data1[0].matchedSubjects

          this.subject_list = data1[0].matchedSubjects.sort((a: any, b: any) => {
            return new Date(a.examDate).getTime() - new Date(b.examDate).getTime();
          });

        this.sem_name = data1[0].examName
        this.show_examslist = 1;
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

    this._SemesterService.get_semSubjects(obj).subscribe(data => {
      this.Academic = data
      var sem = this.Academic.academic.find((a: { exam_name: any; }) => a.exam_name)
      this.sem_name = sem.exam_name.split('End')[0]
    });

  }


  BackToreg() {
    this.RegistrationStd.emit(0);
  }

  downloadPDF() {
    var obj = {
      "role": "Admin",
      "userinfo": [this.logininfo],
      "examinfo": [
        {
          "course_type": this.StdPro[0].course[0].course_type,
          "exam_id": this.semdetials[0].examId,
          "exam_name": this.semdetials[0].examName,
          "exam_date": this.semdetials[0].createdAt
        }
      ],
      "suc": this.currentStdInfo.suc
    }
    this._SemesterService.downloadtracker(obj).subscribe(trackingdata => {
      //   var data = document.getElementById('content');

      //   if (!data) {
      //       console.error('Element with id "content" not found!');
      //       return;
      //   }
      //   data.classList.add('pdf-style');
      //   html2canvas(data,{
      //     useCORS: true,
      //     allowTaint: true
      //   }).then(canvas => {
      //       var imgWidth = 178;
      //       var pageHeight = 295;
      //       var imgHeight = canvas.height * imgWidth / canvas.width;
      //       var heightLeft = imgHeight;


      //       const contentDataURL = canvas.toDataURL('image/jpg');

      //       let pdf = new jspdf('p', 'mm', 'a4'); 

      //       var topMargin = 20;
      //       var positionX = (pdf.internal.pageSize.width - imgWidth) / 2; 
      //       var positionY = topMargin; 

      //       pdf.addImage(contentDataURL, 'JPG', positionX, positionY, imgWidth, imgHeight);

      //       pdf.save('HallTicket.pdf');
      //   }).catch(error => {
      //       console.error('Error generating PDF:', error);
      //   }).finally(() => {
      //     data!.classList.remove('pdf-style');
      // });
      this.printService.printDiv('print_div');
    });


  }
}
