import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { name, email, phone, subject, message, honeypot } = body;

    // Honeypot check
    if (honeypot && honeypot.length > 0) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Name, email and message are required.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const notificationEmail = Deno.env.get('NOTIFICATION_EMAIL');
    const resendKey = Deno.env.get('RESEND_API_KEY');

    if (!resendKey || !notificationEmail) {
      console.warn("RESEND_API_KEY or NOTIFICATION_EMAIL is missing. Cannot send email.");
      return new Response(
        JSON.stringify({ error: 'Email configuration missing.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: 'ExhibitPro Contact <noreply@exhibitpro.ae>',
        to: [notificationEmail],
        subject: `New Contact Message: ${subject || 'No Subject'}`,
        html: `
          <h2>New message from your website</h2>
          <table>
            <tr><td><b>Name:</b></td><td>${name}</td></tr>
            <tr><td><b>Email:</b></td><td>${email}</td></tr>
            <tr><td><b>Phone:</b></td><td>${phone || '-'}</td></tr>
            <tr><td><b>Subject:</b></td><td>${subject || '-'}</td></tr>
            <tr><td><b>Message:</b></td><td>${message}</td></tr>
          </table>
        `,
      }),
    });
    
    if (!res.ok) {
        throw new Error('Resend API error');
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: 'Internal server error.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
