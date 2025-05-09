import React from 'react';
import Header from '../Header';
import { renderWithTamagui } from '@/utils/tests/renderWithTamagui';
 
describe('<Header/>', () => {
  it('Should render logo, bell and profile', () => {
    const {
      getByTestId,
    } = renderWithTamagui(<Header />);
 
   expect(getByTestId('LogoImage')).toBeTruthy();
   expect(getByTestId('BellIcon')).toBeTruthy();
   expect(getByTestId('ProfileImage')).toBeTruthy();
  });
});