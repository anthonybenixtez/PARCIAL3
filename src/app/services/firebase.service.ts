import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Añade importaciones necesarias
import { getFirestore, setDoc, doc, getDoc, addDoc, collection, collectionData, query as firestoreQuery, updateDoc, deleteDoc, where, getDocs } from '@angular/fire/firestore'; // Importa getDocs
import { Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { query } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth= inject(AngularFireAuth);
  firestore= inject(AngularFirestore);


  constructor(private angularFireAuth: AngularFireAuth, private angularFirestore: AngularFirestore, private router: Router) {}

  
  //=================== Autenticación ======================
  getAuth(){
    return getAuth();
  }
  
//================ Acceder =======================
  signIn(user: User){
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

//=============== Crear Usuario ======================
signUp(user: User){
  return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
}

  //============== Actualizar Usuario =================
  updateUser(displayName: string){
    return updateProfile(getAuth().currentUser,{displayName})
  }
  //============== Enviar email para restablecer contraseña =================
  sendRecoveryEmail(email: string){
    return sendPasswordResetEmail(getAuth(), email)
  }

  //===================== Cerrar Sesion ===============================
  signOut(){
    getAuth().signOut()
      .then(() => {
        localStorage.removeItem('user');
        this.router.navigate(['/auth']); // Navega a la página de autenticación después de cerrar sesión
      })
      .catch(error => {
        console.error('Error al cerrar sesión:', error);
      });
  }
  

// Esta función devuelve un observable que busca un maestro en la colección "Maestros" de Firestore utilizando su correo electrónico.
// Devuelve un solo maestro que coincida con el correo electrónico proporcionado.
// Parámetros:
//   - email: El correo electrónico del maestro a buscar.
// Devuelve:
//   - Observable<any>: Un observable que emite el maestro encontrado o null si no se encuentra ningún maestro.
getMaestroByEmail(email: string): Observable<any> {
  return this.angularFirestore.collection('Maestros', ref => ref.where('email', '==', email))
      .valueChanges({ idField: 'id' }) // Se obtienen los cambios en la colección "Maestros"
      .pipe(
          map(maestros => maestros.length > 0 ? maestros[0] : null) // Se mapea el resultado para obtener el primer maestro o null si no se encuentra ningún maestro.
      );
}

// Esta función devuelve un observable que busca todos los alumnos asociados a un maestro específico en Firestore.
// Parámetros:
//   - maestroId: El ID del maestro para el cual se quieren obtener los alumnos.
// Devuelve:
//   - Observable<any[]>: Un observable que emite un array de objetos representando los alumnos encontrados.
getAlumnosByMaestroId(maestroId: string): Observable<any[]> {
  const path = `/Alumnos`; // Se establece la ruta de la colección "Alumnos"
  const query = firestoreQuery(collection(getFirestore(), path), where('maestroId', '==', maestroId)); // Se crea una consulta para buscar los alumnos que tienen el mismo maestroId proporcionado
  return collectionData(query, { idField: 'aid' }); // Se devuelve un observable que emite los cambios en la colección "Alumnos" basados en la consulta establecida.
}

// Esta función devuelve un observable que busca todos los alumnos asociados a una materia específica en Firestore.
// Parámetros:
//   - materiaId: El ID de la materia para la cual se quieren obtener los alumnos.
// Devuelve:
//   - Observable<any[]>: Un observable que emite un array de objetos representando los alumnos encontrados.
// Observaciones:
//   - Esta función parece estar utilizando el AngularFirestore en lugar del firestore directamente.
getAlumnosByMateria(materiaId: string): Observable<any[]> {
  return this.firestore.collection('Alumnos', ref => ref.where('materiaId', '==', materiaId))
      .valueChanges({ idField: 'aid' }); // Se obtienen los cambios en la colección "Alumnos" donde el campo "materiaId" coincide con el ID de la materia proporcionado.
}


  //=====================Base de Datos===============================
  //=================== Obtener documentos de una coleccion ================================
  getCollectionData(path: string, collectionQuery?: any){
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, collectionQuery), {idField: 'aid'});
  }
//=================== Setear un documento ================================
setDocument(path: string, data: any){
  return setDoc(doc(getFirestore(), path), data);
}
//===================== Obtener un Documento ===============================
async getDocument(path: string){
  return (await getDoc(doc(getFirestore(), path))).data();
}

//===================== Agregar un Documento ===============================

addDocument(path: string, data: any){
  return addDoc(collection(getFirestore(), path), data);
}
//=================== Actualizar un documento ================================
updateDocument(path: string, data: any){
  return updateDoc(doc(getFirestore(), path), data);
}

//=================== Eliminar un documento ================================
deleteDocument(path: string){
  return deleteDoc(doc(getFirestore(), path));
}



  // Obtener el usuario actual y su rol desde Firestore
  getCurrentUserWithRole(): Observable<User> {
    return this.auth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
          
        }
      })
    );
  }
  getMaterias(): Observable<any[]> {
    return this.firestore.collection('Materias').valueChanges({ idField: 'aid' });
  }
  // se agrega la rerlacion 
  getMaestros(): Observable<any[]> {
    return this.firestore.collection('Maestros').valueChanges({ idField: 'aid' });
  }
}