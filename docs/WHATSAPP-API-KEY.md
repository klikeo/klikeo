# Guía: Obtener WhatsApp Business API Key

> Esta guía te muestra cómo obtener las credenciales de WhatsApp Business (Meta) para usar en Klikeo.

## ¿Qué es WhatsApp Business API?

La API de WhatsApp Business te permite:
- Enviar mensajes automatizados a tus clientes
- Recibir mensajes entrantes
- Usar templates oficiales para notificaciones
- Integrar con IA (DeepSeek) para respuestas automáticas

**Precios aproximados:**
- Conversaciones iniciadas por ti: ~$0.015 USD por mensaje
- Conversaciones iniciadas por el usuario: gratis dentro de las primeras 24h
- Templates: ~$0.005 - $0.09 USD por mensaje

---

## Paso 1: Crear cuenta en Meta for Developers

1. Ve a: **https://developers.facebook.com/**
2. Click en **"Mis apps"** → **"Crear app"**
3. Selecciona **"Otro tipo de app"** → **"Empresa"**
4. Completa:
   - Nombre del app (ej: `klikeo-chatbot`)
   - Email de contacto empresarial
   - Cuenta de Meta Business (si no tienes, sigue las instrucciones para crear una)

> **Nota**: Si no tienes una cuenta de Meta Business, ve a **https://business.facebook.com/** y crea una primero.

---

## Paso 2: Agregar producto WhatsApp

1. En el panel de tu app, scroll hasta **"Agregar productos a tu app"**
2. Busca **WhatsApp** y click en **"Configurar"**
3. Esto te lleva a la sección de WhatsApp en el menú lateral

```
Tu app
├── Panel
├── Roles
├── Configuración
├── Herramientas de desarrollo
└── WhatsApp
    ├── Overview
    ├── Configuración de API     ← Click aquí
    ├── Plantillas
    ├── Webhooks
    └── Conversaciones
```

---

## Paso 3: Obtener credenciales temporales

En la sección WhatsApp → **Configuración de API**:

Verás:
- **Token de acceso temporal** (vence en ~24h, pero sirve para testing)
- **Phone Number ID**
- **WhatsApp Business Account ID**

**Copia estos tres valores** — los vas a necesitar para el .env

---

## Paso 4: Configurar el número de WhatsApp

1. Ve a **"Configuración de API"** → **"Números de teléfono"**
2. Click en **"Agregar número de teléfono"**
3. Completa el wizard:
   - País: Colombia (+57)
   - WhatsApp: tu número real (para pruebas)
   - Nombre del negocio
   - Categoría (ej: "Tienda online", "Restaurante")
4. Meta te envía un código de verificación al número
5. Ingresa el código para confirmar

> **Importante**: Usa un número que NO esté vinculado a WhatsApp personal, o mejor yet, compra un número virtual para el negocio.

---

## Paso 5: Obtener Access Token permanente

El token temporal dura solo ~24 horas. Para producción:

1. Ve a **https://business.facebook.com/**
2. Selecciona tu empresa
3. **Configuración** → **Cuentas de WhatsApp** → **Tu WhatsApp Business Account**
4. **Configuración** → **Tokens de acceso**
5. Click en **"Generar token"**
6. Selecciona estos permisos mínimos:
   - `whatsapp_business_management`
   - `whatsapp_business_messaging`
   - `whatsapp_business_subscriber`

7. Copia el token generado

> **Nota**: Este token puede durar más tiempo, pero es buena práctica regenerarlo cada mes.

---

## Paso 6: Configurar Webhook (necesario para recibir mensajes)

1. En **"Configuración de API"**, busca **"Webhook"**
2. Click en **"Configurar webhook"**
3. Ingresa:
   - **URL de callback**: `https://tu-dominio.com/api/webhooks/whatsapp`
   - **Token de verificación**: cualquier string que definas (ej: `mi_verify_token_123`)

4. Click en **"Verificar y guardar"**
5. Suscribe el webhook al campo `messages` (messages → messages)

---

## Paso 7: Configurar en Klikeo

Editá el archivo `apps/api/.env` y agregá:

```bash
# WhatsApp Business API
WHATSAPP_TOKEN=EAAxxxxxxxxxxxxx  # Tu access token
WHATSAPP_PHONE_ID=123456789012345  # Phone Number ID
WHATSAPP_BUSINESS_ID=987654321098765  # WhatsApp Business Account ID
WHATSAPP_VERIFY_TOKEN=mi_verify_token_123  # El que definiste en el webhook
```

### Si estás en desarrollo local (ngrok)

Para recibir webhooks en localhost:

```bash
# Install ngrok si no lo tenés
npm install -g ngrok

# Levantar tunnel
ngrok http 3001

# La URL que te da (ej: https://abc123.ngrok.io)
# Usala como URL de callback en Meta
```

---

## Probar la API

### Enviar un mensaje de prueba

```bash
curl -X POST "https://graph.facebook.com/v21.0/YOUR_PHONE_ID/messages" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "573001234567",
    "type": "text",
    "text": {"body": "Hola desde Klikeo! 👋"}
  }'
```

Reemplaza:
- `YOUR_PHONE_ID` → tu Phone Number ID
- `YOUR_ACCESS_TOKEN` → tu Access Token
- `573001234567` → un número real (con código de Colombia)

### Verificar Webhook

Podés verificar que el webhook está configurado correctamente:

```bash
curl "https://graph.facebook.com/v21.0/YOUR_PHONE_ID?fields=phone_number" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Notas de seguridad

✅ **Nunca expongas** el token en código del cliente  
✅ **Regenerá el token** cada mes (configura un recordatorio)  
✅ **Limitá el acceso** a tu panel de Meta Business solo a quienes lo necesiten  
✅ **Si te疑似 phishing**, Meta nunca te pide tu token por email  
✅ **No uses WhatsApp personal** para el negocio — conseguí un número dedicado  

---

## Solución de problemas

### "Invalid OAuth access token"
- El token expiró → regenerate en Business Settings
- Verificá que el token tenga los permisos correctos

### "Phone number not verified"
- Confirmaste el código en el wizard? (Paso 4)
- El número ya está vinculado a otra cuenta de WhatsApp?

### "This API is not supported for your account"
- Tu cuenta de desarrollador necesita verificación
- Ve a **https://developers.facebook.com/** → **Mi app** → **Revisión de la app**

### "Message template quality score too low"
- Tu template fue rechazado por Meta
- Asegurate de seguir las políticas de WhatsApp Business

### Webhook no recibe mensajes
- Verificá que el webhook esté suscrito a `messages`
- Revisá los logs en **WhatsApp** → **Webhooks** → **Debug**

---

## Recursos

- **Documentación oficial**: https://developers.facebook.com/docs/whatsapp
- **Precios**: https://developers.facebook.com/docs/whatsapp/pricing
- **Políticas de templates**: https://developers.facebook.com/docs/whatsapp/message-templates
- **Debug de errores**: https://developers.facebook.com/docs/whatsapp/errors

---

## Siguiente paso

Una vez configurado, el webhook de WhatsApp debe apuntar a:

```
POST /api/webhooks/whatsapp
```

Este endpoint está en `apps/api/src/controllers/webhook.controller.ts`.

---

*Creado: Mayo 2026*
*Para Klikeo - Guía de integración WhatsApp Business API*