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
