import { Component, OnInit, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateAlumnosComponent } from 'src/app/shared/components/add-update-alumnos/add-update-alumnos.component';
import { AlumnosDetailComponent } from 'src/app/shared/components/alumnos-detail/alumnos-detail.component';
import { User } from 'src/app/models/user.model'; // Asegúrate de importar el modelo de usuario aquí
import { Alumnos } from 'src/app/models/alumnos.model';

@Component({
  selector: 'app-pagina4',
  templateUrl: './pagina4.page.html',
  styleUrls: ['./pagina4.page.scss'],
})
export class Pagina4Page implements OnInit {
 firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService)
  constructor(private modalController: ModalController) { }

  loading: boolean = false;
  alumnos: Alumnos[] = [];
  alumnoSeleccionado: Alumnos;
  userRole: string = ''; // Aquí deberías obtener el rol del usuario



  ngOnInit() {

    this.getUserRole(); // Llamamos a la función para obtener el rol del usuario al inicializar el componente
  
  }


  //============= Agregar o Actualizar alumnos====================

  async AddUpdateAlumnos(alumnos?: Alumnos) {
    let success = await this.utilsSvc.presentModal({
      component: AddUpdateAlumnosComponent,
      cssClass: 'add-update-modal',
      componentProps: {alumnos}
    })


    if (success) this.getAlumnos();
  }


  ionViewWillEnter() {
    this.getAlumnos();
  }

  // Función para abrir el detalle del cultivo seleccionado
  async alumnosDetail(alumno?: Alumnos) {
    let success = await this.utilsSvc.presentModal({
      component: AlumnosDetailComponent,
      cssClass: 'alumnos-detal-modal',
      componentProps: {alumno} // Pasa el cultivo específico al modal
    });

    if (success) this.getAlumnos();
  }

  //================== Obtener Productos=====================
  getAlumnos() {
    let path = `/Alumnos`;

    this.loading = true;

    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        console.log(res);
        this.alumnos = res;

        this.loading = false;

        sub.unsubscribe();
      }
    })

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
            this.deleteAlumnos(alumnos)
          }
        }
      ]
    });

  }

  //==================== Eliminar Producto ======================
  async deleteAlumnos(alumnos: Alumnos) {

    let path = `/Alumnos/${alumnos.eid}`

    const loading = await this.utilsSvc.loading();
    await loading.present();

    this.firebaseSvc.deleteDocument(path).then(async res => {

      this.alumnos = this.alumnos.filter(a => a.eid !== alumnos.eid);

      this.utilsSvc.presentToast({
        message: 'Maestro eliminado exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      })




    }).catch(error => {
      console.log("error");

      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      })

    }).finally(() => {
      loading.dismiss();
    })

  }


  getUserRole() {
    this.firebaseSvc.getCurrentUserWithRole().subscribe((user: User) => {
      if (user) {
        // Suponemos que 'user.role' es el campo que contiene el rol del usuario en Firestore
        this.userRole = user.role;
      }
    });
  }

}


