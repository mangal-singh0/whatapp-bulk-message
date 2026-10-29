/**
 * Export Queue Summary to CSV or Excel-compatible TSV
 */

export function exportToCSV(contacts, filename = 'whatsapp-bulk-dispatch-report.csv') {
  if (!contacts || contacts.length === 0) {
    alert('No contacts in the queue to export.');
    return;
  }

  const headers = ['Sr No', 'Phone Number (International)', 'Raw Number', 'Status', 'Timestamp', 'Date', 'Time'];
  
  const rows = contacts.map((c, index) => {
    let dateStr = '-';
    let timeStr = '-';
    let isoTimestamp = '-';

    if (c.sentAt) {
      const d = new Date(c.sentAt);
      if (!isNaN(d.getTime())) {
        isoTimestamp = d.toISOString();
        dateStr = d.toLocaleDateString();
        timeStr = d.toLocaleTimeString();
      }
    }

    return [
      index + 1,
      `="${c.cleaned}"`, // Excel trick so leading numbers or + are not converted to scientific notation
      `"${(c.raw || c.cleaned).replace(/"/g, '""')}"`,
      c.status.toUpperCase(),
      isoTimestamp,
      dateStr,
      timeStr
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\r\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

