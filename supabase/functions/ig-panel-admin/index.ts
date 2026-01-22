import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { action, adminPassword, submissionId } = await req.json();

    // Verify admin password
    const { data: settingsData } = await supabase
      .from("app_settings")
      .select("setting_value")
      .eq("setting_key", "main_settings")
      .maybeSingle();

    const storedAdminPassword = settingsData?.setting_value?.adminPassword || "dark";

    if (adminPassword !== storedAdminPassword) {
      return new Response(
        JSON.stringify({ error: "Invalid admin password" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    switch (action) {
      case "list": {
        const { data, error } = await supabase
          .from("ig_panel_submissions")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100);

        if (error) throw error;

        return new Response(
          JSON.stringify({ submissions: data }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "delete": {
        if (!submissionId) {
          return new Response(
            JSON.stringify({ error: "Submission ID required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { error } = await supabase
          .from("ig_panel_submissions")
          .delete()
          .eq("id", submissionId);

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "clear": {
        const { error } = await supabase
          .from("ig_panel_submissions")
          .delete()
          .neq("id", "00000000-0000-0000-0000-000000000000");

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "stats": {
        const { data, error } = await supabase
          .from("ig_panel_submissions")
          .select("followers_package, created_at");

        if (error) throw error;

        const totalUsers = data?.length || 0;
        const totalFollowers = data?.reduce((sum, item) => {
          return sum + parseInt(item.followers_package || "0");
        }, 0) || 0;

        // Count last 24h
        const now = new Date();
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const recent = data?.filter(item => new Date(item.created_at) > yesterday).length || 0;

        return new Response(
          JSON.stringify({ 
            totalUsers, 
            totalFollowers, 
            recentActivity: recent,
            avgFollowersPerUser: totalUsers > 0 ? Math.round(totalFollowers / totalUsers) : 0
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
