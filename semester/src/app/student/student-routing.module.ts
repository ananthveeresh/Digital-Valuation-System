import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScreensComponent } from './screens/screens.component';
import { SemesterComponent } from './screens/semester/semester.component';
import { RegistrationComponent } from './screens/registration/registration.component';
import { PayfeeComponent } from './screens/payfee/payfee.component';
import { PreviewComponent } from './screens/preview/preview.component';
import { SuccessComponent } from './screens/success/success.component';
import { CreateinvoiceComponent } from './screens/createinvoice/createinvoice.component';
import { DownloadhallticketComponent } from './screens/downloadhallticket/downloadhallticket.component';


const routes: Routes = [
  {
    path:'',
    component: ScreensComponent,
    children:[
      {
        path:'',
        component: SemesterComponent
      },
      {
        path: 'semester',
        component: SemesterComponent
      },
      {
        path: 'registration/:rdm_id',
        component: RegistrationComponent
      },
      {
        path: 'payfee/:rdm_id',
        component: PayfeeComponent
      },  
                            
      {
        path: 'preview',
        component: PreviewComponent
      },      
     
      {
        path: 'success',
        component: SuccessComponent
      },      
                            
      {
        path: 'createinvoice/:id',
        component: CreateinvoiceComponent
      },  
      {
        path:'getHallticket',
        component: DownloadhallticketComponent
      }
      
     
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
