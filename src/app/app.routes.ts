
import { Routes} from '@angular/router';
import { DatosContactoComponent } from './components/datosContacto/datos-contacto.component';
import { IdentificateComponent } from './components/identificate/identificate.component';
import { OpcionesServicioComponent} from './components/opcionesServicio/opcionesServicio.component';
import { DisponibilidadComponent} from './components/disponibilidad/disponibilidad.component';
import { RecervaComponent } from './components/recerva/recerva.component';
import { CitaConfirmadaComponent } from './components/citaConfirmada/citaConfirmada.component';
import { MenuCitasComponent } from './components/menu-citas/menu-citas.component';
import { DetalleCitaComponent } from './components/detalle-cita/detalle-cita.component';
import { SinservicioComponent } from './components/sinservicio/sinservicio.component';

export const ROUTES: Routes =[

  { path: 'identificate', component: IdentificateComponent },
  { path: 'datosContacto', component: DatosContactoComponent},
  { path: 'serviciosCitas', component: OpcionesServicioComponent},
  { path: 'disponibilidadCitas', component: DisponibilidadComponent},
  { path: 'recervarCitas', component: RecervaComponent},
  { path: 'citaConfirmada', component: CitaConfirmadaComponent},
  { path: 'menuCitas', component: MenuCitasComponent},
  { path: 'consultaCita', component: DetalleCitaComponent},
  { path: 'sinServicio', component: SinservicioComponent},

  { path: '', pathMatch:'full', redirectTo:'identificate'},
  { path: '**', pathMatch:'full', redirectTo:'identificate'}
];
