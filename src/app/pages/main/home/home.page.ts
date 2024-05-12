import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service'; // Importa el servicio de Firebase
import { UtilsService } from 'src/app/services/utils.service'; // Importa el servicio de utilidades
import { User } from 'src/app/models/user.model'; // Importa el modelo de usuario

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html', // Plantilla HTML asociada al componente
  styleUrls: ['./home.page.scss'], // Estilos asociados al componente
})
export class HomePage implements OnInit {
  showWelcomeContent: boolean = false; // Variable para controlar la visibilidad del contenido de bienvenida
  userRole: string = ''; // Variable para almacenar el rol del usuario

  constructor(
    private firebaseSvc: FirebaseService, // Inyección del servicio de Firebase
    private utilsSvc: UtilsService // Inyección del servicio de utilidades
  ) { }

  ngOnInit() {
    this.getUserRole(); // Llama a la función para obtener el rol del usuario al inicializar el componente
  }

  getUserRole() {
    // Función para obtener el rol del usuario desde Firebase
    this.firebaseSvc.getCurrentUserWithRole().subscribe((user: User) => {
      if (user) {
        this.userRole = user.role; // Asigna el rol del usuario
      }
    });
  }

  signOut(){
    this.firebaseSvc.signOut(); // Función para cerrar sesión
  }

  toggleWelcomeContent() {
    this.showWelcomeContent = !this.showWelcomeContent; // Alterna la visibilidad del contenido de bienvenida
  }
}
