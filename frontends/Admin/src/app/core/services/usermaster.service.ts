import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { nodeapi, analysisAPI, kafkaapi } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class UsermasterService {

  constructor(private readonly _http: HttpClient, private readonly _router: Router) { }

  get_users_list(): Observable<any> {
    return this._http.get<any>(`${nodeapi}/adminusers/list`);
  }
  
  create_user(obj: any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/adminusers/create`, obj);
  }
  
  update_user(id:any, obj: any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/adminusers/update/`+id, obj);
  }

  delete_user(id:any): Observable<any> {
    return this._http.delete<any>(`${nodeapi}/adminusers/delete/`+id);
  }

  get_results(obj:any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/answerpapers/studentresult`, obj);
  }
}
