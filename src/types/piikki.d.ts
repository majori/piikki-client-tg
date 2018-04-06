declare interface ApiResponse<T> {
  ok: boolean;
  result: T;
}

declare interface User {
  username: string;
  defaultGroup: string | null;
  saldos: {
    [group: string]: number;
  }
}

declare interface UserAuth {
  authenticated: boolean;
}

declare interface AlternativeUserAuth {
  authenticated: boolean;
  username: string;
  groupName: string;
}

declare interface Transaction {
  username: string;
  saldo: number;
}

