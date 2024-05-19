import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddUpdateAlumnosComponent } from 'src/app/shared/components/add-update-alumnos/add-update-alumnos.component';
import { AlumnosDetailComponent } from 'src/app/shared/components/alumnos-detail/alumnos-detail.component';
import { User } from 'src/app/models/user.model';
import { Alumnos } from 'src/app/models/alumnos.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-pagina4',
  templateUrl: './pagina4.page.html',
  styleUrls: ['./pagina4.page.scss'],
})
export class Pagina4Page implements OnInit {

  page: number; // Variable para controlar la página actual
  constructor(
    private modalController: ModalController,
    private firebaseSvc: FirebaseService,
    public utilsSvc: UtilsService
  ) {}
  
  loading = false;
  alumnos: Alumnos[] = [];
  user: User;
  userRole: string = '';
  materiaId: string;

  ngOnInit() {
    this.getCurrentUser();
  }

// Esta función asincrónica se encarga de obtener el usuario actual del servicio de Firebase
async getCurrentUser() {
  // Se llama a la función `getCurrentUserWithRole()` del servicio de Firebase y se suscribe a los cambios
  this.firebaseSvc.getCurrentUserWithRole().subscribe((user: User) => {
      // Cuando se recibe el usuario, se almacena en la variable `this.user`
      this.user = user;
      // Se almacena el rol del usuario en la variable `this.userRole`
      this.userRole = user.role;
      // Si el rol del usuario es "Docente"
      if (this.userRole === 'Docente') {
          // Se llama a la función `getMaestroMateriaAndAlumnos()` para obtener los datos relacionados con el maestro y sus alumnos
          this.getMaestroMateriaAndAlumnos();
      } else {
          // Si el rol del usuario no es "Docente", se llama a la función `getAlumnos()` para obtener los datos de los alumnos
          this.getAlumnos();
      }
  });
}


// Esta función asincrónica se encarga de obtener información sobre el maestro, su materia y sus alumnos.
async getMaestroMateriaAndAlumnos() {
  // Se llama a la función `getMaestroByEmail()` del servicio de Firebase y se suscribe a los cambios
  this.firebaseSvc.getMaestroByEmail(this.user.email).subscribe((maestro: any) => {
      // Se verifica si se ha obtenido información válida sobre el maestro y su materia
      if (maestro && maestro.materiaId) {
          // Si se encontró información sobre la materia del maestro, se almacena el ID de la materia en la variable `this.materiaId`
          this.materiaId = maestro.materiaId;
          // Se llama a la función `getAlumnosByMateria()` para obtener los alumnos asociados a esa materia
          this.getAlumnosByMateria();
      } else {
          // Si no se encuentra información sobre la materia del maestro, se muestra un mensaje de error en la consola
          console.log("No se encontró la materia del maestro.");
          // Se desactiva el indicador de carga (loading)
          this.loading = false;
      }
  });
}


// Esta función asincrónica se encarga de obtener la materia del maestro utilizando su correo electrónico.
async getMaestroMateria() {
  // Se llama a la función `getMaestroByEmail()` del servicio de Firebase y se suscribe a los cambios.
  this.firebaseSvc.getMaestroByEmail(this.user.email).subscribe((maestro: any) => {
      // Se verifica si se ha obtenido información válida sobre el maestro y su materia.
      if (maestro && maestro.materiaId) {
          // Si se encontró información sobre la materia del maestro, se almacena el ID de la materia en la variable `this.materiaId`.
          this.materiaId = maestro.materiaId;
          // Se llama a la función `getAlumnosByMateria()` para obtener los alumnos asociados a esa materia.
          this.getAlumnosByMateria(); // Obtener alumnos de la materia del docente
      } else {
          // Si no se encuentra información sobre la materia del maestro, se muestra un mensaje de error en la consola.
          console.log("No se encontró la materia del maestro.");
          // Se desactiva el indicador de carga (loading).
          this.loading = false;
      }
  });
}

// Esta función asincrónica se encarga de obtener los alumnos asociados a una materia específica.
async getAlumnosByMateria() {
  // Se activa el indicador de carga (loading).
  this.loading = true;
  // Se llama a la función `getAlumnosByMateria()` del servicio de Firebase y se suscribe a los cambios.
  this.firebaseSvc.getAlumnosByMateria(this.materiaId).subscribe({
      // Cuando se obtiene una respuesta exitosa, se procesa la respuesta.
      next: (res: any) => {
          // Se muestra la respuesta en la consola.
          console.log(res);
          // Se almacenan los alumnos obtenidos en la variable `this.alumnos`.
          this.alumnos = res;
          // Se desactiva el indicador de carga (loading).
          this.loading = false;
      },
      // Si ocurre un error al obtener los alumnos, se maneja el error.
      error: (error: any) => {
          // Se muestra un mensaje de error en la consola.
          console.log("Error al obtener alumnos:", error);
          // Se desactiva el indicador de carga (loading).
          this.loading = false;
      }
  });
}


  isAlumnoInMaestroMateria(alumno: Alumnos): boolean {
    // Verificar si el usuario es un docente y tiene una materia asociada
    if (this.userRole === 'Docente' && this.materiaId) {
      // Comprobar si el ID de la materia del alumno coincide con el ID de la materia del docente
      return alumno.materiaId === this.materiaId;
    }
    // Si el usuario no es un docente o no tiene una materia asociada, devolver false
    return false;
  }
  
  async AddUpdateAlumnos(alumnos?: Alumnos) {
    let success = await this.utilsSvc.presentModal({
      component: AddUpdateAlumnosComponent,
      cssClass: 'add-update-modal',
      componentProps: {alumnos}
    });
    
    if (success) {
      if (this.userRole === 'Docente' && this.materiaId) {
        this.getAlumnosByMateria(); // Obtener alumnos de la materia del docente
      } else {
        this.getAlumnos(); // Obtener todos los alumnos
      }
    }
  }
  ionViewWillEnter() {
    this.getAlumnos();
  }

  async alumnosDetail(alumno?: Alumnos) {
    let success = await this.utilsSvc.presentModal({
      component: AlumnosDetailComponent,
      cssClass: 'alumnos-detail-modal',
      componentProps: {alumno}
    });

    if (success) this.getAlumnos();
  }

  async getAlumnos() {
    this.loading = true;
    const path = '/Alumnos'; // Obtener todos los alumnos sin ninguna condición adicional
    this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        console.log(res);
        this.alumnos = res;
        this.loading = false;
      },
      error: (error: any) => {
        console.log("Error al obtener alumnos:", error);
        this.loading = false;
      }
    });
  }
 
  

  async deleteAlumnos(alumnos: Alumnos) {
    const path = `/Alumnos/${alumnos.aid}`;
    const loading = await this.utilsSvc.loading();
    await loading.present();
  
    this.firebaseSvc.deleteDocument(path).then(async res => {
      if (this.userRole === 'Docente' && this.materiaId) {
        this.getAlumnosByMateria(); // Obtener alumnos de la materia del docente
      } else {
        this.getAlumnos(); // Obtener todos los alumnos
      }
      this.utilsSvc.presentToast({
        message: 'Maestro eliminado exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
    }).catch(error => {
      console.log("error");
      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    }).finally(() => {
      loading.dismiss();
    });
  }
  


  async confirmDeleteAlumnos(alumnos: Alumnos) {
    this.utilsSvc.presentAlert({
      header: 'Eliminar Maestro',
      message: '¿Estas seguro de quere eliminar este maestro?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
        }, {
          text: 'Sí, eliminar',
          handler: () => {
            this.deleteAlumnos(alumnos);
          }
        }
      ]
    });
  }

  
}
