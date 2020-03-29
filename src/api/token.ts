const API_TOKEN_KEY = "API_TOKEN";

export function apiToken (): string | null {
  return localStorage.getItem(API_TOKEN_KEY);
}

export function clearApiToken (): void {
  localStorage.removeItem(API_TOKEN_KEY);
}

export function setApiToken (token: string): void {
  localStorage.setItem(API_TOKEN_KEY, token);
}

// t._BX5KYSF1XAQtyxgXM3ZSQtjXwfDdDilN3sR9onivsGhrQ6N2tt-GGrcP7kLxy_fTVqN9Xk01qOjXC0qb_wp7g
