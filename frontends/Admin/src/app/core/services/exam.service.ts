import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { nodeapi, analysisAPI, kafkaapi } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class ExamService {

  constructor(private readonly _http: HttpClient, private readonly _router: Router) { }

  create_exam(obj: any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/exammaster/create/`, obj);
  }
  Get_Overall_Campuses(): Observable<any> {
    return this._http.get<any>(`${nodeapi}/campusmaster/list`);
  }

  get_examlist(): Observable<any> {
    return this._http.get<any>(`${nodeapi}/exammaster/list/`);
  }


  get_exam_list_byID(id: any): Observable<any> {
    return this._http.get<any>(`${nodeapi}/exammaster/getbyid/` +id);
  }


  get_institute(): Observable<any> {
    return this._http.get<any>(`${analysisAPI}/master/institute`);
  }
  
  get_inst_by_ID(id: any): Observable<any> {
    return this._http.get<any>(`${analysisAPI}/master/institute?id=` + id);
  }

  get_campus(id: any): Observable<any> {
    return this._http.get<any>(`${analysisAPI}/master/campus?inst=` + id);
  }
  
  add_campus(obj: any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/exammaster/addcampus`, obj);
  }

  add_subject(obj: any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/exammaster/addsubjectmodel`, obj);
  }
  get_exammasterlist(): Observable<any> {
    return this._http.get<any>(`${nodeapi}/exammaster/list`);
  }
  GetPaperlistById(id: any): Observable<any> {
    return this._http.get<any>(`${nodeapi}/answerpapers/sheetinfo/` +id);
  }
  Get_ExamId(obj: any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/exammaster/digitexamsubjects`, obj);
  }
  faculitylist(obj: any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/faculty/facultylist`, obj);
  }
  MapFaculty(obj: any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/exammaster/create`, obj);
  }
  PostKafka(obj: any): Observable<any> {
    return this._http.post<any>(`${kafkaapi}/producer/digival-subject-papercode-map`, obj);
  }
  UpdateFaculty(obj: any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/exammaster/facultyupdate`, obj);
  }
  UpdatePaperCode(Id:any, obj: any): Observable<any> {
    // // // console.log( `${nodeapi}/exammaster/facultyupdate/${Id}`)
    return this._http.post<any>(`${nodeapi}/exammaster/update/${Id}`, obj);
  }
  

}
