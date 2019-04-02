import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Suggestion, ISuggestionResponse } from '../_models/suggestion';
import { APP_DI_CONFIG } from '../app-config.module';

@Injectable()
export class SuggestionService {

    constructor(private http: HttpClient) { }

    search(value): Observable<ISuggestionResponse> {
        if (value == "" || value == " " || value == "." || value == "/" || value == "\\" || value == "?" || value == "#") value = "a";
        return this.http.get<ISuggestionResponse>(APP_DI_CONFIG.apiEndpoint + '/quotes/companies/' + value)
            .pipe(
                tap((response: ISuggestionResponse) => {
                    response.results = response.results
                        .map(suggestion => {
                            return new Suggestion(suggestion.symbol, suggestion.name)
                        })

                    return response;
                })
            );
    }
}
