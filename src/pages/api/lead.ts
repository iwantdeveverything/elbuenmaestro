import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    // 1. Honeypot check (anti-spam)
    // The field in the UI is name="email_confirm"
    const honeypot = body.email_confirm;
    
    if (honeypot && typeof honeypot === 'string' && honeypot.trim() !== '') {
      // Deceive the bot by returning a 200 OK success response, but do not process
      return new Response(
        JSON.stringify({ success: true, message: "Lead received" }),
        { 
          status: 200, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // 2. Validate required fields
    const { name, email, phone, location, description } = body;
    
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return new Response(
        JSON.stringify({ success: false, message: "El campo 'Nombre' es requerido." }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!email || typeof email !== 'string' || email.trim() === '') {
      return new Response(
        JSON.stringify({ success: false, message: "El campo 'Correo Electrónico' es requerido." }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (!phone || typeof phone !== 'string' || phone.trim() === '') {
      return new Response(
        JSON.stringify({ success: false, message: "El campo 'Teléfono' es requerido." }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (!location || typeof location !== 'string' || location.trim() === '') {
      return new Response(
        JSON.stringify({ success: false, message: "El campo 'Ubicación' es requerido." }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (!description || typeof description !== 'string' || description.trim() === '') {
      return new Response(
        JSON.stringify({ success: false, message: "El campo 'Descripción' es requerido." }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // 3. Process the lead (Mock processing - log to server console)
    console.log(`[Lead Capture Success] Name: ${name}, Email: ${email}, Phone: ${phone}, Location: ${location}`);
    
    return new Response(
      JSON.stringify({ success: true, message: "Lead received" }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "La solicitud debe ser un JSON válido." }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
