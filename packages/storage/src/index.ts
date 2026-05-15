import { SupabaseClient } from "@supabase/supabase-js"

export const uploadFile = async (
  supabase: SupabaseClient,
  bucket: string,
  path: string,
  file: File
) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      upsert: true,
    })
  return { data, error }
}

export const getFileUrl = (
  supabase: SupabaseClient,
  bucket: string,
  path: string
) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export const deleteFile = async (
  supabase: SupabaseClient,
  bucket: string,
  path: string
) => {
  const { error } = await supabase.storage.from(bucket).remove([path])
  return { error }
}
