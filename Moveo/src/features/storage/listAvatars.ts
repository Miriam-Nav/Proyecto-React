import { supabase } from "../../config/supabaseClient"

type AvatarItem = {
  name: string
  path: string
  publicUrl: string
}

export async function listAvatars(userId: string): Promise<AvatarItem[]> {
  const { data, error } = await supabase.storage
    .from('avatars')
    .list(userId, {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' },
    })

  if (error) throw error
  if (!data) return []

  return data.map((item) => {
    const path = `${userId}/${item.name}`
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(path)

    return {
      name: item.name,
      path,
      publicUrl: urlData.publicUrl,
    }
  })
}