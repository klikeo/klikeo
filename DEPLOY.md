# Klikeo - Guía de Deploy

## Pre-requisitos
- Cuenta en GitHub
- Cuenta en Vercel (frontend)
- Cuenta en Railway (backend)
- Cuenta en MongoDB Atlas

---

## Variables de Entorno Necesarias

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL=https://api.klikeo.co
```

### Backend (Railway)
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=genera-un-string-seguro-de-al-menos-32-caracteres
JWT_REFRESH_SECRET=genera-otro-string-seguro-de-al-menos-32-caracteres
DEEPSEEK_API_KEY=sk-...
WHATSAPP_TOKEN=...
WHATSAPP_PHONE_ID=...
WHATSAPP_VERIFY_TOKEN=...
WHATSAPP_APP_SECRET=...
PORT=3001
```

---

## Deploy del Frontend (Vercel)

1. **Conecta tu repositorio a Vercel:**
   - Ve a https://vercel.com
   - "Add New Project" → Import from GitHub
   - Selecciona el repositorio `klikeo`

2. **Configura el proyecto:**
   - Framework Preset: Next.js
   - Root Directory: `apps/web`
   - Build Command: `pnpm build`
   - Output Directory: `.next`

3. **Añade las variables de entorno:**
   - `NEXT_PUBLIC_API_URL` = URL de tu API en Railway (ej: https://api-klikeo.up.railway.app)

4. **Deploy:** Click en "Deploy"

---

## Deploy del Backend (Railway)

1. **Conecta tu repositorio a Railway:**
   - Ve a https://railway.app
   - "New Project" → "Deploy from GitHub"
   - Selecciona el repositorio `klikeo`

2. **Configura el proyecto:**
   - Root Directory: `apps/api`
   - Build Command: `pnpm build`
   - Start Command: `node dist/infra/server.js`

3. **Añade las variables de entorno:**
   - Todas las variables del backend listed above
   - **Importante:** Genera strings aleatorios para JWT_SECRET y JWT_REFRESH_SECRET:
     ```bash
     openssl rand -hex 32
     ```

4. **Deploy:** Click en "Deploy"

---

## Dominio Personalizado (Opcional)

### Vercel (Frontend)
1. Ve a Settings → Domains
2. Agrega tu dominio (ej: klikeo.co)
3. Configura los registros DNS en tu proveedor de dominio

### Railway (Backend)
1. Ve a Settings → Domains
2. Agrega un subdomain (ej: api.klikeo.co)
3. Apunta el CNAME a tu URL de Railway

---

## Verificación

Después del deploy:
1. Verifica que el frontend cargue en tu dominio
2. Prueba el registro de usuario
3. Verifica que la API responde correctamente
4. Revisa los logs en Vercel y Railway si hay errores

---

## Notas Importantes

- **MongoDB Atlas:** Asegúrate de agregar las IPs de Vercel y Railway al whitelist de Atlas
- **WhatsApp:** Necesitas configurar el Webhook en Meta Developer Portal apuntando a `TU_API_URL/api/webhooks/whatsapp`
- **DeepSeek:** Obtén tu API key en https://platform.deepseek.com