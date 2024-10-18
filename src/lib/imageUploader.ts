"use server";

import { createClient } from "@supabase/supabase-js";

const BASE_IMAGE_URL = process.env.SUPABASE_IMG_URL as string;

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
);

// note: you must make file name unique, hence adding timestamp
export const imageUploader = async (file: File) => {
  const { data, error } = await supabase.storage
    .from("assets")
    .upload(file.name, file, { upsert: true });

  if (error) {
    return null;
  }

  return BASE_IMAGE_URL + data.path;
};

export const deleteImage = async (path: string) => {
  const { error } = await supabase.storage.from("assets").remove([path]);
  if (error) {
    return null;
  }
  return true;
};
