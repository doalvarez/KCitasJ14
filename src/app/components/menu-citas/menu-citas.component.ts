import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Appointment } from 'src/app/model/Appointment';
import { Employee } from 'src/app/model/Employee';
import { AppointmentService } from 'src/app/services/appointment.service';
import { Router  } from '@angular/router';
import { IdentificateService } from 'src/app/services/identificate.service';
import { TransaccionService } from 'src/app/services/transaccion.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { ModalDialogCancelaComponent } from '../modalDialogCancela/modalDialogCancela.component';
import { ModalDialogModificaComponent } from '../modal-dialog-modifica/modal-dialog-modifica.component';



@Component({
  selector: 'app-menu-citas',
  templateUrl: './menu-citas.component.html',
  styleUrls: ['./menu-citas.component.css']
})
export class MenuCitasComponent implements OnInit {

  url = `${environment.rootUrl}/KC-GestionWeb/`;
  
  loading: boolean = false;
  error: boolean;
  mensajeError:string;
  appointment: Appointment;
  currentEmployee: Employee;

  constructor(private _transaccionService:TransaccionService,
              private _identificateService: IdentificateService,
              private _service: AppointmentService,
              private router:Router,
              public dialog: MatDialog
              ) {
    this._identificateService.currentEmployee.subscribe ( employye => {
      this.currentEmployee=employye;
    })
    this._service.currentAppointment.subscribe ( appointmentTmp => {
      this.appointment=appointmentTmp;
    })    
   }

  ngOnInit() {
    this._transaccionService.getTransaccion(this.appointment.idKiosco,'menuCitas')
      .subscribe(  data =>{
          console.log(data);
        }, (errorService) => {
                console.log('Entrando a funcion Transaccion DB Error') ;
                console.log(errorService) ;
        }); 
  }

  consultar(appointment:Appointment){

    console.log('>>>>Entra a metodo consultar');
    console.log(appointment);

    this._service.currentAppointmentSetValue(appointment);
    this.router.navigate(['/consultaCita'])
   
  }
 
   modificar(appointment:Appointment){

    const dialogConfig = new MatDialogConfig();
      dialogConfig.width= "650px";
      dialogConfig.height="300px";
      dialogConfig.data=appointment;
   
      const dialogRef = this.dialog.open(ModalDialogModificaComponent, dialogConfig
      );
     
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

  salir(){
    window.location.href= this.url;
  }


  hazCita(){
    console.log('>>>>Entra a metodo Haz tu cita');
    this.router.navigate(['/serviciosCitas'])
  }


}
