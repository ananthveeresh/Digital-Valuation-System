import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { nodeapi, analysisAPI, financeapi, newdigiapi } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class SemisterService {

  constructor(private readonly _http: HttpClient, private readonly _router: Router) { }
  Get_Campus(): Observable<any> {
    return this._http.get<any>(`${analysisAPI}/master/campus?inst=3`)
  }
  get_list_by_campus(campus: any): Observable<string> {
    return this._http.get<string>(`${nodeapi}/semister/campusexam/` + campus);
  }
  get_profile_data(suc: any): Observable<string> {
    return this._http.get<string>(`${nodeapi}/studentreg/getbyid/` + suc);
  }

  create_exam(obj: any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/semister/create/`, obj);
  }


  Get_ExamId(obj: any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/exammaster/digitexamsubjects`, obj);
  }

  get_sem_student(): Observable<any> {
    return this._http.get<any>(`${nodeapi}/studentreg/list`)
  }
  get_sem_list(): Observable<any> {
    return this._http.get<any>(`${nodeapi}/semister/list`)
  }


  Update_Std_Details(Id: any, obj: any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/studentreg/update/` + Id, obj)
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
  VerifyStdAttendance(obj: any): Observable<string> {
    return this._http.post<string>(`${financeapi}/attendance/report`, obj);
  }
  downloadtracker(obj: any): Observable<string> {
    return this._http.post<string>(`${nodeapi}/downloadtracking/create`, obj);
  }

  getboardId(id: any): Observable<string> {
    return this._http.get<string>(`${nodeapi}/exammaster/studentgetboardid/` + id);
  }
  get_semSubjects(obj: any): Observable<string> {
    return this._http.post<string>(`${nodeapi}/exammaster/examsschoolhallticket`, obj);
  }
  Fee_Permission(obj: any): Observable<string> {
    return this._http.post<string>(`${nodeapi}/permissioninfo/create`, obj);
  }
  Fee_Permission_StdData(obj: any): Observable<string> {
    return this._http.post<string>(`${nodeapi}/permissioninfo/studentdata`, obj);
  }

  std_sem2(): Observable<any> {
    return this._http.get<any>(`${nodeapi}/studentreg/secondsempaid`)
  }
  
  get_exam_sublist(obj: any): Observable<string> {
    return this._http.post<string>(`${newdigiapi}/examstudents/examhallticket`, obj);
  }
  
  exam_hallticket(id: any): Observable<string> {
    return this._http.get<string>(`${newdigiapi}/examstudents/gethallticketlist/`+id);
  }
}
