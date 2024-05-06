import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Alumnos } from 'src/app/models/alumnos.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-alumnos',
  templateUrl: './add-update-alumnos.component.html',
  styleUrls: ['./add-update-alumnos.component.scss'],
})
export class AddUpdateAlumnosComponent  implements OnInit {

 @Input() alumnos: Alumnos; //importamos nuestro models de maestros

  //ponemos los campos de maestros en un grupo
  form = new FormGroup({
    eid: new FormControl(''),
    carnet: new FormControl('', [Validators.required, Validators.minLength(1)]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    apellido: new FormControl('', [Validators.required, Validators.minLength(4)]),
    email: new FormControl('', [Validators.required, Validators.minLength(4)]), // Usa `Validators.email` para validar correos electrónicos
    ciclo: new FormControl(null, [Validators.required,Validators.min(0)]),
    nota1: new FormControl(null, [Validators.required,Validators.min(0)]), // Usa 0 como valor inicial para números
    nota2: new FormControl(null, [Validators.required,Validators.min(0)]),
    nota3: new FormControl(null, [Validators.required,Validators.min(0)]),
    nota4: new FormControl(null, [Validators.required,Validators.min(0)]),
    promedio: new FormControl(null, [Validators.required, Validators.min(0)]), // Usa validaciones para números
    materiaId: new FormControl(''),
    maestroId: new FormControl(''),


  });
  
  //importaciones a utilizar

  firebaseSvc= inject(FirebaseService);
  utilsSvc= inject(UtilsService)
  userRole: string = ''; // Aquí deberías obtener el rol del usuario
  materias: any[];
  maestros: any[];

  ngOnInit(): void {
    if (this.alumnos) {
      this.form.setValue({
        eid: this.alumnos.eid,
        carnet: this.alumnos.carnet,
        name: this.alumnos.name,
        apellido: this.alumnos.apellido,
        email: this.alumnos.email,
        ciclo: this.alumnos.ciclo,
        nota1: this.alumnos.nota1,
        nota2: this.alumnos.nota2,
        nota3: this.alumnos.nota3,
        nota4: this.alumnos.nota4,
        promedio: this.alumnos.promedio,
        materiaId: this.alumnos.materiaId || '',
        maestroId: this.alumnos.maestroId || '', // Establece materiaId si existe
         // Establece materiaId si existe
   
      });
    }
    this.firebaseSvc.getMaterias().subscribe((materias) => {
      this.materias = materias; // Obtenemos las materias para el select
    });
    this.firebaseSvc.getMaestros().subscribe((maestros) => {
      this.maestros = maestros;
    });
  }

  submit(){
    if (this.form.valid) {
      if(this.alumnos) this.updateAlumnos();
      else this.createAlumnos();
    }   
  }
  

   ////////// CREAR Maestros /////////////
   async createAlumnos() {
    const path = `/Alumnos`; // Ruta en la base de datos para guardar maestros
    const loading = await this.utilsSvc.loading();
    await loading.present(); // Muestra el indicador de carga
  
    // Elimina `aid` si no es necesario para la creación
    delete this.form.value.eid;
  
    // Obtén el valor de `materiaId` desde el `FormGroup`
    const materiaId = this.form.get('materiaId').value;
    const maestroId = this.form.get('maestroId').value;

  
    // Crea el objeto de datos para el nuevo maestro
    const newAlumnos = {
      ...this.form.value, // Copia todos los valores del formulario
      materiaId: materiaId,
      maestroId: maestroId, // Asegúrate de incluir `materiaId`
       // Asegúrate de incluir `materiaId`
    };
  
    this.firebaseSvc.addDocument(path, newAlumnos) // Guarda el nuevo maestro en Firebase
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
async updateAlumnos() {


  let path =`/Alumnos/${this.alumnos.eid}`

  const loading = await this.utilsSvc.loading();
  await loading.present();

  delete this.form.value.eid;


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

onSelectMaestro(event: any) {
  const selectedMaestroId = event.detail?.value; // Acceder a `detail.value` para obtener el ID seleccionado
  if (selectedMaestroId) {
    this.form.get('maestroId').setValue(selectedMaestroId); // Asignar el ID al `FormGroup`
  } else {
    console.warn('No se seleccionó ningun maestro');
  }
}
}
