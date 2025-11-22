'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateBargains() {
  revalidatePath('/bargains', 'page');
}
