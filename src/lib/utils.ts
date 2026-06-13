import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDirectImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  
  const trimmed = url.trim();

  // Match Google Drive links
  const driveRegex = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|docs\.google\.com\/uc\?export=view&id=)([\w-]+)/;
  const match = trimmed.match(driveRegex);
  
  if (match && match[1]) {
    const fileId = match[1];
    return `https://lh3.googleusercontent.com/u/0/d/${fileId}`;
  }

  return trimmed;
}