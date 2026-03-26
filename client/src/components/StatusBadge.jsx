const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-700',
    accepted: 'bg-green-100 text-green-700',
    declined: 'bg-red-100 text-red-600',
    returned: 'bg-blue-100 text-blue-700',
  };

  return (
    <span
      className={`text-xs font-semibold px-2.5 py-1 rounded-full 
                  capitalize ${styles[status] || 'bg-gray-100 text-gray-600'}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;