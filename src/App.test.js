import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('ag-grid-react', () => {
  const React = require('react');
  return {
    AgGridReact: (props) => {
      const out = {
        columnDefs: props.columnDefs
          ? props.columnDefs.map((cd) => ({
              field: cd.field,
              headerName: cd.headerName,
              cellClassRules: cd.cellClassRules ? Object.keys(cd.cellClassRules) : [],
            }))
          : [],
        rowClassRules: props.rowClassRules ? Object.keys(props.rowClassRules) : [],
      };
      return React.createElement('div', { 'data-ag-props': JSON.stringify(out) });
    },
  };
});

import App, { WishHappyBirthday } from './App';

// test('renders App container with specified height', () => {
//   const { container } = render(<App />);
//   expect(container.firstChild).toHaveStyle('height: 600px');
// });

test('WishHappyBirthday button displays correct text', () => {
  render(<WishHappyBirthday name="Alice" />);
  expect(screen.getByRole('button', { name: 'Wish Birthday 🎂' })).toBeInTheDocument();
});

test('WishHappyBirthday click calls alert with name', () => {
  const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
  render(<WishHappyBirthday name="Bob" />);
  fireEvent.click(screen.getByRole('button'));
  expect(alertMock).toHaveBeenCalledWith('Happy Birthday 🎂 Bob');
  alertMock.mockRestore();
});

test('AgGrid receives cellClassRules (rag-green) and rowClassRules (rowred)', () => {
  const { container } = render(<App />);
  const agDiv = container.querySelector('div[data-ag-props]');
  expect(agDiv).toBeInTheDocument();
  const props = JSON.parse(agDiv.getAttribute('data-ag-props'));
  const ageCol = props.columnDefs.find((c) => c.field === 'age');
  expect(ageCol).toBeDefined();
  expect(ageCol.cellClassRules).toContain('rag-green');
  expect(props.rowClassRules).toContain('rowred');
});
