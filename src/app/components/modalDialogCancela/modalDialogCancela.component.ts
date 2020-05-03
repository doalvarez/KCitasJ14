import { Component, OnInit ,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AppointmentService } from 'src/app/services/appointment.service';
import { Appointment } from 'src/app/model/Appointment';
import { Router } from '@angular/router';
import { IdentificateService } from 'src/app/services/identificate.service';
import { Employee } from 'src/app/model/Employee';
import { first } from 'rxjs/operators'
import { TransaccionService } from 'src/app/services/transaccion.service';



@Component({
  selector: 'app-modalDialogCancela',
  templateUrl: './modalDialogCancela.component.html',
  styles: []
})
export class ModalDialogCancelaComponent implements OnInit {

  appointment: Appointment;
  loading:boolean;
  error: boolean;
  mensajeError:string;
  currentEmployee: Employee;


  constructor(  private router:Router,
                private _service: AppointmentService,
                private _transaccionService:TransaccionService,
                private _identificateService: IdentificateService,
                 public dialogRef: MatDialogRef<ModalDialogCancelaComponent>,
                @Inject(MAT_DIALOG_DATA) public dataApp: Appointment) {


                  this._identificateService.currentEmployee.subscribe ( employye => {
                    this.currentEmployee=employye;
                  })
                  this._service.currentAppointment.subscribe ( appointmentTmp => {
                    this.appointment=appointmentTmp;
                  })   
      
    }

  cancelarClick(): void {
    this.loading=true;
    console.log('Se calcelara la cita');
    
  this._service.getCancelaCita(this.dataApp).pipe(first())
      .subscribe(  data =>{
          console.log(data);
            if(data.codigoRetorno== '0'){

              this._service.getCitasAgendadas(this.currentEmployee)
                .subscribe(  data =>{
                    
                    if(data.citasProgramadas){
                      console.log(data);
                      this.appointment.listAppointments=data.listaCitasDisponibles;
                      this._service.currentAppointmentSetValue(this.appointment);
                      this.router.navigate(['/menuCitas'])
                    }else{
                      this.router.navigate(['/serviciosCitas'])
                    }
              }, (errorService) => {
                console.log(errorService) ;
                this.mensajeError="Error al conectar al RestController";
                this.error= true;
                this.loading=false;
              });
              
              this.loading=false;
            }  else{
                this.error= true;
                this.mensajeError=data.msjError;
                this.mensajeError="Error en el servicio, intenta de nuevo mas tarde";
                
            }
            this.dialogRef.close();

      }, (errorService) => {
      console.log('Error') ;
      console.log(errorService) ;
      this.mensajeError="Error en el servicio, intenta de nuevo mas tarde";
      this.error= true;
      this.loading=false;
      this.dialogRef.close();
      }); 


    
  }

  exitClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {

    this._transaccionService.getTransaccion(this.appointment.idKiosco,'cancelaCita')
    .subscribe(  data =>{
        console.log(data);
      }, (errorService) => {
              console.log('Entrando a funcion Transaccion DB Error') ;
              console.log(errorService) ;
      }); 
  }

}
