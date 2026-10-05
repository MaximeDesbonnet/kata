import { Item, GildedRose } from '@/gilded-rose';

const AGED_BRIE = 'Aged Brie';
const SULFURAS = 'Sulfuras, Hand of Ragnaros';
const BACKSTAGE = 'Backstage passes to a TAFKAL80ETC concert';

function updateOnce(name: string, sellIn: number, quality: number): Item {
  const gildedRose = new GildedRose([new Item(name, sellIn, quality)]);
  return gildedRose.updateQuality()[0];
}

describe('Gilded Rose', () => {
  it('keeps the item name', () => {
    expect(updateOnce('foo', 0, 0).name).toBe('foo');
  });

  it('handles an empty inventory', () => {
    expect(new GildedRose().updateQuality()).toEqual([]);
  });

  it('updates every item of the inventory', () => {
    const items = new GildedRose([
      new Item('foo', 5, 5),
      new Item(AGED_BRIE, 5, 5),
    ]).updateQuality();

    expect(items.map(item => item.quality)).toEqual([4, 6]);
  });

  describe('quality already out of bounds (invalid input)', () => {
    it('is left as is rather than corrected', () => {
      expect(updateOnce('foo', 10, 60).quality).toBe(59);
      expect(updateOnce('foo', 10, -5).quality).toBe(-5);
      expect(updateOnce(AGED_BRIE, 10, 55).quality).toBe(55);
      expect(updateOnce(BACKSTAGE, 5, 55).quality).toBe(55);
    });
  });

  describe('normal item', () => {
    it('decreases sellIn and quality by 1', () => {
      const item = updateOnce('foo', 10, 20);
      expect(item.sellIn).toBe(9);
      expect(item.quality).toBe(19);
    });

    it('degrades twice as fast once the sell date has passed', () => {
      expect(updateOnce('foo', 0, 20).quality).toBe(18);
      expect(updateOnce('foo', -1, 20).quality).toBe(18);
    });

    it('never has a negative quality', () => {
      expect(updateOnce('foo', 10, 0).quality).toBe(0);
      expect(updateOnce('foo', 0, 1).quality).toBe(0);
    });
  });

  describe('Aged Brie', () => {
    it('increases in quality as it gets older', () => {
      const item = updateOnce(AGED_BRIE, 10, 20);
      expect(item.sellIn).toBe(9);
      expect(item.quality).toBe(21);
    });

    it('increases twice as fast once the sell date has passed', () => {
      expect(updateOnce(AGED_BRIE, 0, 20).quality).toBe(22);
    });

    it('never goes above 50', () => {
      expect(updateOnce(AGED_BRIE, 10, 50).quality).toBe(50);
      expect(updateOnce(AGED_BRIE, 0, 49).quality).toBe(50);
    });
  });

  describe('Sulfuras', () => {
    it('never changes, before or after its sell date', () => {
      for (const sellIn of [10, 0, -1]) {
        const item = updateOnce(SULFURAS, sellIn, 80);
        expect(item.sellIn).toBe(sellIn);
        expect(item.quality).toBe(80);
      }
    });
  });

  describe('Conjured item', () => {
    const CONJURED = 'Conjured Mana Cake';

    it('degrades twice as fast as a normal item', () => {
      const item = updateOnce(CONJURED, 10, 20);
      expect(item.sellIn).toBe(9);
      expect(item.quality).toBe(18);
    });

    it('degrades twice as fast as a normal item once expired', () => {
      expect(updateOnce(CONJURED, 0, 20).quality).toBe(16);
    });

    it('never has a negative quality', () => {
      expect(updateOnce(CONJURED, 10, 1).quality).toBe(0);
      expect(updateOnce(CONJURED, 0, 3).quality).toBe(0);
    });
  });

  describe('Backstage passes', () => {
    it('increases by 1 when the concert is more than 10 days away', () => {
      const item = updateOnce(BACKSTAGE, 11, 20);
      expect(item.sellIn).toBe(10);
      expect(item.quality).toBe(21);
    });

    it('increases by 2 when the concert is 10 days away or less', () => {
      expect(updateOnce(BACKSTAGE, 10, 20).quality).toBe(22);
      expect(updateOnce(BACKSTAGE, 6, 20).quality).toBe(22);
    });

    it('increases by 3 when the concert is 5 days away or less', () => {
      expect(updateOnce(BACKSTAGE, 5, 20).quality).toBe(23);
      expect(updateOnce(BACKSTAGE, 1, 20).quality).toBe(23);
    });

    it('drops to 0 after the concert', () => {
      expect(updateOnce(BACKSTAGE, 0, 20).quality).toBe(0);
    });

    it('never goes above 50', () => {
      expect(updateOnce(BACKSTAGE, 10, 49).quality).toBe(50);
      expect(updateOnce(BACKSTAGE, 5, 48).quality).toBe(50);
      expect(updateOnce(BACKSTAGE, 5, 50).quality).toBe(50);
    });
  });
});
