import { Component, OnInit } from '@angular/core';
import { PaperAlloctmentService } from 'src/app/core/services/paperalloct.service';
import { CreateFacultyService } from 'src/app/core/services/createfac.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-paperallotment',
  templateUrl: './paperallotment.component.html',
  styleUrls: ['./paperallotment.component.css']
})
export class PaperallotmentComponent implements OnInit {
  logininfo: any = [];
  ExamName: any[] = [];
  examId: string = '';
  PaperAllocatelist: any[] = [];
  subjectcode: string
  allocatevalue: number;
  staffinfo: any = [];
  Exam: string | null;
  AllocatedPapers: any[] = [];
  pendingPapers: any = [];
  FacultyAllocationData: any[] = [];
  selectedsubject: any;
  totalAllocated: number = 0;
  totalAvailable: number = 0;
  totalValued: number = 0;
  totalPending: number = 0;
  OverallTotal: number = 0;
  FacAllocated: number = 0;
  FacValued: number = 0;
  FacPending: number = 0;
  StdMarksData: any[] = [];
  campusName: string = '';
  loading: boolean = false;
  SemesterList: any[] = [];
  CampusList: any[] = [];
  showerror: boolean = false;
  selected_pending_sub: any;
  selected_pending_ppcode: any;
  show_loading = 0;
  valued_papers: any = [];
  avaliable_papers: any;
  avaliable_scrutiny_papers: any;
  scrutinyalloted: number = 0;
  scrutinycorrected: number = 0;
  scrutinypending: number = 0;
  constructor(private _paperAlloctmentService: PaperAlloctmentService, public _CreateFacultyService: CreateFacultyService) { }

  ngOnInit() {

    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)
    // // // // console.log( this.logininfo)

    this._paperAlloctmentService.get_sem_list().subscribe(data => {
      this.SemesterList = data
      // // console.log( this.SemesterList)
    })

