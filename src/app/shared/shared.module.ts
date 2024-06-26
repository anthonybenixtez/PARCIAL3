import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { HeaderComponent } from './components/header/header.component';
import { LogoComponent } from './components/logo/logo.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddUpdateMateriasComponent } from './components/add-update-materias/add-update-materias.component';
import { MateriasDetailComponent } from './components/materias-detail/materias-detail.component';
import { MaestrosDetailComponent } from './components/maestros-detail/maestros-detail.component';
import { AddUpdateMaestrosComponent } from './components/add-update-maestros/add-update-maestros.component';
import { AddUpdateAlumnosComponent } from './components/add-update-alumnos/add-update-alumnos.component';
import { AlumnosDetailComponent } from './components/alumnos-detail/alumnos-detail.component';



@NgModule({
  declarations: [
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    AddUpdateMateriasComponent,
    MateriasDetailComponent,
    MaestrosDetailComponent,
    AddUpdateMaestrosComponent,
    AddUpdateAlumnosComponent,
    AlumnosDetailComponent
    
  ],
  exports: [
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    ReactiveFormsModule,
    CommonModule,
    AddUpdateMateriasComponent,
    MateriasDetailComponent,
    MaestrosDetailComponent,
    AddUpdateMaestrosComponent,
    AddUpdateAlumnosComponent,
    AlumnosDetailComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SharedModule { }
