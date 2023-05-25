import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  utilisateurs: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<any>('http://localhost:3000/get/us').subscribe(data => {
      this.utilisateurs = this.utilisateurs = Object.keys(data).map(key => ({key, value: data[key]}));;
    });
  }
}
