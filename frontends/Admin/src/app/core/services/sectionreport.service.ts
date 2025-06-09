import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { nodeapi, analysisAPI, kafkaapi } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class SectionReportService {

  constructor(private readonly _http: HttpClient, private readonly _router: Router) { }

  get_campus(): Observable<any> {
    return this._http.get<any>(`${nodeapi}/campusmaster/list`);
  }

  get_examlist(): Observable<any> {
    return this._http.get<any>(`${nodeapi}/exammaster/list/`);
  }
  get_sectionslist(examId:any,campus:any): Observable<any>{
    return this._http.get<any>(`https://apis.aditya.ac.in/digival/analysis/examsectionslist/${examId}/${campus}`);
  }
  get_sectionwise(obj:any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/answerpapers/sectionreport`, obj)
  }
  get_exammasterlist(): Observable<any> {
    return this._http.get<any>(`${nodeapi}/exammaster/list`);
  }
  get_results(obj:any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/answerpapers/studentresult`, obj);
  }
  DeletingSheet(obj:any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/answerpapers/deletesheet`, obj);
  }
}
