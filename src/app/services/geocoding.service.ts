import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeocodingApiService {

  API_KEY: string;
  API_URL: string;


  constructor(private http: HttpClient) {
    this.API_KEY = 'AIzaSyB7fkk6CsN5M9bX7uzMtUHx3kIPI1sl6XY'
    this.API_URL = `https://maps.googleapis.com/maps/api/geocode/json?key=${this.API_KEY}&address=`;
  }


  findFromAddress(address: string): Observable<any> {

    let addressURL= encodeURIComponent(address);
    console.log(addressURL);
    let url = `${this.API_URL}${addressURL}`;
    return this.http.get(url).pipe(
      map(response => <any> response)
    )
  }
}
