import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() title!: string;
  @Input() backButton!: string;
  @Input() isModal!: boolean;
  @Input() showMenu!: boolean;

  userRole: string = ''; // Aquí almacenaremos el rol del usuario

  constructor(private utilsSvc: UtilsService, private firebaseSvc: FirebaseService) { }

  ngOnInit() {
    this.getUserRole(); // Llamamos a la función para obtener el rol del usuario al cargar el componente
  }

  // Función para obtener el rol del usuario desde Firebase
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
