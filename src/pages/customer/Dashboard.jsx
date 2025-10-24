import React from 'react';
import CustomerLayout from '../../components/layout/CustomerLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { FiBook, FiShoppingCart, FiHeart, FiArrowRight } from 'react-icons/fi';

const CustomerDashboard = () => {
  const featuredBooks = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      price: 150000,
      cover: "/book1.jpg"
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      price: 120000,
      cover: "/book2.jpg"
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      price: 100000,
      cover: "/book3.jpg"
    }
  ];

  return (
    <CustomerLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-white">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">Welcome to BookSales</h1>
            <p className="text-xl mb-6 opacity-90">
              Discover your next favorite book from our extensive collection
            </p>
            <Button size="large" className="bg-white text-blue-600 hover:bg-gray-100">
              Browse Books <FiArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </section>

        {/* Featured Books */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Books</h2>
            <Button variant="outline">
              View All <FiArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBooks.map((book) => (
              <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <FiBook className="w-16 h-16 text-blue-600 opacity-50" />
                </div>
                <Card.Body>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">{book.title}</h3>
                  <p className="text-gray-600 mb-2">by {book.author}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-blue-600">
                      Rp {book.price.toLocaleString()}
                    </span>
                    <Button size="small">
                      <FiShoppingCart className="w-4 h-4 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiBook className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600 mb-2">5</div>
            <div className="text-gray-600">Books Purchased</div>
          </Card>
          <Card className="text-center p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiShoppingCart className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600 mb-2">2</div>
            <div className="text-gray-600">Pending Orders</div>
          </Card>
          <Card className="text-center p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiHeart className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600 mb-2">3</div>
            <div className="text-gray-600">Wishlisted Items</div>
          </Card>
        </section>
      </div>
    </CustomerLayout>
  );
};

export default CustomerDashboard;