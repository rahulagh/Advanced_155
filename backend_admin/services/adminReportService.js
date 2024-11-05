exports.generateReport = (invoices) => {
    const totalGSTCollected = invoices.reduce((sum, invoice) => sum + invoice.gstAmount, 0);
    const pendingInvoices = invoices.filter(invoice => invoice.status === 'pending').length;
    const paidInvoices = invoices.filter(invoice => invoice.status === 'paid').length;
  
    return {
      totalGSTCollected,
      totalInvoices: invoices.length,
      pendingInvoices,
      paidInvoices,
    };
  };