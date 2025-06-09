import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Router } from '@angular/router'
import { studentApi, digivalapi } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  constructor(private readonly _http: HttpClient, private readonly _router: Router) { }

  // ************************ Login Api ****************** 
  post_login(obj: any): Observable<any> {
    return this._http.post<any>(`${studentApi}/student/login`, obj)
  }

  get_profile_data(suc: any): Observable<string> {
    return this._http.get<string>(`${digivalapi}/studentreg/getbyid/` + suc);
  }

  logout(): void {
    localStorage.clear();
    window.location.href = "/login";
  }




}