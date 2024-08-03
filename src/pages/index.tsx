import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Form, Input, Button, Cascader, Space } from 'antd-mobile';
import { history } from 'umi';
import { schools } from '@/data/schools';
import './index.less';

// 为每个班级设置金额
const classAmountMapping = {
  '1班': 100,
  '2班': 200,
  '3班': 300,
  '4班': 400,
  '5班': 500,
  '6班': 600,
  '高本贯通班': 700,
};

const SchoolMajorClassForm = () => {
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [schoolName, setSchoolName] = useState<string | null>(null);

  useEffect(() => {
    const school = searchParams.get('school');
    console.log('school', school)
    setSchoolName(school);
  }, [searchParams]);

  const handleGenerateQRCode = (values: { name: string; phone: string; idCard: string; bookSets: string; amount: string }) => {
    const { name, phone, idCard, bookSets, amount } = values;
    if (selectedValue.length && name && phone && idCard && bookSets && amount) {
      const data = {
        school: selectedValue.join('-'),
        name,
        phone,
        idCard,
        bookSets,
        amount,
        total: (parseInt(bookSets, 10) * parseFloat(amount)).toFixed(2),
      };
      const encodedData = encodeURIComponent(JSON.stringify(data));
      history.push(`/result?qrData=${encodedData}`);
    } else {
      alert('请选择学校、专业、班级并输入完整信息');
    }
  };

  const handleAmountChange = () => {
    const bookSets = form.getFieldValue('bookSets');
    const amount = form.getFieldValue('amount');
    const bookSetsNum = parseInt(bookSets, 10);
    const amountNum = parseFloat(amount);
    if (!isNaN(bookSetsNum) && !isNaN(amountNum)) {
      setTotalAmount(bookSetsNum * amountNum);
    } else {
      setTotalAmount(0);
    }
  };

  const handleClassChange = (value: string[]) => {
    const selectedClass = value[value.length - 1]; // 获取最后一个选择的值（即班级）
    const amount = classAmountMapping[selectedClass] || 100; // 默认金额100
    form.setFieldsValue({ amount });
    setSelectedValue(value);
    handleAmountChange(); // 更新总金额
  };

  return (
    <div className='pb-4'>
      <div className="text-xl bg-[#2563eb] text-center text-white leading-[56px] mb-3">缴费系统</div>
      <Form
        className='pr-2'
        form={form}
        onFinish={handleGenerateQRCode}
        footer={
          <Button block type="submit" color="warning">
            确定 <span className=' font-semibold text-white'>￥{totalAmount.toFixed(2)}</span>
          </Button>
        }
      >
        <Form.Header>
          {schoolName && (
            <div className="text-lg font-bold text-blue-600">
              学校名称: {decodeURIComponent(schoolName)}
            </div>
          )}
        </Form.Header>
        <Form.Item name="school" label="选择专业、年级、班级">
          <Space align='center'>
            <Cascader
              options={schools}
              visible={visible}
              onClose={() => setVisible(false)}
              value={selectedValue}
              onConfirm={handleClassChange}
            >
              {items => (
                <div onClick={() => setVisible(true)}>
                  {items.every(item => item === null)
                    ? '选择专业、年级、班级'
                    : items.map(item => item?.label ?? '未选择').join(' - ')}
                </div>
              )}
            </Cascader>
          </Space>
        </Form.Item>

        <Space align="center">
          <Form.Item name="bookSets" label="课本套数" rules={[
            { required: true, message: '请输入课本套数' },
            { pattern: /^[1-9]\d*$/, message: '课本套数必须为大于0的整数' }
          ]}>
            <Input
              placeholder="请输入课本套数"
              onChange={handleAmountChange}
            />
          </Form.Item>

          <Form.Item name="amount" className=' pointer-events-none' label="单套金额" rules={[
            { required: true, message: '请输入金额' },
            { pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: '请输入有效的金额' }
          ]}>
            <Input placeholder="请输入金额" />
          </Form.Item>
        </Space>

        <div className=" text text-right text-red-600">
          <span className="  font-sans">总金额：</span>￥{totalAmount.toFixed(2)}
        </div>

        <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
          <Input placeholder="请输入姓名" />
        </Form.Item>

        <Form.Item name="phone" label="手机号" rules={[
          { required: true, message: '请输入手机号' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
        ]}>
          <Input placeholder="请输入手机号" />
        </Form.Item>

        <Form.Item name="idCard" label="身份证号" rules={[
          { required: true, message: '请输入身份证号' },
        ]}>
          <Input placeholder="请输入身份证号" />
        </Form.Item>

      </Form>
    </div>
  );
};

export default SchoolMajorClassForm;
