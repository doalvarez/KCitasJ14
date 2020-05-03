import { Component, OnInit } from '@angular/core';
import { AppointmentService } from 'src/app/services/appointment.service';
import { Appointment } from 'src/app/model/Appointment';
import { Employee } from 'src/app/model/Employee';
import { GeocodingApiService } from 'src/app/services/geocoding.service';
import { Router } from '@angular/router';
import { IdentificateService } from 'src/app/services/identificate.service';
import { TransaccionService } from 'src/app/services/transaccion.service';
import { DatosCita } from 'src/app/interfaces/datosCita.interface';

@Component({
  selector: 'app-detalle-cita',
  templateUrl: './detalle-cita.component.html',
  styleUrls: ['./detalle-cita.component.css'],
})
export class DetalleCitaComponent implements OnInit {

  loading:boolean;
  error: boolean;
  mensajeError:string;
  appointment: Appointment;
  currentEmployee: Employee;
  datosCita:DatosCita={
    nss:null
}

  constructor(private  _geocodingApiService: GeocodingApiService,
              private _service: AppointmentService,
              private _identificateService: IdentificateService,
              private router:Router,
              private _transaccionService:TransaccionService) {

         this.loading=true;
         this._service.currentAppointment.subscribe ( appointmentTmp => {
           this.appointment=appointmentTmp;
         })
         
         this._identificateService.currentEmployee.subscribe ( employye => {
           this.currentEmployee=employye;
         })
         
         this._geocodingApiService.findFromAddress(this.appointment.cesiLocation).subscribe(  data =>{
          if (data.status == 'OK') {
                  console.log('LAT  -  LNG OK ');
                  console.log(data.results[0].geometry.location);
                    this.appointment.lat = data.results[0].geometry.location.lat;
                    this.appointment.lng = data.results[0].geometry.location.lng;
                } else if (data.status == 'ZERO_RESULTS') {
                    console.log('geocodingAPIService', 'ZERO_RESULTS', data.status);
                } else {
                    console.log('geocodingAPIService', 'Other error', data.status);
                }
    
        }, (errorService) => {
          console.log('Error') ;
          console.log(errorService) ;
          this.mensajeError="Error al conectar a Google Maps";
          this.loading=false;
        });

        this._service.getRequisitosCita(this.appointment).subscribe(  data =>{
          if(data.codigoRetorno=='0'){
            document.getElementById("requisitos").innerHTML =data.requisitos;
            this.datosCita.listaRequirements=data.listaRequisitos;
            this.datosCita.nss=this.currentEmployee.nss;
            this.datosCita.fullName=this.currentEmployee.nombreCompleto;
            this.datosCita.serviceName=this.appointment.serviceName;
            this.datosCita.appointmentDay=this.appointment.appointmentDay;
            this.datosCita.appointmentHour=this.appointment.appointmentHour;
            this.datosCita.cesiLocation=this.appointment.cesiLocation;
            this.datosCita.idConfirmation=this.appointment.idConfirmation;
        
            let citaJson= JSON.stringify(this.datosCita);
            console.log(citaJson);
            localStorage.setItem('miCitaDetalle', citaJson);
          } else {
              console.log('requerimientos error', data);
          }
       }, (errorService) => {
         console.log('Error') ;
         console.log(errorService) ;
         this.mensajeError="Error al conectar a Rest Full";
         this.loading=false;
       });
       this.loading=false;
  }

  ngOnInit() {
    this._transaccionService.getTransaccion(this.appointment.idKiosco,'detalleCita')
      .subscribe(  data =>{
          console.log(data);
        }, (errorService) => {
                console.log('Entrando a funcion Transaccion DB Error') ;
                console.log(errorService) ;
        }); 
  }


  regresar(){

    this._service.getCitasAgendadas(this.currentEmployee)
        .subscribe(  data =>{
              this.appointment.listAppointments=data.listaCitasDisponibles;
              this._service.currentAppointmentSetValue(this.appointment);
              this.router.navigate(['/menuCitas'])
            
      }, (errorService) => {
        console.log(errorService) ;
        this.mensajeError="Error al conectar al RestController";
        this.error= true;
        this.loading=false;
      });
  }

  loadingPrint(){
    this.loading=true;
    setTimeout ( () =>  this.loading=false, 2000);
    }

    
}
