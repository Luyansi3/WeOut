import { renderWithTamagui } from '@/utils/tests/renderWithTamagui'; 

import HomeScreen from '@/app/index';

describe('<HomeScreen />', () => {
  test('Text renders correctly on HomeScreen', () => {
    const { getByText } = renderWithTamagui(<HomeScreen />);

    getByText('Welcome!');
  });
});