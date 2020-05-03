import { Component, OnInit , Inject} from '@angular/core';
import { DatosCita } from '../../interfaces/datosCita.interface';
import { Router } from '@angular/router';
import { TransaccionService } from '../../services/transaccion.service';
import { environment } from '../../../environments/environment';
import { AppointmentService } from 'src/app/services/appointment.service';
import { Appointment } from 'src/app/model/Appointment';
import { Employee } from 'src/app/model/Employee';
import { ModalDialogCancelaComponent } from '../modalDialogCancela/modalDialogCancela.component';
import { ModalDialogModificaComponent } from '../modal-dialog-modifica/modal-dialog-modifica.component';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { IdentificateService } from 'src/app/services/identificate.service';
declare var $:any;

@Component({
  selector: 'app-cita-confirmada-component',
  templateUrl: './citaConfirmada.component.html',
  styleUrls: ['./citaConfirmada.component.css'],
})
export class CitaConfirmadaComponent implements OnInit {

  loading:boolean;

  url = `${environment.rootUrl}/KC-GestionWeb/`;
  error: boolean;
  mensajeError:string;
  appointment: Appointment;
  currentEmployee: Employee;

  datosCita:DatosCita={
      nss:null
  }

  constructor(private router:Router,
    private _service: AppointmentService,
    private _identificateService: IdentificateService,
    private _transaccionService:TransaccionService,
    public dialog: MatDialog) {

    this.loading=true;
    this._service.currentAppointment.subscribe ( appointmentTmp => {
      this.appointment=appointmentTmp;
    })

    this._identificateService.currentEmployee.subscribe ( employye => {
      this.currentEmployee=employye;
    })

    console.log('validando que el objeto se carga bien');
    console.log(this.appointment);
    this.appointment.enabledDay=null;

    this.datosCita.nss=this.currentEmployee.nss
    this.datosCita.fullName=this.currentEmployee.nombreCompleto
    this.datosCita.serviceName=this.appointment.serviceName
    this.datosCita.appointmentDay=this.appointment.appointmentDay
    this.datosCita.appointmentHour=this.appointment.appointmentHour
    this.datosCita.cesiLocation=this.appointment.cesiLocation


    if(!this.appointment.isChangeAppointment){
      this._service.getConfirmaCita(this.appointment,this.datosCita, this.currentEmployee)
      .subscribe(  data =>{
          console.log(data);
            if(data.codigoRetorno== '0'){
              this.appointment = data.cita;
              this.appointment.requirements= data.requisitos;
              this.datosCita.idConfirmation=data.this.appointment.idConfirmation;
              this.datosCita.listaRequirements=data.listaRequisitos;
              document.getElementById("requerimientos").innerHTML =data.requisitos;
              this._service.currentAppointmentSetValue(this.appointment);
              let citaJson= JSON.stringify(this.datosCita);
              console.log(citaJson);
              localStorage.setItem('miCita', citaJson);
              this.loading=false;
            }  else{
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
    }else{
      this._service.getModificaCita(this.appointment, this.currentEmployee)
      .subscribe(  data =>{
          console.log(data);
            if(data.codigoRetorno== '0'){
              this.appointment=data.cita;
              this.appointment.requirements= data.requisitos;
              this.datosCita.idConfirmation=this.appointment.idConfirmation;
              this.datosCita.listaRequirements=data.listaRequisitos;
              document.getElementById("requerimientos").innerHTML =data.requisitos;
              this._service.currentAppointmentSetValue(this.appointment);
              let citaJson= JSON.stringify(this.datosCita);
              console.log(citaJson);
              localStorage.setItem('miCita', citaJson);
              this.loading=false;
            }  else{
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

    }


    }

  ngOnInit() {
    $(function() {
      $(window).scroll(function() {
          if ($(window).scrollTop() > 20) {
              $("#flecha").fadeOut();
          } else {
              $("#flecha").fadeIn();
          }
      });
  });

    this._transaccionService.getTransaccion(this.appointment.idKiosco,'citaConfirmada')
    .subscribe(  data =>{
          console.log(data);
        }, (errorService) => {
                console.log('Entrando a funcion de error') ;
                console.log(errorService) ;
                this.error= true;
        });
      this.loading=false; 
  }

  salir(){
    window.location.href= this.url;
  }



  loadingPrint(){
    this.loading=true;
    setTimeout ( () =>  this.loading=false, 2000);
  }

  cancelar(appointment:Appointment){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width= "650px";
    dialogConfig.height="300px";
    dialogConfig.data=appointment;
    const dialogRef = this.dialog.open(ModalDialogCancelaComponent, dialogConfig
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  reprogramar(appointment:Appointment){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width= "650px";
    dialogConfig.height="300px";
    dialogConfig.data=appointment;
    const dialogRef = this.dialog.open(ModalDialogModificaComponent, dialogConfig
    );
  }

}
