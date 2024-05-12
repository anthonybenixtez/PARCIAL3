import { NgModule } from '@angular/core'; // Importa el decorador NgModule desde el núcleo de Angular
import { CommonModule } from '@angular/common'; // Importa el módulo CommonModule para funcionalidades comunes
import { FormsModule } from '@angular/forms'; // Importa el módulo FormsModule para manejar formularios en Angular

import { IonicModule } from '@ionic/angular'; // Importa el módulo IonicModule de Ionic para componentes de IU móviles

import { ProfilePageRoutingModule } from './profile-routing.module'; // Importa el módulo de enrutamiento de la página de perfil

import { ProfilePage } from './profile.page'; // Importa la clase de la página de perfil

@NgModule({
  imports: [
    CommonModule, // Importa el módulo CommonModule
    FormsModule, // Importa el módulo FormsModule
    IonicModule, // Importa el módulo IonicModule
    ProfilePageRoutingModule // Importa el módulo de enrutamiento de la página de perfil
  ],
  declarations: [ProfilePage] // Declara la página de perfil como componente de este módulo
})
export class ProfilePageModule {} // Exporta el módulo de la página de perfil
