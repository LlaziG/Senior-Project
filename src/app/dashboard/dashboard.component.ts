import { Component, OnInit } from '@angular/core';

import {trigger, stagger, animate, style, group, query as q, transition, keyframes} from '@angular/animations';
const query = (s,a,o={optional:true})=>q(s,a,o);

export const dashboardTransition = trigger('dashboardTransition', [
    transition(':enter', [
      query('.card', style({ opacity: 0 })),
      query('.card', stagger(100, [
        style({ transform: 'translateY(100px)' }),
        animate('600ms cubic-bezier(.75,-0.48,.26,1.52)', style({transform: 'translateY(0px)', opacity: 1})),
      ])),
    ]),
    transition(':leave', [
      query('.card', stagger(100, [
        style({ transform: 'translateY(0px)', opacity: 1 }),
        animate('600ms cubic-bezier(.75,-0.48,.26,1.52)', style({transform: 'translateY(100px)', opacity: 0})),
      ])),        
    ])
  ]);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [ dashboardTransition ],
  host: {
    '[@dashboardTransition]': ''
  }
})
export class DashboardComponent implements OnInit {
  constructor() { }

  ngOnInit(){
  }
  
}
