import { Injectable, OnDestroy } from '@angular/core';
import { Auth, signOut, signInWithPopup, user, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendEmailVerification, sendPasswordResetEmail, getAdditionalUserInfo, OAuthProvider, linkWithPopup, unlink, updateEmail, updatePassword, User, reauthenticateWithPopup, authState, onAuthStateChanged } from '@angular/fire/auth';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, DocumentData, DocumentReference, DocumentSnapshot, Firestore, getDoc, setDoc } from '@angular/fire/firestore';

import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { IUserResponse } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public currentUser$ = new Subject<boolean>();
  public loginSubscription!: Subscription;

  constructor(
    private auth: Auth,
    private router: Router,
    private firestore: Firestore
  ) { }

  logOut(): void {
    signOut(this.auth).then(() => {
      localStorage.removeItem('user');
      this.router.navigate([ '' ]);
      this.currentUser$.next(true);
    })
  }

}