import { getSupabaseServer } from "@/lib/supabase";

const fallbackBySourcePath = new Map<string, string>();

export async function getMediaAssetUrl(sourcePublicPath: string): Promise<string> {
  const supabase = getSupabaseServer();
  if (!supabase) return sourcePublicPath;
  if (fallbackBySourcePath.has(sourcePublicPath)) {
    return fallbackBySourcePath.get(sourcePublicPath) ?? sourcePublicPath;
  }

  const { data, error } = await supabase
    .from("takeawaypack_media_assets")
    .select("public_url")
    .eq("source_public_path", sourcePublicPath)
    .limit(1)
    .maybeSingle();

  const url = error || !data?.public_url ? sourcePublicPath : data.public_url;
  fallbackBySourcePath.set(sourcePublicPath, url);
  return url;
}
