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
    materiaId: new FormControl(''),

  });
  
  //importaciones a utilizar

  firebaseSvc= inject(FirebaseService);
  utilsSvc= inject(UtilsService)
  userRole: string = ''; // Aquí deberías obtener el rol del usuario
  materias: any[];

  ngOnInit(): void {
    if (this.maestros) {
      this.form.setValue({
        aid: this.maestros.aid,
        name: this.maestros.name,
        apellido: this.maestros.apellido,
        identificacion: this.maestros.identificacion,
        email: this.maestros.email,
        materiaId: this.maestros.materiaId || '', // Establece materiaId si existe
      });
    }
    this.firebaseSvc.getMaterias().subscribe((materias) => {
      this.materias = materias; // Obtenemos las materias para el select
    });
  }

  submit(){
    if (this.form.valid) {
      if(this.maestros) this.updateMaestros();
      else this.createMaestros();
    }   
  }
  

   ////////// CREAR Maestros /////////////
   async createMaestros() {
    const path = `/Maestros`; // Ruta en la base de datos para guardar maestros
    const loading = await this.utilsSvc.loading();
    await loading.present(); // Muestra el indicador de carga
  
    // Elimina `aid` si no es necesario para la creación
    delete this.form.value.aid;
  
    // Obtén el valor de `materiaId` desde el `FormGroup`
    const materiaId = this.form.get('materiaId').value;
  
    // Crea el objeto de datos para el nuevo maestro
    const newMaestro = {
      ...this.form.value, // Copia todos los valores del formulario
      materiaId: materiaId, // Asegúrate de incluir `materiaId`
    };
  
    this.firebaseSvc.addDocument(path, newMaestro) // Guarda el nuevo maestro en Firebase
      .then(async () => {
        this.utilsSvc.dismissModal({ success: true }); // Cierra el modal si es necesario
  
        this.utilsSvc.presentToast({
          message: 'Maestro creado exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline', // Icono para indicar éxito
        });
      })
      .catch((error) => {
        console.error('Error creando maestro:', error); // Manejo de errores
  
        this.utilsSvc.presentToast({
          message: 'Error creando maestro',
          duration: 2500,
          color: 'danger', // Color de alerta para indicar error
          icon: 'alert-circle-outline', // Icono para indicar error
        });
      })
      .finally(() => {
        loading.dismiss(); // Detener el indicador de carga
      });
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

onSelectMateria(event: any) {
  const selectedMateriaId = event.detail?.value; // Acceder a `detail.value` para obtener el ID seleccionado
  if (selectedMateriaId) {
    this.form.get('materiaId').setValue(selectedMateriaId); // Asignar el ID al `FormGroup`
  } else {
    console.warn('No se seleccionó ninguna materia');
  }
}
}
