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

  @Input() isAuth: boolean = false; // Recibe el valor de isAuth desde el componente padre
  @Input() title!: string;
  @Input() backButton!: string;
  @Input() isModal!: boolean;
  @Input() showMenu!: boolean;

  userRole: string = ''; // Aquí almacenaremos el rol del usuario
  showSearch: boolean = false;


  constructor(private utilsSvc: UtilsService, private firebaseSvc: FirebaseService) { }

  toggleSearch() {
    this.showSearch = !this.showSearch;
  }

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

  dismissModal(){
    this.utilsSvc.dismissModal();
  }
}
