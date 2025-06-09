import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { MenuComponent } from './menu/menu.component';
import { adminScreensComponent } from './screens/screens.component';
import { DashboardComponent } from './screens/dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { BlankpageComponent } from './screens/blankpage/blankpage.component';
import { StudentBarcodeComponent } from './screens/studentbarcode/studentbarcode.component';
import { BarcodehubComponent } from './screens/barcodehub/barcodehub.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuestionschemaComponent } from './screens/questionschema/questionschema.component';
import { ExamlistComponent } from './screens/examlist/examlist.component';
import { ExamcreateComponent } from './screens/examcreate/examcreate.component';
import { QuestionschemalistComponent } from './screens/questionschemalist/questionschemalist.component';
import { ExameditComponent } from './screens/examedit/examedit.component';
import { CampusinfoComponent } from './screens/campusinfo/campusinfo.component';
import { SubjectinfoComponent } from './screens/subjectinfo/subjectinfo.component';
import { UploadinfoComponent } from './screens/uploadinfo/uploadinfo.component';
import { BarcodenewComponent } from './screens/barcodenew/barcodenew.component';
import { CreateexamComponent } from './screens/createexam/createexam.component';
import { SubjectlistComponent } from './screens/subjectlist/subjectlist.component';
import { PaperallotmentComponent } from './screens/paperallotment/paperallotment.component';
import { ReportComponent } from './screens/report/report.component';
import { CreatefacultyComponent } from './screens/createfaculty/createfaculty.component';
import { StudentreportComponent } from './screens/studentreport/studentreport.component';
import { SectionreportComponent } from './screens/sectionreport/sectionreport.component';
import { CreatesemComponent } from './screens/createsem/createsem.component';
import { RegstudentsComponent } from './screens/regstudents/regstudents.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { EditstddetailsComponent } from './screens/editstddetails/editstddetails.component';
import { DownloadhallticketComponent } from './screens/downloadhallticket/downloadhallticket.component';
import { FeeConcessionComponent } from './screens/fee-concession/fee-concession.component';
import { UsermasterComponent } from './screens/usermaster/usermaster.component';
import { CampusmasterComponent } from './screens/campusmaster/campusmaster.component';
import { Sem2Component } from './screens/sem2/sem2.component';


@NgModule({
  declarations: [
    MenuComponent,
    adminScreensComponent,
    DashboardComponent,
    BlankpageComponent,
    StudentBarcodeComponent,
    BarcodehubComponent,
    QuestionschemaComponent,
    ExamlistComponent,
    ExamcreateComponent,
    QuestionschemalistComponent,
    ExameditComponent,
    CampusinfoComponent,
    SubjectinfoComponent,
    UploadinfoComponent,
    BarcodenewComponent,
    CreateexamComponent,
    SubjectlistComponent,
    PaperallotmentComponent,
    ReportComponent,
    CreatefacultyComponent,
    StudentreportComponent,
    SectionreportComponent,
    CreatesemComponent,
    RegstudentsComponent,
    EditstddetailsComponent,
    DownloadhallticketComponent,
    FeeConcessionComponent,
    UsermasterComponent,
    CampusmasterComponent,
    Sem2Component

  ],
  imports: [
    AdminRoutingModule,
    SharedModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule
    
  ]
})
export class AdminModule { }
