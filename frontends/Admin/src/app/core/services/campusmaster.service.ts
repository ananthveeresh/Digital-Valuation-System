import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { nodeapi, analysisAPI, kafkaapi } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class CampusmasterService {

  constructor(private readonly _http: HttpClient, private readonly _router: Router) { }

  get_campus_list(): Observable<any> {
    return this._http.get<any>(`${nodeapi}/campusmaster/list`);
  }
  get_results(obj:any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/answerpapers/studentresult`, obj);
  }
}
