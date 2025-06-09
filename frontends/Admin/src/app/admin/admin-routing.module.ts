import { BarcodehubComponent } from './screens/barcodehub/barcodehub.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankpageComponent } from './screens/blankpage/blankpage.component';
import { DashboardComponent } from './screens/dashboard/dashboard.component';
import { adminScreensComponent } from './screens/screens.component';
import { StudentBarcodeComponent } from './screens/studentbarcode/studentbarcode.component';
import { QuestionschemaComponent } from './screens/questionschema/questionschema.component';
import { ExamcreateComponent } from './screens/examcreate/examcreate.component';
import { ExamlistComponent } from './screens/examlist/examlist.component';
import { ExameditComponent } from './screens/examedit/examedit.component';
import { CampusinfoComponent } from './screens/campusinfo/campusinfo.component';
import { SubjectinfoComponent } from './screens/subjectinfo/subjectinfo.component';
import { UploadinfoComponent } from './screens/uploadinfo/uploadinfo.component';
import { SubjectlistComponent } from './screens/subjectlist/subjectlist.component';
import { CreateexamComponent } from './screens/createexam/createexam.component';
import { PaperallotmentComponent } from './screens/paperallotment/paperallotment.component';
import { ReportComponent } from './screens/report/report.component';
import { CreatefacultyComponent } from './screens/createfaculty/createfaculty.component';
import { StudentreportComponent } from './screens/studentreport/studentreport.component';
import { SectionreportComponent } from './screens/sectionreport/sectionreport.component';
import { CreatesemComponent } from './screens/createsem/createsem.component';
import { RegstudentsComponent } from './screens/regstudents/regstudents.component';
import { EditstddetailsComponent } from './screens/editstddetails/editstddetails.component';
import { DownloadhallticketComponent } from './screens/downloadhallticket/downloadhallticket.component';
import { FeeConcessionComponent } from './screens/fee-concession/fee-concession.component';
import { UsermasterComponent } from './screens/usermaster/usermaster.component';
import { CampusmasterComponent } from './screens/campusmaster/campusmaster.component';
import { Sem2Component } from './screens/sem2/sem2.component';
const routes: Routes = [
  {
    path:'',
    component: adminScreensComponent,
    children:[
      {
        path:'',
        component: DashboardComponent
      },
      {
        path:'dashboard',
        component: DashboardComponent
      },
      {
        path:'blankpage',
        component: BlankpageComponent
      },
      {
        path:'Studentbarcode',
        component: StudentBarcodeComponent
      },
      {
        path:'barcodehub/:id',
        component: BarcodehubComponent
      },
      // {
      //   path:'qschema',
      //   component: QuestionschemaComponent
      // },
      {
        path:'examcreate',
        component: ExamcreateComponent
      },
      {
        path:'examlist',
        component: ExamlistComponent
      },
      {
        path:'examedit',
        component: ExameditComponent
      },
      {
        path:'campusinfo',
        component: CampusinfoComponent
      },
      {
        path:'subjectinfo',
        component: SubjectinfoComponent
      },
      {
        path:'uploadinfo',
        component: UploadinfoComponent
      },
      {
        path:'create',
        component:CreateexamComponent
      },
      {
        path:'subjectlist',
        component:SubjectlistComponent
        
      },{
        path:'paperallotment',
        component: PaperallotmentComponent
      },{
        path:'report',
        component:ReportComponent
      },{
        path:'facultycreate',
        component:CreatefacultyComponent
      },
      {
        path:'stdreport',
        component:StudentreportComponent
      }, {
        path:'secreport',
        component: SectionreportComponent
      },
      {
        path:'createSem',
        component: CreatesemComponent
      }, {
        path:'regStud',
        component: RegstudentsComponent
      },
      {
        path:'edit',
        component: EditstddetailsComponent
      },
      {
        path:'hallticket',
        component:DownloadhallticketComponent
      },
      {
        path:'fee',
        component: FeeConcessionComponent
      },
      {
        path:'usermaster',
        component: UsermasterComponent
      },
      {
        path:'campusmaster',
        component: CampusmasterComponent
      },
      {
        path:'sem2',
        component: Sem2Component
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
