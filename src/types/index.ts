export type BookCategory = "Fiction" | "Science" | "History" | "Kids" | "Others";

export interface Book {
  _id: string;
  title: string;
  author: string;
  category: BookCategory | string;
  image: string;
  description: string;
  copies: number;
  userEmail: string;
  userName: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface Borrow {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  bookAuthor?: string;
  bookCategory?: string;
  userEmail: string;
  userName: string;
  borrowDate: string | Date;
  returnDate: string | Date;
  status: "Borrowed" | "Returned";
  createdAt?: string | Date;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  count?: number;
  data?: T;
  error?: string;
  token?: string;
  user?: unknown;
}
