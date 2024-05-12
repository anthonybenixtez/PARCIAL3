import { inject, Injectable } from '@angular/core'; // Importa Injectable y inject de Angular Core
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Importa AngularFireAuth para la autenticación de Firebase
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth'; // Importa funciones de autenticación de Firebase
import { User } from '../models/user.model'; // Importa el modelo de usuario
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Importa AngularFirestore para la base de datos Firestore
import { getFirestore, setDoc, doc, getDoc, addDoc, collection, collectionData, query as firestoreQuery, updateDoc, deleteDoc, where, getDocs } from '@angular/fire/firestore'; // Importa funciones de Firestore
import { Router } from '@angular/router'; // Importa Router para la navegación
import { map, switchMap } from 'rxjs/operators'; // Importa operadores de RxJS
import { Observable, of } from 'rxjs'; // Importa Observable y of de RxJS
import { query } from 'firebase/firestore'; // Importa función de consulta de Firebase Firestore

@Injectable({
  providedIn: 'root' // Indica que este servicio se proporciona en el nivel raíz del módulo
})
export class FirebaseService { // Define la clase del servicio FirebaseService

  auth = inject(AngularFireAuth); // Inyecta AngularFireAuth para la autenticación de Firebase
  firestore = inject(AngularFirestore); // Inyecta AngularFirestore para la base de datos Firestore

  constructor(private angularFireAuth: AngularFireAuth, private angularFirestore: AngularFirestore, private router: Router) {} // Constructor del servicio

  // Métodos para la autenticación

  getAuth() {
    return getAuth(); // Obtiene la instancia de autenticación de Firebase
  }
  
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password); // Inicia sesión con correo electrónico y contraseña
  }

  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password); // Crea un nuevo usuario con correo electrónico y contraseña
  }

  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser,{displayName}); // Actualiza el perfil del usuario
  }

  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email); // Envía un correo electrónico de recuperación de contraseña
  }

  signOut() {
    // Cierra sesión del usuario y realiza la navegación a la página de autenticación
    getAuth().signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['/auth']);
    }).catch(error => {
      console.error('Error al cerrar sesión:', error);
    });
  }

  // Métodos para interactuar con Firestore

  getMaestroByEmail(email: string): Observable<any> {
    // Obtiene un maestro por su correo electrónico
    return this.angularFirestore.collection('Maestros', ref => ref.where('email', '==', email)).valueChanges({ idField: 'id' })
      .pipe(
        map(maestros => maestros.length > 0 ? maestros[0] : null)
      );
  }

  getAlumnosByMateria(materiaId: string): Observable<any[]> {
    // Obtiene alumnos por materia
    return this.firestore.collection('Alumnos', ref => ref.where('materiaId', '==', materiaId)).valueChanges({ idField: 'aid' });
  }

  // Métodos generales para Firestore

  getCollectionData(path: string, collectionQuery?: any) {
    // Obtiene documentos de una colección
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, collectionQuery), {idField: 'aid'});
  }

  setDocument(path: string, data: any) {
    // Establece un documento en Firestore
    return setDoc(doc(getFirestore(), path), data);
  }

  async getDocument(path: string) {
    // Obtiene un documento de Firestore
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  addDocument(path: string, data: any) {
    // Agrega un documento a Firestore
    return addDoc(collection(getFirestore(), path), data);
  }

  updateDocument(path: string, data: any) {
    // Actualiza un documento en Firestore
    return updateDoc(doc(getFirestore(), path), data);
  }

  deleteDocument(path: string) {
    // Elimina un documento de Firestore
    return deleteDoc(doc(getFirestore(), path));
  }

  getCurrentUserWithRole(): Observable<User> {
    // Obtiene el usuario actual y su rol desde Firestore
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
    // Obtiene todas las materias de Firestore
    return this.firestore.collection('Materias').valueChanges({ idField: 'aid' });
  }

  getMaestros(): Observable<any[]> {
    // Obtiene todos los maestros de Firestore
    return this.firestore.collection('Maestros').valueChanges({ idField: 'aid' });
  }
}
