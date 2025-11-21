import { Injectable } from '@angular/core';
import { Period } from '@/models/period';



@Injectable({
    providedIn: 'root'
})
export class PeriodService {
    getPeriods(): Array<Period>  {
        return [
            { name: 'Enero', number: 1 },
            { name: 'Febrero', number: 2 },
            { name: 'Marzo', number: 3 },
            { name: 'Abril', number: 4 },
            { name: 'Mayo', number: 5 },
            { name: 'Junio', number: 6 },
            { name: 'Julio', number: 7 },
            { name: 'Agosto', number: 8 },
            { name: 'Septiembre', number: 9 },
            { name: 'Octubre', number: 10 },
            { name: 'Noviembre', number: 11 },
            { name: 'Diciembre', number: 12 }
        ];
    }
}
