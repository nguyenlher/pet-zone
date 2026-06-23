'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/services/orderService';
import { ShippingDetail, CreateOrderPayload } from '@/types';
import {
  ShoppingBag,
  Info,
  AlertCircle,
  Banknote,
  CreditCard,
  ArrowRight,
  User,
  Phone,
  MapPin,
  Building2,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
  AlertTriangle,
  Package,
  ExternalLink,
} from 'lucide-react';

interface CheckoutClientViewProps {
  initialUser?: {
    name?: string | null;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
  } | null;
  accessToken?: string | null;
}

const VIETNAM_CITIES = [
  'An Giang',
  'Bắc Ninh',
  'Cà Mau',
  'Cao Bằng',
  'Cần Thơ',
  'Đà Nẵng',
  'Đắk Lắk',
  'Điện Biên',
  'Đồng Nai',
  'Đồng Tháp',
  'Gia Lai',
  'Hà Nội',
  'Hà Tĩnh',
  'Hải Phòng',
  'Hồ Chí Minh',
  'Hưng Yên',
  'Huế',
  'Khánh Hòa',
  'Lai Châu',
  'Lạng Sơn',
  'Lào Cai',
  'Lâm Đồng',
  'Nghệ An',
  'Ninh Bình',
  'Phú Thọ',
  'Quảng Ngãi',
  'Quảng Ninh',
  'Quảng Trị',
  'Sơn La',
  'Tây Ninh',
  'Thái Nguyên',
  'Thanh Hóa',
  'Tuyên Quang',
  'Vĩnh Long',
];

