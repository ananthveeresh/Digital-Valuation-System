import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { analysisapi, digivalapi } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private readonly _http: HttpClient, private readonly _router: Router) { }

  studentprofile(suc: any): Observable<any> {
    return this._http.get<any>(`${analysisapi}/student/studentprofile/${suc}`)
  }
  studentmaincourse(id: any): Observable<any> {
    return this._http.get<any>(`${analysisapi}/master/maincourse?inst_id=` + id)
  }

  student_reg_create(body: any): Observable<any> {
    return this._http.post<any>(`${digivalapi}/studentreg/create`, body);
  }

  uploadFileToUrl(file: File, uploadUrl: string, uploadPath: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', uploadPath);

    return this._http.post(uploadUrl, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Upload failed:', error);
        return throwError(() => new Error('Upload failed'));
      })
    );
  }
}
