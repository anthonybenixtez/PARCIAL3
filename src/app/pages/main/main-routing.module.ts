import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'pagina1',
        loadChildren: () => import('./pagina1/pagina1.module').then( m => m.Pagina1PageModule)
      },
      {
        path: 'pagina2',
        loadChildren: () => import('./pagina2/pagina2.module').then( m => m.Pagina2PageModule)
      },
      {
        path: 'pagina4',
        loadChildren: () => import('./pagina4/pagina4.module').then( m => m.Pagina4PageModule)
      },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
