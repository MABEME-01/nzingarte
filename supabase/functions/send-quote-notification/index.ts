import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface QuoteRequest {
  name: string;
  email: string;
  phone?: string;
  serviceName?: string;
  message: string;
}

async function sendEmail(options: {
  from: string;
  to: string[];
  subject: string;
  html: string;
}) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${error}`);
  }

  return response.json();
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, serviceName, message }: QuoteRequest = await req.json();

    console.log("Sending quote notification for:", { name, email, serviceName });

    // Email para o admin (Samuel Nzinga)
    const adminEmailResponse = await sendEmail({
      from: "NZINGA'RTE <onboarding@resend.dev>",
      to: ["samuel587nzinga@gmail.com"],
      subject: `Novo Pedido de Orçamento - ${serviceName || "Geral"}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0d9488, #14b8a6); padding: 20px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">NZINGA'RTE</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0;">Novo Pedido de Orçamento</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border: 1px solid #e9ecef; border-top: none;">
            <h2 style="color: #0d9488; margin-top: 0;">Detalhes do Cliente</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #dee2e6; font-weight: bold; width: 120px;">Nome:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #dee2e6;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #dee2e6; font-weight: bold;">Email:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #dee2e6;"><a href="mailto:${email}">${email}</a></td>
              </tr>
              ${phone ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #dee2e6; font-weight: bold;">Telefone:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #dee2e6;"><a href="tel:${phone}">${phone}</a></td>
              </tr>
              ` : ''}
              ${serviceName ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #dee2e6; font-weight: bold;">Serviço:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #dee2e6;">${serviceName}</td>
              </tr>
              ` : ''}
            </table>
            
            <h3 style="color: #0d9488; margin-top: 20px;">Mensagem:</h3>
            <div style="background: white; padding: 15px; border-radius: 5px; border: 1px solid #dee2e6;">
              <p style="margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
          
          <div style="background: #0d9488; padding: 15px; border-radius: 0 0 10px 10px; text-align: center;">
            <p style="color: white; margin: 0; font-size: 14px;">Este email foi enviado automaticamente pelo sistema NZINGA'RTE</p>
          </div>
        </div>
      `,
    });

    console.log("Admin email sent:", adminEmailResponse);

    // Email de confirmação para o cliente
    const clientEmailResponse = await sendEmail({
      from: "NZINGA'RTE <onboarding@resend.dev>",
      to: [email],
      subject: "Recebemos o seu pedido de orçamento - NZINGA'RTE",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0d9488, #14b8a6); padding: 20px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">NZINGA'RTE</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0;">Fazer bem, faz bem</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border: 1px solid #e9ecef; border-top: none;">
            <h2 style="color: #0d9488; margin-top: 0;">Olá ${name}!</h2>
            
            <p>Recebemos o seu pedido de orçamento${serviceName ? ` para <strong>${serviceName}</strong>` : ''} e entraremos em contacto consigo o mais breve possível.</p>
            
            <p>Enquanto isso, sinta-se à vontade para:</p>
            <ul>
              <li>Explorar os nossos <a href="https://nzingarte.lovable.app/servicos" style="color: #0d9488;">serviços</a></li>
              <li>Ver o nosso <a href="https://nzingarte.lovable.app/portfolio" style="color: #0d9488;">portfólio</a></li>
              <li>Contactar-nos via WhatsApp: <a href="https://wa.me/244936163587" style="color: #0d9488;">+244 936 163 587</a></li>
            </ul>
            
            <p>Obrigado pela preferência!</p>
            
            <p style="margin-top: 20px;">
              Com os melhores cumprimentos,<br>
              <strong>Equipa NZINGA'RTE</strong>
            </p>
          </div>
          
          <div style="background: #0d9488; padding: 15px; border-radius: 0 0 10px 10px; text-align: center;">
            <p style="color: white; margin: 0; font-size: 14px;">Mbanza Kongo, Angola | +244 936 163 587</p>
          </div>
        </div>
      `,
    });

    console.log("Client email sent:", clientEmailResponse);

    return new Response(
      JSON.stringify({ success: true, adminEmail: adminEmailResponse, clientEmail: clientEmailResponse }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-quote-notification:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
