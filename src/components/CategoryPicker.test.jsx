import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import CategoryPicker from './CategoryPicker';
import { activeCategoryKeys, DEFAULT_CATEGORIES } from '../utils/categories';

const Harness = ({ initial = DEFAULT_CATEGORIES }) => {
  const [value, setValue] = useState(initial);
  return (<><CategoryPicker value={value} onChange={setValue} /><p data-testid="value">{value.join(',')}</p></>);
};

const button = (name) => screen.getByRole('button', { name: new RegExp(`^${name}`) });

describe('CategoryPicker', () => {
  it('swaps a category by deselecting one and selecting another', () => {
    render(<Harness />);
    expect(screen.getByText('4 af 4 valgt')).toBeInTheDocument();
    fireEvent.click(button('Dyr'));
    expect(screen.getByText(/Fravælg en kategori først/)).toBeInTheDocument();
    expect(screen.getByTestId('value')).toHaveTextContent('person,sted,ting,aarstal');
    fireEvent.click(button('Årstal'));
    fireEvent.click(button('Dyr'));
    expect(screen.getByTestId('value')).toHaveTextContent('person,sted,ting,dyr');
    expect(button('Dyr')).toHaveAttribute('aria-pressed', 'true');
  });

  it('can go back to the default four', () => {
    render(<Harness initial={['dyr', 'musik', 'natur', 'sport']} />);
    fireEvent.click(screen.getByRole('button', { name: /Brug standard/ }));
    expect(screen.getByTestId('value')).toHaveTextContent('person,sted,ting,aarstal');
  });
});

describe('activeCategoryKeys', () => {
  it('keeps a valid set in list order and falls back to the default otherwise', () => {
    expect(activeCategoryKeys(['musik', 'person', 'dyr', 'sted'])).toEqual(['person', 'sted', 'dyr', 'musik']);
    expect(activeCategoryKeys(['person', 'begivenhed', 'sted', 'ting'])).toEqual(DEFAULT_CATEGORIES);
    expect(activeCategoryKeys(undefined)).toEqual(DEFAULT_CATEGORIES);
  });
});
