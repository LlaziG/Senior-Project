export class Suggestion {
  constructor(public symbol: string, public name: string) { }
}

export interface ISuggestionResponse {
  results: Suggestion[];
}