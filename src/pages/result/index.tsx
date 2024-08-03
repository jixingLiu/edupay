import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Radio, Space, Button, Toast, Modal } from 'antd-mobile';
import QRCode from 'qrcode.react';

const PaymentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [paymentData, setPaymentData] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'wechat' | 'alipay'>('wechat');
  const [isPaying, setIsPaying] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);

  useEffect(() => {
    const qrData = searchParams.get('qrData');
    if (qrData) {
      const decodedData = JSON.parse(decodeURIComponent(qrData));
      setPaymentData(decodedData);
    }
  }, [searchParams]);

  const handlePayment = () => {
    setIsPaying(true);
    setTimeout(() => {
      const isSuccess = Math.random() > 0.1; // 随机决定支付成功或失败
      setIsPaying(false);
      if (isSuccess) {
        setIsPaid(true);
        const encodedData = JSON.stringify(paymentData); // 编码支付数据为二维码
        setQrCodeData(encodedData);
        Toast.show('支付成功');
      } else {
        Toast.show('支付失败');
      }
    }, 3000);
  };

  if (!paymentData) {
    return <div>加载中...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6 bg-gray-50">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg">
        {!isPaid ? (
          <>
            <div className="text-center text-2xl font-bold text-gray-800 mb-4">缴费易收银台</div>

            <div className="text-center text-lg text-gray-600 mb-6">
              支付剩余时间 <span className="text-red-500 font-semibold">14:35:49</span>
            </div>

            <div className="text-center text-lg text-gray-800 mb-2">
              {paymentData.bookSets} x {paymentData.amount} = <span className="text-red-500">¥{paymentData.total}</span>
            </div>

            <div className="text-center text-sm text-gray-500 mb-6">收款方:云南华盛图书有限公司</div>

            <div className="mb-6">
              <div className="text-sm font-semibold mb-2">支付方式</div>
              <Radio.Group
                value={paymentMethod}
                onChange={(value) => setPaymentMethod(value as 'wechat' | 'alipay')}
              >
                <Space direction="vertical">
                  <Radio value="wechat">微信支付</Radio>
                  <Radio value="alipay">支付宝</Radio>
                </Space>
              </Radio.Group>
            </div>

            <Button
              color="primary"
              block
              className="text-lg py-3"
              onClick={handlePayment}
              disabled={isPaying}
            >
              确认支付 ¥{paymentData.total}
            </Button>
          </>
        ) : (
          <div className="text-center flex flex-col items-center justify-center">
            <div className="text-lg font-semibold text-green-500 mb-4">支付成功:待核销</div>
            {qrCodeData && (
              <>
                <QRCode value={qrCodeData} size={200} />
                <div className="mt-4 text-center text-gray-500">扫码查看支付详情</div>
              </>
            )}
            <Button
              className="mt-4 text-lg py-3"
              block
              onClick={() => setIsPaid(false)}
            >
              返回
            </Button>
          </div>
        )}

        <div className="text-center text-xs text-gray-400 mt-6">v1.52.0</div>
      </div>

      <Modal
        visible={isPaying}
        content="支付中，请稍候..."
        closeOnAction={true}
        onClose={() => setIsPaying(false)}
      />
    </div>
  );
};

export default PaymentPage;
