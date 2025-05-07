describe('add()', () => {
    function add(a: number, b: number): number {
      return a + b;
    }
  
    it('should return 5 when adding 2 and 3', () => {
      expect(add(2, 3)).toBe(5);
    });
  
    it('should return 0 when adding -2 and 2', () => {
      expect(add(-2, 2)).toBe(0);
    });
  });
  