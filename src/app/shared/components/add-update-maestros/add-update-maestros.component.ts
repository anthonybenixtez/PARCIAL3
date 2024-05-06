import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Maestros } from 'src/app/models/maestros.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
@Component({
  selector: 'app-add-update-maestros',
  templateUrl: './add-update-maestros.component.html',
  styleUrls: ['./add-update-maestros.component.scss'],
})
export class AddUpdateMaestrosComponent  implements OnInit {

 @Input() maestros: Maestros; //importamos nuestro models de maestros

  //ponemos los campos de maestros en un grupo
  form = new FormGroup({
    aid: new FormControl(''),
    name: new FormControl ('', [Validators.required, Validators.minLength(4)]),
    apellido: new FormControl('', [Validators.required, Validators.minLength(4)]),
    identificacion: new FormControl('', [Validators.required, Validators.minLength(4)]),
    email: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });
  
  //importaciones a utilizar

  firebaseSvc= inject(FirebaseService);
  utilsSvc= inject(UtilsService)
  userRole: string = ''; // Aquí deberías obtener el rol del usuario
  materias: any[];


  ngOnInit(): void {
    if (this.maestros) this.form.setValue(this.maestros);
    this.firebaseSvc.getMaterias().subscribe((materias) => {
      this.materias = materias;
    });
  }

  submit(){
    if (this.form.valid) {
      if(this.maestros) this.updateMaestros();
      else this.createMaestros();
    }   
  }
  

   ////////// CREAR Maestros /////////////
   async createMaestros(){


    let path = `/Maestros`
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
async updateMaestros() {


  let path =`/Maestros/${this.maestros.aid}`

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

onSelectMateria(event) {
  const selectedMateriaId = event.target.value;
  this.maestros.materiaId = selectedMateriaId;
}



}
