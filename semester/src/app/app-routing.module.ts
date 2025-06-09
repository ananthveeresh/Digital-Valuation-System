import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { LoginComponent } from './login/login.component';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component'; 
import { StudentModule } from './student/student.module';

const routes: Routes = [
  {
    path:'forgetpassword',
    component:ForgetpasswordComponent
  },
  {
    path:'student',
    loadChildren: () => import('./student/student.module').then(module => module.StudentModule),
    canActivate : [AuthGuard]
  },
  {
    path:'',component:LoginComponent
  },
  {
    path:'login',component:LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),FormsModule, ReactiveFormsModule, HttpClientModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [ StudentModule  ]
