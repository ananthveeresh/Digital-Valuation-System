import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, Observer } from 'rxjs'
import { Router } from '@angular/router'
import { nodeapi } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  constructor(private readonly _http: HttpClient, private readonly _router: Router) { }


  // ************************ Login Api ****************** 
  post_login(obj: any): Observable<any> {
    return this._http.post<any>(`${nodeapi}/adminusers/checkuser`, obj)
  }

  

  logout(stddata: any): void {

    const videoPlayMongo =
    {
      "userId": stddata.stdSuc,
      "eventCategory": 'Logout',
      "eventDetails": stddata,
      "title1": "Logout",
      "result": "Logout"
    }
   
    localStorage.clear();
    //window.location.href = "https://abhyas.ai/beta/#/login";
  }


  getIpAddress(): Observable<any> {
    return this._http.get('https://api64.ipify.org?format=json');
  }

  getCurrentLocation(): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position: any) => {
            observer.next(position);
            observer.complete();
          },
          (error: any) => observer.error(error),
          { timeout: 10000, maximumAge: 60000 } // Set timeout to 10 seconds and maximumAge to 1 minute
        );
      } else {
        observer.error('Geolocation is not supported by your browser.');
      }
    });
  }
  

}
