import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsermasterService } from 'src/app/core/services/usermaster.service';
import { CampusmasterService } from 'src/app/core/services/campusmaster.service';

@Component({
  selector: 'app-usermaster',
  templateUrl: './usermaster.component.html',
  styleUrls: ['./usermaster.component.css']
})
export class UsermasterComponent {

  public logininfo: any = [];
  public users_list: any = [];
  public campus_list: any = [];
  public selected_user: any;
  public show_edit = 0;
  public updated_campus: any[] = [];

  public selected_campus: any = [];

  public create_user_form: FormGroup;
  public update_user_form: FormGroup;

  constructor(public fb: FormBuilder, private _UsermasterService: UsermasterService, private _CampusmasterService: CampusmasterService) {

    this.create_user_form = this.fb.group({
      FullName: ['', [Validators.required]],
      UserName: ['', [Validators.required]],
      Password: ['', [Validators.required]],
      UserLevel: ['', [Validators.required]],
      UserCampus: ['', [Validators.required]]
    })

    this.update_user_form = this.fb.group({
      FullName: ['', [Validators.required]],
      UserName: ['', [Validators.required]],
      Password: ['', [Validators.required]],
      UserLevel: ['', [Validators.required]],
      UserCampus: ['', [Validators.required]]
    })
  }

  ngOnInit() {
    this.logininfo = localStorage.getItem('logindata');
    this.logininfo = JSON.parse(this.logininfo)
    // // // // console.log( this.logininfo)

    this._CampusmasterService.get_campus_list().subscribe(data => {
      // // // console.log(data)
      this.campus_list = data
    })

    this._UsermasterService.get_users_list().subscribe(data => {
      // // // console.log(data)
      this.users_list = data
    })
  }

  view_user(dt: any) {
    // // // console.log(dt)
    this.updated_campus = [];
    this.selected_user = dt;
  }

  new_user(){
    this.updated_campus = [];
    this.show_edit = 1;
  }

  edit_user(dt: any) {
    // // // console.log(dt)
    this.updated_campus = [];
    this.update_user_form.patchValue({
      FullName: dt.FullName,
      UserName: dt.UserName,
      Password: dt.Password,
      UserLevel: dt.UserLevel
    })
    
    this.campus_list.forEach((campus: { checked: any; campus_id: any; }) => {
      campus.checked = dt.UserCampus.some(
        (userCampus: any) => userCampus.campus_id === campus.campus_id
      );
    });
    // // // console.log(this.updated_campus)
    // // // console.log(dt.UserCampus)
    this.updated_campus = dt.UserCampus
    this.check_updt_cmp()
    this.selected_user = dt;
    this.show_edit = 2;
    // // // console.log(this.update_user_form.value)
  }

  Create_user() {
    // // // console.log(this.create_user_form.value)
    // // // console.log(this.selected_campus)
    var filtered_campuses: any = [];
    for (var i = 0; i < this.selected_campus.length; i++) {
      var obj = {
        "campus_id": this.selected_campus[i].campus_id,
        "campus_name": this.selected_campus[i].campus_name,
        "campus_shortcode": this.selected_campus[i].campus_shortcode
      }
      filtered_campuses.push(obj)
    }

    var post_obj = {
      "FullName": this.create_user_form.value.FullName,
      "UserName": this.create_user_form.value.UserName,
      "Password": this.create_user_form.value.Password,
      "UserLevel": this.create_user_form.value.UserLevel,
      "UserCampus": filtered_campuses
    }

    // // // console.log(post_obj)
    if(confirm("Are you sure, Do you want to submit..?")){
      this._UsermasterService.create_user(post_obj).subscribe(data => {
        // // // console.log(data)
        alert("User Created Successfully..!")
        location.reload();
      })
    }
  }

  Update_user() {
    // // // console.log(this.update_user_form.value)
    // // // console.log(this.updated_campus) var filtered_campuses: any = [];
    var upd_filtered_campuses: any = []
    for (var i = 0; i < this.updated_campus.length; i++) {
      var obj = {
        "campus_id": this.updated_campus[i].campus_id,
        "campus_name": this.updated_campus[i].campus_name,
        "campus_shortcode": this.updated_campus[i].campus_shortcode
      }
      upd_filtered_campuses.push(obj)
    }

    var upd_post_obj = {
      "FullName": this.update_user_form.value.FullName,
      "UserName": this.update_user_form.value.UserName,
      "Password": this.update_user_form.value.Password,
      "UserLevel": this.update_user_form.value.UserLevel,
      "UserCampus": upd_filtered_campuses
    }

    // // // console.log(upd_post_obj)
    if(confirm("Are you sure, Do you want to Update..?")){
      this._UsermasterService.update_user(this.selected_user._id, upd_post_obj).subscribe(data => {
        // // // console.log(data)
        alert("User Updated Successfully..!")
        location.reload();
      })
    }
  }

  delete_user(dt: any) {
    // // // console.log(dt)
    if (confirm("Are you sure, Do you want to DELETE..?")) {
      this._UsermasterService.delete_user(dt._id).subscribe(data => {
        // // // console.log(data)
        alert("User Deleted Successfully..!")
        location.reload();
      })
    }
  }

  cmp_selection(campus: any, event: any): void {
    campus.cmp_check = event.target.checked;
  
    if (campus.cmp_check) {
      if (!this.selected_campus.some((c: { _id: any; }) => c._id === campus._id)) {
        this.selected_campus.push(campus);
      }
    } else {
      this.selected_campus = this.selected_campus.filter(
        (c: { _id: any; }) => c._id !== campus._id
      );
    }
  }

  
  onCampusSelectionChange(campus: any, event: any) {
    if (event.target.checked) {
      this.updated_campus.push(campus);
    } else {
      this.updated_campus = this.updated_campus.filter(c => c.campus_id !== campus.campus_id);
    }
    this.check_updt_cmp()
  }
  
  check_updt_cmp(){
    // // // console.log(this.updated_campus.length)
    this.update_user_form.patchValue({
      UserCampus: this.updated_campus.length>0 ? true : false
    })
  }

  isCampusSelected(campus: any): boolean {
    return this.updated_campus.some((c: any) => c.campus_id === campus.campus_id);
  }
}
