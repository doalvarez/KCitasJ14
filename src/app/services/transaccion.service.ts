import { Injectable } from '@angular/core';
import { HttpClient } from  '@angular/common/http'
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransaccionService {

  constructor(private http:HttpClient) { }

  getTransaccion( idKiosco:string, urlOperacion:string ){
    const urlTmp= `${environment.rootUrl}/KC-QuejasWeb/register/`+idKiosco+"/"+urlOperacion;
     return this.http.get(urlTmp).pipe
       (map( res=>{
         return res;
       }))
  }
}
