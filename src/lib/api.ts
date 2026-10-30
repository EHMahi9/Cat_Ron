import { Book, Borrow, ApiResponse } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  (process.env.NODE_ENV === "production"
    ? "https://cat-ron-server.onrender.com"
    : "http://localhost:5000");

/**
 * Helper to get active JWT token from localStorage or session
 */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("booknook_token");
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("booknook_token", token);
}

export function removeToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("booknook_token");
}

/**
 * Exchange authenticated user session for a signed JWT token
 */
export async function syncJwtToken(user: {
  email: string;
  name?: string | null;
  id?: string | null;
}): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/jwt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        name: user.name || "BookNook Member",
        id: user.id,
      }),
    });

    const data: ApiResponse = await res.json();
    if (data.success && data.token) {
      setToken(data.token);
      return data.token;
    }
    return null;
  } catch (error) {
    console.error("Failed to sync JWT token with server:", error);
    return null;
  }
}

/**
 * 1. GET /books - Fetch all books with optional sorting & filtering
 */
export async function getBooks(params?: {
  sort?: string;
  limit?: number;
  category?: string;
  search?: string;
  email?: string;
}): Promise<Book[]> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.sort) searchParams.append("sort", params.sort);
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.category && params.category !== "All")
      searchParams.append("category", params.category);
    if (params?.search) searchParams.append("search", params.search);
    if (params?.email) searchParams.append("email", params.email);

    const url = `${API_BASE_URL}/books${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;

    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}: Failed to fetch books`);
    }

    const json: ApiResponse<Book[]> = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("getBooks error:", error);
    return [];
  }
}

/**
 * 2. GET /books/:id - Fetch single book details
 */
export async function getBookById(id: string): Promise<Book | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/books/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const json: ApiResponse<Book> = await res.json();
    return json.data || null;
  } catch (error) {
    console.error("getBookById error:", error);
    return null;
  }
}

/**
 * 3. POST /books - Add new book (Protected)
 */
export async function createBook(
  bookData: {
    title: string;
    author: string;
    category: string;
    image: string;
    description: string;
    copies: number;
    userEmail: string;
    userName: string;
  },
  token?: string | null
): Promise<ApiResponse<Book>> {
  const activeToken = token || getToken();
  const res = await fetch(`${API_BASE_URL}/books`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${activeToken}`,
    },
    body: JSON.stringify(bookData),
  });

  return await res.json();
}

/**
 * 4. PATCH /books/:id - Update book (Protected)
 */
export async function updateBook(
  id: string,
  bookData: Partial<Book>,
  token?: string | null
): Promise<ApiResponse<Book>> {
  const activeToken = token || getToken();
  const res = await fetch(`${API_BASE_URL}/books/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${activeToken}`,
    },
    body: JSON.stringify(bookData),
  });

  return await res.json();
}

/**
 * 5. DELETE /books/:id - Delete book (Protected)
 */
export async function deleteBook(
  id: string,
  token?: string | null
): Promise<ApiResponse> {
  const activeToken = token || getToken();
  const res = await fetch(`${API_BASE_URL}/books/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${activeToken}`,
    },
  });

  return await res.json();
}

/**
 * 6. POST /borrows - Borrow a book (Protected)
 */
export async function borrowBook(
  borrowData: {
    bookId: string;
    bookTitle: string;
    bookImage: string;
    userEmail: string;
    userName: string;
    returnDate: string;
  },
  token?: string | null
): Promise<ApiResponse<Borrow>> {
  const activeToken = token || getToken();
  const res = await fetch(`${API_BASE_URL}/borrows`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${activeToken}`,
    },
    body: JSON.stringify(borrowData),
  });

  return await res.json();
}

/**
 * 7. GET /borrows - Get user borrowed books (Protected)
 */
export async function getMyBorrows(token?: string | null): Promise<Borrow[]> {
  try {
    const activeToken = token || getToken();
    if (!activeToken) return [];

    const res = await fetch(`${API_BASE_URL}/borrows`, {
      headers: {
        Authorization: `Bearer ${activeToken}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return [];

    const json: ApiResponse<Borrow[]> = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("getMyBorrows error:", error);
    return [];
  }
}

/**
 * 8. DELETE /borrows/:id - Return a borrowed book (Protected)
 */
export async function returnBook(
  borrowId: string,
  token?: string | null
): Promise<ApiResponse> {
  const activeToken = token || getToken();
  const res = await fetch(`${API_BASE_URL}/borrows/${borrowId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${activeToken}`,
    },
  });

  return await res.json();
}
