export const useTransactionStatus = (): UseTransactionStatus => {
  const statuses: Record<number, string> = {
    0: 'New',
    1: 'Pending',
    2: 'Finished',
    3: 'Canceled',
    4: 'Error'
  }
  const statusColor: Record<number, string> = {
    0: 'grey',
    1: 'light-blue',
    2: 'green',
    3: 'yellow',
    4: 'error'
  }

  const getTransactionStatus = (status: number): string => statuses[status] || statuses[0]
  const getTransactionStatusColor = (status: number): string => statusColor[status] || statusColor[0]

  return {
    getTransactionStatus,
    getTransactionStatusColor
  }
}

export interface UseTransactionStatus {
  getTransactionStatus: (status: number) => string
  getTransactionStatusColor: (status: number) => string
}
