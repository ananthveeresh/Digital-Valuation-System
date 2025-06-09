import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { nodeapi } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class QuestionschemaService {

  constructor(private readonly _http: HttpClient, private readonly _router: Router) { }

  create_qschema(obj: any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/questionmodel/create/`, obj);
  }

  get_qschema(): Observable<any> {
    return this._http.get<any>(`${nodeapi}/questionmodel/list/`);
  }

  delete_qschema(id: any): Observable<any> {
    return this._http.delete<any>(`${nodeapi}/questionmodel/delete/`+id);
  }
}
