import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Pagina4PageRoutingModule } from './pagina4-routing.module';

import { Pagina4Page } from './pagina4.page';
import { SharedModule } from 'src/app/shared/shared.module';

//Importacion de paginador
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxPaginationModule, // Importa el módulo aquí
    Pagina4PageRoutingModule,
    SharedModule
  ],
  declarations: [Pagina4Page]
})
export class Pagina4PageModule {}
