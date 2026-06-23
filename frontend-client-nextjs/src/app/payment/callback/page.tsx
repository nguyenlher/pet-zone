import React from 'react';
import { Metadata } from 'next';
import { verifyVNPayCallback } from '@/services/paymentService';
import PaymentCallbackClientView from '@/components/payment/PaymentCallbackClientView';

export const metadata: Metadata = {
  title: 'Kết quả thanh toán VNPay | Pet Zone 3D',
  description: 'Xác thực và cập nhật trạng thái thanh toán đơn hàng qua cổng VNPay tại Pet Zone 3D.',
};

interface PaymentCallbackPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PaymentCallbackPage({ searchParams }: PaymentCallbackPageProps) {
  const rawParams = await searchParams;

  // Flatten searchParams into Record<string, string>
  const queryParams: Record<string, string> = {};
  for (const [key, value] of Object.entries(rawParams)) {
    if (typeof value === 'string') {
      queryParams[key] = value;
    } else if (Array.isArray(value) && value.length > 0) {
      queryParams[key] = value[0];
    }
  }

  let result = {
    success: false,
    orderId: queryParams['vnp_TxnRef'] || '',
    message: 'Không tìm thấy thông tin giao dịch.',
    transactionId: queryParams['vnp_TransactionNo'] || '',
  };

  try {
    const callbackRes = await verifyVNPayCallback(queryParams);
    result = {
      success: callbackRes.success === true,
      orderId: (callbackRes.orderId as string) || queryParams['vnp_TxnRef'] || '',
      message: callbackRes.message || (callbackRes.success ? 'Thanh toán thành công' : 'Giao dịch không thành công'),
      transactionId: callbackRes.transactionId || queryParams['vnp_TransactionNo'] || '',
    };
  } catch (err: any) {
    console.error('Payment callback verification error:', err);
    // If backend response code is 00 from VNPay query
    const isVnPay00 = queryParams['vnp_ResponseCode'] === '00';
    result = {
      success: isVnPay00,
      orderId: queryParams['vnp_TxnRef'] || '',
      message: isVnPay00
        ? 'Thanh toán hoàn tất, đơn hàng đang được cập nhật.'
        : 'Thanh toán không thành công hoặc đã bị hủy.',
      transactionId: queryParams['vnp_TransactionNo'] || '',
    };
  }

  return (
    <PaymentCallbackClientView
      result={result}
      responseCode={queryParams['vnp_ResponseCode']}
    />
  );
}
