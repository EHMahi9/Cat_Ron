"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { createBook } from "@/lib/api";
import {
  PlusCircle,
  Upload,
  BookOpen,
  User,
  Mail,
  Layers,
  FileText,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";
import toast from "react-hot-toast";

const categories = ["Fiction", "Science", "History", "Kids", "Others"];

export default function AddBookPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Fiction");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [copies, setCopies] = useState<number>(3);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Private route check
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?callbackUrl=/add-book");
    }
  }, [session, isPending, router]);

  // Handle direct file upload to ImgBB
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file is too large. Max size is 5MB.");
      return;
    }

    setUploadingImage(true);
    const toastId = toast.loading("Uploading cover image to ImgBB...");

    try {
      const apiKey =
        process.env.NEXT_PUBLIC_IMGBB_API_KEY || "d81643c726eeeb5726224f8d9510619a";
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.data?.url) {
        setImageUrl(data.data.url);
        toast.success("Image uploaded successfully!", { id: toastId });
      } else {
        toast.error("Failed to upload image. You can paste a direct image URL.", {
          id: toastId,
        });
      }
    } catch {
      toast.error("Network error during image upload. You can enter an image URL.", {
        id: toastId,
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user) {
      toast.error("Please login to add a book.");
      router.push("/login?callbackUrl=/add-book");
      return;
    }

    if (!imageUrl) {
      toast.error("Please upload an image or provide a book cover image URL.");
      return;
    }

    if (copies < 0) {
      toast.error("Total copies must be 0 or greater.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await createBook({
        title,
        author,
        category,
        image: imageUrl,
        description,
        copies: Number(copies),
        userEmail: session.user.email,
        userName: session.user.name || "BookNook Member",
      });

      if (res.success) {
        toast.success(`"${title}" has been successfully added to BookNook!`);
        router.push("/books");
      } else {
        toast.error(res.message || "Failed to add book.");
      }
    } catch (err: unknown) {
      console.error("Add book error:", err);
      const errorMsg = (err as Error)?.message;
      toast.error(
        errorMsg && !errorMsg.includes("fetch")
          ? errorMsg
          : "Could not connect to book server. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-xl border-3 border-indigo-600 border-t-transparent animate-spin" />
        <p className="text-sm font-medium text-slate-500 font-serif">
          Verifying session...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Contribute to Library</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-serif">
          Add New Book
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Share your favorite literature with our reading community. Fill in the details below to add a title to the shelves.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                Book Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. The Midnight Library"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                Author Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Matt Haig"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Category & Total Copies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                Total Copies * (Challenge: Available Copies)
              </label>
              <input
                type="number"
                min="1"
                required
                value={copies}
                onChange={(e) => setCopies(parseInt(e.target.value, 10) || 1)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Image Upload / URL input */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Book Cover Image * (Upload or Enter URL)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* File upload button */}
              <div className="sm:col-span-6">
                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl hover:border-indigo-500 cursor-pointer bg-slate-50/50 dark:bg-slate-800/50 transition-colors">
                  <Upload className="w-6 h-6 text-indigo-500 mb-1" />
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    {uploadingImage ? "Uploading to ImgBB..." : "Click to upload image file (ImgBB)"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Direct URL input */}
              <div className="sm:col-span-6">
                <input
                  type="url"
                  placeholder="Or paste direct image URL (Unsplash, ImgBB, etc.)"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Preview */}
            {imageUrl && (
              <div className="pt-2 flex items-center gap-4">
                <div className="relative w-16 h-22 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-100 shrink-0">
                  <Image
                    src={imageUrl}
                    alt="Book Cover Preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  Cover image preview ready
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
              Short Description *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Provide a concise, engaging summary of the book..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
            />
          </div>

          {/* Contributor Read-Only Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                Contributor Name (Read-Only)
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  readOnly
                  disabled
                  value={session?.user?.name || "BookNook Member"}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 text-sm cursor-not-allowed font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                Contributor Email (Read-Only)
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  readOnly
                  disabled
                  value={session?.user?.email || ""}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 text-sm cursor-not-allowed font-medium"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/30 disabled:opacity-50 transition-all focus:outline-none"
            >
              <PlusCircle className="w-5 h-5" />
              {submitting ? "Adding Book to Catalogue..." : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
