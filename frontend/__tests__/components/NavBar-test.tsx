import { renderWithTamagui } from '@/utils/tests/renderWithTamagui'; 
import { NavigationBar } from '@/components/NavBar';

describe('<NavigationBar />', () => {
it('should render 3 icons', () => {
    const { getAllByRole } = renderWithTamagui(<NavigationBar active="home" />);
    const buttons = getAllByRole('button');
    expect(buttons.length).toBe(3);
  });
});