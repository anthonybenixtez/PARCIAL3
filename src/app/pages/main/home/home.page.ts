import { Component, inject, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model'; // Asegúrate de importar el modelo de usuario aquí

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc= inject(FirebaseService);
  utilsSvc= inject(UtilsService)
  userRole: string = ''; // Aquí deberías obtener el rol del usuario

  
  ngOnInit() {
    this.getUserRole(); // Llamamos a la función para obtener el rol del usuario al inicializar el componente

  }

  getUserRole() {
    this.firebaseSvc.getCurrentUserWithRole().subscribe((user: User) => {
      if (user) {
        // Suponemos que 'user.role' es el campo que contiene el rol del usuario en Firestore
        this.userRole = user.role;
      }
    });
  }

  signOut(){
    this.firebaseSvc.signOut();
  }
}
