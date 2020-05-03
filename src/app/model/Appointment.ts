export class Appointment{


  idKiosco?:string;
  
  day?:string;
  month?:string;
  year?:string;
  months?:any;

  hour?:string;
  minute?:string;
  
  idservice?:string;
  serviceName?:string;
  idState?:string;
  stateName?:string;
  cesiId?:string;
  cesiLocation?:string;
  cesiName?:string;

  services?:any;
  states?:any;
  cesis?:any;

  listAppointments?:any;


  appointmentDay?:any;
  appointmentHour?:any;
  calendarMonth?:null;
  calendarYear?:null;
  dayMax?:number;
  dayMin?:number;
  enabledDay?:any;
  fistEnabledDay?:string;
  
  consultedMonth?:number;

  appointmentId?:string;
  ts?:string;
  appointmentCode?:string;
  stateId?:string;
  customField1?:string;
  creatorUserCode?:string;
  creationChannelId?:string;
  quotaChannelId?:string;


  reservationId?:any;
  idConfirmation?:any;
  requirements?:string;
  listRequirements?:any;

  nss?:string;
  name?:string;
  lastName?:string;
  mail?:string;
  phone?:string;
  movilePhone?:string;

  lat?: number;
  lng?: number;

  isChangeAppointment?:boolean;

  idClient?:string;
  arrayOfAppointmentServiceVO?:any;

}