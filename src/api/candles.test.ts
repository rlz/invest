import { Candle, findCandleIndex } from './candles';

test("Search candle by date", () => {
  expect(findCandleIndex([], new Date())).toBeUndefined();

  const candle: Candle = {
    o: 1,
    c: 2,
    h: 3,
    l: 4,
    v: 5,
    interval: "",
    time: "2020-03-12T12:43:50Z"
  };
  expect(findCandleIndex([candle], new Date("2020-03-12T12:43:49Z"))).toBeUndefined();
  expect(findCandleIndex([candle], new Date("2020-03-12T12:43:50Z"))).toBe(0);
  expect(findCandleIndex([candle], new Date("2020-03-12T12:43:51Z"))).toBe(0);

  const candles1 = [
    { ...candle },
    { ...candle, time: "2020-03-12T12:45:50Z" }
  ];

  expect(findCandleIndex(candles1, new Date("2020-03-12T12:43:49Z"))).toBeUndefined();
  expect(findCandleIndex(candles1, new Date("2020-03-12T12:43:50Z"))).toBe(0);
  expect(findCandleIndex(candles1, new Date("2020-03-12T12:43:51Z"))).toBe(0);
  expect(findCandleIndex(candles1, new Date("2020-03-12T12:45:49Z"))).toBe(0);
  expect(findCandleIndex(candles1, new Date("2020-03-12T12:45:50Z"))).toBe(1);
  expect(findCandleIndex(candles1, new Date("2020-03-12T12:45:51Z"))).toBe(1);

  const candles2 = [
    { ...candle },
    { ...candle, time: "2020-03-12T12:45:50Z" },
    { ...candle, time: "2020-03-12T12:47:50Z" }
  ];

  expect(findCandleIndex(candles2, new Date("2020-03-12T12:43:49Z"))).toBeUndefined();
  expect(findCandleIndex(candles2, new Date("2020-03-12T12:43:50Z"))).toBe(0);
  expect(findCandleIndex(candles2, new Date("2020-03-12T12:43:51Z"))).toBe(0);
  expect(findCandleIndex(candles2, new Date("2020-03-12T12:45:49Z"))).toBe(0);
  expect(findCandleIndex(candles2, new Date("2020-03-12T12:45:50Z"))).toBe(1);
  expect(findCandleIndex(candles2, new Date("2020-03-12T12:45:51Z"))).toBe(1);
  expect(findCandleIndex(candles2, new Date("2020-03-12T12:47:49Z"))).toBe(1);
  expect(findCandleIndex(candles2, new Date("2020-03-12T12:47:50Z"))).toBe(2);
  expect(findCandleIndex(candles2, new Date("2020-03-12T12:47:51Z"))).toBe(2);

  const candles3 = [
    { ...candle },
    { ...candle, time: "2020-03-12T12:45:50Z" },
    { ...candle, time: "2020-03-12T12:47:50Z" },
    { ...candle, time: "2020-03-12T12:49:50Z" }
  ];

  expect(findCandleIndex(candles3, new Date("2020-03-12T12:43:49Z"))).toBeUndefined();
  expect(findCandleIndex(candles3, new Date("2020-03-12T12:43:50Z"))).toBe(0);
  expect(findCandleIndex(candles3, new Date("2020-03-12T12:43:51Z"))).toBe(0);
  expect(findCandleIndex(candles3, new Date("2020-03-12T12:45:49Z"))).toBe(0);
  expect(findCandleIndex(candles3, new Date("2020-03-12T12:45:50Z"))).toBe(1);
  expect(findCandleIndex(candles3, new Date("2020-03-12T12:45:51Z"))).toBe(1);
  expect(findCandleIndex(candles3, new Date("2020-03-12T12:47:49Z"))).toBe(1);
  expect(findCandleIndex(candles3, new Date("2020-03-12T12:47:50Z"))).toBe(2);
  expect(findCandleIndex(candles3, new Date("2020-03-12T12:47:51Z"))).toBe(2);
  expect(findCandleIndex(candles3, new Date("2020-03-12T12:49:49Z"))).toBe(2);
  expect(findCandleIndex(candles3, new Date("2020-03-12T12:49:50Z"))).toBe(3);
  expect(findCandleIndex(candles3, new Date("2020-03-12T12:49:51Z"))).toBe(3);

  const candles4 = [
    { ...candle },
    { ...candle, time: "2020-03-12T12:45:50Z" },
    { ...candle, time: "2020-03-12T12:47:50Z" },
    { ...candle, time: "2020-03-12T12:49:50Z" },
    { ...candle, time: "2020-03-12T12:51:50Z" }
  ];

  expect(findCandleIndex(candles4, new Date("2020-03-12T12:43:49Z"))).toBeUndefined();
  expect(findCandleIndex(candles4, new Date("2020-03-12T12:43:50Z"))).toBe(0);
  expect(findCandleIndex(candles4, new Date("2020-03-12T12:43:51Z"))).toBe(0);
  expect(findCandleIndex(candles4, new Date("2020-03-12T12:45:49Z"))).toBe(0);
  expect(findCandleIndex(candles4, new Date("2020-03-12T12:45:50Z"))).toBe(1);
  expect(findCandleIndex(candles4, new Date("2020-03-12T12:45:51Z"))).toBe(1);
  expect(findCandleIndex(candles4, new Date("2020-03-12T12:47:49Z"))).toBe(1);
  expect(findCandleIndex(candles4, new Date("2020-03-12T12:47:50Z"))).toBe(2);
  expect(findCandleIndex(candles4, new Date("2020-03-12T12:47:51Z"))).toBe(2);
  expect(findCandleIndex(candles4, new Date("2020-03-12T12:49:49Z"))).toBe(2);
  expect(findCandleIndex(candles4, new Date("2020-03-12T12:49:50Z"))).toBe(3);
  expect(findCandleIndex(candles4, new Date("2020-03-12T12:49:51Z"))).toBe(3);
  expect(findCandleIndex(candles4, new Date("2020-03-12T12:51:49Z"))).toBe(3);
  expect(findCandleIndex(candles4, new Date("2020-03-12T12:51:50Z"))).toBe(4);
  expect(findCandleIndex(candles4, new Date("2020-03-12T12:51:51Z"))).toBe(4);
});