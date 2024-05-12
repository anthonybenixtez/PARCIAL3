import { inject, Injectable } from '@angular/core'; // Importa Injectable e inject de Angular Core
import { Router } from '@angular/router'; // Importa Router para la navegación
import { AlertController, AlertOptions, LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular'; // Importa controladores de alerta, carga, modal y toast de Ionic

@Injectable({
  providedIn: 'root' // Indica que este servicio se proporciona en el nivel raíz del módulo
})
export class UtilsService { // Define la clase del servicio UtilsService

  // Inyección de controladores
  loadingCtrl = inject(LoadingController); // Controlador para la carga
  toastCtrl = inject(ToastController); // Controlador para el toast
  modalCtrl = inject(ModalController); // Controlador para el modal
  router = inject(Router); // Controlador para el router
  alertCtrl = inject(AlertController); // Controlador para la alerta

  // Método para mostrar un indicador de carga
  async loading() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...' // Mensaje de carga predeterminado
    });
    return loading; // Retorna el indicador de carga
  }

  // Método para mostrar un toast
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts); // Crea un toast con las opciones especificadas
    toast.present(); // Muestra el toast
  }

  // Método para redirigir a una página
  routerLink(url: string) {
    return this.router.navigateByUrl(url); // Navega a la URL especificada
  }

  // Método para guardar un elemento en el localStorage
  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value)); // Guarda el valor en el localStorage como una cadena JSON
  }

  // Método para obtener un elemento desde el localStorage
  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key)); // Obtiene y parsea el valor del localStorage
  }

  // Método para presentar un modal
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts); // Crea un modal con las opciones especificadas
    await modal.present(); // Presenta el modal

    const {data} = await modal.onWillDismiss(); // Espera a que se cierre el modal y obtiene los datos pasados desde el modal
    if (data) return data; // Retorna los datos si existen
  }

  // Método para descartar un modal
  dismissModal(data?: any) {
    return this.modalCtrl.dismiss(data); // Descarta el modal con los datos especificados
  }

  // Método para presentar una alerta
  async presentAlert(opts?: AlertOptions) {
    const alert = await this.alertCtrl.create(opts); // Crea una alerta con las opciones especificadas
    await alert.present(); // Presenta la alerta
  }

  // Función para verificar si se debe mostrar u ocultar un elemento según el rol del usuario
  public shouldShowElementForRole(role: string, userRole: string): boolean {
    return role === userRole; // Retorna verdadero si el rol del usuario coincide con el rol especificado
  }
}
