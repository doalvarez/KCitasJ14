import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-sinservicio',
  templateUrl: './sinservicio.component.html',
  styles: []
})
export class SinservicioComponent implements OnInit {

  url = `${environment.rootUrl}/KC-GestionWeb/`;

    loading:boolean;
    error: boolean;

  constructor( @Inject(DOCUMENT) private document: any) {


    }

  ngOnInit() {

  }


  home(){
    console.log('home')
     this.document.location.href =  this.url;
  }
}
