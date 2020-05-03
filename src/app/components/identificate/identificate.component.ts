import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators  } from '@angular/forms';
import { Router } from '@angular/router';
import { IdentificateService } from '../../services/identificate.service';
import { TransaccionService } from '../../services/transaccion.service';
declare var $:any;
import { environment } from '../../../environments/environment';
import { DOCUMENT } from '@angular/common';
import { AppointmentService } from 'src/app/services/appointment.service';
import { Employee } from 'src/app/model/Employee';
import { Appointment } from 'src/app/model/Appointment';


@Component({
  selector: 'app-identificate',
  templateUrl: './identificate.component.html',
  styleUrls: ['./identificate.component.css']
})
export class IdentificateComponent implements OnInit {

  forma: FormGroup;
  loading:boolean;
  error: boolean;
  mensajeError:string;
  idKiosco:string;
  employee: Employee={
    
  }
  appointment: Appointment={
  }
  

  url = `${environment.rootUrl}/KC-GestionWeb/`;


  constructor( private router:Router,
              private _identificateService: IdentificateService,
              private _service: AppointmentService,
              private _transaccionService:TransaccionService,
               @Inject(DOCUMENT) private document: any){

      this.idKiosco = localStorage.getItem('startKiosco');

      this.forma= new FormGroup({
        'nss': new FormControl(),
        'dia': new FormControl(),
        'anio': new FormControl(),
        'mes': new FormControl()
      })

    this.appointment.idKiosco=this.idKiosco;
    this.employee.meses= [
    { codigo:"01", nombre:"Enero"}
    , {
      codigo:"02",  nombre:"Febrero"
    },{
        codigo:"03",  nombre:"Marzo"
    },{
        codigo:"04",  nombre:"Abril"
    },{
        codigo:"05",  nombre:"Mayo"
    },{
      codigo:"06",  nombre:"Junio"
    },{
        codigo:"07", nombre:"Julio"
    },{
        codigo:"08", nombre:"Agosto"
    },{
        codigo:"09",  nombre:"Septiembre"
      },{
        codigo:"10",  nombre:"Octubre"
      },{
          codigo:"11",  nombre:"Noviembre"
      },{
          codigo:"12",  nombre:"Diciembre"
      }];


  }

  ngOnInit() {
    $(function(){
        $('#numberNss').keyboard();
        $('#numberDia').keyboard({placement: 'top'});
        $('#numberAnio').keyboard({placement: 'top'});

        $('#datetimepicker1').datetimepicker({
          format: 'LL',
          inline: true,
          sideBySide: true,
          locale: 'es'
                 });
      });

    this._transaccionService.getTransaccion(this.appointment.idKiosco,'citaIdentificate')
    .subscribe(  data =>{
          console.log(data);
        }, (errorService) => {
                console.log('Entrando a funcion de error') ;
                console.log(errorService) ;
                this.error= true;
        }); 

  }

  consultaTrabajador(){
        this.loading=true;
        let nssValue:string=$("#numberNss").val();
        let diaValue:string=$("#numberDia").val();
        let anioValue:string=$("#numberAnio").val();
        let mesValue = this.forma.controls['mes'].value;

        this.employee.nss=nssValue;
        this.employee.dia=diaValue;
        this.employee.mes=mesValue;
        this.employee.anio=anioValue;

        this.forma= new FormGroup({
          'nss': new FormControl('', [Validators.required, Validators.minLength(11),Validators.maxLength(11)] ),
          'dia': new FormControl('', [Validators.required, Validators.minLength(2),Validators.maxLength(2)] ),
          'anio': new FormControl('',[Validators.required, Validators.minLength(4),Validators.maxLength(4)] ),
          'mes': new FormControl('', Validators.required)
        })

        this.forma.controls['nss'].setValue(nssValue);
        this.forma.controls['dia'].setValue(diaValue);
        this.forma.controls['anio'].setValue(anioValue);
        this.forma.controls['mes'].setValue(mesValue);

      if(this.forma.valid){
        this._identificateService.getTrabajador(this.employee) .subscribe(  data =>{
              console.log(data);
              if(data.codigoRetorno== '0'){
                this.employee.nombre=data.nombre;
                this.employee.nombreCompleto=data.nombreCompleto;
                this.employee.apellidoPaterno=data.apellidoPaterno;
                this.employee.apellidoMaterno=data.apellidoMaterno;
                this.employee.meses=[];
                //this._data.data=this.employee;
                this.router.navigate(['/datosContacto']);
              }else{
                this.mensajeError=data.msjError;
                this.error= true;
              }

              this.loading=false;
        }, (errorService) => {
          console.log('Entrando a funcion de error') ;
          console.log(errorService) ;
          this.mensajeError="Error al conectar al RestController";
          this.error= true;
          this.router.navigate(['/sinServicio']);
          this.loading=false;
        });
        
        this._identificateService.setStorageEmployee(this.employee);
        this._service.currentAppointmentSetValue(this.appointment);
      }else{
          this.loading=false;
      }
  }

   salir(){
     console.log('salir')
      this.document.location.href =  this.url;
   }

}
