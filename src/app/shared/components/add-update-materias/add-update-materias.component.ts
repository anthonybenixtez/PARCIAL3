import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Materias } from 'src/app/models/materias.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-materias',
  templateUrl: './add-update-materias.component.html',
  styleUrls: ['./add-update-materias.component.scss'],
})
export class AddUpdateMateriasComponent  implements OnInit {

  @Input() materias: Materias; //importamos nuestro models de materias

  //ponemos los campos de materias en un grupo
  form = new FormGroup({
    aid: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    descripcion: new FormControl('', [Validators.required, Validators.minLength(4)])
  });
  
  //importaciones a utilizar

  firebaseSvc= inject(FirebaseService);
  utilsSvc= inject(UtilsService)
  userRole: string = ''; // Aquí deberías obtener el rol del usuario

  ngOnInit() {
    if (this.materias) this.form.setValue(this.materias);
  }

  submit(){
    if (this.form.valid) {
      if(this.materias) this.updateMaterias();
      else this.createMaterias();
    }   
  }
  

   ////////// CREAR Materias /////////////
   async createMaterias(){


    let path = `/Materias`
    const loading = await this.utilsSvc.loading();
    await loading.present();
    
    delete this.form.value.aid;

    this.firebaseSvc.addDocument(path, this.form.value).then(async res =>{
      
      this.utilsSvc.dismissModal({ successs: true});

      this.utilsSvc.presentToast({
        message: 'Cultivo creado exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      })     

    }).catch(error=>{
      console.log(error);

      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      })


    }).finally(()=> {
      loading.dismiss();
    })

}
//==================== Actualizar Producto ======================
async updateMaterias() {


  let path =`/Materias/${this.materias.aid}`

  const loading = await this.utilsSvc.loading();
  await loading.present();

  delete this.form.value.aid;


  this.firebaseSvc.updateDocument(path, this.form.value).then(async res => {
    
    this.utilsSvc.dismissModal({ successs: true});

    this.utilsSvc.presentToast({
      message: 'Producto actualizado exitosamente',
      duration: 1500,
      color: 'success',
      position: 'middle',
      icon: 'checkmark-circle-outline'
    })


  }).catch(error=>{
    console.log("error");

    this.utilsSvc.presentToast({
      message: error.message,
      duration: 2500,
      color: 'primary',
      position: 'middle',
      icon: 'alert-circle-outline'
    })

  }).finally(()=> {
    loading.dismiss();
  })

}


}
