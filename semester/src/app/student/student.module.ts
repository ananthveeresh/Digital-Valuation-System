import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { MenuComponent } from './menu/menu.component';
import { ScreensComponent } from './screens/screens.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { CapitalizePipe } from 'src/app/utilities/capitalize.pipe';
import { SemesterComponent } from './screens/semester/semester.component';
import { RegistrationComponent } from './screens/registration/registration.component';
import { PayfeeComponent } from './screens/payfee/payfee.component';
import { SuccessComponent } from './screens/success/success.component';
import { PreviewComponent } from './screens/preview/preview.component';
import { CreateinvoiceComponent } from './screens/createinvoice/createinvoice.component';
import { DownloadhallticketComponent } from './screens/downloadhallticket/downloadhallticket.component';

@NgModule({
  declarations: [
    MenuComponent,
    ScreensComponent,
    CapitalizePipe,
       SemesterComponent,
       RegistrationComponent,
       PayfeeComponent,
       SuccessComponent,
       PreviewComponent,
       CreateinvoiceComponent,
       DownloadhallticketComponent,
   
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class StudentModule { }
