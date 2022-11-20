import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from '../../services/user.service';

class UserRegistrationFormModel {
  username = "";
  password = "";
  confirmPassword = "";
}

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.less']
})
export class UserRegistrationComponent implements OnInit {
  @ViewChild("f")
  form: NgForm;

  model = new UserRegistrationFormModel();

  constructor(
    private router: Router,
    private userService: UserService,
    private nzMessageService: NzMessageService
  ) { }

  ngOnInit(): void {
  }

  async submit() {

    // TODO  Vérifier que la confirmation de mot de passe correspond au mot de passe
    if (this.form.form.invalid || this.model.password !== this.model.confirmPassword) {
      return ;
    }

    // TODO Enregistrer l'utilisateur via le UserService
    const exists = await this.userService.exists(this.model.username);

    if(exists) {
      this.nzMessageService.error("Ce nom d'utilisateur existe déjà, veuillez en choisir un nouveau");

    } else {  
      await this.userService.register(this.model.username, this.model.password);
      this.goToLogin();

    }

  }

  goToLogin() {
    this.router.navigateByUrl("/splash/login")
  }
}
