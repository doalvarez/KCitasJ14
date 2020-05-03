import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from  '@angular/common/http'
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Employee } from '../model/Employee';
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class IdentificateService {

  private currentEmployeeSubject: BehaviorSubject<Employee>;
  public currentEmployee: Observable<Employee>;

   constructor(private http:HttpClient) { 
    this.currentEmployeeSubject = new BehaviorSubject<Employee>(JSON.parse(sessionStorage.getItem('currentEmployee')));
    this.currentEmployee = this.currentEmployeeSubject.asObservable();
   }

   getTrabajador( employee:Employee ){

      let body = JSON.stringify(employee);
      let headers = new HttpHeaders(
          { 'Content-Type':'application/json',
          'Access-Control-Allow-Origin':'*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS, GET'
          }
      ); 
      // return this.http.post(this.url+"identificate",body, { headers:headers } ).pipe
      return this.http.post<any>(`${environment.rootUrl}/KC-CitasWeb/identificate`,body, { headers:headers } ).pipe
        (map( res=>{
          return res;
        })) 

   }


   setStorageEmployee(employee:Employee){
    localStorage.setItem('currentEmployee',JSON.stringify(employee));
    this.currentEmployeeSubject.next(employee);
   }


   logout(){
     localStorage.removeItem('currentEmployee');
     this.currentEmployeeSubject.next(null);
   }

}
