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
  router= inject(Router);

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

    
}
