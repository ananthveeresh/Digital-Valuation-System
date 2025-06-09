import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { nodeapi, analysisAPI, kafkaapi } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class CreateFacultyService {

  constructor(private readonly _http: HttpClient, private readonly _router: Router) { }
  get_campus(): Observable<any> {
    return this._http.get<any>(`${nodeapi}/campusmaster/list`);
  }
  create_faculty(obj: any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/faculty/create`, obj);
  }

  get_CreatedFacultyList(obj:any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/faculty/campuslist/`, obj);
  }

  get_exam_list_byID(id: any): Observable<any> {
    return this._http.get<any>(`${nodeapi}/exammaster/getbyid/` +id);
  }
  get_exammasterlist(campus:any): Observable<any> {
    return this._http.get<any>(`${nodeapi}/exammaster/campussubjects/`+campus);
  }
  RemoveFaculty(_id:any): Observable<any> {
    return this._http.get<any>(`${nodeapi}faculty/delete/` +_id);
  }


 }