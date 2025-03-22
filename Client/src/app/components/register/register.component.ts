import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{

  public title: string = 'Hola desde register :D';


  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
