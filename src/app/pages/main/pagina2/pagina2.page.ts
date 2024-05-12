import { Component, OnInit, inject } from '@angular/core';
import { ModalController } from '@ionic/angular'; // Importa el controlador de modales de Ionic
import { FirebaseService } from 'src/app/services/firebase.service'; // Importa el servicio de Firebase
import { UtilsService } from 'src/app/services/utils.service'; // Importa el servicio de utilidades
import { AddUpdateMaestrosComponent } from 'src/app/shared/components/add-update-maestros/add-update-maestros.component'; // Importa el componente de agregar/actualizar maestros
import { MaestrosDetailComponent } from 'src/app/shared/components/maestros-detail/maestros-detail.component'; // Importa el componente de detalle de maestros
import { User } from 'src/app/models/user.model'; // Importa el modelo de usuario
import { Maestros } from 'src/app/models/maestros.model'; // Importa el modelo de maestros

@Component({
  selector: 'app-pagina2',
  templateUrl: './pagina2.page.html', // Plantilla HTML asociada al componente
  styleUrls: ['./pagina2.page.scss'], // Estilos asociados al componente
})
export class Pagina2Page implements OnInit {

  page: number; // Variable para controlar la página actual

  firebaseSvc = inject(FirebaseService); // Inyección del servicio de Firebase
  utilsSvc = inject(UtilsService); // Inyección del servicio de utilidades

  constructor(private modalController: ModalController) { } // Constructor del componente

  loading: boolean = false; // Variable para controlar el estado de carga
  maestros: Maestros[] = []; // Arreglo para almacenar los maestros
  maestroSeleccionado: Maestros; // Variable para almacenar el maestro seleccionado
  userRole: string = ''; // Variable para almacenar el rol del usuario

  ngOnInit() {
    this.getUserRole(); // Llamamos a la función para obtener el rol del usuario al inicializar el componente
  }

  // Función para agregar o actualizar maestros
  async AddUpdateMaestros(maestros?: Maestros) {
    let success = await this.utilsSvc.presentModal({
      component: AddUpdateMaestrosComponent, // Componente de agregar/actualizar maestros
      cssClass: 'add-update-modal',
      componentProps: {maestros} // Propiedades del componente modal
    });

    if (success) this.getMaestros(); // Si se realizó con éxito, actualiza la lista de maestros
  }

  // Función que se ejecuta al ingresar a la página
  ionViewWillEnter() {
    this.getMaestros(); // Obtiene la lista de maestros al ingresar a la página
  }

  // Función para abrir el detalle de un maestro
  async maestrosDetail(maestro?: Maestros) {
    let success = await this.utilsSvc.presentModal({
      component: MaestrosDetailComponent, // Componente de detalle de maestros
      cssClass: 'maestros-detal-modal',
      componentProps: {maestro} // Propiedades del componente modal
    });

    if (success) this.getMaestros(); // Si se realizó con éxito, actualiza la lista de maestros
  }

  // Función para obtener la lista de maestros
  getMaestros() {
    let path = `/Maestros`; // Ruta de la colección de maestros en Firebase

    this.loading = true; // Establece el estado de carga como verdadero

    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        console.log(res); // Muestra en la consola la respuesta obtenida
        this.maestros = res; // Asigna la respuesta a la lista de maestros

        this.loading = false; // Establece el estado de carga como falso

        sub.unsubscribe(); // Cancela la suscripción al observable
      }
    });
  }

  // Función para confirmar la eliminación de un maestro
  async confirmDeleteMaestros(maestros: Maestros) {
    this.utilsSvc.presentAlert({
      header: 'Eliminar Maestro',
      message: '¿Estás seguro de querer eliminar este maestro?', // Mensaje de confirmación
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
        }, {
          text: 'Sí, eliminar',
          handler: () => {
            this.deleteMaestros(maestros); // Manejador de eventos para la eliminación del maestro
          }
        }
      ]
    });
  }

  // Función para eliminar un maestro
  async deleteMaestros(maestros: Maestros) {
    let path = `/Maestros/${maestros.aid}`; // Ruta del documento del maestro en Firebase

    const loading = await this.utilsSvc.loading(); // Muestra el indicador de carga
    await loading.present(); // Muestra el indicador de carga

    this.firebaseSvc.deleteDocument(path).then(async res => {
      this.maestros = this.maestros.filter(m => m.aid !== maestros.aid); // Filtra y actualiza la lista de maestros

      // Muestra un mensaje de éxito
      this.utilsSvc.presentToast({
        message: 'Maestro eliminado exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });

    }).catch(error => {
      console.log("error");

      // Muestra un mensaje de error
      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      });

    }).finally(() => {
      loading.dismiss(); // Oculta el indicador de carga
    });
  }

  // Función para obtener el rol del usuario
  getUserRole() {
    this.firebaseSvc.getCurrentUserWithRole().subscribe((user: User) => {
      if (user) {
        this.userRole = user.role; // Asigna el rol del usuario
      }
    });
  }
}
