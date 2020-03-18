export function c (base: string | Iterable<string>, ...conds: [boolean, string][]): string {
  const classes: string[] = [];

  if (typeof base === "string") {
    classes.push(base);
  } else {
    for (const cl of base) {
      classes.push(cl);
    }
  }

  for (const c of conds) {
    if (c[0]) {
      classes.push(c[1]);
    }
  }

  return classes.join(" ");
}