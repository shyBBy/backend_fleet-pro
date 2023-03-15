export interface LastChangeCreate {
  
  title: string;
  reason: string;
}

export interface LastChangeSingle extends LastChangeCreate {
  
    id: string
    editedByUser: string
    editedDate: Date
}


export type LastChangeSingleRes = LastChangeSingle

export type GetListOffLastChangesResponse = LastChangeSingleRes[]

export interface GetListOffPaginatedLastChangesRes {
  lastChanges: GetListOffLastChangesResponse,
  pagesCount: number;
  resultsCount: number;
}