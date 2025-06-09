import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SemesterService } from 'src/app/core/services/semester.service';
import { PrintService } from 'src/app/utilities/print.service';
declare var bootstrap: any;

@Component({
  selector: 'app-payfee',
  templateUrl: './payfee.component.html',
  styleUrls: ['./payfee.component.css']
})

export class PayfeeComponent {

  public logininfo: any = [];
  public exam_fee_info: any = [];
  public payment_history: any = [];
  public result_details: any = [];
  StdPro: any = [];
  public errorimg: any;
  profile_data: any;
  sec_id: any
  Academic: any = [];
  sem_name: string = "";
  SelectedSemName: string = "";
  hallticket: number = 0;
  StdAttendance: any[] = [];
  CheckPercent: number;
  public showDangerAlert: boolean = false;
  public fees_info: any;

  public std_board_id: any;
  public exam_result: any = '';
  public selected_result: any;
  public report_date: any;
  public total_credit_points: any;
  public total_grade_points: any;
  public std_clg_info: any = [];
  public active_tab_name = "";
  public exams_list: any = [];
  public selected_exam_id: any = '';
  public checknewsempayment: any = [];

  public total_grading = [
    { "grade": "O", "points": 10 },
    { "grade": "A+", "points": 9 },
    { "grade": "A", "points": 8 },
    { "grade": "B+", "points": 7 },
    { "grade": "B", "points": 6 },
    { "grade": "C", "points": 5 },
    { "grade": "D", "points": 4 },
    { "grade": "F", "points": 0 }
  ];

  constructor(private route: ActivatedRoute, private router: Router, private _semesterService: SemesterService, private printService: PrintService) { }

  get_tab_name(dt: any) {
    this.selected_result = "";
    this.exam_result = "";
    this.active_tab_name = dt
  }

  ngOnInit() {

    localStorage.setItem('tran_count', "0");
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)
    // // console.log(this.logininfo)
    this.active_tab_name = 'tab1';

    var random_number = this.route.snapshot.params['rdm_id'];
    let decoded = window.atob(random_number);

    this.errorimg = "assets/img/profile-img.jpg";
    var campusname = this.logininfo.stdCampus.trim().replace(/\s+/g, '');

    var post_obj = {
      "year_id": 21,
      "student_id": this.logininfo.stdPhoto.split('.')[0]
    }

    this._semesterService.exam_history(post_obj).subscribe((data: any) => {
      //console.log(data)
      this.payment_history = data;
      this.checknewsempayment = this.payment_history.filter((e: { fee_id: number; }) => e.fee_id == 108)
      // console.log(this.checknewsempayment)
    })

    this._semesterService.check_exam_due(post_obj).subscribe((data: any) => {
      // // console.log(data);

      const firstDueFee = data.find((item: any) => item.term_due_amount > 0);

      if (firstDueFee) {
        this.exam_fee_info = [firstDueFee];
      } else {
        this.exam_fee_info = [];
      }
      // // console.log(this.exam_fee_info)
    });

    this._semesterService.get_std_sectioninfo(this.logininfo.stdSuc).subscribe((sec_data: any) => {
      // // console.log(sec_data)
      var section_data = sec_data;

      this._semesterService.get_profile_data(this.logininfo.stdSuc).subscribe((data: any) => {
        // // console.log(data)
        this.profile_data = data[0]
        // console.log(this.profile_data.studentinfo[0].campus_id)
        var obj = {
          "student_id": this.profile_data.studentinfo[0]?.std_id,
          "year_id": this.profile_data.studentinfo[0]?.year_id,
          "section_id": section_data[0]?.sec_id,
        }
        this._semesterService.VerifyStdAttendance(obj).subscribe((Stdatt: any) => {
          // // console.log(Stdatt)
          this.StdAttendance = Stdatt.result;
          var PresentDays = 0; var WorkingDays = 0;
          for (var i = 0; i < this.StdAttendance.length; i++) {
            PresentDays += this.StdAttendance[i].presentdays
            WorkingDays += this.StdAttendance[i].workingdays
          }
          this.CheckPercent = Math.round(PresentDays / WorkingDays * 100);
        });

        var due_post_obj = {
          "year_id": this.profile_data.studentinfo[0].year_id,
          "student_id": this.profile_data.studentinfo[0].std_id,
          // "term_number": this.profile_data.studentinfo[0].smc_order !== null ? this.profile_data.studentinfo[0].smc_order : 1
          "term_number": 2
        }

        this._semesterService.check_due(due_post_obj).subscribe((data: any) => {
          // // console.log(data)
          this.fees_info = data[0]
          if (data[0].feedue > 0) {
            this.showDangerAlert = true;
          } else {
            this.showDangerAlert = false;
          }
        })
      })
    })

