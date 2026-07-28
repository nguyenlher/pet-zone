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
        <div className="w-16 h-16 mx-auto mb-6 rounded-none bg-white border border-neutral-200 flex items-center justify-center text-black">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 mb-2 block">
          Giỏ hàng trống
        </span>
        <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-black mb-3">
          Bạn chưa chọn sản phẩm nào
        </h1>
        <p className="text-neutral-500 text-xs mb-8 leading-relaxed max-w-md mx-auto font-mono">
          Khám phá các dòng sản phẩm và mô hình 3D cao cấp để bắt đầu đơn hàng.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {hasBackup && (
            <button
              type="button"
              onClick={handleRestoreCart}
              className="inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-colors rounded-none cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-white" />
              <span>Khôi phục giỏ hàng gần nhất</span>
            </button>
          )}
          <Link
            href="/category/all"
            className="inline-flex items-center gap-2 px-6 py-3 border border-neutral-200 hover:bg-neutral-50 text-black font-bold text-xs uppercase tracking-wider transition-colors rounded-none cursor-pointer"
          >
            <span>Khám phá sản phẩm</span>
            <ArrowRight className="w-4 h-4 text-neutral-500" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Checkout Stepper Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-3 uppercase tracking-wider">
          <Link href="/" className="hover:text-black transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-black font-bold">Thanh toán</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-200">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-black uppercase tracking-tight">
              Xác Nhận & Đặt Hàng
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Kiểm tra đơn hàng và hoàn tất thông tin nhận hàng an toàn
            </p>
          </div>

          {/* Stepper pills */}
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <div className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 bg-neutral-50 text-neutral-600 rounded-none">
              <Check className="w-3.5 h-3.5" />
              <span>1. Giỏ hàng</span>
            </div>
            <span className="text-neutral-300">―</span>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-black text-white rounded-none">
              <span>2. Giao hàng & Thanh toán</span>
            </div>
            <span className="text-neutral-300">―</span>
            <div className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 bg-white text-neutral-400 rounded-none">
              <span>3. Hoàn tất</span>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Notice Banner */}
      {!accessToken && (
        <div className="mb-8 p-5 border border-neutral-200 bg-neutral-50 text-black flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-none">
          <div>
            <h3 className="font-bold text-sm text-black uppercase tracking-wider mb-1">
              Đặt hàng không cần đăng nhập
            </h3>
            <p className="text-xs text-neutral-500">
              Đăng nhập để tự động điền địa chỉ đã lưu và dễ dàng theo dõi hành trình đơn hàng.
            </p>
          </div>
          <Link
            href="/auth/signin?callbackUrl=/checkout"
            className="whitespace-nowrap px-5 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-colors rounded-none self-start sm:self-auto cursor-pointer"
          >
            Đăng nhập ngay
          </Link>
        </div>
      )}

      {submitError && (
        <div className="mb-6 p-4 rounded-none bg-neutral-50 border border-neutral-300 text-neutral-900 text-xs sm:text-sm flex items-center gap-3 font-mono">
          <AlertCircle className="w-5 h-5 text-black shrink-0" />
          <span className="font-medium">{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Delivery Form & Payment Choice */}
          <div className="lg:col-span-7 space-y-7">
            {/* 1. Delivery Details */}
            <div className="bg-white rounded-none border border-neutral-200 p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-neutral-100">
                <div className="w-6 h-6 rounded-none bg-black text-white font-bold flex items-center justify-center text-xs">
                  1
                </div>
                <div>
                  <h2 className="text-sm font-bold text-black uppercase tracking-wider">
                    Thông tin nhận hàng
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Địa chỉ và số điện thoại liên hệ nhận hàng
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Full name */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                    Họ và tên người nhận <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
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
                      className={`w-full pl-10 pr-4 py-2.5 rounded-none border ${
                        errors.name
                          ? 'border-rose-500 focus:ring-rose-400 bg-rose-50/20'
                          : 'border-neutral-200 focus:border-black bg-white'
                      } text-xs transition-colors focus:outline-none`}
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                    Số điện thoại liên hệ <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
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
                      className={`w-full pl-10 pr-4 py-2.5 rounded-none border ${
                        errors.phone
                          ? 'border-rose-500 focus:ring-rose-400 bg-rose-50/20'
                          : 'border-neutral-200 focus:border-black bg-white'
                      } text-xs transition-colors focus:outline-none`}
                    />
                  </div>
                  {errors.phone ? (
                    <p className="mt-1 text-xs text-rose-500">{errors.phone}</p>
                  ) : (
                    <p className="mt-1 text-[11px] text-neutral-400">
                      Số điện thoại dùng để giao hàng và tra cứu đơn hàng.
                    </p>
                  )}
                </div>

                {/* City & Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                      Tỉnh / Thành phố <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <select
                        value={formData.city}
                        onChange={(e) => {
                          setFormData({ ...formData, city: e.target.value });
                          if (errors.city) setErrors({ ...errors, city: '' });
                        }}
                        className="w-full pl-10 pr-4 py-2.5 rounded-none border border-neutral-200 focus:border-black bg-white text-xs transition-colors appearance-none cursor-pointer focus:outline-none"
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
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                      Địa chỉ cụ thể <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
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
                        className={`w-full pl-10 pr-4 py-2.5 rounded-none border ${
                          errors.address
                            ? 'border-rose-500 focus:ring-rose-400 bg-rose-50/20'
                            : 'border-neutral-200 focus:border-black bg-white'
                        } text-xs transition-colors focus:outline-none`}
                      />
                    </div>
                    {errors.address && (
                      <p className="mt-1 text-xs text-rose-500">{errors.address}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Payment Method */}
            <div className="bg-white rounded-none border border-neutral-200 p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-neutral-100">
                <div className="w-6 h-6 rounded-none bg-black text-white font-bold flex items-center justify-center text-xs">
                  2
                </div>
                <div>
                  <h2 className="text-sm font-bold text-black uppercase tracking-wider">
                    Phương thức thanh toán
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Lựa chọn phương thức thanh toán an toàn
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {/* COD Option */}
                <label
                  className={`flex items-start gap-4 p-4 rounded-none border cursor-pointer transition-colors ${
                    formData.paymentMethod === 'COD'
                      ? 'border-black bg-neutral-50'
                      : 'border-neutral-200 hover:border-neutral-400 bg-white'
                  }`}
                >
                  <div className="mt-0.5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={formData.paymentMethod === 'COD'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'COD' })}
                      className="w-4 h-4 text-black focus:ring-black cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="font-bold text-black text-xs uppercase tracking-wider block">
                      Thanh toán khi nhận hàng (COD)
                    </span>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      Kiểm tra hàng khi nhận và thanh toán tiền mặt trực tiếp cho đơn vị vận chuyển.
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-none border border-neutral-200 bg-white flex items-center justify-center text-black shrink-0">
                    <Banknote className="w-4 h-4" />
                  </div>
                </label>

                {/* VNPay Option */}
                <label
                  className={`flex items-start gap-4 p-4 rounded-none border cursor-pointer transition-colors ${
                    formData.paymentMethod === 'VNPAY'
                      ? 'border-black bg-neutral-50'
                      : 'border-neutral-200 hover:border-neutral-400 bg-white'
                  }`}
                >
                  <div className="mt-0.5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="VNPAY"
                      checked={formData.paymentMethod === 'VNPAY'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'VNPAY' })}
                      className="w-4 h-4 text-black focus:ring-black cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="font-bold text-black text-xs uppercase tracking-wider block">
                      Cổng thanh toán điện tử VNPay
                    </span>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      Hỗ trợ quét mã VNPay-QR, thẻ ATM nội địa và thẻ quốc tế Visa / Mastercard.
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-none border border-neutral-200 bg-white flex items-center justify-center text-black shrink-0">
                    <CreditCard className="w-4 h-4" />
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-none border border-neutral-200 p-6 sticky top-24 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                <h3 className="font-bold text-black text-xs uppercase tracking-wider">
                  Tóm tắt đơn hàng
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 border border-neutral-200 bg-neutral-50 text-black">
                  {cart.length} món
                </span>
              </div>

              {/* Free Shipping Progress Indicator */}
              <div className="p-3 bg-neutral-50 border border-neutral-200 text-xs rounded-none">
                <div className="flex items-center justify-between text-neutral-600 mb-1.5">
                  <span className="flex items-center gap-1.5 text-xs">
                    <Truck className="w-3.5 h-3.5 text-black" />
                    {remainingForFreeShipping > 0 ? (
                      <span>
                        Mua thêm <strong className="text-black">{remainingForFreeShipping.toLocaleString('vi-VN')} đ</strong> để Freeship
                      </span>
                    ) : (
                      <span className="text-black font-bold">
                        Đủ điều kiện Miễn Phí Vận Chuyển!
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-[10px] text-neutral-500">{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full h-1 bg-neutral-200 rounded-none overflow-hidden">
                  <div
                    className="h-full bg-black rounded-none transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Product items list */}
              <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100 pr-1 space-y-2.5">
                {cart.map((item) => (
                  <div key={item.product.id} className="pt-2.5 first:pt-0 flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-none overflow-hidden bg-neutral-100 shrink-0 border border-neutral-100">
                      <Image
                        src={item.product.image || '/placeholder-pet.png'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                      <span className="absolute bottom-0 right-0 bg-black text-white text-[9px] font-bold px-1 py-0.5">
                        x{item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-black uppercase tracking-wide truncate">
                        {item.product.name}
                      </h4>
                      {item.selectedColor && (
                        <p className="text-[10px] text-neutral-400 uppercase">Màu: {item.selectedColor}</p>
                      )}
                      <p className="text-[11px] text-neutral-500 mt-0.5 font-mono">
                        {item.product.price.toLocaleString('vi-VN')} đ
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-black font-mono">
                        {(item.product.price * item.quantity).toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {/* Price Calculation breakdown */}
              <div className="pt-4 border-t border-neutral-200 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span className="uppercase tracking-wider">Tạm tính tiền hàng</span>
                  <span className="font-semibold text-black font-mono">
                    {subtotal.toLocaleString('vi-VN')} đ
                  </span>
                </div>

                <div className="flex justify-between text-neutral-600">
                  <span className="uppercase tracking-wider">Phí giao hàng</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-black font-bold uppercase tracking-wider">Miễn phí</span>
                    ) : (
                      <span className="font-semibold text-black font-mono">
                        {shippingFee.toLocaleString('vi-VN')} đ
                      </span>
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-baseline pt-3 border-t border-neutral-200">
                  <span className="text-xs font-bold text-black uppercase tracking-wider">Tổng thanh toán</span>
                  <span className="text-xl font-extrabold text-black font-mono">
                    {totalAmount.toLocaleString('vi-VN')}{' '}
                    <span className="text-xs font-bold text-neutral-500 font-sans">đ</span>
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed rounded-none"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-none" />
                    <span>Đang xử lý đơn hàng...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {formData.paymentMethod === 'VNPAY'
                        ? 'Tiến hành thanh toán VNPay'
                        : 'Hoàn tất đặt hàng (COD)'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </>
                )}
              </button>

              {/* Trust Guarantees */}
              <div className="pt-4 border-t border-neutral-100 grid grid-cols-3 gap-2 text-center text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-black" />
                  <span>Chính Hãng</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="w-4 h-4 text-black" />
                  <span>Đổi Trả 7 Ngày</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-black" />
                  <span>Đóng Gói Kỹ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* VNPay Redirect & Safety Fallback Modal */}
      {vnpayModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-none border border-neutral-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-4 text-center relative">
            <div className="w-12 h-12 mx-auto rounded-none border border-neutral-200 bg-neutral-50 text-black flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 border border-neutral-200 bg-neutral-50 text-black inline-block mb-2">
                Cổng thanh toán VNPay
              </span>
              <h3 className="text-lg font-bold text-black uppercase tracking-wider">
                Đơn Hàng Đã Được Khởi Tạo
              </h3>
              <p className="text-neutral-500 text-xs mt-1 leading-relaxed">
                Mã đơn: <span className="font-mono font-bold text-black">#{vnpayModalData.orderId.slice(0, 8)}</span> • Số tiền: <span className="font-extrabold text-black font-mono">{vnpayModalData.totalAmount.toLocaleString('vi-VN')} đ</span>
              </p>
            </div>

            {/* Sandbox Notice Box */}
            <div className="p-4 rounded-none bg-neutral-50 border border-neutral-200 text-left text-xs text-neutral-700 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-black uppercase tracking-wider text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5 text-black shrink-0" />
                <span>Lưu ý về Cổng thử nghiệm (VNPay Sandbox)</span>
              </div>
              <p className="leading-relaxed text-neutral-600 text-[11px]">
                Nếu cổng VNPay Sandbox hiển thị <strong>&quot;Website này chưa được phê duyệt&quot; (Mã lỗi 71)</strong>, đây là do tài khoản đối tác thử nghiệm đang chờ VNPay kích hoạt.
              </p>
              <p className="leading-relaxed text-neutral-600 text-[11px]">
                Đơn hàng của bạn đã được lưu an toàn với số điện thoại <strong>{vnpayModalData.phone}</strong>. Bạn có thể chọn <strong>&quot;Xem đơn & Chuyển sang COD&quot;</strong> để được giao hàng tận nơi và thanh toán tiền mặt.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <a
                href={vnpayModalData.paymentUrl}
                onClick={() => {
                  clearCart();
                }}
                className="w-full py-3 px-6 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 rounded-none cursor-pointer"
              >
                <span>Mở cổng thanh toán VNPay</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => {
                  clearCart();
                  router.push(`/order/${vnpayModalData.orderId}`);
                }}
                className="w-full py-3 px-6 border border-neutral-300 hover:border-black text-black font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 rounded-none cursor-pointer"
              >
                <Package className="w-3.5 h-3.5" />
                <span>Xem đơn hàng (Thanh toán COD)</span>
              </button>

              <button
                type="button"
                onClick={() => setVnpayModalData(null)}
                className="w-full py-2 text-neutral-400 hover:text-black font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
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
