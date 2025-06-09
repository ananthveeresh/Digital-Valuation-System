import { Component } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { CreateFacultyService } from 'src/app/core/services/createfac.service';
@Component({
  selector: 'app-createfaculty',
  templateUrl: './createfaculty.component.html',
  styleUrls: ['./createfaculty.component.css']
})
export class CreatefacultyComponent {
  public CreateFaculty:FormGroup;

  public logininfo : any=[];  
  GetBranch:string = '';
  GetSub:string = '';
  GetList:any[] = [];
  filtered: any[] = [];
  campus_data:any[] = [];
  FacData:any[] = [];
  ShowFac:number = 0;
  facuty_type:string = 'Valuer';

  constructor(public fb: FormBuilder, public _CreateFacultyService: CreateFacultyService){
    this.CreateFaculty = this.fb.group({
      facultyName: ['', [Validators.required]],
      facultyEmail: ['', [Validators.required, Validators.email]],
      facultyMobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      facultyBranch: ['', [Validators.required]],
      facultyPayCode: ['', [ Validators.required, 
        Validators.minLength(7), 
        Validators.maxLength(7)]],
      facultySubject: ['', [Validators.required]],
      facultytype: ['', [Validators.required]]
    })
  }

  ngOnInit(){
    
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)
    // // // // console.log( this.logininfo)
    this._CreateFacultyService.get_campus().subscribe(camp =>{
      // // // // console.log( camp)
      this.campus_data = [];
      for(var i=0; i<this.logininfo.UserCampus.length; i++){
        var temp = camp.filter((e: { campus_id: any; })=> e.campus_id == this.logininfo.UserCampus[i].campus_id)
        if(temp.length>0){
          this.campus_data.push(temp[0])
        }
      }
      // // // // console.log( this.campus_data)
    })
  
  }

  getsubjectlist(){
    this._CreateFacultyService.get_exammasterlist(this.CreateFaculty.value.facultyBranch).subscribe(data => {
      this.GetList = data
     
    })

  }
  FacultyCreate(){    
    this.ShowFac = 0  
   var obj = {
    "paycode" : this.CreateFaculty.value.facultyPayCode ? this.CreateFaculty.value.facultyPayCode : this.CreateFaculty.value.facultyMobile,
    "subject" : this.CreateFaculty.value.facultySubject,
    "facultyName" :this.CreateFaculty.value.facultyName,
    "branch" : this.CreateFaculty.value.facultyBranch.trim().replace(/\s+/g, ''),
    "mobile" : this.CreateFaculty.value.facultyMobile,
    "email" : this.CreateFaculty.value.facultyEmail,
    "emptype" : this.CreateFaculty.value.facultytype
}
// // // // console.log( obj)
this._CreateFacultyService.create_faculty(obj).subscribe(data => {
  alert("Faculty Created Successfully..!")
  location.reload();
})
  }
  isDisabled():boolean{
    return this.GetBranch.length === 0

  }
  GetFacultyList(){
    this.ShowFac = 1
    var obj = {
        "campus": this.GetBranch,
        "emptype": this.facuty_type,
    }
    // // // // console.log( obj)
    this._CreateFacultyService.get_CreatedFacultyList(obj).subscribe(data => {
      this.FacData = data;
    })
  }

  GetFaculityList(){
    this.ShowFac = 1
  }
  RemoveFaculty(Data:any) {
    
    this._CreateFacultyService.RemoveFaculty(Data._id).subscribe(data => {
      alert("Faculty Removed Successfully..!")
      location.reload();
    })
  }
  GetFacultyCreation(){
    this.ShowFac = 0
  }
}
