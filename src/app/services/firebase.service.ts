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
  

  // Obtener un maestro por su correo electrónico
  getMaestroByEmail(email: string): Observable<any> {
    return this.angularFirestore.collection('Maestros', ref => ref.where('email', '==', email)).valueChanges({ idField: 'id' })
      .pipe(
        map(maestros => maestros.length > 0 ? maestros[0] : null)
      );
  }


  // En tu servicio FirebaseService
  getAlumnosByMaestroId(maestroId: string): Observable<any[]> {
    const path = `/Alumnos`;
    const query = firestoreQuery(collection(getFirestore(), path), where('maestroId', '==', maestroId));
    return collectionData(query, { idField: 'aid' });
  }



    // Obtener alumnos por materia
    getAlumnosByMateria(materiaId: string): Observable<any[]> {
      return this.firestore.collection('Alumnos', ref => ref.where('materiaId', '==', materiaId)).valueChanges({ idField: 'aid' });
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

  getMaestros(): Observable<any[]> {
    return this.firestore.collection('Maestros').valueChanges({ idField: 'aid' });
  }
}
