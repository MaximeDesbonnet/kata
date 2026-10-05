export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

const AGED_BRIE = 'Aged Brie';
const BACKSTAGE_PASSES = 'Backstage passes to a TAFKAL80ETC concert';
const SULFURAS = 'Sulfuras, Hand of Ragnaros';

const MIN_QUALITY = 0;
const MAX_QUALITY = 50;

/** End-of-day rule for one kind of item. */
type ItemRule = (item: Item) => void;

/**
 * Moves quality by `delta` without crossing the bounds. A quality already
 * out of bounds is left as is, as in the legacy code.
 */
function changeQuality(item: Item, delta: number) {
  if (delta > 0) {
    item.quality = Math.max(item.quality, Math.min(MAX_QUALITY, item.quality + delta));
  } else {
    item.quality = Math.min(item.quality, Math.max(MIN_QUALITY, item.quality + delta));
  }
}

function isExpired(item: Item): boolean {
  return item.sellIn < 0;
}

const updateNormalItem: ItemRule = item => {
  item.sellIn -= 1;
  changeQuality(item, isExpired(item) ? -2 : -1);
};

const updateAgedBrie: ItemRule = item => {
  item.sellIn -= 1;
  changeQuality(item, isExpired(item) ? 2 : 1);
};

const updateBackstagePasses: ItemRule = item => {
  const daysBeforeConcert = item.sellIn;
  item.sellIn -= 1;
  if (isExpired(item)) {
    item.quality = 0;
  } else if (daysBeforeConcert <= 5) {
    changeQuality(item, 3);
  } else if (daysBeforeConcert <= 10) {
    changeQuality(item, 2);
  } else {
    changeQuality(item, 1);
  }
};

/** Legendary item: never sold, never degrades. */
const updateSulfuras: ItemRule = () => {};

function ruleFor(item: Item): ItemRule {
  switch (item.name) {
    case AGED_BRIE:
      return updateAgedBrie;
    case BACKSTAGE_PASSES:
      return updateBackstagePasses;
    case SULFURAS:
      return updateSulfuras;
    default:
      return updateNormalItem;
  }
}

export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  updateQuality() {
    for (const item of this.items) {
      ruleFor(item)(item);
    }

    return this.items;
  }
}
