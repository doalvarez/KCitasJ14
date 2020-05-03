import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEs);
import { RouterModule} from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//Material
import { AngularMaterialModule } from './angular-material.module';

//Components
import { IdentificateComponent } from './components/identificate/identificate.component';
import { DatosContactoComponent } from './components/datosContacto/datos-contacto.component';
import { LoadingComponent } from './components/shared/loading/loading.component';
import { DisponibilidadComponent } from './components/disponibilidad/disponibilidad.component';
import { RecervaComponent } from './components/recerva/recerva.component';
import { CitaConfirmadaComponent } from './components/citaConfirmada/citaConfirmada.component';
import { OpcionesServicioComponent } from './components/opcionesServicio/opcionesServicio.component';
import { SinservicioComponent } from './components/sinservicio/sinservicio.component';
import { MenuCitasComponent } from './components/menu-citas/menu-citas.component';
import { DetalleCitaComponent } from './components/detalle-cita/detalle-cita.component';
import { ModalDialogModificaComponent } from './components/modal-dialog-modifica/modal-dialog-modifica.component';
import { ModalDialogCancelaComponent } from './components/modalDialogCancela/modalDialogCancela.component';


//Routes
import { ROUTES} from './app.routes';

//http
import { HttpClientModule } from '@angular/common/http';

// Google Maps
import { AgmCoreModule } from '@agm/core';


@NgModule({
  declarations: [
    AppComponent,
    IdentificateComponent,
    DatosContactoComponent,
    OpcionesServicioComponent,
    LoadingComponent,
    DisponibilidadComponent,
    RecervaComponent,
    CitaConfirmadaComponent,
    SinservicioComponent,
    MenuCitasComponent,
    DetalleCitaComponent,
    ModalDialogCancelaComponent,
    ModalDialogModificaComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot( ROUTES,  {useHash:true}),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB7fkk6CsN5M9bX7uzMtUHx3kIPI1sl6XY'
    })
  ],
  providers: [
    
    { provide: LOCALE_ID, useValue: "es-ES" }
 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
