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

  async getCurrentUser() {
    this.firebaseSvc.getCurrentUserWithRole().subscribe((user: User) => {
      this.user = user;
      this.userRole = user.role;
      if (this.userRole === 'Docente') {
        this.getMaestroMateriaAndAlumnos();
      } else {
        this.getAlumnos();
      }
    });
  }

  async getMaestroMateriaAndAlumnos() {
    this.firebaseSvc.getMaestroByEmail(this.user.email).subscribe((maestro: any) => {
      if (maestro && maestro.materiaId) {
        this.materiaId = maestro.materiaId;
        this.getAlumnosByMateria();
      } else {
        console.log("No se encontró la materia del maestro.");
        this.loading = false;
      }
    });
  }


  async getMaestroMateria() {
    this.firebaseSvc.getMaestroByEmail(this.user.email).subscribe((maestro: any) => {
      if (maestro && maestro.materiaId) {
        this.materiaId = maestro.materiaId;
        this.getAlumnosByMateria(); // Obtener alumnos de la materia del docente
      } else {
        console.log("No se encontró la materia del maestro.");
        this.loading = false;
      }
    });
  }

  async getAlumnosByMateria() {
    this.loading = true;
    this.firebaseSvc.getAlumnosByMateria(this.materiaId).subscribe({
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