export default function CheckoutClientView({ initialUser, accessToken }: CheckoutClientViewProps) {
  const router = useRouter();
  const { cart, subtotal, clearCart, restoreCart } = useCart();

  const [formData, setFormData] = useState<ShippingDetail>({
    name: initialUser?.name || '',
    phone: initialUser?.phone || '',
    address: initialUser?.address || '',
    city: initialUser?.city || 'Hồ Chí Minh',
    paymentMethod: 'COD',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hasBackup, setHasBackup] = useState(false);
  const [vnpayModalData, setVnpayModalData] = useState<{
    orderId: string;
    paymentUrl: string;
    totalAmount: number;
    phone: string;
  } | null>(null);

  // Check for backup cart on mount
  useEffect(() => {
    try {
      const backup = localStorage.getItem('petzone_cart_backup');
      if (backup && JSON.parse(backup).length > 0) {
        setHasBackup(true);
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleRestoreCart = () => {
    try {
      const backup = localStorage.getItem('petzone_cart_backup');
      if (backup) {
        restoreCart(JSON.parse(backup));
        localStorage.removeItem('petzone_cart_backup');
        setHasBackup(false);
      }
    } catch {
      // Ignore
    }
  };

  // Auto-fill form when initialUser updates
  useEffect(() => {
    if (initialUser) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || initialUser.name || '',
        phone: prev.phone || initialUser.phone || '',
        address: prev.address || initialUser.address || '',
        city: prev.city || initialUser.city || 'Hồ Chí Minh',
      }));
    }
  }, [initialUser]);

  const FREE_SHIPPING_THRESHOLD = 500000;
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 30000;
  const totalAmount = subtotal + shippingFee;
  const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) {
      errs.name = 'Vui lòng nhập họ và tên người nhận';
    }
    const phoneTrimmed = formData.phone.trim();
    if (!phoneTrimmed) {
      errs.phone = 'Vui lòng nhập số điện thoại nhận hàng';
    } else if (!/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(phoneTrimmed)) {
      errs.phone = 'Số điện thoại không hợp lệ (gồm 10 số, ví dụ 0912345678)';
    }
    if (!formData.address.trim()) {
      errs.address = 'Vui lòng nhập địa chỉ nhận hàng chi tiết';
    }
    if (!formData.city.trim()) {
      errs.city = 'Vui lòng chọn hoặc nhập Tỉnh/Thành phố';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (cart.length === 0) {
      setSubmitError('Giỏ hàng của bạn đang trống!');
      return;
    }

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: CreateOrderPayload = {
        items: cart.map((item) => ({
          itemType: item.product.categorySlug === 'thu-cung' ? 'PET' : 'PRODUCT',
          itemId: item.product.id,
          quantity: item.quantity,
        })),
        shipping: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          paymentMethod: formData.paymentMethod,
        },
      };

      const order = await createOrder(payload, accessToken || undefined);

      if (formData.paymentMethod === 'VNPAY' && order.paymentUrl) {
        // Backup cart & record pending order so user NEVER loses their data
        try {
          localStorage.setItem('petzone_cart_backup', JSON.stringify(cart));
          sessionStorage.setItem(
            'pending_vnpay_order',
            JSON.stringify({
              orderId: order.orderId,
              phone: formData.phone.trim(),
              totalAmount: order.totalAmount,
              paymentUrl: order.paymentUrl,
              createdAt: new Date().toISOString(),
            })
          );
        } catch {
          // Ignore
        }

        setIsSubmitting(false);
        setVnpayModalData({
          orderId: order.orderId,
          paymentUrl: order.paymentUrl,
          totalAmount: order.totalAmount,
          phone: formData.phone.trim(),
        });
      } else {
        clearCart();
        router.push(`/order/${order.orderId}`);
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setSubmitError(err?.message || 'Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại!');
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-white border border-stone-200/90 shadow-lg flex items-center justify-center text-stone-400">
          <ShoppingBag className="w-9 h-9" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2 block">
          Giỏ hàng trống
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 mb-3 tracking-tight">
          Bạn chưa chọn sản phẩm nào
        </h1>
        <p className="text-stone-500 text-sm mb-8 leading-relaxed max-w-md mx-auto">
          Khám phá các dòng sản phẩm dinh dưỡng, phụ kiện cao cấp và thú cưng 3D sống động để bắt đầu đơn hàng.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {hasBackup && (
            <button
              type="button"
              onClick={handleRestoreCart}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-stone-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider shadow-xl transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-[#D4F442]" />
              <span>Khôi phục giỏ hàng gần nhất</span>
            </button>
          )}
          <Link
            href="/category/all"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full border border-stone-200 hover:bg-stone-50 text-stone-700 font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
          >
            <span>Khám phá sản phẩm</span>
            <ArrowRight className="w-4 h-4 text-stone-500" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Checkout Stepper Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-400 mb-3">
          <Link href="/" className="hover:text-stone-900 transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-stone-900">Thanh toán</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200/80">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
              Xác Nhận & Đặt Hàng
            </h1>
            <p className="text-sm text-stone-500 mt-1">
              Kiểm tra đơn hàng và hoàn tất thông tin nhận hàng an toàn
            </p>
          </div>

          {/* Stepper pills */}
          <div className="flex items-center gap-2 text-xs font-bold">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Check className="w-3.5 h-3.5" />
              <span>1. Giỏ hàng</span>
            </div>
            <span className="text-stone-300">―</span>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-900 text-white shadow-sm">
              <span className="w-4 h-4 rounded-full bg-[#D4F442] text-black flex items-center justify-center text-[10px]">
                2
              </span>
              <span>Giao hàng & Thanh toán</span>
            </div>
            <span className="text-stone-300">―</span>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 text-stone-400">
              <span>3. Hoàn tất</span>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Notice Banner */}
      {!accessToken && (
        <div className="mb-8 p-5 md:p-6 rounded-3xl bg-stone-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-bold text-sm sm:text-base text-white">
                  Bạn đang đặt hàng không cần tài khoản
                </h3>
              </div>
              <p className="text-xs text-stone-300">
                Đăng nhập để tự động điền địa chỉ đã lưu, tích lũy điểm thưởng và dễ dàng theo dõi hành trình đơn hàng.
              </p>
            </div>
          </div>
          <Link
            href="/auth/signin?callbackUrl=/checkout"
            className="relative z-10 whitespace-nowrap px-5 py-2.5 rounded-full bg-white hover:bg-stone-100 text-stone-900 text-xs font-bold transition-all shadow-md self-start sm:self-auto cursor-pointer"
          >
            Đăng nhập ngay
          </Link>
        </div>
      )}

      {submitError && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span className="font-medium">{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Delivery Form & Payment Choice */}
          <div className="lg:col-span-7 space-y-7">
            {/* 1. Delivery Details */}
            <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
                <div className="w-9 h-9 rounded-2xl bg-stone-900 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                  1
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-stone-900 tracking-tight">
                    Thông tin đặt hàng
                  </h2>
                  <p className="text-xs text-stone-500">
                    Vui lòng cung cấp chính xác để shipper liên hệ giao hàng tận nơi
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Full name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                    Họ và tên người nhận <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: '' });
                      }}
                      placeholder="Ví dụ: Nguyễn Văn A"
                      className={`w-full pl-10 pr-4 py-3 rounded-2xl border ${
                        errors.name
                          ? 'border-rose-500 focus:ring-rose-400 bg-rose-50/20'
                          : 'border-stone-200 focus:border-stone-900 bg-stone-50/50'
                      } focus:bg-white focus:outline-none focus:ring-4 focus:ring-stone-900/5 text-sm transition-all`}
                    />
                  </div>
                  {errors.name && <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                    Số điện thoại liên hệ <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (errors.phone) setErrors({ ...errors, phone: '' });
                      }}
                      placeholder="Ví dụ: 0912345678"
                      className={`w-full pl-10 pr-4 py-3 rounded-2xl border ${
                        errors.phone
                          ? 'border-rose-500 focus:ring-rose-400 bg-rose-50/20'
                          : 'border-stone-200 focus:border-stone-900 bg-stone-50/50'
                      } focus:bg-white focus:outline-none focus:ring-4 focus:ring-stone-900/5 text-sm transition-all`}
                    />
                  </div>
                  {errors.phone ? (
                    <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.phone}</p>
                  ) : (
                    <p className="mt-1.5 text-xs text-stone-400">
                      Số điện thoại dùng để shipper giao hàng và là khóa bảo mật để tra cứu đơn sau này.
                    </p>
                  )}
                </div>

                {/* City & Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                      Tỉnh / Thành phố <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <select
                        value={formData.city}
                        onChange={(e) => {
                          setFormData({ ...formData, city: e.target.value });
                          if (errors.city) setErrors({ ...errors, city: '' });
                        }}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-stone-200 focus:border-stone-900 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-stone-900/5 text-sm transition-all appearance-none cursor-pointer"
                      >
                        {VIETNAM_CITIES.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                      Địa chỉ cụ thể <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => {
                          setFormData({ ...formData, address: e.target.value });
                          if (errors.address) setErrors({ ...errors, address: '' });
                        }}
                        placeholder="Số nhà, tên đường, phường/xã"
                        className={`w-full pl-10 pr-4 py-3 rounded-2xl border ${
                          errors.address
                            ? 'border-rose-500 focus:ring-rose-400 bg-rose-50/20'
                            : 'border-stone-200 focus:border-stone-900 bg-stone-50/50'
                        } focus:bg-white focus:outline-none focus:ring-4 focus:ring-stone-900/5 text-sm transition-all`}
                      />
                    </div>
                    {errors.address && (
                      <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.address}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Payment Method */}
            <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
                <div className="w-9 h-9 rounded-2xl bg-stone-900 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                  2
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-stone-900 tracking-tight">
                    Phương thức thanh toán
                  </h2>
                  <p className="text-xs text-stone-500">
                    Lựa chọn phương thức thanh toán thuận tiện và an toàn nhất
                  </p>
                </div>
              </div>

              <div className="space-y-3.5">
                {/* COD Option */}
                <label
                  className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                    formData.paymentMethod === 'COD'
                      ? 'border-stone-900 bg-stone-50/70 shadow-sm'
                      : 'border-stone-200/80 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="mt-1">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={formData.paymentMethod === 'COD'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'COD' })}
                      className="w-4 h-4 text-stone-900 focus:ring-stone-900 cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-stone-900 text-sm">
                        Thanh toán khi nhận hàng (COD)
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                      Kiểm tra hàng khi nhận và thanh toán tiền mặt trực tiếp cho shipper.
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700 shrink-0">
                    <Banknote className="w-5 h-5" />
                  </div>
                </label>

                {/* VNPay Option */}
                <label
                  className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                    formData.paymentMethod === 'VNPAY'
                      ? 'border-stone-900 bg-stone-50/70 shadow-sm'
                      : 'border-stone-200/80 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="mt-1">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="VNPAY"
                      checked={formData.paymentMethod === 'VNPAY'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'VNPAY' })}
                      className="w-4 h-4 text-stone-900 focus:ring-stone-900 cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-stone-900 text-sm">
                        Cổng thanh toán điện tử VNPay
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                      Hỗ trợ VNPay-QR, thẻ ATM nội địa và thẻ quốc tế.
                    </p>
                    <div className="flex items-center gap-2 mt-2.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-semibold">
                        VNPAY-QR
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-semibold">
                        ATM Nội địa
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-semibold">
                        Visa / Mastercard
                      </span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl p-6 sm:p-7 sticky top-28 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <h3 className="font-extrabold text-stone-900 text-lg tracking-tight">
                  Tóm tắt đơn hàng
                </h3>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
                  {cart.length} sản phẩm
                </span>
              </div>

              {/* Free Shipping Progress Indicator */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 text-xs">
                <div className="flex items-center justify-between font-semibold text-stone-700 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    {remainingForFreeShipping > 0 ? (
                      <span>
                        Mua thêm{' '}
                        <strong className="text-stone-900">
                          {remainingForFreeShipping.toLocaleString('vi-VN')} đ
                        </strong>{' '}
                        để Freeship
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-bold">
                        Đã đủ điều kiện Miễn Phí Vận Chuyển!
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-stone-500">{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-stone-200 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Product items list */}
              <div className="max-h-72 overflow-y-auto divide-y divide-stone-100 pr-1 space-y-3">
                {cart.map((item) => (
                  <div key={item.product.id} className="pt-3 first:pt-0 flex items-center gap-3.5">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200/60">
                      <Image
                        src={item.product.image || '/placeholder-pet.png'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                      <span className="absolute bottom-0 right-0 bg-stone-900 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-tl-lg">
                        x{item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                        {item.product.name}
                      </h4>
                      {item.selectedColor && (
                        <p className="text-[11px] text-stone-400">Màu: {item.selectedColor}</p>
                      )}
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {item.product.price.toLocaleString('vi-VN')} đ
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs sm:text-sm font-extrabold text-stone-900">
                        {(item.product.price * item.quantity).toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation breakdown */}
              <div className="pt-4 border-t border-stone-100 space-y-3 text-sm">
                <div className="flex justify-between text-stone-600 text-xs sm:text-sm">
                  <span>Tạm tính tiền hàng</span>
                  <span className="font-semibold text-stone-900">
                    {subtotal.toLocaleString('vi-VN')} đ
                  </span>
                </div>

                <div className="flex justify-between text-stone-600 text-xs sm:text-sm">
                  <span>Phí giao hàng</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-bold">Miễn phí</span>
                    ) : (
                      <span className="font-semibold text-stone-900">
                        {shippingFee.toLocaleString('vi-VN')} đ
                      </span>
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-baseline pt-3 border-t border-stone-200">
                  <span className="text-sm font-bold text-stone-900">Tổng thanh toán</span>
                  <span className="text-xl sm:text-2xl font-black text-stone-900">
                    {totalAmount.toLocaleString('vi-VN')}{' '}
                    <span className="text-sm font-bold text-stone-500">đ</span>
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-full bg-stone-900 hover:bg-black text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2.5 transition-transform active:scale-[0.99] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang xử lý đơn hàng...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {formData.paymentMethod === 'VNPAY'
                        ? 'Tiến hành thanh toán VNPay'
                        : 'Hoàn tất đặt hàng (COD)'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#D4F442]" />
                  </>
                )}
              </button>

              {/* Trust Guarantees */}
              <div className="pt-4 border-t border-stone-100 grid grid-cols-3 gap-2 text-center text-[10px] text-stone-500 font-semibold">
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-stone-700" />
                  <span>100% Chính Hãng</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="w-4 h-4 text-stone-700" />
                  <span>Đổi Trả 7 Ngày</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-stone-700" />
                  <span>Đóng Gói Kỹ Lưỡng</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* VNPay Redirect & Safety Fallback Modal */}
      {vnpayModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 text-center relative">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
              <CreditCard className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 bg-blue-100 text-blue-800 rounded-full inline-block mb-2">
                Cổng thanh toán VNPay
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
                Đơn Hàng Đã Được Khởi Tạo!
              </h3>
              <p className="text-stone-500 text-xs mt-1.5 leading-relaxed">
                Mã đơn: <span className="font-mono font-bold text-stone-900">#{vnpayModalData.orderId.slice(0, 8)}</span> • Số tiền: <span className="font-extrabold text-stone-900">{vnpayModalData.totalAmount.toLocaleString('vi-VN')} đ</span>
              </p>
            </div>

            {/* Sandbox Notice Box */}
            <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-left text-xs text-amber-800 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Lưu ý về Cổng thử nghiệm (VNPay Sandbox)</span>
              </div>
              <p className="leading-relaxed text-amber-700">
                Nếu cổng VNPay Sandbox hiển thị <strong>&quot;Website này chưa được phê duyệt&quot; (Mã lỗi 71)</strong>, đây là do tài khoản đối tác thử nghiệm đang chờ VNPay kích hoạt.
              </p>
              <p className="leading-relaxed text-amber-700">
                Đơn hàng của bạn đã được lưu an toàn với số điện thoại <strong>{vnpayModalData.phone}</strong>. Bạn có thể chọn <strong>&quot;Xem đơn & Chuyển sang COD&quot;</strong> để được giao hàng tận nơi và thanh toán tiền mặt.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <a
                href={vnpayModalData.paymentUrl}
                onClick={() => {
                  clearCart();
                }}
                className="w-full py-3.5 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Mở cổng thanh toán VNPay</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => {
                  clearCart();
                  router.push(`/order/${vnpayModalData.orderId}`);
                }}
                className="w-full py-3.5 px-6 rounded-full bg-stone-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Package className="w-4 h-4" />
                <span>Xem đơn hàng (Nhận hàng thanh toán COD)</span>
              </button>

              <button
                type="button"
                onClick={() => setVnpayModalData(null)}
                className="w-full py-2 text-stone-500 hover:text-stone-900 font-semibold text-xs transition-colors cursor-pointer"
              >
                Đóng và giữ lại giỏ hàng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
