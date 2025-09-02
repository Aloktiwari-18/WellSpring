import React, { useState } from 'react';
import { BookOpen, Headphones, ArrowLeft, Search, Star } from 'lucide-react';

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  rating: number;
  imageUrl: string;
}

const books: Book[] = [
  {
    id: 1,
    title: 'The Power of Now',
    author: 'Eckhart Tolle',
    description: 'A guide to spiritual enlightenment and living in the present moment.',
    rating: 4.8,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTeHrXkAz4VPjJUS-wTd87rXomWJpeQ-isAmnOI1Wra6LH9IQF_UKD7lIEcMSHTNjWqwmcdS3ANh1RbYW0NEtE0nQjxz1UPb-Q-X48YT7ucoA6PlmDJEq4U',
  },
  {
    id: 2,
    title: 'Atomic Habits',
    author: 'James Clear',
    description: 'An easy & proven way to build good habits & break bad ones.',
    rating: 4.9,
    imageUrl: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTJdHI1dz7Zj2nDlfUJIs77nYrFd-xsUyKqOF5LvY_nCVYRd7i6ImPQxgZtYXcQFXsnBdyKkE6jS6IOPMeHPr2_B7GeJN26',
  },
  {
    id: 3,
    title: 'The Subtle Art of Not Giving a F*ck',
    author: 'Mark Manson',
    description: 'A counterintuitive approach to living a good life.',
    rating: 4.7,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcR1A0txI1mRijJkoycMH6TEr7qVMkOuEMDm1YYW7n6tWrko5nD_h83-jSTNmH1ccwlQebB2SBlgXjGvL8uDW1FYCRYzHRDLfcSmJ7uhHtGVGebo5ye8eCVJ',
  },
  {
    id: 4,
    title: 'Think Like a Monk',
    author: 'Jay Shetty',
    description: 'Train your mind for peace and purpose every day.',
    rating: 4.8,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTydMoX-In6tIv9rDwnPraSmRm1Lqrm1CGbTrZX37lshY1tGGoADMxpqC9oT-hVilqDmaW9GSucmPVDVdvJkVfVxwT5zVpkcBOouBVRRIXu93VxgqRPAW96tg',
  },
];

const BookLibrary = () => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-8">
      {!selectedBook ? (
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Book Library</h1>

          {/* Search bar */}
          <div className="relative max-w-xl mx-auto mb-12">
            <input
              type="text"
              placeholder="Search books or authors..."
              className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          </div>

          {/* Books grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setSelectedBook(book)}
              >
                <div className="aspect-[2/3] relative">
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{book.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">by {book.author}</p>
                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(book.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">{book.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Book details page
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedBook(null)}
            className="flex items-center text-indigo-600 hover:text-indigo-800 mb-8"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Library
          </button>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              <div className="aspect-[2/3] relative">
                <img
                  src={selectedBook.imageUrl}
                  alt={selectedBook.title}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedBook.title}</h2>
                <p className="text-lg text-gray-600 mb-6">by {selectedBook.author}</p>
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(selectedBook.rating)
                          ? 'text-yellow-500 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600">{selectedBook.rating}</span>
                </div>
                <p className="text-gray-700 mb-8">{selectedBook.description}</p>
                <div className="flex gap-4">
                  <button className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
                    <BookOpen className="mr-2" size={20} />
                    Read
                  </button>
                  <button className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
                    <Headphones className="mr-2" size={20} />
                    Listen
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookLibrary;
