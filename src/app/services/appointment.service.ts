import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Appointment } from '../model/Appointment';
import { HttpClient,HttpHeaders } from  '@angular/common/http'
import { Employee } from '../model/Employee';
import { DatosCita } from '../interfaces/datosCita.interface';


@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private currentAppointmentSubject: BehaviorSubject<Appointment>;
  public currentAppointment: Observable<Appointment>;
  appointment: Appointment={};


  constructor(private  http:HttpClient) { 
    this.currentAppointmentSubject = new BehaviorSubject<Appointment>(JSON.parse(sessionStorage.getItem('currentAppointment')));
    this.currentAppointment = this.currentAppointmentSubject.asObservable();
  }



  public get currentAppointmentValue(): Appointment {
    return this.currentAppointmentSubject.value;
  }

  
  currentAppointmentSetValue(appointment:Appointment) {
    sessionStorage.setItem('currentAppointment', JSON.stringify(appointment));
    this.currentAppointmentSubject.next(appointment);
  }

  logout() {
    sessionStorage.removeItem('currentAppointment');
    sessionStorage.clear();
    this.currentAppointmentSubject.next(null);
  }

  getServicios( trabajador:Employee){

    let body = JSON.stringify(trabajador);
    let headers = new HttpHeaders(
      { 'Content-Type':'application/json'  }
    ); 
     return this.http.post<any>(`${environment.rootUrl}/KC-CitasWeb/datosContacto` ,body, { headers:headers } )
     .pipe (map( res=>{
         console.log(res);
         return res;
       }))
  }


  getEstados( appointment:Appointment ){
    let datosCitaTmp: DatosCita={};
    datosCitaTmp.idservice=appointment.idservice;
    let body = JSON.stringify(datosCitaTmp);
    console.log('Json de entrada:'+ body);
    let headers = new HttpHeaders(
      { 'Content-Type':'application/json'  }
    ); 
     return this.http.post<any>(`${environment.rootUrl}/KC-CitasWeb/comboEstados` ,body, { headers:headers }).pipe
       (map( res=>{
         console.log(res);
         return res;
       }))
  }


  getCesis( appointment:Appointment ){

    let datosCitaTmp: DatosCita={};
    datosCitaTmp.idservice=appointment.idservice;
    datosCitaTmp.idState=appointment.idState;
    datosCitaTmp.stateName=appointment.stateName;
    
    let body = JSON.stringify(datosCitaTmp);
    let headers = new HttpHeaders(
      { 'Content-Type':'application/json'  }
    ); 
    console.log('Json de entrada:'+ body);
     return this.http.post<any>(`${environment.rootUrl}/KC-CitasWeb/comboCesi`  ,body, { headers:headers }).pipe
       (map( res=>{
         console.log(res);
         return res;
       }))
  }


  getFechasDisponibles( appointment:Appointment ){
    
    let datosCitaTmp: DatosCita={};
    datosCitaTmp.idservice=appointment.idservice;
    datosCitaTmp.cesiId=appointment.cesiId;
    datosCitaTmp.consultedMonth=appointment.consultedMonth;

    let headers = new HttpHeaders(
      { 'Content-Type':'application/json'  }
    ); 

  
    let body = JSON.stringify(datosCitaTmp);
    console.log('Json de entrada:'+ body);

     return this.http.post<any>(`${environment.rootUrl}/KC-CitasWeb/citasDisponibles` ,body, { headers:headers }).pipe
       (map( res=>{
         console.log(res);
         return res;
       }))
  }

  getHorariosDisponibles( serviceId:string, cesiId:string, diaSeleccionado:Date){
    this.appointment.idservice=serviceId;
    this.appointment.cesiId=cesiId;
    this.appointment.appointmentDay=diaSeleccionado;
    console.log(this.appointment);


    // let url:string = this.url+"citasHorariosDisponibles";
    let body = JSON.stringify( this.appointment);
    console.log('Json de entrada:'+ body);
    let headers = new HttpHeaders(
      { 'Content-Type':'application/json'  }
    ); 
     // return this.http.post<any>(url ,body, { headers:headers }).pipe
     return this.http.post<any>(`${environment.rootUrl}/KC-CitasWeb/citasHorariosDisponibles` ,body, { headers:headers }).pipe
       (map( res=>{
         console.log(res);
         return res;
       }))
  }

  getAgendarCita( appointment:Appointment ,currentEmployee: Employee){

    let datosCitaTmp: DatosCita={};

    datosCitaTmp.nss=currentEmployee.nss
    datosCitaTmp.idservice=appointment.idservice;
    datosCitaTmp.cesiId=appointment.cesiId;
    datosCitaTmp.appointmentDay=appointment.appointmentDay
    datosCitaTmp.appointmentHour=appointment.appointmentHour

    datosCitaTmp.name=currentEmployee.nombre;
    datosCitaTmp.lastName=currentEmployee.apellidoMaterno + ' ' +currentEmployee.apellidoPaterno;
    datosCitaTmp.mail=currentEmployee.correo;
    datosCitaTmp.movilePhone=currentEmployee.celular;
    datosCitaTmp.phone=currentEmployee.telefono;

    let body = JSON.stringify(datosCitaTmp);
    console.log('Json de entrada:'+ body);
    let headers = new HttpHeaders(
      { 'Content-Type':'application/json'  }
    ); 
     return this.http.post<any>(`${environment.rootUrl}/KC-CitasWeb/agendarCitaSeleccionada` ,body, { headers:headers }).pipe
       (map( res=>{
         console.log(res);
         return res;
       }))
  }

  getConfirmaCita( appointment:Appointment, datosCita: DatosCita , employee: Employee){

    //ingresar ek resto de los seteos
    datosCita.cesiLocation=appointment.cesiLocation
    datosCita.name=employee.nombre;
    datosCita.lastName=employee.apellidoMaterno + ' ' +employee.apellidoPaterno;
    datosCita.mail=employee.correo;
    datosCita.movilePhone=employee.celular;
    datosCita.phone=employee.telefono;
    datosCita.idservice=appointment.idservice;
    datosCita.cesiId=appointment.cesiId;
    datosCita.appointmentDay=appointment.appointmentDay
    datosCita.appointmentHour=appointment.appointmentHour
    
    let body = JSON.stringify( datosCita);
    console.log('Json de entrada:'+ body);
    let headers = new HttpHeaders(
      { 'Content-Type':'application/json'  }
    ); 
     return this.http.post<any>(`${environment.rootUrl}/KC-CitasWeb/confimarCita` ,body, { headers:headers }).pipe
       (map( res=>{
         console.log(res);
         return res;
       }))
   }


  getRequisitosCita( appointment: Appointment ){
    let body = JSON.stringify(appointment);
    console.log('Json de entrada:'+ body);
    let headers = new HttpHeaders(
      { 'Content-Type':'application/json'  }
    ); 
     return this.http.post<any>(`${environment.rootUrl}/KC-CitasWeb/requisitosCita` ,body, { headers:headers }).pipe
       (map( res=>{
         console.log(res);
         return res;
       }))
  }


  getCancelaCita(appointment: Appointment ){
    let datosCitaTmpCancelar: DatosCita={};

    datosCitaTmpCancelar.appointmentId=appointment.appointmentId;
    datosCitaTmpCancelar.ts=appointment.ts;
    
    let body = JSON.stringify( datosCitaTmpCancelar);
    let headers = new HttpHeaders(
      { 'Content-Type':'application/json'  }
    ); 
     return this.http.post<any>(`${environment.rootUrl}/KC-CitasWeb/cancelarCita` ,body, { headers:headers }).pipe
       (map( res=>{
         console.log(res);
         return res;
       }))
  }


  getCitasAgendadas(trabajador:Employee ){
    let body = JSON.stringify(trabajador);
    console.log('Json de entrada:'+ body);
    let headers = new HttpHeaders(
      { 'Content-Type':'application/json'  }
    ); 
     return this.http.post<any>(`${environment.rootUrl}/KC-CitasWeb/consultaAgendaCitas` ,body, { headers:headers }).pipe
       (map( res=>{
         console.log(res);
         return res;
       }))
  }


  getModificaCita( appointment:Appointment, employee: Employee){

    let datosCitaTmpModificar: DatosCita={};

    datosCitaTmpModificar=appointment;
    datosCitaTmpModificar.nss=employee.nss;
    datosCitaTmpModificar.name=employee.nombre;
    datosCitaTmpModificar.lastName=employee.apellidoMaterno + ' ' +employee.apellidoPaterno;
    datosCitaTmpModificar.mail=employee.correo;
    datosCitaTmpModificar.movilePhone=employee.celular;
    datosCitaTmpModificar.phone=employee.telefono;
    
    let body = JSON.stringify( datosCitaTmpModificar);
    console.log('Json de entrada:'+ body);
    let headers = new HttpHeaders(
      { 'Content-Type':'application/json'  }
    ); 
     return this.http.post<any>(`${environment.rootUrl}/KC-CitasWeb/modificarCita` ,body, { headers:headers }).pipe
       (map( res=>{
         console.log(res);
         return res;
       }))
   }


}
