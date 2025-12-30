import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

jest.mock('ag-grid-react', () => {
  const React = require('react');
  return {
    AgGridReact: (props) => {
      const out = {
        columnDefs: props.columnDefs
          ? props.columnDefs.map((cd) => ({ field: cd.field, headerName: cd.headerName }))
          : [],
        rowClassRules: props.rowClassRules ? Object.keys(props.rowClassRules) : [],
      };
      return React.createElement('div', { 'data-ag-props': JSON.stringify(out) });
    },
  };
});

describe('Form validations', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('shows validation errors for empty fields', () => {
    render(<App />);
    fireEvent.click(screen.getByText('+ Add'));
    fireEvent.click(screen.getByText('Submit'));

    expect(screen.getByText('Full name is required')).toBeInTheDocument();
    expect(screen.getByText('Age must be a number between 5 and 100')).toBeInTheDocument();
    expect(screen.getByText('Email is invalid')).toBeInTheDocument();
  });

  test('rejects invalid email, phone and pincode', () => {
    render(<App />);
    fireEvent.click(screen.getByText('+ Add'));

    fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Age'), { target: { value: '20' } });
    fireEvent.change(screen.getByPlaceholderText('Grade'), { target: { value: 'A' } });
    fireEvent.change(screen.getByPlaceholderText('Date of Birth'), { target: { value: '2005-01-01' } });
    fireEvent.change(screen.getByPlaceholderText('Phone'), { target: { value: '123' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'not-an-email' } });
    fireEvent.change(screen.getByPlaceholderText('Street'), { target: { value: 'Some St' } });
    fireEvent.change(screen.getByPlaceholderText('City'), { target: { value: 'City' } });
    fireEvent.change(screen.getByPlaceholderText('Pincode'), { target: { value: '12' } });

    fireEvent.click(screen.getByText('Submit'));

    expect(screen.getByText('Phone must be 10 digits')).toBeInTheDocument();
    expect(screen.getByText('Email is invalid')).toBeInTheDocument();
    expect(screen.getByText('Pincode must be 6 digits')).toBeInTheDocument();
  });

  test('accepts valid submission and closes form', async () => {
    render(<App />);
    fireEvent.click(screen.getByText('+ Add'));

    fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('Age'), { target: { value: '21' } });
    fireEvent.change(screen.getByPlaceholderText('Grade'), { target: { value: 'B' } });
    fireEvent.change(screen.getByPlaceholderText('Date of Birth'), { target: { value: '2004-01-01' } });
    fireEvent.change(screen.getByPlaceholderText('Phone'), { target: { value: '9123456789' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test.user@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Street'), { target: { value: 'Main St' } });
    fireEvent.change(screen.getByPlaceholderText('City'), { target: { value: 'Town' } });
    fireEvent.change(screen.getByPlaceholderText('Pincode'), { target: { value: '560001' } });

    fireEvent.click(screen.getByText('Submit'));

    // form should be closed after successful submit
    expect(screen.queryByPlaceholderText('Full Name')).not.toBeInTheDocument();

    const saved = JSON.parse(localStorage.getItem('students'));
    expect(saved).toBeTruthy();
    expect(saved[saved.length - 1].name).toBe('Test User');
  });
});
