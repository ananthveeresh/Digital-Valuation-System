import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { analysisAPI, nodeapi } from 'src/environments/environment.development';

interface Section {
  id: number;
  section_name: string;
  course_id: number;
  course_name: string;
}

interface Student {
  id: number;
  name: string;
  student_no: string;
  section_name: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentBarcodeService {

  constructor(private http: HttpClient) { }

  getinst(): Observable<any> {
    return this.http.get<any>(`${analysisAPI}/master/institute`);
  }

  getcampus(id: any): Observable<any> {
    return this.http.get<any>(`${analysisAPI}/master/campus?inst=`+id);
  }

  getSections(year: any, campus: any): Observable<Section[]> {
    return this.http.get<Section[]>(`${nodeapi}/exammaster/analysissection/` + year + `/` + campus);
  }

  getStudents(obj: any): Observable<Student[]> {
    return this.http.post<Student[]>(`${nodeapi}/exammaster/getsectionwisestudentslist`, obj);
  }
  
  get_courses(id: any): Observable<any> {
    return this.http.get<any>(`${analysisAPI}/master/course?campus=`+id+`&year=21`);
  }
  
  get_course_barcode(obj: any): Observable<any> {
    return this.http.post<any>(`${nodeapi}/exammaster/getcoursewisestudentslist`, obj);
  }

}
