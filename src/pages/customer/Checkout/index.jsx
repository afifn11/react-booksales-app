import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerLayout from '../../../components/layout/CustomerLayout';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { useCart } from '../../../contexts/CartContext';
import { useAuth } from '../../../contexts/AuthContext';
import { transactionService, mockTransactionService } from '../../../services/transactions';
import { formatCurrency } from '../../../utils/helpers';
import { 
  FiShoppingCart, 
  FiUser, 
  FiCreditCard, 
  FiTruck,
  FiMapPin,
  FiCheck
} from 'react-icons/fi';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    shipping_name: user?.name || '',
    shipping_address: '',
    shipping_city: '',
    shipping_postal_code: '',
    shipping_phone: '',
    payment_method: 'credit_card',
    notes: ''
  });

  if (cartItems.length === 0) {
    return (
      <CustomerLayout>
        <div className="text-center py-12">
          <FiShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some books to proceed with checkout</p>
          <Button onClick={() => navigate('/customer/books')}>
            Continue Shopping
          </Button>
        </div>
      </CustomerLayout>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validasi form
    if (!formData.shipping_name || !formData.shipping_address || !formData.shipping_city || !formData.shipping_postal_code || !formData.shipping_phone) {
      setError('Please fill in all required shipping information');
      setLoading(false);
      return;
    }

    try {
      const transactionData = {
        items: cartItems.map(item => ({
          book_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total_amount: getCartTotal(),
        shipping_address: `${formData.shipping_address}, ${formData.shipping_city}, ${formData.shipping_postal_code}`,
        shipping_phone: formData.shipping_phone,
        payment_method: formData.payment_method,
        notes: formData.notes
      };

      console.log('Submitting transaction:', transactionData);

      let response;
      
      // Coba gunakan real service pertama, fallback ke mock service
      try {
        response = await transactionService.createTransaction(transactionData);
      } catch (apiError) {
        console.warn('Real API failed, using mock service:', apiError);
        response = await mockTransactionService.createTransaction(transactionData);
      }

      console.log('Transaction response:', response);
      
      setSuccess(response.message || 'Order placed successfully!');
      clearCart();
      
      setTimeout(() => {
        navigate('/customer/transactions');
      }, 2000);
      
    } catch (error) {
      console.error('Checkout error:', error);
      setError(error.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getCartTotal();
  const shippingFee = 15000; // Flat rate
  const total = subtotal + shippingFee;

  return (
    <CustomerLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600">Complete your purchase</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Shipping & Payment */}
            <div className="space-y-6">
              {/* Shipping Information */}
              <Card>
                <Card.Header>
                  <div className="flex items-center">
                    <FiMapPin className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">Shipping Information</h3>
                  </div>
                </Card.Header>
                <Card.Body className="space-y-4">
                  <Input
                    label="Full Name *"
                    name="shipping_name"
                    value={formData.shipping_name}
                    onChange={handleInputChange}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Shipping Address *
                    </label>
                    <textarea
                      name="shipping_address"
                      value={formData.shipping_address}
                      onChange={handleInputChange}
                      rows={3}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Enter your complete address"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="City *"
                      name="shipping_city"
                      value={formData.shipping_city}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      label="Postal Code *"
                      name="shipping_postal_code"
                      value={formData.shipping_postal_code}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <Input
                    label="Phone Number *"
                    name="shipping_phone"
                    value={formData.shipping_phone}
                    onChange={handleInputChange}
                    required
                  />
                </Card.Body>
              </Card>

              {/* Payment Method */}
              <Card>
                <Card.Header>
                  <div className="flex items-center">
                    <FiCreditCard className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">Payment Method</h3>
                  </div>
                </Card.Header>
                <Card.Body className="space-y-4">
                  <div className="space-y-2">
                    {[
                      { id: 'credit_card', label: 'Credit Card', icon: FiCreditCard },
                      { id: 'bank_transfer', label: 'Bank Transfer', icon: FiUser },
                      { id: 'cod', label: 'Cash on Delivery', icon: FiTruck }
                    ].map((method) => (
                      <label key={method.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="payment_method"
                          value={method.id}
                          checked={formData.payment_method === method.id}
                          onChange={handleInputChange}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <method.icon className="w-5 h-5 text-gray-600 mx-3" />
                        <span className="text-sm font-medium text-gray-900">{method.label}</span>
                      </label>
                    ))}
                  </div>
                </Card.Body>
              </Card>

              {/* Order Notes */}
              <Card>
                <Card.Header>
                  <h3 className="text-lg font-medium text-gray-900">Order Notes (Optional)</h3>
                </Card.Header>
                <Card.Body>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Any special instructions for your order..."
                  />
                </Card.Body>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              <Card>
                <Card.Header>
                  <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
                </Card.Header>
                <Card.Body>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {item.cover_photo ? (
                            <img
                              src={item.cover_photo}
                              alt={item.title}
                              className="w-12 h-16 object-cover rounded"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center">
                              <FiShoppingCart className="w-6 h-6 text-gray-500" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-medium text-gray-900">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t mt-4 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-gray-900">{formatCurrency(shippingFee)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total</span>
                      <span className="text-green-600">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <Button
                type="submit"
                variant="primary"
                size="large"
                loading={loading}
                disabled={loading}
                className="w-full"
              >
                <FiCheck className="w-5 h-5 mr-2" />
                Place Order
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/customer/books')}
                className="w-full"
              >
                Continue Shopping
              </Button>

              {/* Development Note */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700">
                  <strong>Development Note:</strong> The checkout is currently using mock data since the backend API endpoint is not available. In production, this would connect to a real payment processor.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </CustomerLayout>
  );
};

export default Checkout;