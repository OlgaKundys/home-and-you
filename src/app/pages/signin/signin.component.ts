import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Auth, signOut, signInWithPopup, user, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendEmailVerification, sendPasswordResetEmail, getAdditionalUserInfo, OAuthProvider, linkWithPopup, unlink, updateEmail, updatePassword, User, reauthenticateWithPopup, authState, onAuthStateChanged } from '@angular/fire/auth';
import { collection, doc, docData, DocumentReference, CollectionReference, Firestore, onSnapshot, query, where, Unsubscribe, Query, DocumentData, collectionData, collectionChanges, docSnapshots, setDoc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit, OnDestroy {

  public signInForm!: FormGroup;
  public loginForm!: FormGroup;
  public loginSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private authService: AuthService,
    private firestore: Firestore,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initSignUpForm();
    this.initLoginForm();
  }

  initSignUpForm(): void {
    this.signInForm = this.fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required]
    })
  }

  initLoginForm(): void {
    this.loginForm = this.fb.group({
      yourEmail: [null, Validators.required],
      yourPassword: [null, Validators.required]
    })
  }

  async emailSignUp(email: string, password: string): Promise<any> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    const user = {
      email: credential.user.email,
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      zipCode: "",
      city: "",
      orders: [],
      id: credential.user.uid,
      role: "user",
    }
    let data = await setDoc(doc(this.firestore, "users", credential.user.uid), user);
    return data;
  }

  register(): void {
    const { email, password } = this.signInForm.value;
    this.emailSignUp(email, password).then(() => {
      this.signIn(email, password).then(() => {
        this.toastr.success('Welcome!');
      }).catch(error => {
        this.toastr.error('Login error!');
      });
    })
    this.signInForm.reset();
  }

  async signIn(email: string, password: string): Promise<any> {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    this.loginSubscription = docData(doc(this.firestore, "users", credential.user.uid)).subscribe(user => {
      localStorage.setItem('user', JSON.stringify(user));
      if (user && user.role === 'admin') {
        this.router.navigate(['/admin']);
      } else if (user && user.role === 'user') {
        this.router.navigate(['/profile-details']);
      }
      this.authService.currentUser$.next(true);
    });
  }

  login(): void {
    const { yourEmail, yourPassword } = this.loginForm.value;
    this.signIn(yourEmail, yourPassword).then(() => {
      this.toastr.success('Welcome!');
    }).catch(() => {
      this.toastr.error('Login error!');
    });
    this.loginForm.reset();
  }

  ngOnDestroy(): void {
    this.loginSubscription.unsubscribe();
  }

}