import { animate, group, query, style, transition, trigger } from '@angular/animations';

const animationDuration = '0.5s';

export const presentationAnimation = trigger('presentationAnimation', [
  transition('* <=> *', [
    query(':enter, :leave', style({ position: 'absolute', width: '100%', height: '100%' }), { optional: true }),
    group([
      query(
        ':enter',
        [
          style({ transform: 'translateX(100%)' }),
          animate(animationDuration + ' ease-in-out', style({ transform: 'translateX(0%)' }))
        ],
        { optional: true }
      ),
      query(
        ':leave',
        [
          style({ transform: 'translateX(0%)' }),
          animate(animationDuration + ' ease-in-out', style({ transform: 'translateX(-100%)' }))
        ],
        { optional: true }
      )
    ])
  ])
]);
