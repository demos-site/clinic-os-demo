import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Eye, Printer, ArrowUpDown } from 'lucide-react';
import type { Checkup } from '../utils/mockData';

interface RecentCheckupsProps {
  checkups: Checkup[];
  onViewCheckup: (checkup: Checkup) => void;
  onPrintCheckup: (checkup: Checkup) => void;
}

type SortKey = 'date' | 'patientName' | 'cost' | 'paid';
type SortOrder = 'asc' | 'desc';

export const RecentCheckups: React.FC<RecentCheckupsProps> = ({
  checkups,
  onViewCheckup,
  onPrintCheckup,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  // Filter
  const filteredCheckups = checkups.filter((c) => {
    const search = searchTerm.toLowerCase();
    return (
      c.patientName.toLowerCase().includes(search) ||
      c.patientId.toLowerCase().includes(search) ||
      c.id.toLowerCase().includes(search) ||
      c.complaint.toLowerCase().includes(search) ||
      (c.diagnosis && c.diagnosis.toLowerCase().includes(search))
    );
  });

  // Sort
  const sortedCheckups = [...filteredCheckups].sort((a, b) => {
    let valA = a[sortKey];
    let valB = b[sortKey];

    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortOrder === 'asc' 
        ? valA.localeCompare(valB) 
        : valB.localeCompare(valA);
    }
    
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    }

    return 0;
  });

  // Paginate
  const totalItems = sortedCheckups.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedCheckups.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="card" style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>Recent Consultations</h3>
        
        {/* Search */}
        <div style={styles.searchWrapper}>
          <Search size={16} color="var(--text-muted)" style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by patient, ID, complaints..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="form-input"
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* Table */}
      <div className="table-container" style={styles.tableContainer}>
        <table className="custom-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('date')} style={styles.thSortable}>
                Date & Time <ArrowUpDown size={12} style={styles.sortIcon} />
              </th>
              <th>Patient ID</th>
              <th onClick={() => handleSort('patientName')} style={styles.thSortable}>
                Patient Name <ArrowUpDown size={12} style={styles.sortIcon} />
              </th>
              <th>Chief Complaint</th>
              <th onClick={() => handleSort('cost')} style={styles.thSortable}>
                Grand Total <ArrowUpDown size={12} style={styles.sortIcon} />
              </th>
              <th onClick={() => handleSort('paid')} style={styles.thSortable}>
                Paid <ArrowUpDown size={12} style={styles.sortIcon} />
              </th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={8} style={styles.emptyCell}>
                  No consultations match the search criteria.
                </td>
              </tr>
            ) : (
              currentItems.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={styles.dateCell}>
                      <span style={styles.primaryText}>
                        {new Date(c.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-primary">{c.patientId}</span>
                  </td>
                  <td>
                    <span style={styles.boldText}>{c.patientName}</span>
                  </td>
                  <td style={styles.complaintCell}>
                    <span style={styles.complaintText} title={c.complaint}>
                      {c.complaint}
                    </span>
                    {c.diagnosis && (
                      <span style={styles.diagnosisText}>{c.diagnosis}</span>
                    )}
                  </td>
                  <td>
                    <span style={styles.boldText}>₹{c.cost.toLocaleString('en-IN')}</span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--success)', fontWeight: 600 }}>
                      ₹{c.paid.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td>
                    {c.due > 0 ? (
                      <span className="badge badge-danger">Due: ₹{c.due}</span>
                    ) : (
                      <span className="badge badge-success">Paid</span>
                    )}
                  </td>
                  <td>
                    <div style={styles.actions}>
                      <button 
                        onClick={() => onViewCheckup(c)} 
                        style={styles.actionBtn}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => onPrintCheckup(c)} 
                        style={{ ...styles.actionBtn, color: 'var(--primary)' }}
                        title="Print Prescription"
                      >
                        <Printer size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={styles.pagination}>
        <span style={styles.paginationText}>
          Showing <span style={styles.boldText}>{totalItems === 0 ? 0 : indexOfFirstItem + 1}</span> to{' '}
          <span style={styles.boldText}>{Math.min(indexOfLastItem, totalItems)}</span> of{' '}
          <span style={styles.boldText}>{totalItems}</span> entries
        </span>
        
        <div style={styles.paginatorControls}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              ...styles.paginatorBtn,
              opacity: currentPage === 1 ? 0.4 : 1,
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            <ChevronLeft size={16} />
          </button>
          
          <span style={styles.pageNumber}>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              ...styles.paginatorBtn,
              opacity: currentPage === totalPages ? 0.4 : 1,
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    padding: '1.5rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: '1rem',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '1.1rem',
    color: 'var(--text-main)',
  },
  searchWrapper: {
    position: 'relative' as const,
    width: '100%',
    maxWidth: '300px',
  },
  searchIcon: {
    position: 'absolute' as const,
    left: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none' as const,
  },
  searchInput: {
    width: '100%',
    paddingLeft: '2.25rem',
    fontSize: '0.85rem',
    height: '36px',
  },
  tableContainer: {
    margin: 0,
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)',
    overflow: 'hidden',
  },
  thSortable: {
    cursor: 'pointer',
    userSelect: 'none' as const,
  },
  sortIcon: {
    marginLeft: '4px',
    verticalAlign: 'middle',
    color: 'var(--text-muted)',
  },
  emptyCell: {
    textAlign: 'center' as const,
    padding: '3rem',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
  },
  dateCell: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  primaryText: {
    fontWeight: 500,
  },
  boldText: {
    fontWeight: 600,
  },
  complaintCell: {
    maxWidth: '220px',
  },
  complaintText: {
    display: 'block',
    whiteSpace: 'nowrap' as const,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    fontWeight: 500,
  },
  diagnosisText: {
    display: 'block',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
    marginTop: '2px',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
  },
  actionBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '0.4rem',
    borderRadius: 'var(--radius-sm)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s ease',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '1.25rem',
    flexWrap: 'wrap' as const,
    gap: '1rem',
  },
  paginationText: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
  },
  paginatorControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  paginatorBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-sm)',
    width: '32px',
    height: '32px',
    color: 'var(--text-main)',
    transition: 'all 0.15s ease',
  },
  pageNumber: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
  }
};
export default RecentCheckups;
