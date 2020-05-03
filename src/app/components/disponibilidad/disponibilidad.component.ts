import { Component, OnInit , NgZone} from '@angular/core';
import { FormGroup, FormControl, Validators  } from '@angular/forms';
import { TransaccionService } from '../../services/transaccion.service';
import { Trabajador } from '../../interfaces/trabajador.interface';
import { Router } from '@angular/router';
import { AppointmentService } from 'src/app/services/appointment.service';
import { Appointment } from 'src/app/model/Appointment';
import { Employee } from 'src/app/model/Employee';
declare var $:any;

@Component({
  selector: 'app-disponibilidad-component',
  templateUrl: './disponibilidad.component.html',
  styles: [  ]
})
export class DisponibilidadComponent implements OnInit {

  forma: FormGroup;

  loading:boolean;
  loadingHrs:boolean;
  muestraHorarios:boolean;
  mesAnterior:boolean;
  error: boolean;
  mensajeError:string;
  dataRecive:any;
  listHorarios:any={};
  appointment: Appointment;
  currentEmployee: Employee;


  constructor(private router:Router,
               private _service: AppointmentService,
               private _transaccionService:TransaccionService,
               private zone: NgZone) {


      this._service.currentAppointment.subscribe ( appointmentTmp => {
                  this.appointment=appointmentTmp;
      })

      this.muestraHorarios=false;
      this.loading=true;
      this.mesAnterior=false;

      this.forma= new FormGroup({
        'fechaSel': new FormControl(),
        'horaSel': new FormControl()
      })
      
      this._transaccionService.getTransaccion(this.appointment.idKiosco ,'citaDisponibilidad')
      .subscribe(  data =>{
            console.log(data);
          }, (errorService) => {
                  console.log('Entrando a funcion Transaccion DB Error') ;
                  console.log(errorService) ;
          });
  }

  ngOnInit() {

    let anioCTmp=this.appointment.calendarYear;
    let mesCTmp: number=this.appointment.calendarMonth;
    let diaMaxTmp=this.appointment.dayMax;
    let diaMinTmp=this.appointment.dayMin;
    let diasHabTmp:string=this.appointment.enabledDay;
    let idServiceTmp= this.appointment.idservice;
    let idCesiTmp=this.appointment.cesiId;
    let primerdH=this.appointment.fistEnabledDay;
    var self = this;

    $(function(){

      $('#datetimepicker').datetimepicker({
                  format: 'LL',
                  inline: true,
                  sideBySide: true,
                  locale: 'es',
                  enabledDates: [ diasHabTmp ],
                  defaultDate: primerdH
        });
        $('#datetimepicker').data("DateTimePicker").minDate(new Date(anioCTmp, mesCTmp-1, diaMinTmp));
        $('#datetimepicker').data("DateTimePicker").maxDate(new Date(anioCTmp, mesCTmp, diaMinTmp));
        $("#datetimepicker").on("dp.change", function (e) {
                  self.consultarHorarios(idServiceTmp,idCesiTmp, e.date.format());
        				});
    });
    this.consultarHorarios(idServiceTmp,idCesiTmp, primerdH);
    this.loading=false;
  }


  construyeCalendario(appointmentTmp:Appointment){

    console.log('Iniciando COntruye calendario')
    let diasHabTmpCC=appointmentTmp.enabledDay;
    let anioCTmpCC=appointmentTmp.calendarYear;
    let mesCTmpCC: number=appointmentTmp.calendarMonth;
    let diaMaxCC = appointmentTmp.dayMax;
    let diaMinCC = appointmentTmp.dayMin;
    let idServiceTmp= this.appointment.idservice;
    let idCesiTmp=this.appointment.cesiId;
    let primerdH=this.appointment.fistEnabledDay;
    var self2 = this;

    $(function(){
      $('#datetimepicker').data("DateTimePicker").destroy();

      $('#datetimepicker').datetimepicker({
                format: 'LL',
                inline: true,
                sideBySide: true,
                locale: 'es',
                enabledDates: [ diasHabTmpCC ],
                defaultDate: primerdH
             });
      $('#datetimepicker').data("DateTimePicker").minDate(new Date(anioCTmpCC, mesCTmpCC -1, diaMinCC));
      $('#datetimepicker').data("DateTimePicker").maxDate(new Date(anioCTmpCC, mesCTmpCC, diaMinCC));
      $("#datetimepicker").on("dp.change", function (e) {
                self2.consultarHorarios(idServiceTmp,idCesiTmp, e.date.format());
              });
      });
  }

