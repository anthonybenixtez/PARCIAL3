import { Component, OnInit, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateMaestrosComponent } from 'src/app/shared/components/add-update-maestros/add-update-maestros.component';
import { MaestrosDetailComponent } from 'src/app/shared/components/maestros-detail/maestros-detail.component';
import { User } from 'src/app/models/user.model'; // Asegúrate de importar el modelo de usuario aquí
import { Maestros } from 'src/app/models/maestros.model';

@Component({
  selector: 'app-pagina2',
  templateUrl: './pagina2.page.html',
  styleUrls: ['./pagina2.page.scss'],
})
export class Pagina2Page implements OnInit {

  page: number; // Variable para controlar la página actual

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService)
  constructor(private modalController: ModalController) { }



  loading: boolean = false;
  maestros: Maestros[] = [];
  maestroSeleccionado: Maestros;
  userRole: string = ''; // Aquí deberías obtener el rol del usuario



  ngOnInit() {

    this.getUserRole(); // Llamamos a la función para obtener el rol del usuario al inicializar el componente
  
  }


  //============= Agregar o Actualizar maestros====================

  async AddUpdateMaestros(maestros?: Maestros) {
    let success = await this.utilsSvc.presentModal({
      component: AddUpdateMaestrosComponent,
      cssClass: 'add-update-modal',
      componentProps: {maestros}
    })


    if (success) this.getMaestros();
  }


  ionViewWillEnter() {
    this.getMaestros();
  }

  // Función para abrir el detalle del cultivo seleccionado
  async maestrosDetail(maestro?: Maestros) {
    let success = await this.utilsSvc.presentModal({
      component: MaestrosDetailComponent,
      cssClass: 'maestros-detal-modal',
      componentProps: {maestro} // Pasa el cultivo específico al modal
    });

    if (success) this.getMaestros();
  }

  //================== Obtener Productos=====================
  getMaestros() {
    let path = `/Maestros`;

    this.loading = true;

    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        console.log(res);
        this.maestros = res;

        this.loading = false;

        sub.unsubscribe();
      }
    })

  }

  async confirmDeleteMaestros(maestros: Maestros) {
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
            this.deleteMaestros(maestros)
          }
        }
      ]
    });

  }

  //==================== Eliminar Producto ======================
  async deleteMaestros(maestros: Maestros) {

    let path = `/Maestros/${maestros.aid}`

    const loading = await this.utilsSvc.loading();
    await loading.present();

    this.firebaseSvc.deleteDocument(path).then(async res => {

      this.maestros = this.maestros.filter(m => m.aid !== maestros.aid);

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
