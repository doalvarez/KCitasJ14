import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators  } from '@angular/forms';
import { Router } from '@angular/router';
import { TransaccionService } from '../../services/transaccion.service';
import { AppointmentService } from 'src/app/services/appointment.service';
import { Appointment } from 'src/app/model/Appointment';
import { IdentificateService } from 'src/app/services/identificate.service';
import { Employee } from 'src/app/model/Employee';
import { environment } from '../../../environments/environment';
declare var $:any;

@Component({
  selector: 'app-opciones-servicio',
  templateUrl: './opcionesServicio.component.html',
  styles: []
})
export class OpcionesServicioComponent implements OnInit {

  url = `${environment.rootUrl}/KC-GestionWeb/`;
  formaServicio: FormGroup;
  loading:boolean;
  error: boolean;
  info:boolean;
  mensajeError:string;
  msjInfo:string;
  appointment: Appointment;
  currentEmployee: Employee;



  constructor( private router:Router,
               private _service: AppointmentService,
               private _identificateService: IdentificateService,
               private _transaccionService:TransaccionService) {

      this._identificateService.currentEmployee.subscribe ( employye => {
        this.currentEmployee=employye;
      })
      this._service.currentAppointment.subscribe ( appointmentTmp => {
        this.appointment=appointmentTmp;
      })

      this.loading=true;
      this.formaServicio= new FormGroup({
        'servicio': new FormControl(),
        'estado': new FormControl(),
        'cesi': new FormControl()
      })
      this.appointment.consultedMonth=0;

      if(!this.appointment.isChangeAppointment){
        this._service.getServicios(this.currentEmployee)
                  .subscribe(  data =>{

                    if(data.codigoRetorno== '0'){
                        this.appointment.services=data.listaServiciosCitas;
                    }else if (data.codigoRetorno== '1'){
                      this.mensajeError=data.msjError;
                      this.error= true;
                    }else{
                      this.mensajeError=data.msjError;
                      this.error= true;
                    }
                    this.loading=false;
                  }, (errorService) => {
                    console.log(errorService) ;
                    this.mensajeError="Error al conectar al RestController";
                    this.error= true;
                    this.loading=false;
                  });
      }else{
        this._service.getEstados(this.appointment)
        .subscribe(  data =>{
              this.appointment.states=data.listRegiones;
              this.loading=false;
        }, (errorService) => {
          this.mensajeError="Error al conectar al RestController";
          this.error= true;
          this.loading=false;
        });
      }
     
  }

  ngOnInit() {
   this._transaccionService.getTransaccion(this.appointment.idKiosco,'citaOpcionesServicio')
    .subscribe(  data =>{
          console.log(data);
        }, (errorService) => {
                console.log('Entrando a funcion Transaccion DB Error') ;
                console.log(errorService) ;
        }); 

  }




  actionGetEstados(args){
        this.loading=true;
        this.error=false;
         if(!this.appointment.isChangeAppointment){
           
          let idServicio =args.target.value;
          let servicioTitulo= args.target.options[args.target.selectedIndex].text
           this.appointment.idservice=idServicio;
           this.appointment.serviceName=servicioTitulo;
         }
         console.log(this.appointment.idservice);
      if(this.appointment.idservice != null && this.appointment.idservice  != ""){
        this._service.getEstados(this.appointment)
        .subscribe(  data =>{
              this.appointment.states=data.listRegiones;
              this.loading=false;
        }, (errorService) => {
          this.mensajeError="Error al conectar al RestController";
          this.error= true;
          this.loading=false;
        });
      }

    }


    actionGetCesis(args){
      this.loading=true;
      this.error=false;
          let idRegion =args.target.value;
          let regionTitulo= args.target.options[args.target.selectedIndex].text;

        if(idRegion != null && idRegion != ""){
          this.appointment.idState=idRegion;
          this.appointment.stateName=regionTitulo;
          this._service.getCesis(this.appointment)
          .subscribe(  data =>{
                this.appointment.cesis=data.listaCesis;
                this.loading=false;
          }, (errorService) => {
            this.mensajeError="Error al conectar al RestController";
            this.error= true;
            this.loading=false;
          });
        }
      }


      actionSaveCesis(args){
        this.loading=true;
        let idCesi =args.target.value;
        let nombreCesi= args.target.options[args.target.selectedIndex].text;

        if(idCesi != null && idCesi != ""){
            this.appointment.cesiId=idCesi;
            this.appointment.cesiName=nombreCesi;
            this.getAtributoCesis(this.appointment.cesis);
            this.loading=false;
          }
        }

      consultaMesCupoDisp(){
        this.loading=true;
        this.formaServicio= new FormGroup({
          'servicio': new FormControl('', Validators.required),
          'estado': new FormControl('', Validators.required),
          'cesi': new FormControl('',  Validators.required)
        })
        this.formaServicio.controls['servicio'].setValue(this.appointment.idservice);
        this.formaServicio.controls['estado'].setValue(this.appointment.idState);
        this.formaServicio.controls['cesi'].setValue(this.appointment.cesiId);

        if(this.formaServicio.valid){
            this.validaCupoDisponible();
        }else{
            this.loading=false;
        }
      }

      validaCupoDisponible(){
        this.loading=true;
        let sigMesTmp: number=this.appointment.consultedMonth;
        console.log('Mes a consultar:'+sigMesTmp);
        let d = new Date();
        let m = d.getMonth();
        let mesES= d.toLocaleString('es-MX', { month: 'long' });
        let promise = new Promise((resolve, reject) => {
          this._service.getFechasDisponibles(this.appointment)
          .toPromise()
          .then(
            data => {
              console.log(data);
              if(data.codigoRetorno== '0'){
                      this.appointment.cesis=null;
                      this.appointment.services=null;
                      this.appointment.states=null;
                      this.appointment.enabledDay=data.listDiasDisponibles;
                     this.appointment.dayMin=data.diaMinimo;
                     this.appointment.dayMax=data.diaMaximo;
                     this.appointment.calendarMonth=data.mesCalendario;
                     this.appointment.calendarYear=data.anioCalendario;
                     this.appointment.fistEnabledDay=data.primerDiahabilitado;
                     this._service.currentAppointmentSetValue(this.appointment);
                     //this._data.data = this.usuarioService;
                     this.loading=false;

                     resolve();
                     this.router.navigate(['/disponibilidadCitas'])
              }else if(data.codigoRetorno== 'CITAS30006' && this.appointment.consultedMonth <= 6){

                    d.setMonth(m+this.appointment.consultedMonth);
                    mesES= d.toLocaleString('es-MX', { month: 'long' });
                    this.msjInfo='Buscando disponibilidad en '+mesES;
                    this.info= true;
                    this.error= false;

                    sigMesTmp++;
                    this.appointment.consultedMonth=sigMesTmp;

                    reject(setTimeout ( () => this.validaCupoDisponible() , 1000));

              }  else{
                  this.appointment.consultedMonth=0;
                  this.mensajeError='No se ha encontrado disponibilidad';
                  this.error= true;
                  this.info= false;
                  this.loading=false;
                  resolve();
              }
            });
        });
      }

      getAtributoCesis(miArray:any){
        for (var valor of miArray) {
          if(this.appointment.cesiId == valor.organizationCode){
            this.appointment.cesiLocation=valor.organizationLocation;
            this.appointment.cesiName=valor.organizationDescription
          }
        }
      }

      salir(){
        window.location.href= this.url;
      }
}
