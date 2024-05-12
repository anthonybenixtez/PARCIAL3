import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddUpdateAlumnosComponent } from 'src/app/shared/components/add-update-alumnos/add-update-alumnos.component'; // Importa el componente para agregar o actualizar alumnos
import { AlumnosDetailComponent } from 'src/app/shared/components/alumnos-detail/alumnos-detail.component'; // Importa el componente para mostrar los detalles de un alumno
import { User } from 'src/app/models/user.model'; // Importa el modelo de usuario
import { Alumnos } from 'src/app/models/alumnos.model'; // Importa el modelo de alumnos
import { FirebaseService } from 'src/app/services/firebase.service'; // Importa el servicio para interactuar con Firebase
import { UtilsService } from 'src/app/services/utils.service'; // Importa el servicio de utilidades

@Component({
  selector: 'app-pagina4', // Selector del componente
  templateUrl: './pagina4.page.html', // Ruta de la plantilla HTML
  styleUrls: ['./pagina4.page.scss'], // Ruta de los estilos CSS
})
export class Pagina4Page implements OnInit {

  page: number; // Variable para controlar la página actual
  constructor(
    private modalController: ModalController, // Inyecta el controlador de modales
    private firebaseSvc: FirebaseService, // Inyecta el servicio de Firebase
    public utilsSvc: UtilsService // Inyecta el servicio de utilidades
  ) {}
  
  loading = false; // Variable para controlar el estado de carga
  alumnos: Alumnos[] = []; // Arreglo para almacenar los alumnos
  user: User; // Objeto para almacenar la información del usuario
  userRole: string = ''; // Variable para almacenar el rol del usuario
  materiaId: string; // Variable para almacenar el ID de la materia

  ngOnInit() {
    this.getCurrentUser(); // Método que se ejecuta al inicializar el componente para obtener el usuario actual
  }

  async getCurrentUser() {
    // Método para obtener el usuario actual y su rol
    this.firebaseSvc.getCurrentUserWithRole().subscribe((user: User) => {
      this.user = user; // Almacena la información del usuario
      this.userRole = user.role; // Obtiene el rol del usuario
      if (this.userRole === 'Docente') {
        this.getMaestroMateriaAndAlumnos(); // Si el usuario es docente, obtiene la materia y los alumnos asociados
      } else {
        this.getAlumnos(); // Si no es docente, obtiene todos los alumnos
      }
    });
  }

  async getMaestroMateriaAndAlumnos() {
    // Método para obtener la materia y los alumnos asociados al docente
    this.firebaseSvc.getMaestroByEmail(this.user.email).subscribe((maestro: any) => {
      if (maestro && maestro.materiaId) {
        this.materiaId = maestro.materiaId; // Almacena el ID de la materia
        this.getAlumnosByMateria(); // Obtiene los alumnos de la materia
      } else {
        console.log("No se encontró la materia del maestro."); // Mensaje si no se encuentra la materia del maestro
        this.loading = false; // Cambia el estado de carga a falso
      }
    });
  }


  async getMaestroMateria() {
    // Método para obtener la materia del docente
    this.firebaseSvc.getMaestroByEmail(this.user.email).subscribe((maestro: any) => {
      if (maestro && maestro.materiaId) {
        this.materiaId = maestro.materiaId; // Almacena el ID de la materia
        this.getAlumnosByMateria(); // Obtiene los alumnos de la materia
      } else {
        console.log("No se encontró la materia del maestro."); // Mensaje si no se encuentra la materia del maestro
        this.loading = false; // Cambia el estado de carga a falso
      }
    });
  }

  async getAlumnosByMateria() {
    // Método para obtener los alumnos de una materia
    this.loading = true; // Cambia el estado de carga a verdadero
    this.firebaseSvc.getAlumnosByMateria(this.materiaId).subscribe({
      next: (res: any) => {
        console.log(res); // Muestra los alumnos en la consola
        this.alumnos = res; // Almacena los alumnos obtenidos
        this.loading = false; // Cambia el estado de carga a falso
      },
      error: (error: any) => {
        console.log("Error al obtener alumnos:", error); // Muestra un mensaje de error en la consola
        this.loading = false; // Cambia el estado de carga a falso
      }
    });
  }

