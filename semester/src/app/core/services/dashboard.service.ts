import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Router } from '@angular/router'
// import {  NodeAPI,PythonAPI } from 'src/environments/environment.development';
 
@Injectable({
  providedIn: 'root'
})

export class DashboardService {

  constructor(private readonly _http: HttpClient, private readonly _router: Router) { }
 
  // get_laguages(): Observable<any> { 
  //   return this._http.get<any>(`${NodeAPI}/language/list`) 
  // }

  // get_paperList(suc: any): Observable<any> { 
   
  //   return this._http.get<any>(`https://apis.aditya.ac.in/zoom/v23/api/vg/studetgroup/studentinfo/`+suc) 
  // }

  // get_schedule(obj: any): Observable<any> { 
  //   return this._http.post<any>(`${NodeAPI}/exams/examslist`, obj)  
  // }


  // get_wetresult(obj: any): Observable<any> { 
  //   // return this._http.get<any>(`http://10.30.1.21:8010/v2/check?language=en-US&level=picky&text=`+obj)  
  //   return this._http.get<any>(`https://abhyas.ai/wet/api/check?language=en-US&text=`+obj)  
  // }
  // Get_Ques(): Observable<any> { 
  //   return this._http.get<any>(NodeAPI+`/question/list`)
  // }

  // Get_QuesInfo(qid:any): Observable<any> { 
  //   return this._http.get<any>(NodeAPI+`/question/getinfo/`+qid)
  // }
  // Get_ResultInfo(qid:any): Observable<any> { 
  //   return this._http.get<any>(NodeAPI+`/question/getinfo/`+qid)
  // }
  // Get_Similarity(obj: any): Observable<any> { 
  //   // return this._http.post<any>(`http://10.70.3.216:8002/similarity`, obj)  
  //    return this._http.post<any>(`${PythonAPI}/similarity`, obj)  
  // }

  // submit_anwser(obj: any): Observable<any> { 
  //   return this._http.post<any>(`${NodeAPI}/studentresult/create`, obj)  
  // }
  // Get_QueIds(suc:string): Observable<any> { 
  //   return this._http.get<any>(`${NodeAPI}/studentresult/completequestions/`+suc)
  // }
  // Get_result(qid:any, suc:any): Observable<any> { 
  //   return this._http.get<any>(`${NodeAPI}/studentresult/getinfo/`+suc+`/`+qid)
  // }
}