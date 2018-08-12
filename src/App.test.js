import React from 'react';
import { render, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';
import 'jest-styled-components';
import App from './App';
import Nav from './components/Nav';
import TxModal from './features/transactions/Tx';

afterEach(cleanup);

test('renders without crashing', () => {
  const { getByTestId } = render(<App />);
  expect(getByTestId('mainApp')).toBeTruthy();
});

test('renders Nav with props', () => {
  const { getByTestId } = render(<Nav title="test title" balance={2} />);
  expect(getByTestId('navbar')).toHaveTextContent('test title');
  expect(getByTestId('navbar')).toHaveTextContent(2);
});

test('nav matches snapshot', () => {
  const { getByTestId } = render(<Nav title="test title" balance={2} />);
  expect(getByTestId('navbar')).toMatchSnapshot();
});

test.skip('TX modal matches snapshot', () => {
  const mockFn = jest.fn();
  const { getByTestId } = render(
    <TxModal
      visible={false}
      handleOk={mockFn}
      handleCancel={mockFn}
      handleChange={mockFn}
      passwordConfirm={'test password'}
      gas={100}
      showAdvanced={false}
      onChange={mockFn}
      closeModal={mockFn}
      loading={false}
      min={10}
      max={100}
      actualPrice={100}
    />,
  );
  expect(getByTestId('txModal')).toMatchSnapshot();
});
