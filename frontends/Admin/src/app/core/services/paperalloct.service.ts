import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { nodeapi, analysisAPI, kafkaapi } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class PaperAlloctmentService {
  someMethod() {
    throw new Error('Method not implemented.');
  }

  constructor(private readonly _http: HttpClient, private readonly _router: Router) { }

  get_CreatedFacultyList(obj:any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/faculty/campuslist/`, obj);
  }
  get_sem_list(): Observable<any> {
    return this._http.get<any>(`${nodeapi}/semister/list`)
  }
  create_exam(obj: any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/exammaster/create/`, obj);
  }

  get_examlist(): Observable<any> {
    return this._http.get<any>(`${nodeapi}/exammaster/examslist/`);
  }

  GetPaperlistById(obj: any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/answerpapers/sheetinfo/` ,obj);
  }
  GetFacultylistById(obj: any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/answerpapers/sheetinfofaculty/`,obj);
  }
  
  SubjectFaculty(obj: any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/exammaster/subjectfaculty`, obj);
  }

  get_institute(): Observable<any> {
    return this._http.get<any>(`${analysisAPI}/master/institute`);
  }
  
  get_inst_by_ID(id: any): Observable<any> {
    return this._http.get<any>(`${analysisAPI}/master/institute?id=` + id);
  }

  get_campus(id: any): Observable<any> {
    return this._http.get<any>(`${analysisAPI}/master/campus?inst=` + id);
  }
  
  add_campus(obj: any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/exammaster/addcampus`, obj);
  }

  add_subject(obj: any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/exammaster/addsubjectmodel`, obj);
  }
  get_exammasterlist(): Observable<any> {
    return this._http.get<any>(`${analysisAPI}/exammaster/list`);
  }
  Get_ExamId(obj: any): Observable<any> {
    return this._http.post<any>(`${analysisAPI}/exams/digitexamsubjects`, obj);
  }
  faculitylist(obj: any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/faculty/list`, obj);
  }
  MapFaculty(obj: any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/exammaster/create`, obj);
  }
  PostKafka(obj: any): Observable<any> {
    return this._http.post<any>(`${kafkaapi}/producer/digival-subject-papercode-map`, obj);
  }
  PostKafkaalotment(obj: any): Observable<any> {
    return this._http.post<any>(`${kafkaapi}/producer/digival-paper-allotment`, obj);
  }
  Postalocatedfaculty(obj: any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/answerpapers/paperallotment`, obj);
  }
  GetAlocatedPapers(obj: any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/answerpapers/paperallotedinfo`, obj);
  }
  GetStdMarks(obj: any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/answerpapers/subjectmarks`, obj);
  }
  unallocate_papers(obj: any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/answerpapers/unallotment`, obj);
  }
  Postscrutinyfaculty(obj: any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/answerpapers/scrutinyallotment`, obj);
  }
  GetScrutinyPapers(obj: any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/answerpapers/scrutinyallotmentinfo`, obj);
  }
  unallocate_scrutiny_papers(obj: any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/answerpapers/scrutinyunallotment`, obj);
  }
}
