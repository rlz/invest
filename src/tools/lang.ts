export function plural (n: number, form0: string, form1: string, form2: string): string {
  if (n % 10 == 1 && n % 100 != 11) {
    return form0;
  }

  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) {
    return form1;
  }

  return form2;
}