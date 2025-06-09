import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { analysisapi, digivalapi, paymentapi, financeapi, newdigiapi } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SemesterService {
  constructor(private _http: HttpClient) { }

  get_list(campus: string): Observable<string> {
    return this._http.get<string>(`${digivalapi}/semister/campusexam/` + campus);
  }
  get_list_by_campus(campus: any): Observable<string> {
    return this._http.get<string>(`${digivalapi}/semister/campusexam/` + campus);
  }

  registeration_check(suc: any): Observable<string> {
    return this._http.get<string>(`${digivalapi}/studentreg/getbyid/` + suc);
  }

  get_std_profile(suc: any): Observable<string> {
    return this._http.get<any>(`${analysisapi}/student/studentprofile/` + suc)
  }

  check_due(obj: any): Observable<string> {
    return this._http.post<string>(`${analysisapi}/finance/checkstudentdue`, obj);
  }

  check_exam_due(obj: any): Observable<string> {
    return this._http.post<string>(`${analysisapi}/finance/checkexamdue`, obj);
  }

  exam_history(obj: any): Observable<string> {
    return this._http.post<string>(`${analysisapi}/finance/exampaidhistory`, obj);
  }

  pay_exam_fee(obj: any): Observable<string> {
    return this._http.post<string>(`${paymentapi}/paymenticici/icicipaymentnow`, obj);
  }

  get_profile_data(suc: any): Observable<string> {
    return this._http.get<string>(`${digivalapi}/studentreg/getbyid/` + suc);
  }

  post_payment(obj: any): Observable<string> {
    return this._http.post<string>(`${paymentapi}/paymenticici/verifydata`, obj);
  }

  post_invoice(obj: any): Observable<string> {
    return this._http.post<string>(`${financeapi}/finance/feepayment`, obj);
  }

  payment_update(obj: any): Observable<string> {
    return this._http.post<string>(`${digivalapi}/studentreg/updatePaymentInfo`, obj);
  }

  get_semSubjects(obj: any): Observable<string> {
    return this._http.post<string>(`${analysisapi}/exams/schoolhallticket`, obj);
  }

  VerifyStdAttendance(obj: any): Observable<string> {
    return this._http.post<string>(`${financeapi}/attendance/report`, obj);
  }

  downloadtracker(obj: any): Observable<string> {
    return this._http.post<string>(`${digivalapi}/downloadtracking/create`, obj);
  }

  getboardId(id: any): Observable<string> {
    return this._http.get<string>(`${analysisapi}/student/getboardid/` + id);
  }

  get_result(id: any): Observable<string> {
    return this._http.get<string>(`${analysisapi}/marksmemo/studentexams/` + id);
  }
  
  get_clg_info(id: any): Observable<string> {
    return this._http.get<string>(`${analysisapi}/student/studentprofile/` + id);
  }
  
  get_std_sectioninfo(id: any): Observable<string> {
    return this._http.get<string>(`${analysisapi}/student/getstudent/` + id);
  }
  
  get_exam_sublist(obj: any): Observable<string> {
    return this._http.post<string>(`${newdigiapi}/examstudents/examhallticket`, obj);
  }
  
  exam_hallticket(id: any): Observable<string> {
    return this._http.get<string>(`${newdigiapi}/examstudents/gethallticketlist/`+id);
  }
}
