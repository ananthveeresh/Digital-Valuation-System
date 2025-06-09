import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { nodeapi, analysisAPI, kafkaapi } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class ExamResultService {

  constructor(private readonly _http: HttpClient, private readonly _router: Router) { }

  get_sem_list(): Observable<any> {
    return this._http.get<any>(`${nodeapi}/semister/list`)
  }

  get_examlist(): Observable<any> {
    return this._http.get<any>(`${nodeapi}/exammaster/list`);
  }
  get_exammasterlist(Id:any): Observable<any> {
    return this._http.get<any>(`${nodeapi}/exammaster/getbyid/` + Id);
  }
  get_results(obj:any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/answerpapers/studentresult`, obj);
  }
  DeletingSheet(obj:any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/answerpapers/deletesheet`, obj);
  }
  Get_ExamId(obj: any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/exammaster/digitexamsubjects`, obj);
  }
}
