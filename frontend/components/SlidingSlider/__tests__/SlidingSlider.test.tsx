import React from 'react';
import SlidingSlider, { calculateValueFromPageX } from '../SlidingSlider';
import { renderWithTamagui } from '@/utils/tests/renderWithTamagui';
 
describe('SlidingSlider', () => {
  it('renders correctly with default props and emoji icon', () => {
    const { getByText } = renderWithTamagui(
      <SlidingSlider value={25} max={100} icon="🎵" />
    );

    expect(getByText('🎵')).toBeTruthy();
  });

  it('computes correct value from pageX', () => {
    const value = calculateValueFromPageX(150, 0, 300, 100);
    expect(value).toBe(50);
  });
});