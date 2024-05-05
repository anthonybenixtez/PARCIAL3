import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
pages = [
  {title: 'Pagina Principal', url: '/main/home', icon: 'home-outline'},
  {title: 'Materias', url: '/main/pagina1', icon: 'albums-outline'},
  {title: 'Maestros', url: '/main/pagina2', icon: 'people'},
  {title: 'Alumnos', url: '/main/pagina4', icon: 'school'},
]

router= inject(Router);
firebaseSvc = inject(FirebaseService);
utilsSvc = inject(UtilsService);

currentPath: string = '';

  ngOnInit() {

    this.router.events.subscribe((event: any)=>{
      if(event?.url) this.currentPath = event.url;

    })
  }


  user(): User{
    return this.utilsSvc.getFromLocalStorage('user');
  }

  //============== Cerrar Sesion ====================
  signOut(){
    this.firebaseSvc.signOut();
  }

}
