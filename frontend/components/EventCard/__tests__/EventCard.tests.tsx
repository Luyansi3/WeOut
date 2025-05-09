import React from 'react';
import EventCard from '../EventCard';
import { renderWithTamagui } from '@/utils/tests/renderWithTamagui';
 
describe('<EventCard/>', () => {
  it('Should render logo, bell and profile', () => {
    const {
      getByTestId,
      getAllByRole,
    } = renderWithTamagui(<EventCard />);
 
   expect(getByTestId('EventImage')).toBeTruthy();
   expect(getByTestId('EventDate')).toBeTruthy();
   expect(getByTestId('EventLocation')).toBeTruthy();
   expect(getAllByRole('text')).toHaveLength(4);
  });
});