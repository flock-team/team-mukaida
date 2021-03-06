import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { DeleteAccountDialogComponent } from 'src/app/delete-account-dialog/delete-account-dialog.component';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  readonly nameMaxLength = 20;
  user: User;
  isProcessing: boolean;
  oldImageUrl = '';
  imageFile: string;
  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(this.nameMaxLength)]],
  });

  user$: Observable<User> = this.authService.user$;
  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.user$.subscribe((user) => {
      this.user = user;
      this.oldImageUrl = user.avatarURL;
      this.form.patchValue({
        ...user,
      });
    });
  }

  onCroppedImage(image: string): void {
    this.imageFile = image;
  }

  openDeleteAccountDialog() {
    this.dialog.open(DeleteAccountDialogComponent, {
      width: '400px',
      autoFocus: false,
      restoreFocus: false,
    });
  }

  updateUser(): void {
    const formData = this.form.value;
    this.userService
      .updateUser({
        uid: this.user.uid,
        avatarURL: this.imageFile,
        name: formData.name,
      })
      .then(() => this.snackBar.open('ユーザー情報を更新しました'));
  }
}
