import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  public title: string = 'Hola desde login'

  constructor(){

  }

  ngOnInit(): void {
  console.log('componente de login cargado');
  }


}