    this._paperAlloctmentService.get_examlist().subscribe(data => {
      this.ExamName = data;
      // // // // console.log( this.ExamName)
    });
    // this.GetSubjectWiseData()
  }

  get_examId(examId: any) {
    this.CampusList = [];
    this.PaperAllocatelist = [];
    this.showerror = false;
    this.campusName = "";
    // // console.log(examId.target.value)
    // // console.log(this.SemesterList)
    var campus = this.SemesterList.filter((e: { examId: any; }) => e.examId == examId.target.value)
    // // console.log(campus)
    for (var i = 0; i < this.logininfo.UserCampus.length; i++) {
      var temp = campus[0].campus.filter((e: any) => e == this.logininfo.UserCampus[i].campus_name)
      if (temp.length > 0) {
        this.CampusList.push(temp[0])
      }
    }

    // this.CampusList = campus[0].campus;
    // // // // console.log( cam)

  }

  GetPaperList() {
    this.show_loading = 1;
    this.PaperAllocatelist = [];
    this.GetSubjectWiseData()
    this.GetFacultyWiseData()
  }

  GetSubjectWiseData() {
    var obj =
    {
      "examid": this.examId,
      "campus": this.campusName.trim().replace(/\s+/g, '')
    }
    // // // // console.log( obj)
    this._paperAlloctmentService.GetPaperlistById(obj).subscribe(data => {
      this.PaperAllocatelist = data;
      // // // console.log( this.PaperAllocatelist);
      // this.loading = false;
      this.resetPaperTotals();
      this.calculatePaperTotals();
      this.show_loading = 0;
      if (this.PaperAllocatelist.length > 0) {
        this.showerror = false;
      } else {
        this.showerror = true;
      }
    });
  }

  GetFacultyWiseData() {
    var obj = {
      "examid": this.examId,
      "campus": this.campusName.trim().replace(/\s+/g, '')
    }
    this._paperAlloctmentService.GetFacultylistById(obj).subscribe(data => {
      this.FacultyAllocationData = data;
      // this.loading = false;
      this.resetFacultyTotals();
      this.calculateFacultyTotals();
      this.show_loading = 0;
      if (this.FacultyAllocationData.length > 0) {
        this.showerror = false;
      } else {
        this.showerror = true;
      }
    });
  }

  resetPaperTotals() {
    this.OverallTotal = 0;
    this.totalAllocated = 0;
    this.totalAvailable = 0;
    this.totalValued = 0;
    this.totalPending = 0;
    this.scrutinyalloted = 0;
    this.scrutinycorrected = 0;
    this.scrutinypending = 0;
  }

  calculatePaperTotals() {
    this.PaperAllocatelist.forEach(paper => {
      this.totalAllocated += paper.alloted;
      this.totalAvailable += paper.available;
      this.totalValued += paper.corrected;
      this.totalPending += paper.pending;
      this.OverallTotal += paper.total;
      this.scrutinyalloted += paper.scrutinyalloted;
      this.scrutinycorrected += paper.scrutinycorrected;
      this.scrutinypending += paper.scrutinypending;
    });
  }

  resetFacultyTotals() {
    this.FacAllocated = 0;
    this.FacValued = 0;
    this.FacPending = 0;
  }

  calculateFacultyTotals() {
    this.FacultyAllocationData.forEach(fac => {
      this.FacAllocated += fac.alloted;
      this.FacValued += fac.corrected;
      this.FacPending += fac.pending;
    });
  }

  viewAllocations(Data: any) {
    var obj = {
      "examId": parseInt(this.examId),
      "paperCode": Data.papercode,
      "branch": this.campusName.trim().replace(/\s+/g, '')
    }
    // // // console.log( obj)
    this._paperAlloctmentService.GetAlocatedPapers(obj).subscribe(data => {
      this.AllocatedPapers = data
      // // // console.log(this.AllocatedPapers)
    });

  }

  GetAllocate(Data: any) {
    // // console.log(Data);
    this.staffinfo = [];
    this.selected_pending_sub = Data.subject;
    this.selected_pending_ppcode = Data.papercode;
    var obj = {
      "examid": parseInt(this.examId),
      "papercode": Data.papercode,
      "campus": this.campusName,
      "subjectname": Data.subject
    }

    this._paperAlloctmentService.SubjectFaculty(obj).subscribe(faculty_info => {
      // // console.log(faculty_info);
      if(this.examId == "26388"){
        this.subjectcode = faculty_info.papercode;
      }else{
      this.subjectcode = faculty_info.subjectcode;
    }
      this.selectedsubject = faculty_info.subjectname
      // // // // // // console.log( data);

      var paper_obj = {
        "examId": parseInt(this.examId),
        "paperCode": Data.papercode,
        "branch": this.campusName.trim().replace(/\s+/g, '')
      }
      // // // console.log( obj)
      this._paperAlloctmentService.GetAlocatedPapers(paper_obj).subscribe(papers_info => {
        // // // console.log(papers_info)
        this.AllocatedPapers = papers_info
        // // // console.log(this.AllocatedPapers)
        for (var i = 0; i < faculty_info.staffinfo.length; i++) {
          var filtered_emp = this.AllocatedPapers.filter(e => e.paycode == faculty_info.staffinfo[i].paycode)
          if(filtered_emp.length>0){
            faculty_info.staffinfo[i].alloted = filtered_emp[0].alloted
            faculty_info.staffinfo[i].pending = filtered_emp[0].pending
            faculty_info.staffinfo[i].valued = filtered_emp[0].valued
          }
        }
        this.staffinfo = faculty_info.staffinfo
        this.staffinfo.total_alloted = Data.alloted
        this.staffinfo.total_corrected = Data.corrected
        this.staffinfo.total_pending = Data.pending
        this.staffinfo.total_available = Data.available
        this.staffinfo.subject = Data.subject
        this.avaliable_papers = this.staffinfo.total_available

        // // // console.log(this.staffinfo)
      });

    });
  }

  Getpending(Data: any) {
    //  // // // console.log( Data);
    var obj = {
      "examId": parseInt(this.examId),
      "paperCode": Data.papercode,
      "branch": this.campusName.trim().replace(/\s+/g, '')
    }
    // // // // console.log( obj)
    this._paperAlloctmentService.GetAlocatedPapers(obj).subscribe(data => {
      this.pendingPapers = data;
      // // console.log(this.pendingPapers)
    });
  }

  remove_allocations(dt: any) {
    //  // // // console.log( dt);
    if (confirm("Are you sure, Do you want to Un Allocate..?")) {

      var obj = {
        "examid": this.examId,
        "branch": this.campusName.trim().replace(/\s+/g, ''),
        "subject": this.selected_pending_sub,
        "paycode": dt.paycode
      }
      // // // // console.log( obj)
      this._paperAlloctmentService.unallocate_papers(obj).subscribe(data => {
        alert("Successfully Un Allocated..!");
        this.GetPaperList();
      });
    }
  }

  // GetStdMarks(StdData: any) {
  //   // // console.log( StdData);
  //   // var obj = {
  //   //   "examid": this.examId,
  //   //   "papercode": StdData.papercode,
  //   //   "subject": StdData.subject,
  //   //   "campus": this.campusName.trim().replace(/\s+/g, '')
  //   // }
  //   // // // // console.log( obj);
  //   // this._paperAlloctmentService.GetStdMarks(obj).subscribe(data => {
  //   //   // // // // console.log( data);

  //   //   var stdobj = {};
  //   //   for (var i = 0; i < data.length; i++) {
  //   //     let individualTotal = 0;
  //   //     for (var j = 0; j < data[i].marksjson.length; j++) {
  //   //       stdobj = {
  //   //         "Examid": data[i].examid,
  //   //         "Branch": data[i].branch,
  //   //         "Papercode": data[i].papercode,
  //   //         "Subject": data[i].subject,
  //   //         "Suc": data[i].suc,
  //   //         "Subjectmarks": data[i].subjectmarks,
  //   //         "Maxmarks": individualTotal += data[i].marksjson[j].TotalMaxmarks

  //   //       }
  //   //     }
  //   //     data[i].individualTotal = individualTotal;


  //   //     this.StdMarksData.push(stdobj)
  //   //   }
  //   //   // // // // // console.log( this.StdMarksData)
  //   //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.StdMarksData);
  //   //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //   //   XLSX.writeFile(wb, 'StudentMarksReport.xlsx');
  //   // });

  // }

  copyToClipboard(link: string) {
    navigator.clipboard.writeText(link).then(() => {
      alert('Link copied to clipboard');
    });
  }

  sendMessage(link: string) {
    // Open a message dialog or send an email
    // alert('Message dialog opened for link: ' + link);
  }

  AllocateFaculty() {
    var finalarray = [];
    // // console.log( this.subjectcode)
    // // console.log(this.PaperAllocatelist)
    for (var i = 0; i < this.PaperAllocatelist.length; i++) {
      for (var j = 0; j < this.staffinfo.length; j++) {
        if (this.subjectcode == this.PaperAllocatelist[i].papercode) {
          if (this.staffinfo[j].allocatevalue != undefined) {
            var obj = {
              "exam": this.examId,
              "subject": this.PaperAllocatelist[i].subject,
              "allocated": parseInt(this.staffinfo[j].allocatevalue),
              "paycode": this.staffinfo[j].paycode,
              "branch": this.staffinfo[j].branch,
              "facultyallocateInfo": [{
                "subject": this.staffinfo[j].subject,
                "facultyName": this.staffinfo[j].facultyName,
                "mobile": this.staffinfo[j].mobile,
                "email": this.staffinfo[j].email
              }]
            }
            // // console.log( obj)
            finalarray.push(obj)
          }
        }
      }
    }
    // // console.log( finalarray)
    if (confirm("Are you sure, Do you want to submit..?")) {
      this._paperAlloctmentService.Postalocatedfaculty(finalarray).subscribe(res => {
        alert('Allocted Successfully');
        this.GetPaperList();
      });
    }
  }

  GetValued_papers(Data: any) {
    // // // console.log(Data);
    this.selected_pending_sub = Data.subject;
    this.selected_pending_ppcode = Data.papercode;

    var obj = {
      "campus": this.campusName.trim().replace(/\s+/g, ''),
      "emptype": "Scrutiny",
    }
    // // // // console.log( obj)
    this._CreateFacultyService.get_CreatedFacultyList(obj).subscribe(faculty_info => {
      // // // console.log(faculty_info)
      // this.valued_papers = faculty_info.filter((e: { subject: any; })=> e.subject == Data.subject);
      this.valued_papers = faculty_info
      
      var scrut_obj = {
        "examId": parseInt(this.examId),
        "paperCode": Data.papercode,
        "branch": this.campusName.trim().replace(/\s+/g, '')
      }
      // // // console.log( obj)
      this._paperAlloctmentService.GetScrutinyPapers(scrut_obj).subscribe(scrut_info => {
      //  // // console.log(scrut_info)
       
      let total_alloted = 0, total_valued = 0, total_pending = 0;
       for (var i = 0; i < this.valued_papers.length; i++) {
        var filtered_paper = scrut_info.filter((e: { paycode: any; }) => e.paycode == this.valued_papers[i].paycode)
        // // // console.log(filtered_paper)
        if(filtered_paper.length>0){
          this.valued_papers[i].alloted = filtered_paper[0].alloted
          this.valued_papers[i].pending = filtered_paper[0].pending
          this.valued_papers[i].valued = filtered_paper[0].valued
        }
       }
        this.valued_papers.forEach((paper: { alloted: any; valued: any; pending: any; }) => {
            total_alloted += paper.alloted || 0;
            total_valued += paper.valued || 0;
            total_pending += paper.pending || 0;
        });

        this.valued_papers.total_alloted = total_alloted
        this.valued_papers.total_valued = total_valued
        this.valued_papers.total_pending = total_pending
        this.valued_papers.scrutinypending = Data.scrutinypending
        this.avaliable_scrutiny_papers = Data.scrutinypending

      })
      // // console.log(this.valued_papers)

    });
  }

  Allocatescrutiny() {
    var finalarray = [];
    // // console.log( this.valued_papers)
    for (var i = 0; i < this.PaperAllocatelist.length; i++) {
      for (var j = 0; j < this.valued_papers.length; j++) {
        if (this.selected_pending_ppcode == this.PaperAllocatelist[i].papercode) {
          // // // console.log(this.valued_papers[j].allocatevalue)
          if (this.valued_papers[j].allocatevalue != undefined) {
            var obj = {
              "exam": this.examId,
              "subject": this.PaperAllocatelist[i].subject,
              "allocated": parseInt(this.valued_papers[j].allocatevalue),
              "paycode": this.valued_papers[j].paycode,
              "branch": this.valued_papers[j].branch,
              "scrutinyinfo": [{
                "subject": this.valued_papers[j].subject,
                "facultyName": this.valued_papers[j].facultyName,
                "mobile": this.valued_papers[j].mobile,
                "email": this.valued_papers[j].email
              }]
            }
            // // // console.log( obj)
            finalarray.push(obj)
          }
        }
      }
    }
    // // console.log( finalarray)
    if (confirm("Are you sure, Do you want to submit..?")) {
      this._paperAlloctmentService.Postscrutinyfaculty(finalarray).subscribe(res => {
        alert('Allocted Successfully');
        this.GetPaperList();
      });
    }
  }
  
  remove_scrutiny_allocations(dt: any) {
    //  // // // console.log( dt);
    if (confirm("Are you sure, Do you want to Un Allocate..?")) {

      var obj = {
        "examid": this.examId,
        "branch": this.campusName.trim().replace(/\s+/g, ''),
        "subject": this.selected_pending_sub,
        "scrutinypaycode": dt.paycode
      }
      // // console.log(obj)
      this._paperAlloctmentService.unallocate_scrutiny_papers(obj).subscribe(data => {
        alert("Successfully Un Allocated..!");
        this.GetPaperList();
      });
    }
  }


  check_balance_papers() {
    let totalAllocated = this.staffinfo.reduce((sum: number, item: { allocatevalue: string; }) => {
      return sum + (parseInt(item.allocatevalue) || 0); // Convert input to number safely
    }, 0);
    this.staffinfo.total_available = this.avaliable_papers - totalAllocated;
  }


  check_balance_scrutiny_papers() {
    let totalAllocated = this.valued_papers.reduce((sum: number, item: { allocatevalue: string; }) => {
      return sum + (parseInt(item.allocatevalue) || 0); // Convert input to number safely
    }, 0);
    this.valued_papers.scrutinypending = this.avaliable_scrutiny_papers - totalAllocated;
  }
  
  isSubmitEnabled(): boolean {
    if (!this.staffinfo) return false;
  
    const totalAlloted = this.staffinfo.total_alloted || 0;
    const totalPending = this.staffinfo.total_pending || 0;
    const totalAvailable = this.staffinfo.total_available || 0;
    const availablePapers = this.avaliable_papers || 0;  // Assuming `avaliable_papers` is declared
  
    // Enable if total_available is exactly 0 and total_alloted !== total_pending
    if (totalAvailable === 0 && totalAlloted !== totalPending) {
      return true;
    }
  
    // Disable if total_available < 0
    if (totalAvailable < 0) {
      return false;
    }
  
    // Disable if total_available is 0 and total_alloted === total_pending
    if (totalAvailable === 0 && totalAlloted === totalPending) {
      return false;
    }
  
    // Disable if input fields are disabled (when total_available = 0 & available_papers = 0)
    if (totalAvailable === 0 && availablePapers === 0) {
      return false;
    }
  
    return false;
  }
  

}

function getSumElements(obj: { [x: string]: { [x: string]: any; }; }, field: string | number) {
  //// // console.log(obj);
  var total = 0;
  for (var i in obj) {
    total += Number(obj[i][field]);
  }
  return total;
}