import { Component, OnInit, Inject } from '@angular/core';
import { Appointment } from 'src/app/model/Appointment';
import { Employee } from 'src/app/model/Employee';
import { Router } from '@angular/router';
import { AppointmentService } from 'src/app/services/appointment.service';
import { IdentificateService } from 'src/app/services/identificate.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TransaccionService } from 'src/app/services/transaccion.service';

@Component({
  selector: 'app-modal-dialog-modifica',
  templateUrl: './modal-dialog-modifica.component.html',
  styles: []
})
export class ModalDialogModificaComponent implements OnInit {

  appointment: Appointment;
  loading:boolean;
  error: boolean;
  mensajeError:string;
  currentEmployee: Employee;


  constructor(  private router:Router,
                private _transaccionService:TransaccionService,
                private _service: AppointmentService,
                private _identificateService: IdentificateService,
                 public dialogRef: MatDialogRef<ModalDialogModificaComponent>,
                @Inject(MAT_DIALOG_DATA) public dataApp: Appointment) {
                 
                  this._identificateService.currentEmployee.subscribe ( employye => {
                    this.currentEmployee=employye;
                  })
                  this._service.currentAppointment.subscribe ( appointmentTmp => {
                    this.appointment=appointmentTmp;
                  })  
                }

  ngOnInit(): void {

    this._transaccionService.getTransaccion(this.appointment.idKiosco,'modificaCita')
    .subscribe(  data =>{
        console.log(data);
      }, (errorService) => {
              console.log('Entrando a funcion Transaccion DB Error') ;
              console.log(errorService) ;
      }); 
  }



  modificaClick(): void {
    console.log('Se modificara la cita');
    this.dataApp;
    this.dataApp.isChangeAppointment=true;
    this._service.currentAppointmentSetValue(this.dataApp);
    this.router.navigate(['/serviciosCitas'])
  }

  exitClick(): void {
    this.dialogRef.close();
  }

}