    this._semesterService.getboardId(this.logininfo.stdSuc).subscribe((res: any) => {
      // // // console.log(id[0].board_id)
      this.std_board_id = res[0].board_id;
      // // console.log(this.std_board_id)

      this._semesterService.get_clg_info(this.std_board_id).subscribe((data1: any) => {
        // // console.log(data1)
        this.std_clg_info = data1
      })
      this._semesterService.get_result(this.std_board_id).subscribe(res => {
        this.result_details = res;
        // // console.log(this.result_details)

      })
    })

    this._semesterService.exam_hallticket(this.logininfo.stdSuc).subscribe((data: any) => {
      // console.log(data)
      this.exams_list = data
    })
  }

  get_examresult() {
    // console.log(this.exam_result);
    this.selected_result = this.exam_result;
    this.report_date = new Date()

    for (let i = 0; i < this.selected_result.marks.length; i++) {
      let mark = this.selected_result.marks[i];

      // Replace empty grade with '-'
      if (mark.grade === "") {
        mark.grade = "-";
      }

      // Only calculate points and gradepoints if grade is valid
      if (mark.grade && mark.grade !== "-NA-" && mark.grade !== "-" && mark.credit != null) {
        let filtering_dt = this.total_grading.filter(e => e.grade === mark.grade);
        if (filtering_dt.length > 0) {
          mark.points = filtering_dt[0].points;
          mark.gradepoints = filtering_dt[0].points * Number(mark.credit);
        }
      } else {
        // If grade is -NA-, '-', or invalid, make sure gradepoints and points are null
        mark.points = null;
        mark.gradepoints = null;
      }
    }

    this.report_date = new Date();

    // Include all subjects with a valid credit for total_credit_points
    const allWithCredit = this.selected_result.marks.filter((m: { credit: null; }) => m.credit != null);
    this.total_credit_points = getSumElements(allWithCredit, 'credit');

    // Only include subjects with valid gradepoints for grade point sum
    const validGradepoints = this.selected_result.marks.filter((m: { grade: string; gradepoints: null; }) => m.grade !== "-NA-" && m.gradepoints != null);
    // console.log(validGradepoints)
    const hasFailedOrAbsent = this.selected_result.marks.some((subj: { grade: string; }) => subj.grade === 'F' || subj.grade === 'ABS');
    // console.log(hasFailedOrAbsent)
    if (hasFailedOrAbsent) {
      this.total_grade_points = 0;
    } else {
      this.total_grade_points = getSumElements(validGradepoints, 'gradepoints');
    }

  }

  getHallTicket() {
    this.active_tab_name = 'tab6';

    const triggerEl = document.querySelector('button[data-bs-target="#tab6"]');
    if (triggerEl) {
      const tab = new bootstrap.Tab(triggerEl);
      tab.show();
    }
  }


  get_examhallticket() {
    this.hallticket = 1;
    // // console.log(this.selected_exam_id)
    // this.router.navigate(['/student/getHallticket']);
  }

  navigateTopayment() {
    var std_id = this.logininfo.stdPhoto.split('.')[0]
    var obj = {
      "amount": this.exam_fee_info[0].term_due_amount.toString(),
      // "amount":"1",
      "email": this.profile_data.studentemail,
      "phone": this.profile_data.studentmobilenumber,
      "productinfo": "Exam Fee",
      "firstname": this.logininfo.stdName,
      "lastname": this.logininfo.stdName,
      "suc": this.logininfo.stdSuc,
      "projectId": "AA",
      "alternative_no": this.profile_data.fathermobilenumber,
      "feeinfo": this.exam_fee_info,
      "udf": std_id,
      "webapp": "SemisterApp"
    }
    // // // // console.log(obj)
    this._semesterService.pay_exam_fee(obj).subscribe((data: any) => {
      // // // // console.log(data)
      if (data.status == 200) {
        window.location.href = data.paymenturl
      }
    })

  }

  printDiv() {
    this.printService.printDiv('print_div');
  }
  print_result() {

    // this.printService.printDiv('printableArea');
    const printContents = document.getElementById('printableArea')?.innerHTML;
    if (!printContents) return;

    const popupWin = window.open('', '_blank', 'width=1000,height=800');
    if (!popupWin) return;

    // Grab all current styles
    let styles = '';
    document.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
      styles += node.outerHTML;
    });

    popupWin.document.open();
    popupWin.document.write(`
      <html>
      <head>
        <title>Grade Sheet</title>
        ${styles}
        <style>
          .pointerclass {
            cursor: pointer;
          }
          .no-pointer {
            cursor: none;
          }
          @media print {
            .d-print-none {
              display: none !important;
            }
            body,
            html {
              margin: 0;
              padding: 0;
              height: 100%;
            }
            .grade-sheet {
              border: 2px solid #00000096;
              background-color: white;
              padding: 10px 12px 0 12px;
              position: relative;
              margin: 0;
              min-height: 100%;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
            }
            footer {
              margin-top: auto;
            }
            img {
              max-width: 120px !important;
              max-height: 120px !important;
              object-fit: contain;
            }
          }
          .grade-sheet {
            border: 2px solid #00000096;
            background-color: white;
            padding: 0px 12px;
            position: relative;
            overflow: hidden;
            padding-top: 10px;
            margin-top: 15px;
            height: 100%;
            display: flex;
            flex-direction: column;
          }
          .logo {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background-color: white;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .college-name {
            font-size: 30px;
            margin-bottom: 5px;
          }
          .college-details {
            font-size: 17px;
            margin-bottom: 5px;
            font-weight: 600;
          }
          .grade-title button {
            background-color: #ff8c42;
            color: black;
            padding: 4px 26px;
            font-weight: 500;
            font-size: 15px;
            border-radius: 10px;
            margin: 10px auto;
            display: block;
            border: 2px solid #934512;
          }
          .student-details {
            margin: 6px 0;
          }
          table {
            width: 100%;
            margin: 5px 0;
            border: 2px solid #000000a8;
            border-collapse: collapse;
          }
          th,
          td {
            padding: 6px;
            text-align: center;
          }
          th {
            font-weight: bold;
          }
          .subjects-col {
            text-align: left;
            font-weight: bold;
          }
          .signature {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
          }
          .sign-text {
            text-align: center;
            font-weight: bold;
            margin-top: 5px;
          }
          .sign-image {
            display: flex;
            align-items: flex-end;
            justify-content: center;
            color: green;
          }
          .right-sign .sign-image {
            font-family: cursive;
            font-weight: bold;
            font-size: 20px;
          }
          .exam-details {
            font-size: 18px;
            font-weight: bold;
            margin-top : 20px !important;
          }
           

        </style>
      </head>
      <body onload="window.print(); window.close();">
        ${printContents}
      </body>
      </html>
    `);
    popupWin.document.close();
  }

}

function getSumElements(obj: { [x: string]: { [x: string]: any; }; }, field: string) {
  //// console.log(obj);
  var total = 0;
  for (var i in obj)
    total += Number(obj[i][field]);
  return total;
}