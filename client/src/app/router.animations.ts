import { sequence, trigger, stagger, animate, style, group, query as q, transition, keyframes, animateChild } from '@angular/animations';
const query = (s, a, o = { optional: true }) => q(s, a, o);

export const routerTransition = trigger('routerTransition', [
  transition('* => *', [
    query(':enter, :leave', style({ position: 'fixed', width: '87%' })),
    query(':enter', style({ transform: 'translateX(113%)' })),
    sequence([
      query(':leave', animateChild()),
      group([
        query(':leave', [
          style({ transform: 'translateX(0%)' }),
          animate('500ms cubic-bezier(.75,-0.48,.26,1.52)',
            style([
              { transform: 'translateX(113%)' },
              { opacity: '0' },
            ]))
        ]),
        query(':enter', [
          style({ transform: 'translateX(-113%)' }),
          animate('500ms cubic-bezier(.75,-0.48,.26,1.52)',
            style([
              { transform: 'translateX(0%)' },
              { opacity: '1' },
            ]))
        ]),
      ]),
      query(':enter', animateChild()),
    ])
  ])
]);