  consultaSigMes(){
    this.loading=true;
    this.muestraHorarios=false;
    this.error= false;
    var selfSM = this;
    let sigMesTmp: number=this.appointment.consultedMonth
    let mesSCTmp: number;
    if(sigMesTmp >= 0){

      sigMesTmp++;
      this.appointment.consultedMonth=sigMesTmp;
      this._service.getFechasDisponibles(this.appointment)
      .subscribe(  data =>{
            console.log(data)
            if(data.codigoRetorno== '0'){
              this.appointment.enabledDay=data.listDiasDisponibles;
              this.appointment.dayMin=data.diaMinimo;
              this.appointment.dayMax=data.diaMaximo;
              this.appointment.calendarMonth=data.mesCalendario;
              this.appointment.calendarYear=data.anioCalendario;
              this.appointment.fistEnabledDay=data.primerDiahabilitado;
              selfSM.construyeCalendario(this.appointment);
              this.muestraHorarios=true;
            }else{
              this.mensajeError=data.msjError;
              this.error= true;
            }
      }, (errorService) => {
        console.log('Error') ;
        console.log(errorService) ;
        this.mensajeError="Error al conectar al RestController";
        this.error= true;
         this.loading=false;
      });
      this.mesAnterior=true;
    }
    this.loading=false;
  }


    consultaMesAnterior(){
      console.log('consultaMesAnterior');
    this.loading=true;
    this.error= false;
    var selfSM = this;
    let sigMesTmp: number=this.appointment.consultedMonth
    let mesSCTmp: number;
    if(sigMesTmp > 0){

      sigMesTmp--;
      this.appointment.consultedMonth=sigMesTmp;
      console.log(this.appointment.consultedMonth)
      this._service.getFechasDisponibles(this.appointment)
      .subscribe(  data =>{
        if(data.codigoRetorno== '0'){
            this.appointment.enabledDay=data.listDiasDisponibles;
            this.appointment.dayMin=data.diaMinimo;
            this.appointment.dayMax=data.diaMaximo;
            this.appointment.calendarMonth=data.mesCalendario;
            this.appointment.calendarYear=data.anioCalendario;
            this.appointment.fistEnabledDay=data.primerDiahabilitado;
            selfSM.construyeCalendario(this.appointment);
          }else{
            this.mensajeError=data.msjError;
            this.error= true;
          }
      }, (errorService) => {
        console.log('Error') ;
        console.log(errorService) ;
        this.mensajeError="Error al conectar al RestController";
        this.error= true;
         this.loading=false;
      });

    }else{
      this.mesAnterior=false;
    }
    this.loading=false;
    }


  consultarHorarios(idServiceTmpF:string,idCesiTmpF:string, fechaSeleccionadaCal:any){
      this.loading=true;
      this.error= false;
      console.log('Dia seleccionada:'+ fechaSeleccionadaCal);
      this.appointment.appointmentDay= fechaSeleccionadaCal;
       this._service.getHorariosDisponibles(idServiceTmpF,idCesiTmpF,fechaSeleccionadaCal)
       .subscribe(  data =>{

             console.log(data);
             if(data.codigoRetorno== '0'){
               this.listHorarios=data.listaCitasDisponibles
               this.muestraHorarios=true;
             }else{
               this.mensajeError=data.msjError;
               this.error= true;
               this.muestraHorarios=false;
             }
              this.loading=false;
       }, (errorService) => {
         console.log('Error') ;
         console.log(errorService) ;
         this.mensajeError="Error al conectar al RestController";
         this.error= true;
         this.loading=false;
       });

     }



   agendarCita(horario:string){
     this.loading=true;
     this.error= false;
     this.appointment.appointmentHour=horario;
     this._service.currentAppointmentSetValue(this.appointment);
     this.loading=false;
     this.router.navigate(['/recervarCitas'])
   }

   regresar(){
         this.router.navigate(['/serviciosCitas'])
   }

}
