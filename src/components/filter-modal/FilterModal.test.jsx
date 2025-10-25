import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterModal from './FilterModal';
import { format, subDays, startOfMonth, subMonths } from 'date-fns';

describe('FilterModal', () => {
  let mockOnApplyFilter;

  beforeEach(() => {
    mockOnApplyFilter = vi.fn();
  });

  describe('Rendering', () => {
    it('should render the Filter button', () => {
      render(<FilterModal onApplyFilter={mockOnApplyFilter} filteredCount={null} />);

      const filterButton = screen.getByRole('button', { name: /filter/i });
      expect(filterButton).toBeInTheDocument();
    });

    it('should display filtered count badge when filteredCount is provided', () => {
      render(<FilterModal onApplyFilter={mockOnApplyFilter} filteredCount={5} />);

      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('should not display badge when filteredCount is null', () => {
      const { container } = render(<FilterModal onApplyFilter={mockOnApplyFilter} filteredCount={null} />);

      const badge = container.querySelector('span.rounded-full');
      expect(badge).not.toBeInTheDocument();
    });
  });

  describe('Modal Opening and Closing', () => {
    it('should open modal when Filter button is clicked', async () => {
      const user = userEvent.setup();
      render(<FilterModal onApplyFilter={mockOnApplyFilter} filteredCount={null} />);

      const filterButton = screen.getByRole('button', { name: /filter/i });
      await user.click(filterButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Filter', { selector: 'h2' })).toBeInTheDocument();
      });
    });

    it('should close modal when clicking outside', async () => {
      const user = userEvent.setup();
      render(<FilterModal onApplyFilter={mockOnApplyFilter} filteredCount={null} />);

      const filterButton = screen.getByRole('button', { name: /filter/i });
      await user.click(filterButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Press Escape to close
      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('Date Range Selection', () => {
    it('should select "Today" date range', async () => {
      const user = userEvent.setup();
      render(<FilterModal onApplyFilter={mockOnApplyFilter} filteredCount={null} />);

      const filterButton = screen.getByRole('button', { name: /filter/i });
      await user.click(filterButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const todayButton = screen.getByRole('button', { name: 'Today' });
      await user.click(todayButton);

      // Check that today's date is displayed in both date fields
      const today = format(new Date(), 'dd MMM yyyy');
      const dateButtons = screen.getAllByText(today);
      expect(dateButtons.length).toBeGreaterThanOrEqual(2); // Start and End date
    });

    it('should select "Last 7 days" date range', async () => {
      const user = userEvent.setup();
      render(<FilterModal onApplyFilter={mockOnApplyFilter} filteredCount={null} />);

      const filterButton = screen.getByRole('button', { name: /filter/i });
      await user.click(filterButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const last7DaysButton = screen.getByRole('button', { name: 'Last 7 days' });
      await user.click(last7DaysButton);

      const today = new Date();
      const sevenDaysAgo = subDays(today, 6);

      expect(screen.getByText(format(sevenDaysAgo, 'dd MMM yyyy'))).toBeInTheDocument();
      expect(screen.getByText(format(today, 'dd MMM yyyy'))).toBeInTheDocument();
    });

    it('should select "This month" date range', async () => {
      const user = userEvent.setup();
      render(<FilterModal onApplyFilter={mockOnApplyFilter} filteredCount={null} />);

      const filterButton = screen.getByRole('button', { name: /filter/i });
      await user.click(filterButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const thisMonthButton = screen.getByRole('button', { name: 'This month' });
      await user.click(thisMonthButton);

      const today = new Date();
      const monthStart = startOfMonth(today);

      expect(screen.getByText(format(monthStart, 'dd MMM yyyy'))).toBeInTheDocument();
      expect(screen.getByText(format(today, 'dd MMM yyyy'))).toBeInTheDocument();
    });

    it('should select "Last 3 months" date range', async () => {
      const user = userEvent.setup();
      render(<FilterModal onApplyFilter={mockOnApplyFilter} filteredCount={null} />);

      const filterButton = screen.getByRole('button', { name: /filter/i });
      await user.click(filterButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const last3MonthsButton = screen.getByRole('button', { name: 'Last 3 months' });
      await user.click(last3MonthsButton);

      const today = new Date();
      const threeMonthsAgo = subMonths(today, 3);

      expect(screen.getByText(format(threeMonthsAgo, 'dd MMM yyyy'))).toBeInTheDocument();
      expect(screen.getByText(format(today, 'dd MMM yyyy'))).toBeInTheDocument();
    });
  });

  describe('Transaction Status Selection', () => {
    it('should toggle status checkboxes', async () => {
      const user = userEvent.setup();
      render(<FilterModal onApplyFilter={mockOnApplyFilter} filteredCount={null} />);

      const filterButton = screen.getByRole('button', { name: /filter/i });
      await user.click(filterButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Open status dropdown
      const statusDropdown = screen.getByText('Select an option');
      await user.click(statusDropdown);

      // Check successful status
      const successfulCheckbox = screen.getByRole('checkbox', { name: /successful/i });
      await user.click(successfulCheckbox);

      expect(successfulCheckbox).toBeChecked();
    });

    it('should display selected statuses in dropdown text', async () => {
      const user = userEvent.setup();
      render(<FilterModal onApplyFilter={mockOnApplyFilter} filteredCount={null} />);

      const filterButton = screen.getByRole('button', { name: /filter/i });
      await user.click(filterButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Open status dropdown
      const statusDropdown = screen.getByText('Select an option');
      await user.click(statusDropdown);

      // Select multiple statuses
      const successfulCheckbox = screen.getByRole('checkbox', { name: /successful/i });
      const failedCheckbox = screen.getByRole('checkbox', { name: /failed/i });

      await user.click(successfulCheckbox);
      await user.click(failedCheckbox);

      await waitFor(() => {
        expect(screen.getByText(/successful, failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Apply and Clear Functionality', () => {
    it('should call onApplyFilter with correct data when Apply is clicked', async () => {
      const user = userEvent.setup();
      render(<FilterModal onApplyFilter={mockOnApplyFilter} filteredCount={null} />);

      const filterButton = screen.getByRole('button', { name: /filter/i });
      await user.click(filterButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Select "Today" date range
      const todayButton = screen.getByRole('button', { name: 'Today' });
      await user.click(todayButton);

      // Open status dropdown and select a status
      const statusDropdown = screen.getByText('Select an option');
      await user.click(statusDropdown);

      const successfulCheckbox = screen.getByRole('checkbox', { name: /successful/i });
      await user.click(successfulCheckbox);

      // Click Apply button
      const applyButton = screen.getByRole('button', { name: /apply/i });
      await user.click(applyButton);

      await waitFor(() => {
        expect(mockOnApplyFilter).toHaveBeenCalledTimes(1);
        const callArgs = mockOnApplyFilter.mock.calls[0][0];
        expect(callArgs.statuses).toContain('successful');
        expect(callArgs.startDate).toBeDefined();
        expect(callArgs.endDate).toBeDefined();
      });
    });

    it('should have Apply button disabled when no dates are selected', async () => {
      const user = userEvent.setup();
      render(<FilterModal onApplyFilter={mockOnApplyFilter} filteredCount={null} />);

      const filterButton = screen.getByRole('button', { name: /filter/i });
      await user.click(filterButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const applyButton = screen.getByRole('button', { name: /apply/i });
      expect(applyButton).toBeDisabled();
    });

    it('should clear all filters when Clear button is clicked', async () => {
      const user = userEvent.setup();
      render(<FilterModal onApplyFilter={mockOnApplyFilter} filteredCount={null} />);

      const filterButton = screen.getByRole('button', { name: /filter/i });
      await user.click(filterButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Select date range
      const todayButton = screen.getByRole('button', { name: 'Today' });
      await user.click(todayButton);

      // Open status dropdown and select a status
      const statusDropdown = screen.getByText('Select an option');
      await user.click(statusDropdown);

      const successfulCheckbox = screen.getByRole('checkbox', { name: /successful/i });
      await user.click(successfulCheckbox);

      // Click Clear button
      const clearButton = screen.getByRole('button', { name: /clear/i });
      await user.click(clearButton);

      await waitFor(() => {
        expect(mockOnApplyFilter).toHaveBeenCalledWith({
          startDate: null,
          endDate: null,
          statuses: []
        });
      });

      // Verify dates are cleared
      expect(screen.getAllByText('Select a date')).toHaveLength(2);
    });

    it('should reset selected statuses after Clear is clicked', async () => {
      const user = userEvent.setup();
      render(<FilterModal onApplyFilter={mockOnApplyFilter} filteredCount={null} />);

      const filterButton = screen.getByRole('button', { name: /filter/i });
      await user.click(filterButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Open status dropdown and select a status
      const statusDropdown = screen.getByText('Select an option');
      await user.click(statusDropdown);

      const successfulCheckbox = screen.getByRole('checkbox', { name: /successful/i });
      await user.click(successfulCheckbox);

      expect(successfulCheckbox).toBeChecked();

      // Click Clear button
      const clearButton = screen.getByRole('button', { name: /clear/i });
      await user.click(clearButton);

      await waitFor(() => {
        expect(successfulCheckbox).not.toBeChecked();
      });
    });
  });

  describe('Modal State Management', () => {
    it('should close modal after applying filters', async () => {
      const user = userEvent.setup();
      render(<FilterModal onApplyFilter={mockOnApplyFilter} filteredCount={null} />);

      const filterButton = screen.getByRole('button', { name: /filter/i });
      await user.click(filterButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Select "Today" date range
      const todayButton = screen.getByRole('button', { name: 'Today' });
      await user.click(todayButton);

      // Click Apply button
      const applyButton = screen.getByRole('button', { name: /apply/i });
      await user.click(applyButton);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('should maintain filter state when reopening modal', async () => {
      const user = userEvent.setup();
      render(<FilterModal onApplyFilter={mockOnApplyFilter} filteredCount={null} />);

      // Open modal
      const filterButton = screen.getByRole('button', { name: /filter/i });
      await user.click(filterButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Select "Today" date range
      const todayButton = screen.getByRole('button', { name: 'Today' });
      await user.click(todayButton);

      const today = format(new Date(), 'dd MMM yyyy');

      // Verify dates are set
      await waitFor(() => {
        const dateDisplays = screen.getAllByText(today);
        expect(dateDisplays.length).toBeGreaterThanOrEqual(2);
      });

      // Close modal (escape)
      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });

      // Reopen modal
      await user.click(filterButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Selected date should still be there
      await waitFor(() => {
        const dateDisplaysAfterReopen = screen.getAllByText(today);
        expect(dateDisplaysAfterReopen.length).toBeGreaterThanOrEqual(2);
      });
    });
  });
});
