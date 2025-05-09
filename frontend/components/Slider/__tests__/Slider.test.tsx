import React from 'react';
import Slider from '../Slider';
import { renderWithTamagui } from '@/utils/tests/renderWithTamagui';
 
describe('Slider', () => {
  it('renders correctly with default props and emoji icon', () => {
    const { getByText } = renderWithTamagui(
      <Slider value={25} max={100} icon="🎵" />
    );

    expect(getByText('🎵')).toBeTruthy();
  });
});