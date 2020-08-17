export interface ApiResponse<T> {
  ok: boolean;
  result: T;
}

export interface User {
  username: string;
  defaultGroup: string | null;
  saldos: {
    [group: string]: number;
  };
}

export interface UserAuth {
  authenticated: boolean;
}

export interface AlternativeUserAuth {
  authenticated: boolean;
  username: string;
  groupName: string;
}

export interface Transaction {
  username: string;
  saldo: number;
}

export interface Group {
  name: string;
  private: boolean;
  password?: string;
}
