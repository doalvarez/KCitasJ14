export interface Trabajador{

  nss:string;
  idKiosco:string;
  dia?:string;
  mes?:string;
  anio?:string;
  meses?:any;
  nombre?:string;
  nombreCompleto?:string;
  apellidoPaterno?:string;
  apellidoMaterno?:string;
  celular?:number;
  correo?:string;
  lada?:number;
  telefono?:number;
  servicioId?:string;
  nombreServicio?:string;
  estadoId?:string;
  nombreEstado?:string,
  cesiId?:string,
  cesiUbicacion?:string,
  nombreCesi?:string,

  servicios?:any;
  estados?:any;
  cesis?:any;


  diaCita?:any;
  horaCita?:any;
  mesCalendar?:null;
  anioCalendar?:null;
  diaMax?:number;
  diaMin?:number;
  diasHabilitados?:any;
  primerDiahabilitado?:string,
  mesConsultado?:number;

  reservacionId?:any;
  confirmacionId?:any;
  requerimientos?:string;
  listrequisitos?:any;

  lat?: number;
  lng?: number;
}
