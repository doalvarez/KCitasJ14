import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators  } from '@angular/forms';
import { TransaccionService } from '../../services/transaccion.service';
import { Router  } from '@angular/router';
import { Employee } from 'src/app/model/Employee';
import { IdentificateService } from 'src/app/services/identificate.service';
import { AppointmentService } from 'src/app/services/appointment.service';
import { Appointment } from 'src/app/model/Appointment';
declare var $:any;

@Component({
  selector: 'app-datos-contacto',
  templateUrl: './datos-contacto.component.html',
  styles: []
})
export class DatosContactoComponent implements OnInit {


  forma: FormGroup;
  loading:boolean;
  error: boolean;
  mensajeError:string;
  currentEmployee: Employee;
  appointment: Appointment;

  constructor(private router:Router,
    private _transaccionService:TransaccionService,
    private _identificateService: IdentificateService,
    private _service: AppointmentService) {

      this._identificateService.currentEmployee.subscribe ( employye => {
        this.currentEmployee=employye;
      })
      this._service.currentAppointment.subscribe ( appointmentTmp => {
        this.appointment=appointmentTmp;
      })

      this.forma= new FormGroup({
        'celular': new FormControl(),
        'correo': new FormControl(),
        'lada': new FormControl(),
        'telefono': new FormControl()
      })

      
       this._transaccionService.getTransaccion(this.appointment.idKiosco,'citaDatosContacto')
      .subscribe(  data =>{
          console.log(data);
        }, (errorService) => {
                console.log('Entrando a funcion Transaccion DB Error') ;
                console.log(errorService) ;
        }); 
       
        
}

  ngOnInit() {

    $(function(){
     $('#numberCel').keyboard();
     $('#CorreoCustom').keyboard(
       {layout:[
         [['1','1'],['2','2'],['3','3'],['4','4'],['5','5'],['6','6'],['7','7'],['8','8'],['9','9'],['0','0'],['del','del']],
     	   [['q','Q'],['w','W'],['e','E'],['r','R'],['t','T'],['y','Y'],['u','U'],['i','I'],['o','O'],['p','P']],
         [['a','A'],['s','S'],['d','D'],['f','F'],['g','G'],['h','H'],['j','J'],['k','K'],['l','L'],['@','@']],
         [['z','Z'],['x','X'],['c','C'],['v','V'],['b','B'],['n','N'],['m','M'],['.','.'],['-','-'],['_','_']]
       ]
     }
    );
     $('#numberLada').keyboard({placement: 'top'});
     $('#numberTelLocal').keyboard({placement: 'top'});
   });

  }


  consultaServicios(){

    this.loading=true;

    let celValue:string=$("#numberCel").val();
    let correoValue:string=$("#CorreoCustom").val();
    let ladaValue:string=$("#numberLada").val();
    let telValue:string=$("#numberTelLocal").val();

    this.currentEmployee.celular= celValue;
    this.currentEmployee.correo=correoValue;
    this.currentEmployee.lada=ladaValue;
    this.currentEmployee.telefono=telValue;

    this.forma= new FormGroup({
      'celular': new FormControl('', [Validators.required, Validators.minLength(10),Validators.maxLength(10)] ),
      'correo': new FormControl('', [
          Validators.required,
          Validators.pattern("^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$")] ),
      'lada': new FormControl(''),
      'telefono': new FormControl(''),
    })

    this.forma.controls['celular'].setValue(celValue);
    this.forma.controls['correo'].setValue(correoValue);
    this.forma.controls['lada'].setValue(ladaValue);
    this.forma.controls['telefono'].setValue(telValue);

    if(this.forma.valid){
      
      this._identificateService.setStorageEmployee(this.currentEmployee);

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

    }else{
        this.loading=false;
    }
  }


  regresar(){
        this.router.navigate(['/identificate'])
  }


}
