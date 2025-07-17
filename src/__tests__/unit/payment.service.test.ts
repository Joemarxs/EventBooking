import * as paymentService from '../../payments/payment.service';
import db from '../../drizzle/db';

jest.mock('../../drizzle/db', () => ({
  __esModule: true,
  default: {
    select: jest.fn(() => ({
      from: jest.fn(() => ({
        where: jest.fn(() => Promise.resolve([{ payment_id: 1 }])),
      })),
    })),
    insert: jest.fn(() => ({
      values: jest.fn(() => ({
        returning: jest.fn(() => Promise.resolve([{ payment_id: 1 }])),
      })),
    })),
    update: jest.fn(() => ({
      set: jest.fn(() => ({
        where: jest.fn(() => ({
          returning: jest.fn(() => Promise.resolve([{ payment_id: 1 }])),
        })),
      })),
    })),
    delete: jest.fn(() => ({
      where: jest.fn(() => ({
        returning: jest.fn(() => Promise.resolve([{ payment_id: 1 }])),
      })),
    })),
  },
}));

describe('Payment Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getAllPayments should return list of payments', async () => {
    (db.select as any).mockReturnValueOnce({
      from: () => Promise.resolve([{ payment_id: 1, amount: 100 }]),
    });

    const result = await paymentService.getAllPayments();
    expect(result[0].payment_id).toBe(1);
  });

  test('getPaymentById should return a payment', async () => {
    const result = await paymentService.getPaymentById(1);
    expect(result?.payment_id).toBe(1);
  });

  test('createPayment should insert and return payment', async () => {
    const payment = await paymentService.createPayment({
      event_id: 1,
      user_id: 1,
      amount: 100,
      paymentStatus: true,
      paymentDate: '2025-07-02',
      paymentMethod: 'mpesa',
      transactionId: 'TX123',
    } as any);

    expect(payment.payment_id).toBe(1);
  });

  test('createPayment should throw if no data is passed', async () => {
    await expect(paymentService.createPayment(undefined as any)).rejects.toThrow(
      'No payment data provided'
    );
  });

  test('updatePayment should return updated payment', async () => {
    const updated = await paymentService.updatePayment(1, {
      amount: 150,
      paymentMethod: 'paypal',
    } as any);

    expect(updated?.payment_id).toBe(1);
  });

  test('deletePayment should return deleted payment', async () => {
    const deleted = await paymentService.deletePayment(1);
    expect(deleted?.payment_id).toBe(1);
  });
});
