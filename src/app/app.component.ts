import { Component, Inject } from '@angular/core';
import { Appointment } from './model/Appointment';
import { AppointmentService } from './services/appointment.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  appointment: Appointment;

  constructor( private appointmentService: AppointmentService) {

    this.appointmentService.currentAppointment.subscribe ( citaTmp => this.appointment = citaTmp);
  }



}
