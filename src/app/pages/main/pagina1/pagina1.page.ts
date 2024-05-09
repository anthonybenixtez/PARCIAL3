import { Component, OnInit, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Materias } from 'src/app/models/materias.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateMateriasComponent } from 'src/app/shared/components/add-update-materias/add-update-materias.component';
import { MateriasDetailComponent } from 'src/app/shared/components/materias-detail/materias-detail.component';
import { User } from 'src/app/models/user.model'; // Asegúrate de importar el modelo de usuario aquí


@Component({
  selector: 'app-pagina1',
  templateUrl: './pagina1.page.html',
  styleUrls: ['./pagina1.page.scss'],
})
export class Pagina1Page implements OnInit {
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService)
  constructor(private modalController: ModalController) { }

  loading: boolean = false;
  materias: Materias[] = [];
  cultivoSeleccionado: Materias;
  userRole: string = ''; // Aquí deberías obtener el rol del usuario


  ngOnInit() {

    this.getUserRole(); // Llamamos a la función para obtener el rol del usuario al inicializar el componente

  }


  //============= Agregar o Actualizar materias====================

  async AddUpdateMaterias(materias?: Materias) {
    let success = await this.utilsSvc.presentModal({
      component: AddUpdateMateriasComponent,
      cssClass: 'add-update-modal',
      componentProps: {materias}
    })


    if (success) this.getMaterias();
  }


  ionViewWillEnter() {
    this.getMaterias();
  }

  // Función para abrir el detalle del cultivo seleccionado
  async materiasDetail(materia?: Materias) {
    let success = await this.utilsSvc.presentModal({
      component: MateriasDetailComponent,
      cssClass: 'materias-detal-modal',
      componentProps: {materia} // Pasa el cultivo específico al modal
    });

    if (success) this.getMaterias();
  }

  //================== Obtener Productos=====================
  getMaterias() {
    let path = `/Materias`;

    this.loading = true;

    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        console.log(res);
        this.materias = res;

        this.loading = false;

        sub.unsubscribe();
      }
    })

  }

  async confirmDeleteMaterias(materias: Materias) {
    this.utilsSvc.presentAlert({
      header: 'Eliminar Materia',
      message: '¿Estas seguro de quere eliminar este materia?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
        }, {
          text: 'Sí, eliminar',
          handler: () => {
            this.deleteMaterias(materias)
          }
        }
      ]
    });

  }

  //==================== Eliminar Producto ======================
  async deleteMaterias(materias: Materias) {

    let path = `/Materias/${materias.aid}`

    const loading = await this.utilsSvc.loading();
    await loading.present();

    this.firebaseSvc.deleteDocument(path).then(async res => {

      this.materias = this.materias.filter(m => m.aid !== materias.aid);

      this.utilsSvc.presentToast({
        message: 'Materia eliminado exitosamente',
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
