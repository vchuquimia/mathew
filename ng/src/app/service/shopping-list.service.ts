import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ShoppingList } from '@/models/shopping-list';
import { ShoppingListItem } from '@/models/shopping-list-item';
import { Expense } from '@/models/expense';

@Injectable({
    providedIn: 'root'
})
export class ShoppingListService {
    constructor(private http: HttpClient) {}

    getLists(familyId: number): Observable<ShoppingList[]> {
        return this.http.get<ShoppingList[]>(`${environment.apiUrl}ShoppingList/${familyId}`);
    }

    createList(list: ShoppingList): Observable<ShoppingList> {
        return this.http.post<ShoppingList>(`${environment.apiUrl}ShoppingList`, list);
    }

    updateList(list: ShoppingList): Observable<ShoppingList> {
        return this.http.put<ShoppingList>(`${environment.apiUrl}ShoppingList`, list);
    }

    addItem(item: ShoppingListItem): Observable<ShoppingListItem> {
        return this.http.post<ShoppingListItem>(`${environment.apiUrl}ShoppingList/item`, item);
    }

    updateItem(item: ShoppingListItem): Observable<ShoppingListItem> {
        return this.http.put<ShoppingListItem>(`${environment.apiUrl}ShoppingList/item`, item);
    }

    deleteItem(itemId: number): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrl}ShoppingList/item/${itemId}`);
    }

    reorderItems(items: ShoppingListItem[]): Observable<void> {
        return this.http.post<void>(`${environment.apiUrl}ShoppingList/reorder`, items);
    }

    purchaseItem(itemId: number, amount: number, registeredBy: string): Observable<Expense> {
        let params = new HttpParams()
            .set('amount', amount)
            .set('registeredBy', registeredBy);
        return this.http.post<Expense>(`${environment.apiUrl}ShoppingList/purchase/${itemId}`, null, { params });
    }
}