  isAlumnoInMaestroMateria(alumno: Alumnos): boolean {
    // Método para verificar si un alumno está asociado a la materia del docente
    if (this.userRole === 'Docente' && this.materiaId) {
      return alumno.materiaId === this.materiaId; // Comprueba si el ID de la materia del alumno coincide con el del docente
    }
    return false; // Devuelve falso si el usuario no es docente o no tiene una materia asociada
  }
  
  async AddUpdateAlumnos(alumnos?: Alumnos) {
    // Método para agregar o actualizar alumnos
    let success = await this.utilsSvc.presentModal({
      component: AddUpdateAlumnosComponent, // Componente de modal para agregar o actualizar alumnos
      cssClass: 'add-update-modal',
      componentProps: {alumnos} // Propiedades del componente modal
    });
    
    if (success) {
      if (this.userRole === 'Docente' && this.materiaId) {
        this.getAlumnosByMateria(); // Obtiene los alumnos de la materia del docente
      } else {
        this.getAlumnos(); // Obtiene todos los alumnos
      }
    }
  }
  ionViewWillEnter() {
    this.getAlumnos(); // Método que se ejecuta antes de entrar en la vista para obtener los alumnos
  }

  async alumnosDetail(alumno?: Alumnos) {
    // Método para mostrar los detalles de un alumno
    let success = await this.utilsSvc.presentModal({
      component: AlumnosDetailComponent, // Componente de modal para mostrar los detalles de un alumno
      cssClass: 'alumnos-detail-modal',
      componentProps: {alumno} // Propiedades del componente modal
    });

    if (success) this.getAlumnos(); // Actualiza la lista de alumnos después de la acción
  }

  async getAlumnos() {
    // Método para obtener todos los alumnos
    this.loading = true; // Cambia el estado de carga a verdadero
    const path = '/Alumnos'; // Ruta para obtener todos los alumnos
    this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        console.log(res); // Muestra los alumnos en la consola
        this.alumnos = res; // Almacena los alumnos obtenidos
        this.loading = false; // Cambia el estado de carga a falso
      },
      error: (error: any) => {
        console.log("Error al obtener alumnos:", error); // Muestra un mensaje de error en la consola
        this.loading = false; // Cambia el estado de carga a falso
      }
    });
  }
 
  

  async deleteAlumnos(alumnos: Alumnos) {
    // Método para eliminar un alumno
    const path = `/Alumnos/${alumnos.aid}`; // Ruta para eliminar un alumno
    const loading = await this.utilsSvc.loading(); // Muestra un indicador de carga
    await loading.present(); // Muestra el indicador de carga
  
    this.firebaseSvc.deleteDocument(path).then(async res => {
      // Elimina el documento y actualiza la lista de alumnos después de la acción
      if (this.userRole === 'Docente' && this.materiaId) {
        this.getAlumnosByMateria(); // Obtiene los alumnos de la materia del docente
      } else {
        this.getAlumnos(); // Obtiene todos los alumnos
      }
      this.utilsSvc.presentToast({
        message: 'Maestro eliminado exitosamente', // Muestra un mensaje de éxito
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
    }).catch(error => {
      console.log("error"); // Muestra un mensaje de error en la consola
      this.utilsSvc.presentToast({
        message: error.message, // Muestra el mensaje de error
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    }).finally(() => {
      loading.dismiss(); // Oculta el indicador de carga
    });
  }
  


  async confirmDeleteAlumnos(alumnos: Alumnos) {
    // Método para confirmar la eliminación de un alumno
    this.utilsSvc.presentAlert({
      header: 'Eliminar Maestro', // Título del cuadro de diálogo
      message: '¿Estas seguro de quere eliminar este maestro?', // Mensaje de confirmación
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar', // Botón para cancelar
        }, {
          text: 'Sí, eliminar', // Botón para confirmar la eliminación
          handler: () => {
            this.deleteAlumnos(alumnos); // Elimina el alumno
          }
        }
      ]
    });
  }

  
}
