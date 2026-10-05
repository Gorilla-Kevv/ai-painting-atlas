/* =====================================================================
 * 站点配置 · 社区共建功能
 * SUPABASE_URL / SUPABASE_ANON_KEY 留空 = 社区功能关闭（站点其余功能不受影响）
 * anon key 为公开密钥（安全靠 Supabase RLS 策略保障，见 supabase-setup.sql）
 * ===================================================================== */
window.KB_CONFIG = {
  SUPABASE_URL: "https://jbvzwdpuxklannhacrol.supabase.co",        // 形如 https://xxxxx.supabase.co
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impidnp3ZHB1eGtsYW5uaGFjcm9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExMzQzMzMsImV4cCI6MjEwNjcxMDMzM30.LFU1eQJ3sMwQDmrt16oUz60wB-djapJ3GTK7zv0A3T4",   // Supabase Dashboard → Settings → API → anon public
  GITHUB_REPO: "Gorilla-Kevv/ai-painting-atlas"
};
