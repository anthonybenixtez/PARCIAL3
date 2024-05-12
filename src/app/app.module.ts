import { NgModule } from '@angular/core'; // Importa NgModule desde Angular Core
import { BrowserModule } from '@angular/platform-browser'; // Importa BrowserModule para la aplicación web
import { RouteReuseStrategy } from '@angular/router'; // Importa RouteReuseStrategy para la estrategia de reutilización de rutas
import { HttpClientModule } from '@angular/common/http'; // Importa HttpClientModule para realizar solicitudes HTTP
import { IonicModule, IonicRouteStrategy } from '@ionic/angular'; // Importa IonicModule y IonicRouteStrategy desde Ionic

import { NgxPaginationModule } from 'ngx-pagination'; // Importa NgxPaginationModule para la paginación

import { AppComponent } from './app.component'; // Importa AppComponent, el componente raíz
import { AppRoutingModule } from './app-routing.module'; // Importa AppRoutingModule, el módulo de enrutamiento

// Importaciones de Firebase
import { AngularFireModule } from '@angular/fire/compat'; // Importa AngularFireModule para la integración con Firebase
import { environment } from 'src/environments/environment'; // Importa el entorno de configuración de Firebase

import * as pdfMake from 'pdfmake/build/pdfmake'; // Importa pdfMake para la generación de PDF
import * as pdfFonts from 'pdfmake/build/vfs_fonts'; // Importa pdfFonts para los tipos de letra de PDF

@NgModule({
  declarations: [AppComponent], // Declara el componente raíz
  imports: [
    BrowserModule, // Importa BrowserModule para la aplicación web
    IonicModule.forRoot({mode: 'md'}), // Configura Ionic con el modo 'md' (material design)
    AppRoutingModule, // Importa el módulo de enrutamiento
    HttpClientModule, // Importa el módulo de solicitudes HTTP
    AngularFireModule.initializeApp(environment.firebaseConfig), // Configura la inicialización de Firebase con la configuración del entorno
    NgxPaginationModule // Importa el módulo de paginación
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy } // Proporciona la estrategia de reutilización de rutas para la navegación
  ],
  bootstrap: [AppComponent], // Establece el componente raíz para iniciar la aplicación
})
export class AppModule {} // Define el módulo principal AppModule
