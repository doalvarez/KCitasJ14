export interface DatosCita{

  nss?:string;

  name?:string;
  fullName?:string;
  lastName?:string;
  mail?: string;
  movilePhone?: string;
	phone?:string;

  hour?:string;
  minute?:string;

  idservice?:string;
  serviceName?:string;
  stateName?:string;
  idState?:string;
  cesiId?:string;
  appointmentDay?:any;
  appointmentHour?:any;

  cesiLocation?:string;
  cesiName?:string,
  consultedMonth?:number;
  reservationId?:any;
  //confirmationId?:any;
  idConfirmation?:string;
  listaRequirements?:any;
  
  idClient?:string;
  appointmentId?:string;
  ts?:string;
  appointmentCode?:string;
  stateId?:string;
  customField1?:string;
  creatorUserCode?:string;
  creationChannelId?:string;
  quotaChannelId?:string;
}
