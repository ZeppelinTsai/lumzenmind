import { Router } from 'itty-router';

const router = Router();

// 根目錄
router.get('/', () => {
  return new Response('Cloudinary Uploader is Running 🚀', {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/plain',
    },
  });
});

// Preflight CORS
router.options('/upload', () => {
  console.log("Preflight CORS check triggered");
  return new Response("Preflight OK", {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
});

// 處理上傳
router.post('/upload', async (request) => {
  console.log("Upload route triggered");

  try {
    const formData = await request.formData();
    console.log("[DEBUG] formData keys:", Array.from(formData.keys()));

    const file = formData.get('file');
    if (!file) {
      console.error("[ERROR] No file found in formData");
      return new Response('No file provided', { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    console.log("[DEBUG] Buffer size:", buffer.length);

    // Cloudinary URL 組成
    const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    const cloudinaryFormData = new FormData();
    
    cloudinaryFormData.append('file', new Blob([buffer], { type: file.type }), file.name);
    cloudinaryFormData.append('upload_preset', UPLOAD_PRESET);

    console.log("[DEBUG] Sending POST request to Cloudinary...");

    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: cloudinaryFormData,
    });

    console.log("[DEBUG] Cloudinary response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[ERROR] Cloudinary API Error:", errorText);
      return new Response(errorText, {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const result = await response.json();
    console.log("[SUCCESS] Upload successful", result);

    return new Response(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      status: 200,
    });

  } catch (err) {
    console.error('[ERROR] Upload failed:', err.message);
    return new Response(`Upload failed: ${err.message}`, {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
});

addEventListener('fetch', (event) => {
  event.respondWith(router.handle(event.request));
});
