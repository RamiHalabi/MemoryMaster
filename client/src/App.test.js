import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import React from 'react';


test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

 test("renders the title correctly", () => {
    const { getByText } = render(<App />);
    const title = getByText(/Memory Master/i);
    expect(title).toBeInTheDocument();
 });

 test("shows the player stats when clicking on the player stats button", async () => {
    const { getByText } = render(<App />);
    const playerStatsButton = getByText(/Player Stats./i);
    fireEvent.click(playerStatsButton);
    await waitFor(() => expect(getByText(/Highscore:/i)).toBeInTheDocument());
 });


