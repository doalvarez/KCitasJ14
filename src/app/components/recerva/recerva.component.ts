import { Component, OnInit , NgZone} from '@angular/core';
import { Router } from '@angular/router';
import { GeocodingApiService }  from '../../services/geocoding.service'
import { TransaccionService } from '../../services/transaccion.service';
import { Employee } from 'src/app/model/Employee';
import { AppointmentService } from 'src/app/services/appointment.service';
import { Appointment } from 'src/app/model/Appointment';
import { IdentificateService } from 'src/app/services/identificate.service';

@Component({
  selector: 'app-recerva-component',
  templateUrl: './recerva.component.html',
  styleUrls: ['./reserva.component.css']
})
export class RecervaComponent implements OnInit {

  loading:boolean;
  timerConfirmar:boolean;
  error: boolean;
  mensajeError:string;
  dataRecive:any;
  contador_s:number;
  leyendaTimer:string;
  appointment: Appointment;
  currentEmployee: Employee;
 

  constructor(private router:Router,
      private _service: AppointmentService,
      private _identificateService: IdentificateService,
      private _transaccionService:TransaccionService,
      private  _geocodingApiService: GeocodingApiService){

      this.loading=true;
      this.timerConfirmar=true;

      this._service.currentAppointment.subscribe ( appointmentTmp => {
        this.appointment=appointmentTmp;
      })
      this._identificateService.currentEmployee.subscribe ( employye => {
        this.currentEmployee=employye;
      })
      console.log('Employee>>');
      
    console.log(this.currentEmployee);

    this._geocodingApiService.findFromAddress(this.appointment.cesiLocation).subscribe(  data =>{
          if (data.status == 'OK') {
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
    }

  ngOnInit() {
    this.loading=true;
    this._service.getAgendarCita(this.appointment, this.currentEmployee)
    .subscribe(  data =>{
          console.log(data);
          if(data.codigoRetorno== '0'){
            this.appointment.reservationId=data.recervacionId
            //this._data.data = this.usuarioService;
            this.loading=false;
            this.tiempoEspera();
            this._transaccionService.getTransaccion(this.appointment.idKiosco,'citaRecerva')
            .subscribe(  data =>{
                  console.log(data);
                }, (errorService) => {
                        console.log('Entrando a funcion Transaccion DB Error') ;
                        console.log(errorService) ;
                });
          }else{
            this.mensajeError=data.msjError;
            this.router.navigate(['/sinServicio'])
        }
          
    }, (errorService) => {
      console.log('Error') ;
      console.log(errorService) ;
      this.mensajeError="Error al conectar al RestController";
      this.error= true;
      this.loading=false;
    });
    this.loading=false;
  }

  tiempoEspera() {
    let contTmp =60;
    var self = this;
      var refreshId = setInterval(function ( ) {
      if(document.getElementById("timerSeg") != null){
        if (contTmp == 0 )  {
           document.getElementById("timerSeg").innerHTML = ''+contTmp;
           clearInterval(refreshId);
           self.setTimerValues();
          }else{
            document.getElementById("timerSeg").innerHTML =''+contTmp;
            contTmp--;
          }
      }else{
        clearInterval(refreshId);
      }
      }, 1000);
    }


      setTimerValues(){
        this.timerConfirmar=false;
      }



  confirmarCita(){
    console.log('confirmarCita');
    this.loading=true;
    this._service.currentAppointmentSetValue(this.appointment);
    this.loading=false;
    this.router.navigate(['/citaConfirmada'])
  }




  regresar(){
     this.router.navigate(['/disponibilidadCitas'])
  }

}
