import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, websiteUrl } = await req.json();

    if (!email || !websiteUrl) {
      return new Response(
        JSON.stringify({ error: "Missing email or websiteUrl" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const sendgridApiKey = Deno.env.get("SENDGRID_API_KEY");
    if (!sendgridApiKey) {
      return new Response(
        JSON.stringify({ error: "SendGrid API key not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const emailContent = `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
      .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
      .header { text-align: center; margin-bottom: 30px; }
      .header h1 { color: #b45309; margin: 0; }
      .content { color: #333; line-height: 1.6; }
      .link-section { background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
      .link-section a { display: inline-block; background-color: #ea580c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; }
      .credentials { background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0; }
      .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🏜️ Morocco Tours</h1>
        <p>Your Tour Management Platform</p>
      </div>
      
      <div class="content">
        <p>Hello,</p>
        <p>Welcome! Your Morocco Tours website is now live and ready to use.</p>
        
        <div class="link-section">
          <p><strong>Access Your Website:</strong></p>
          <a href="${websiteUrl}">Visit Morocco Tours →</a>
        </div>
        
        <div class="credentials">
          <h3 style="margin-top: 0;">Admin Access Instructions:</h3>
          <ul>
            <li>Click the <strong>"Admin Login"</strong> button in the top-right corner</li>
            <li>Enter your email: <strong>${email}</strong></li>
            <li>You can now manage all tours, add new ones, edit pricing, and more</li>
          </ul>
        </div>
        
        <h3>Features Available:</h3>
        <ul>
          <li>✅ View all Morocco tour packages</li>
          <li>✅ Add new tours with pricing and details</li>
          <li>✅ Edit existing tour information</li>
          <li>✅ Delete tours you no longer offer</li>
          <li>✅ Beautiful responsive design</li>
        </ul>
        
        <p><strong>Next Steps:</strong></p>
        <ul>
          <li>Log in to the admin panel</li>
          <li>Customize tour details and pricing</li>
          <li>Add your own tour packages</li>
          <li>Share the public link with customers</li>
        </ul>
        
        <p>Enjoy managing your Morocco tours business!</p>
      </div>
      
      <div class="footer">
        <p>© 2024 Morocco Tours. All rights reserved.</p>
        <p>This is your exclusive access link. Keep it safe!</p>
      </div>
    </div>
  </body>
</html>
    `;

    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sendgridApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: email }],
            subject: "🏜️ Your Morocco Tours Website is Ready!",
          },
        ],
        from: { email: "noreply@moroccobtours.com", name: "Morocco Tours" },
        content: [
          {
            type: "text/html",
            value: emailContent,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("SendGrid error:", error);
      return new Response(JSON.stringify({ error: "Failed to send email" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email sent successfully to " + email,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
