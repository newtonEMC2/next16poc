'use server';

import { revalidateTag, updateTag } from 'next/cache';

export async function revalidateBargains(expire: boolean) {
  if (expire) {
    updateTag('bargains');
  }
  else {
    revalidateTag('bargains', 'max');
  }
}