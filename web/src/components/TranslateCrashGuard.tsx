'use client';

import { useEffect } from 'react';

/**
 * TranslateCrashGuard:
 * Mencegah crash "Application error: a client-side exception has occurred"
 * yang disebabkan oleh Google Translate memodifikasi struktur DOM (menyisipkan tag <font>)
 * saat React mencoba melakukan rekonsiliasi atau unmount elemen (removeChild / insertBefore).
 */
export function TranslateCrashGuard() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Tangkal error removeChild
    const originalRemoveChild = Node.prototype.removeChild;
    Node.prototype.removeChild = function <T extends Node>(child: T): T {
      if (child.parentNode !== this) {
        if (child.parentNode) {
          return child.parentNode.removeChild(child);
        }
        return child; // Abaikan secara aman tanpa memicu crash
      }
      return originalRemoveChild.call(this, child) as T;
    };

    // 2. Tangkal error insertBefore
    const originalInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function <T extends Node>(
      newNode: T,
      referenceNode: Node | null
    ): T {
      if (referenceNode && referenceNode.parentNode !== this) {
        if (referenceNode.parentNode) {
          return referenceNode.parentNode.insertBefore(newNode, referenceNode);
        }
        return this.appendChild(newNode);
      }
      return originalInsertBefore.call(this, newNode, referenceNode) as T;
    };
  }, []);

  return null;
}

