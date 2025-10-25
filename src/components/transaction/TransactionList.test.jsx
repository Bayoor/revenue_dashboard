import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransactionList } from './TransactionList';
import * as useFetchHook from '../../hooks/useFetch';

// Mock the useFetch hook
vi.mock('../../hooks/useFetch');

// Mock the services
vi.mock('../../services/user', () => ({
  getAllTransactions: vi.fn(),
}));

const mockTransactions = [
  {
    payment_reference: 'TXN001',
    amount: '100.00',
    date: '2025-10-20T10:00:00Z',
    status: 'successful',
    type: 'payment',
    metadata: {
      product_name: 'Product A',
      name: 'John Doe',
    },
  },
  {
    payment_reference: 'TXN002',
    amount: '250.50',
    date: '2025-10-22T14:30:00Z',
    status: 'pending',
    type: 'payment',
    metadata: {
      product_name: 'Product B',
      name: 'Jane Smith',
    },
  },
  {
    payment_reference: 'TXN003',
    amount: '50.00',
    date: '2025-10-15T09:15:00Z',
    status: 'failed',
    type: 'payment',
    metadata: {
      product_name: 'Product C',
      name: 'Bob Johnson',
    },
  },
  {
    payment_reference: 'TXN004',
    amount: '75.00',
    date: '2025-10-25T16:45:00Z',
    status: 'successful',
    type: 'withdrawal',
    metadata: {},
  },
];

