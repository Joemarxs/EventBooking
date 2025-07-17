import * as supportService from '../../customerSupport/customerSupport.service';
import db from '../../drizzle/db';

jest.mock('../../drizzle/db', () => ({
  select: jest.fn(() => ({
    from: jest.fn(() => Promise.resolve([{ support_id: 1 }])),
  })),
  insert: jest.fn(() => ({
    values: jest.fn(() => ({
      returning: jest.fn(() => Promise.resolve([{ support_id: 1 }])),
    })),
  })),
  update: jest.fn(() => ({
    set: jest.fn(() => ({
      where: jest.fn(() => ({
        returning: jest.fn(() => Promise.resolve([{ support_id: 1 }])),
      })),
    })),
  })),
  delete: jest.fn(() => ({
    where: jest.fn(() => ({
      returning: jest.fn(() => Promise.resolve([{ support_id: 1 }])),
    })),
  })),
}));

describe('Customer Support Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getAllSupportRequests should return list of support requests', async () => {
    const result = await supportService.getAllSupportRequests();
    expect(result[0].support_id).toBe(1);
  });

  test('getSupportRequestById should return a single request', async () => {
    (db.select as any).mockReturnValueOnce({
      from: () => ({
        where: () => Promise.resolve([{ support_id: 1 }]),
      }),
    });

    const result = await supportService.getSupportRequestById(1);
    expect(result?.support_id).toBe(1);
  });

  test('createSupportRequest should insert and return new request', async () => {
    const support = await supportService.createSupportRequest({
      user_id: 1,
      payment_id: 1,
      subject: 'Payment Issue',
      description: 'Transaction failed but amount deducted',
      status: 'pending',
    } as any);

    expect(support.support_id).toBe(1);
  });

  test('updateSupportRequest should return updated request', async () => {
    const result = await supportService.updateSupportRequest(1, {
      status: 'resolved',
    } as any);

    expect(result?.support_id).toBe(1);
  });

  test('deleteSupportRequest should return deleted request', async () => {
    const result = await supportService.deleteSupportRequest(1);
    expect(result?.support_id).toBe(1);
  });
});
