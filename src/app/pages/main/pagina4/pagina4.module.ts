import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa el módulo para el uso de directivas de Angular comunes
import { FormsModule } from '@angular/forms'; // Importa el módulo para el manejo de formularios en Angular

import { IonicModule } from '@ionic/angular'; // Importa el módulo de Ionic para la integración con componentes y estilos de Ionic

import { Pagina4PageRoutingModule } from './pagina4-routing.module'; // Importa el enrutador de la página 4

import { Pagina4Page } from './pagina4.page'; // Importa la página 4

import { SharedModule } from 'src/app/shared/shared.module'; // Importa el módulo compartido que contiene componentes reutilizables

// Importación del módulo de paginación
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule, // Importa el módulo de CommonModule
    FormsModule, // Importa el módulo de FormsModule
    IonicModule, // Importa el módulo de IonicModule para la integración con Ionic
    NgxPaginationModule, // Importa el módulo de paginación
    Pagina4PageRoutingModule, // Importa el enrutador de la página 4
    SharedModule // Importa el módulo compartido
  ],
  declarations: [Pagina4Page] // Declara la página 4 como parte del módulo
})
export class Pagina4PageModule {} // Exporta el módulo de la página 4
