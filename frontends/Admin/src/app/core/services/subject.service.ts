import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { nodeapi, analysisAPI } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class SubjectService {

  constructor(private readonly _http: HttpClient, private readonly _router: Router) { }

  get_subjectmasterlist(): Observable<any> {
    return this._http.get<any>(`${nodeapi}/subjectmaster/list`);
  }

  get_subject_by_group(obj: any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/subjectmaster/getbygroup`, obj);
  }
  get_exam_subs(obj: any): Observable<any> {
    return this._http.post<any>(`${analysisAPI}/exams/getexamsectionsubjects`, obj);
  }

}