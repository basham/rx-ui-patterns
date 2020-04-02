import { BehaviorSubject } from 'rxjs'

const a$ = new BehaviorSubject(100)
console.log('##', a$.value)
