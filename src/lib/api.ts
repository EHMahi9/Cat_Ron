import { Book, Borrow, ApiResponse } from "@/types";

/**
 * Dynamically resolves the API Base URL.
 * Guarantees that in the browser on Vercel/production it ALWAYS routes to Render.
 */
export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
      return "https://cat-ron-server.onrender.com";
    }
  }
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && !envUrl.includes("localhost")) {
    return envUrl.replace(/\/$/, "");
  }
  if (process.env.NODE_ENV === "production") {
    return "https://cat-ron-server.onrender.com";
  }
  return envUrl?.replace(/\/$/, "") || "https://cat-ron-server.onrender.com";
}

export const API_BASE_URL = getApiBaseUrl();

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
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/jwt`, {
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
 * Ensures an active JWT token is available; attempts sync if missing
 */
async function ensureToken(
  token?: string | null,
  userEmail?: string,
  userName?: string
): Promise<string | null> {
  let activeToken = token || getToken();
  if (!activeToken && userEmail) {
    activeToken = await syncJwtToken({
      email: userEmail,
      name: userName || "BookNook Member",
    });
  }
  return activeToken;
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

    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}/books${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;

    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (res.ok) {
      const json: ApiResponse<Book[]> = await res.json();
      if (json.data && json.data.length > 0) {
        return json.data;
      }
    }
  } catch (error) {
    console.warn("Express server fetch error, falling back to direct DB:", error);
  }

  // Server-side fallback directly to MongoDB if Express API is unreachable
  if (typeof window === "undefined") {
    try {
      const { db } = await import("./auth");
      const filter: Record<string, unknown> = {};

      if (params?.category && params.category !== "All") {
        filter.category = params.category;
      }

      if (params?.search) {
        filter.$or = [
          { title: { $regex: params.search, $options: "i" } },
          { author: { $regex: params.search, $options: "i" } },
        ];
      }

      if (params?.email) {
        filter.userEmail = params.email;
      }

      let cursor = db.collection("books").find(filter);

      if (params?.sort === "rating") {
        cursor = cursor.sort({ rating: -1 });
      } else if (params?.sort === "copies") {
        cursor = cursor.sort({ copies: -1 });
      } else {
        cursor = cursor.sort({ createdAt: -1 });
      }

      if (params?.limit) {
        cursor = cursor.limit(params.limit);
      }

      const docs = await cursor.toArray();
      return docs.map((d) => ({
        _id: d._id.toString(),
        title: d.title || "",
        author: d.author || "",
        category: d.category || "Novel",
        image: d.image || "",
        description: d.description || "",
        copies: typeof d.copies === "number" ? d.copies : 1,
        userEmail: d.userEmail || "",
        userName: d.userName || "BookNook Member",
        createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: d.updatedAt ? new Date(d.updatedAt).toISOString() : new Date().toISOString(),
      }));
    } catch (dbErr) {
      console.error("Direct MongoDB fallback error:", dbErr);
    }
  }

  return [];
}

/**
 * 2. GET /books/:id - Retrieve single book details
 */
export async function getBookById(id: string): Promise<Book | null> {
  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/books/${id}`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (res.ok) {
      const json: ApiResponse<Book> = await res.json();
      if (json.data) return json.data;
    }
  } catch (error) {
    console.warn("Express getBookById error, falling back to direct DB:", error);
  }

  // Server-side fallback directly to MongoDB
  if (typeof window === "undefined") {
    try {
      const { db } = await import("./auth");
      const { ObjectId } = await import("mongodb");

      if (ObjectId.isValid(id)) {
        const doc = await db.collection("books").findOne({ _id: new ObjectId(id) });
        if (doc) {
          return {
            _id: doc._id.toString(),
            title: doc.title || "",
            author: doc.author || "",
            category: doc.category || "Novel",
            image: doc.image || "",
            description: doc.description || "",
            copies: typeof doc.copies === "number" ? doc.copies : 1,
            userEmail: doc.userEmail || "",
            userName: doc.userName || "BookNook Member",
            createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
            updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : new Date().toISOString(),
          };
        }
      }
    } catch (dbErr) {
      console.error("Direct MongoDB getBookById fallback error:", dbErr);
    }
  }

  return null;
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
  const activeToken = await ensureToken(token, bookData.userEmail, bookData.userName);
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/books`, {
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
  const activeToken = await ensureToken(token);
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/books/${id}`, {
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
  const activeToken = await ensureToken(token);
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/books/${id}`, {
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
  const activeToken = await ensureToken(token, borrowData.userEmail, borrowData.userName);
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/borrows`, {
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
    const activeToken = await ensureToken(token);
    if (!activeToken) return [];

    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/borrows`, {
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
  const activeToken = await ensureToken(token);
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/borrows/${borrowId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${activeToken}`,
    },
  });

  return await res.json();
}
