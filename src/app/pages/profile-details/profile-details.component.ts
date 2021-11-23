import { Component, OnInit } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, DocumentData, DocumentReference, Firestore, getDocs, query, QuerySnapshot, setDoc, where } from "@angular/fire/firestore";
import { ToastrService } from 'ngx-toastr';
import { IUserResponse } from 'src/app/shared/interfaces/user.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsComponent implements OnInit {

  public allUsers: Array<IUserResponse> = [];
  public currentUser!: IUserResponse;
  public userForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.initUserForm();
    this.loadUserInfo();
  }

  initUserForm(): void {
    this.userForm = this.fb.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      email: [null, Validators.required],
      phone: [null, Validators.required],
      address: [null, Validators.required],
      zipCode: [null, Validators.required],
      city: [null, Validators.required],
      id: [],
      role: ["user"]
    })
  }

  loadUserInfo(): void {
    this.currentUser = JSON.parse(localStorage.getItem('user') as string)
    this.userForm.patchValue({
      firstName: this.currentUser.firstName,
      lastName: this.currentUser.lastName,
      email: this.currentUser.email,
      phone: this.currentUser.phone,
      address: this.currentUser.address,
      zipCode: this.currentUser.zipCode,
      city: this.currentUser.city,
      id: this.currentUser.id
    })
  }

  updateUserFB(user: IUserResponse, id: string): Promise<void> {
    return setDoc(doc(this.firestore, "users", id), user);
  }

  saveUser(): void {
    console.log(this.userForm.value);
    this.updateUserFB(this.userForm.value, this.currentUser.id).then(() => {
      this.initUserForm();
      this.loadUserInfo();
    }).catch(error => {
      this.toastr.error(error.message)
    })
  }

}
