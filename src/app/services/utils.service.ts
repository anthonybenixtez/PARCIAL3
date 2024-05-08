import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AlertOptions, LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
// =============== loading =================
  loadingCtrl= inject(LoadingController);
  toastCtrl= inject(ToastController);
  modalCtrl= inject(ModalController);
  router= inject(Router);
  alertCtrl= inject(AlertController);

  async loading() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...'
    });
    return loading;
  }




  
  //========================= Toast ==========================
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

    //========================= Enruta a cualquier pagina disponible ==========================
    routerLink(url: string){
      return this.router.navigateByUrl(url);
    }

      //========================= Guarda un elemento en el localstorage ==========================
  saveInLocalStorage(key: string, value: any){
    return localStorage.setItem(key, JSON.stringify(value))
  }

    //========================= Obtiene un elemento desde el localstorage ==========================
    getFromLocalStorage(key: string){
      return JSON.parse(localStorage.getItem(key))
    }

  //============================ Modal =======================================
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);
  
    await modal.present();

    const {data} = await modal.onWillDismiss();
    if (data) return data;
  }
  dismissModal(data?: any){
    return this.modalCtrl.dismiss(data);
  }
    

  //================== Alerta====================00
  async presentAlert(opts?: AlertOptions) {
    const alert = await this.alertCtrl.create(opts);
  
    await alert.present();
  }

    // Función para verificar si se debe mostrar u ocultar un elemento según el rol del usuario
    public shouldShowElementForRole(role: string, userRole: string): boolean {
      return role === userRole;
    }

    
}
