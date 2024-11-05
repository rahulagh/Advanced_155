exports.addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };
  
  exports.formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };
  
  exports.isWithinDays = (date, days) => {
    const now = new Date();
    const difference = date.getTime() - now.getTime();
    const daysDifference = difference / (1000 * 3600 * 24);
    return daysDifference <= days && daysDifference >= 0;
  };