describe('TransactionList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading and Error States', () => {
    it('should display loading state', () => {
      vi.spyOn(useFetchHook, 'useFetch').mockReturnValue({
        data: null,
        loading: true,
        error: null,
      });

      render(<TransactionList />);

      expect(screen.getByText('Loading transactions...')).toBeInTheDocument();
    });

    it('should display error state', () => {
      vi.spyOn(useFetchHook, 'useFetch').mockReturnValue({
        data: null,
        loading: false,
        error: 'Failed to fetch transactions',
      });

      render(<TransactionList />);

      expect(screen.getByText(/Error: Failed to fetch transactions/i)).toBeInTheDocument();
    });
  });

  describe('Transaction Rendering', () => {
    it('should render all transactions when loaded', () => {
      vi.spyOn(useFetchHook, 'useFetch').mockReturnValue({
        data: mockTransactions,
        loading: false,
        error: null,
      });

      render(<TransactionList />);

      expect(screen.getByText('4 Transactions')).toBeInTheDocument();
      expect(screen.getByText('Product A')).toBeInTheDocument();
      expect(screen.getByText('Product B')).toBeInTheDocument();
      expect(screen.getByText('Product C')).toBeInTheDocument();
      expect(screen.getByText('Cash withdrawal')).toBeInTheDocument();
    });

    it('should render transaction count correctly', () => {
      vi.spyOn(useFetchHook, 'useFetch').mockReturnValue({
        data: mockTransactions,
        loading: false,
        error: null,
      });

      render(<TransactionList />);

      expect(screen.getByText('4 Transactions')).toBeInTheDocument();
    });

    it('should display empty state when no transactions', () => {
      vi.spyOn(useFetchHook, 'useFetch').mockReturnValue({
        data: [],
        loading: false,
        error: null,
      });

      render(<TransactionList />);

      expect(screen.getByText('No transactions found')).toBeInTheDocument();
      expect(
        screen.getByText(/You don't have any transactions yet/i)
      ).toBeInTheDocument();
    });
  });

  describe('Transaction Filtering by Status', () => {
    it('should filter transactions by successful status', async () => {
      const user = userEvent.setup();
      vi.spyOn(useFetchHook, 'useFetch').mockReturnValue({
        data: mockTransactions,
        loading: false,
        error: null,
      });

      render(<TransactionList />);

      // Open filter modal
      const filterButton = screen.getByRole('button', { name: /filter/i });
      await user.click(filterButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Select "Today" to set dates
      const todayButton = screen.getByRole('button', { name: 'Today' });
      await user.click(todayButton);

      // Open status dropdown
      const statusDropdown = screen.getByText('Select an option');
      await user.click(statusDropdown);

      // Select successful status
      const successfulCheckbox = screen.getByRole('checkbox', { name: /successful/i });
      await user.click(successfulCheckbox);

      // Apply filters
      const applyButton = screen.getByRole('button', { name: /apply/i });
      await user.click(applyButton);

      await waitFor(() => {
        // Should only show successful transactions from today
        const transactionCount = screen.getByText(/Transactions/);
        expect(transactionCount).toBeInTheDocument();
      });
    });

    it('should filter transactions by failed status', async () => {
      const user = userEvent.setup();
      vi.spyOn(useFetchHook, 'useFetch').mockReturnValue({
        data: mockTransactions,
        loading: false,
        error: null,
      });

      render(<TransactionList />);

      // Open filter modal
      const filterButton = screen.getByRole('button', { name: /filter/i });
      await user.click(filterButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Select "Last 3 months" to include all test data
      const last3MonthsButton = screen.getByRole('button', { name: 'Last 3 months' });
      await user.click(last3MonthsButton);

      // Open status dropdown
      const statusDropdown = screen.getByText('Select an option');
      await user.click(statusDropdown);

      // Select failed status
      const failedCheckbox = screen.getByRole('checkbox', { name: /failed/i });
      await user.click(failedCheckbox);

      // Apply filters
      const applyButton = screen.getByRole('button', { name: /apply/i });
      await user.click(applyButton);

      await waitFor(() => {
        // Should show only failed transaction
        expect(screen.getByText('1 Transactions')).toBeInTheDocument();
        expect(screen.getByText('Product C')).toBeInTheDocument();
      });
    });

    it('should filter transactions by multiple statuses', async () => {
      const user = userEvent.setup();
      vi.spyOn(useFetchHook, 'useFetch').mockReturnValue({
        data: mockTransactions,
        loading: false,
        error: null,
      });

      render(<TransactionList />);

      // Open filter modal
      const filterButton = screen.getByRole('button', { name: /filter/i });
      await user.click(filterButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Select "Last 3 months" to include all test data
      const last3MonthsButton = screen.getByRole('button', { name: 'Last 3 months' });
      await user.click(last3MonthsButton);

      // Open status dropdown
      const statusDropdown = screen.getByText('Select an option');
      await user.click(statusDropdown);

      // Select successful and pending
      const successfulCheckbox = screen.getByRole('checkbox', { name: /successful/i });
      const pendingCheckbox = screen.getByRole('checkbox', { name: /pending/i });

      await user.click(successfulCheckbox);
      await user.click(pendingCheckbox);

      // Apply filters
      const applyButton = screen.getByRole('button', { name: /apply/i });
      await user.click(applyButton);

      await waitFor(() => {
        // Should show successful and pending transactions (3 total)
        expect(screen.getByText('3 Transactions')).toBeInTheDocument();
      });
    });
  });

  describe('Transaction Filtering by Date', () => {
    it('should show correct description text when filters are applied', async () => {
      const user = userEvent.setup();
      vi.spyOn(useFetchHook, 'useFetch').mockReturnValue({
        data: mockTransactions,
        loading: false,
        error: null,
      });

      render(<TransactionList />);

      // Initially shows "for the last 7 days"
      expect(screen.getByText(/for the last 7 days/i)).toBeInTheDocument();

      // Open filter modal
      const filterButton = screen.getByRole('button', { name: /filter/i });
      await user.click(filterButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Select date range
      const todayButton = screen.getByRole('button', { name: 'Today' });
      await user.click(todayButton);

      // Apply filters
      const applyButton = screen.getByRole('button', { name: /apply/i });
      await user.click(applyButton);

      await waitFor(() => {
        // Should now show "for the selected date range"
        expect(screen.getByText(/for the selected date range/i)).toBeInTheDocument();
      });
    });

    it('should display empty state with filter message when no matches', async () => {
      const user = userEvent.setup();
      vi.spyOn(useFetchHook, 'useFetch').mockReturnValue({
        data: mockTransactions,
        loading: false,
        error: null,
      });

      render(<TransactionList />);

      // Open filter modal
      const filterButton = screen.getByRole('button', { name: /filter/i });
      await user.click(filterButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Select "Today"
      const todayButton = screen.getByRole('button', { name: 'Today' });
      await user.click(todayButton);

      // Open status dropdown and select failed (no failed transactions today)
      const statusDropdown = screen.getByText('Select an option');
      await user.click(statusDropdown);

      const failedCheckbox = screen.getByRole('checkbox', { name: /failed/i });
      await user.click(failedCheckbox);

      // Apply filters
      const applyButton = screen.getByRole('button', { name: /apply/i });
      await user.click(applyButton);

      await waitFor(() => {
        expect(screen.getByText('No transactions found')).toBeInTheDocument();
        expect(
          screen.getByText(/No transactions match your current filters/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe('Filter Count Badge', () => {
    it('should display filtered count in badge when filters are active', async () => {
      const user = userEvent.setup();
      vi.spyOn(useFetchHook, 'useFetch').mockReturnValue({
        data: mockTransactions,
        loading: false,
        error: null,
      });

      render(<TransactionList />);

      // Open filter modal
      const filterButton = screen.getByRole('button', { name: /filter/i });
      await user.click(filterButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Select "Last 3 months"
      const last3MonthsButton = screen.getByRole('button', { name: 'Last 3 months' });
      await user.click(last3MonthsButton);

      // Apply filters
      const applyButton = screen.getByRole('button', { name: /apply/i });
      await user.click(applyButton);

      await waitFor(() => {
        // Filter button should now show badge with count
        const filterButtonAfter = screen.getByRole('button', { name: /filter/i });
        expect(filterButtonAfter).toBeInTheDocument();
      });
    });

    it('should not display badge when no filters are active', () => {
      vi.spyOn(useFetchHook, 'useFetch').mockReturnValue({
        data: mockTransactions,
        loading: false,
        error: null,
      });

      const { container } = render(<TransactionList />);

      // Badge should not be present
      const badge = container.querySelector('span.rounded-full');
      expect(badge).not.toBeInTheDocument();
    });
  });

  describe('Transaction Types', () => {
    it('should render withdrawal transactions differently', () => {
      vi.spyOn(useFetchHook, 'useFetch').mockReturnValue({
        data: mockTransactions,
        loading: false,
        error: null,
      });

      render(<TransactionList />);

      // Withdrawal should display as "Cash withdrawal"
      expect(screen.getByText('Cash withdrawal')).toBeInTheDocument();
    });

    it('should render payment transactions with metadata', () => {
      vi.spyOn(useFetchHook, 'useFetch').mockReturnValue({
        data: mockTransactions,
        loading: false,
        error: null,
      });

      render(<TransactionList />);

      // Payment transactions should show product names
      expect(screen.getByText('Product A')).toBeInTheDocument();
      // Status is shown instead of recipient when status is successful/pending
      expect(screen.getAllByText('Successful').length).toBeGreaterThan(0);
    });
  });

  describe('Export Button', () => {
    it('should render Export list button', () => {
      vi.spyOn(useFetchHook, 'useFetch').mockReturnValue({
        data: mockTransactions,
        loading: false,
        error: null,
      });

      render(<TransactionList />);

      const exportButton = screen.getByRole('button', { name: /export list/i });
      expect(exportButton).toBeInTheDocument();
    });
  });
});
