import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function generateInvoiceHTML(order: any, invoiceNumber: string) {
  const items = Array.isArray(order.items) ? order.items : [];
  const totalEur = (order.total_amount / 100).toFixed(2);
  const date = new Date(order.created_at).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const itemsRows = items
    .map(
      (item: any) => `
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #2a2520; color: #e8dcc8; font-size: 14px;">
          ${item.name || item.product?.name || "Morilles de feu séchées"}
        </td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #2a2520; color: #e8dcc8; font-size: 14px; text-align: center;">
          ${item.quantity || 1}
        </td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #2a2520; color: #e8dcc8; font-size: 14px; text-align: right;">
          ${((item.price || item.unit_amount || 0)).toFixed(2)} €
        </td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #2a2520; color: #e8dcc8; font-size: 14px; text-align: right;">
          ${((item.price || item.unit_amount || 0) * (item.quantity || 1)).toFixed(2)} €
        </td>
      </tr>
    `
    )
    .join("");

  const shipping = order.shipping_address || {};
  const shippingBlock = shipping.line1
    ? `
      <div style="margin-top: 24px;">
        <p style="font-size: 12px; color: #8a7e6b; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.1em;">Adresse de livraison</p>
        <p style="font-size: 14px; color: #e8dcc8; margin: 0; line-height: 1.6;">
          ${shipping.line1 || ""}${shipping.line2 ? "<br/>" + shipping.line2 : ""}<br/>
          ${shipping.postal_code || ""} ${shipping.city || ""}<br/>
          ${shipping.country || "France"}
        </p>
      </div>
    `
    : "";

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Facture ${invoiceNumber} — Morilles du Canada</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Raleway:wght@300;400;500;600&display=swap');
    body { margin: 0; padding: 0; background: #1a1714; font-family: 'Raleway', Arial, sans-serif; }
    @media print {
      body { background: white; }
      .invoice-container { box-shadow: none !important; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="text-align: center; padding: 16px; background: #2a2520;">
    <button onclick="window.print()" style="padding: 10px 32px; background: #cc9a2e; color: #1a1714; border: none; font-family: 'Raleway', sans-serif; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; font-size: 12px; cursor: pointer; border-radius: 2px;">
      Télécharger / Imprimer
    </button>
  </div>
  <div class="invoice-container" style="max-width: 700px; margin: 0 auto; background: #1a1714; padding: 0;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #cc9a2e, #d4a843); padding: 32px 40px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h1 style="font-family: 'Cormorant Garamond', Georgia, serif; color: #1a1714; font-size: 28px; margin: 0;">Morilles du Canada</h1>
        <p style="color: #1a1714; font-size: 11px; margin: 4px 0 0; letter-spacing: 0.1em; text-transform: uppercase;">Morilles de feu sauvages séchées</p>
      </div>
      <div style="text-align: right;">
        <p style="color: #1a1714; font-size: 20px; font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 600; margin: 0;">FACTURE</p>
        <p style="color: #1a1714cc; font-size: 12px; margin: 4px 0 0;">${invoiceNumber}</p>
      </div>
    </div>

    <!-- Info -->
    <div style="padding: 32px 40px; display: flex; justify-content: space-between;">
      <div>
        <p style="font-size: 12px; color: #8a7e6b; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.1em;">Facturé à</p>
        <p style="font-size: 16px; color: #e8dcc8; margin: 0; font-weight: 500;">${order.customer_name}</p>
        <p style="font-size: 14px; color: #e8dcc8; margin: 4px 0 0;">${order.email}</p>
        ${shippingBlock}
      </div>
      <div style="text-align: right;">
        <p style="font-size: 12px; color: #8a7e6b; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.1em;">Date</p>
        <p style="font-size: 14px; color: #e8dcc8; margin: 0;">${date}</p>
        <p style="font-size: 12px; color: #8a7e6b; margin: 16px 0 4px; text-transform: uppercase; letter-spacing: 0.1em;">Commande</p>
        <p style="font-size: 14px; color: #e8dcc8; margin: 0;">${order.id.substring(0, 8).toUpperCase()}</p>
      </div>
    </div>

    <!-- Items -->
    <div style="padding: 0 40px;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 2px solid #cc9a2e;">
            <th style="padding: 12px 16px; text-align: left; font-size: 11px; color: #8a7e6b; text-transform: uppercase; letter-spacing: 0.1em;">Produit</th>
            <th style="padding: 12px 16px; text-align: center; font-size: 11px; color: #8a7e6b; text-transform: uppercase; letter-spacing: 0.1em;">Qté</th>
            <th style="padding: 12px 16px; text-align: right; font-size: 11px; color: #8a7e6b; text-transform: uppercase; letter-spacing: 0.1em;">Prix unit.</th>
            <th style="padding: 12px 16px; text-align: right; font-size: 11px; color: #8a7e6b; text-transform: uppercase; letter-spacing: 0.1em;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>
    </div>

    <!-- Total -->
    <div style="padding: 24px 40px; text-align: right;">
      <div style="display: inline-block; background: #2a2520; border: 1px solid #cc9a2e33; border-radius: 4px; padding: 16px 32px;">
        <p style="font-size: 12px; color: #8a7e6b; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.1em;">Total TTC</p>
        <p style="font-size: 28px; color: #cc9a2e; font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 600; margin: 0;">${totalEur} €</p>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding: 24px 40px; border-top: 1px solid #cc9a2e1a; text-align: center;">
      <p style="color: #8a7e6b; font-size: 11px; margin: 0;">
        Morilles du Canada · contact@morillesducanada.com
      </p>
      <p style="color: #8a7e6b; font-size: 10px; margin: 8px 0 0;">
        © ${new Date().getFullYear()} Morilles du Canada · Non assujetti à la TVA (micro-entreprise)
      </p>
    </div>
  </div>
</body>
</html>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId } = await req.json();
    if (!orderId) throw new Error("Missing orderId");

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Not authenticated");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) throw new Error("Invalid auth token");

    // Fetch order - use service role to bypass RLS for admin or own orders
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: order, error: orderError } = await serviceClient
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) throw new Error("Order not found");

    // Check authorization: must be own order or admin
    const { data: isAdmin } = await serviceClient.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });

    if (order.user_id !== user.id && !isAdmin) {
      throw new Error("Unauthorized");
    }

    // Only allow invoice for paid/shipped/delivered orders
    if (!["paid", "shipped", "delivered"].includes(order.status)) {
      throw new Error("Invoice not available for this order status");
    }

    const invoiceNumber = `FAC-${new Date(order.created_at).getFullYear()}-${order.id.substring(0, 8).toUpperCase()}`;
    const html = generateInvoiceHTML(order, invoiceNumber);

    return new Response(html, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Invoice error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: error.message === "Unauthorized" ? 403 : 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
