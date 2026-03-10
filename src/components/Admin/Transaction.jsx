// components/TransactionManagement.jsx
import React, { useState } from 'react';
import { Search, Download, Eye } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  mockTransactionList, 
  transactionStats, 
  transactionChartData, 
  timeRangeOptions,
  statusOptions,
  paymentMethodOptions
} from '../../data/Admin/TransactionData';
import '../../styles/Admin/Transaction.css';

const TransactionManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('today');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter transactions
  const filteredTransactions = mockTransactionList.filter(transaction => {
    const matchesSearch = 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.passenger.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || transaction.status === selectedStatus;
    const matchesPayment = selectedPaymentMethod === 'all' || transaction.paymentMethod === selectedPaymentMethod;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Get chart data
  const chartData = transactionChartData[selectedTimeRange] || transactionChartData.today;

  // Handle view details
  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailModal(true);
  };

  // Handle export
  const handleExport = () => {
    alert('Export functionality will be implemented');
  };

  // Get status badge class
  const getStatusClass = (status) => {
    switch (status) {
      case 'Completed': return 'status-completed';
      case 'Pending': return 'status-pending';
      case 'Refunded': return 'status-refunded';
      case 'Failed': return 'status-failed';
      default: return '';
    }
  };

  return (
    <div className="transaction-container">
      <div className="transaction-main">
        {/* HEADER */}
        <div className="transaction-header">
          <h1>TRANSACTION MANAGEMENT</h1>
        </div>

        {/* STATISTICS CARDS */}
        <div className="transaction-stats-grid">
          <div className="transaction-stat-card">
            <div className="stat-icon-txn">💳</div>
            <div className="stat-content-txn">
              <div className="stat-label-txn">Total Transactions</div>
              <div className="stat-value-txn">{transactionStats.totalTransactions.toLocaleString()}</div>
            </div>
          </div>

          <div className="transaction-stat-card">
            <div className="stat-icon-txn">💰</div>
            <div className="stat-content-txn">
              <div className="stat-label-txn">Total Revenue</div>
              <div className="stat-value-txn">฿{transactionStats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>

          <div className="transaction-stat-card">
            <div className="stat-icon-txn">📊</div>
            <div className="stat-content-txn">
              <div className="stat-label-txn">Service Fees</div>
              <div className="stat-value-txn">฿{transactionStats.totalFees.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>

          <div className="transaction-stat-card">
            <div className="stat-icon-txn">↩️</div>
            <div className="stat-content-txn">
              <div className="stat-label-txn">Total Refunds</div>
              <div className="stat-value-txn">฿{transactionStats.totalRefunds.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
        </div>

        {/* CHART SECTION */}
        <div className="transaction-chart-container">
          <div className="chart-header-txn">
            <h2 className="chart-title-txn">Revenue & Transaction Overview</h2>
            <select 
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="time-range-select"
            >
              {timeRangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="transaction-chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey={Object.keys(chartData[0])[0]} 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="#f59e0b"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#3b82f6"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  name="Revenue (฿)"
                  dot={{ fill: '#f59e0b', r: 4 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="transactions" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  name="Transactions"
                  dot={{ fill: '#3b82f6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TRANSACTION LIST TABLE */}
        <div className="transaction-table-container">
          <div className="transaction-table-header">
            <h2 className="table-title-txn">TRANSACTION LIST</h2>
            
            <div className="table-controls-txn">
              <div className="search-box-txn">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="filter-select-txn"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select 
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="filter-select-txn"
              >
                {paymentMethodOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <button className="export-btn-txn" onClick={handleExport}>
                <Download size={18} />
                Export
              </button>
            </div>
          </div>

          <div className="transaction-table-info">
            <span>Total Transactions: <strong>{filteredTransactions.length}</strong></span>
          </div>

          <div className="transaction-table-wrapper">
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DATE</th>
                  <th>DRIVER</th>
                  <th>PASSENGER</th>
                  <th>AMOUNT</th>
                  <th>STATUS</th>
                  <th>PAYMENT</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.length > 0 ? (
                  currentTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="txn-id">{transaction.id}</td>
                      <td>
                        <div className="date-cell">
                          <div>{transaction.date}</div>
                          <div className="time-text">{transaction.time}</div>
                        </div>
                      </td>
                      <td>{transaction.driver}</td>
                      <td>{transaction.passenger}</td>
                      <td className="amount-cell">
                        ฿{transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td>
                        <span className={`status-badge-txn ${getStatusClass(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td>
                        <span className="payment-method">{transaction.paymentMethod}</span>
                      </td>
                      <td>
                        <button 
                          className="action-btn-txn"
                          onClick={() => handleViewDetails(transaction)}
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="no-data-txn">No transactions found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-txn">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                Previous
              </button>
              
              <div className="pagination-info">
                Page {currentPage} of {totalPages}
              </div>
              
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* DETAIL MODAL */}
        {showDetailModal && selectedTransaction && (
          <div className="modal-overlay-txn" onClick={() => setShowDetailModal(false)}>
            <div className="modal-content-txn" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-txn">
                <h2>Transaction Details</h2>
                <button 
                  className="modal-close-txn"
                  onClick={() => setShowDetailModal(false)}
                >
                  ✕
                </button>
              </div>

              <div className="modal-body-txn">
                <div className="detail-section-txn">
                  <h3>Transaction Information</h3>
                  <div className="detail-grid-txn">
                    <div className="detail-item-txn">
                      <span className="detail-label-txn">Transaction ID:</span>
                      <span className="detail-value-txn">{selectedTransaction.id}</span>
                    </div>
                    <div className="detail-item-txn">
                      <span className="detail-label-txn">Date & Time:</span>
                      <span className="detail-value-txn">{selectedTransaction.date} {selectedTransaction.time}</span>
                    </div>
                    <div className="detail-item-txn">
                      <span className="detail-label-txn">Status:</span>
                      <span className={`status-badge-txn ${getStatusClass(selectedTransaction.status)}`}>
                        {selectedTransaction.status}
                      </span>
                    </div>
                    <div className="detail-item-txn">
                      <span className="detail-label-txn">Payment Method:</span>
                      <span className="detail-value-txn">{selectedTransaction.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section-txn">
                  <h3>Trip Information</h3>
                  <div className="detail-grid-txn">
                    <div className="detail-item-txn">
                      <span className="detail-label-txn">Driver:</span>
                      <span className="detail-value-txn">{selectedTransaction.driver}</span>
                    </div>
                    <div className="detail-item-txn">
                      <span className="detail-label-txn">Passenger:</span>
                      <span className="detail-value-txn">{selectedTransaction.passenger}</span>
                    </div>
                    <div className="detail-item-txn">
                      <span className="detail-label-txn">From:</span>
                      <span className="detail-value-txn">{selectedTransaction.fromLocation}</span>
                    </div>
                    <div className="detail-item-txn">
                      <span className="detail-label-txn">To:</span>
                      <span className="detail-value-txn">{selectedTransaction.toLocation}</span>
                    </div>
                    <div className="detail-item-txn">
                      <span className="detail-label-txn">Distance:</span>
                      <span className="detail-value-txn">{selectedTransaction.distance}</span>
                    </div>
                    <div className="detail-item-txn">
                      <span className="detail-label-txn">Duration:</span>
                      <span className="detail-value-txn">{selectedTransaction.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section-txn">
                  <h3>Fare Breakdown</h3>
                  <div className="fare-breakdown-txn">
                    <div className="fare-item-txn">
                      <span>Base Fare:</span>
                      <span>฿{selectedTransaction.fareBreakdown.baseFare.toFixed(2)}</span>
                    </div>
                    <div className="fare-item-txn">
                      <span>Distance Fare:</span>
                      <span>฿{selectedTransaction.fareBreakdown.distance.toFixed(2)}</span>
                    </div>
                    <div className="fare-item-txn">
                      <span>Service Fee:</span>
                      <span>฿{selectedTransaction.fareBreakdown.serviceFee.toFixed(2)}</span>
                    </div>
                    <div className="fare-item-txn">
                      <span>Tax:</span>
                      <span>฿{selectedTransaction.fareBreakdown.tax.toFixed(2)}</span>
                    </div>
                    <div className="fare-divider-txn"></div>
                    <div className="fare-total-txn">
                      <span>Total Amount:</span>
                      <span>฿{selectedTransaction.amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {selectedTransaction.refundReason && (
                  <div className="detail-section-txn">
                    <h3>Refund Information</h3>
                    <div className="refund-info-txn">
                      <p><strong>Reason:</strong> {selectedTransaction.refundReason}</p>
                    </div>
                  </div>
                )}

                {selectedTransaction.failReason && (
                  <div className="detail-section-txn">
                    <h3>Failure Information</h3>
                    <div className="fail-info-txn">
                      <p><strong>Reason:</strong> {selectedTransaction.failReason}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer-txn">
                <button 
                  className="modal-btn-close"
                  onClick={() => setShowDetailModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionManagement;