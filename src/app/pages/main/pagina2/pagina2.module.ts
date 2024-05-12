import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Pagina2PageRoutingModule } from './pagina2-routing.module'; // Importa el enrutador de la página 2
import { Pagina2Page } from './pagina2.page'; // Importa la página 2
import { SharedModule } from 'src/app/shared/shared.module'; // Importa el módulo compartido
import { NgxPaginationModule } from 'ngx-pagination'; // Importa el módulo de paginación

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxPaginationModule, // Importa el módulo de paginación
    Pagina2PageRoutingModule,
    SharedModule // Importa el módulo compartido
  ],
  declarations: [Pagina2Page] // Declara la página 2 como parte del módulo
})
export class Pagina2PageModule {} // Exporta el módulo de la página 2
