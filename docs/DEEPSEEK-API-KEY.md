# Guía: Obtener DeepSeek API Key

> Esta guía te muestra cómo obtener tu API key de DeepSeek para usar en Klikeo.

## ¿Qué es DeepSeek?

DeepSeek es una alternativa a OpenAI (GPT) que ofrece modelos de lenguaje similares pero a una fracción del costo (~90% más barato).

**Precios aproximados:**
- DeepSeek Chat: $0.14 USD por millón de tokens
- DeepSeek Reasoner: $0.40 USD por millón de tokens

---

## Paso 1: Crear cuenta en DeepSeek

1. Ve a: **https://platform.deepseek.com/**
2. Click en **"Sign Up"**
3. Registrate con:
   - Email y contraseña, O
   - Cuenta Google, O
   - Cuenta GitHub
4. Verificá tu email si es necesario

---

## Paso 2: Obtener tu API Key

### 2.1 Acceder al panel

Una vez logueado, verás el panel de control. En el menú lateral:

```
├── Chat
├── API Keys          ← Click aquí
├── Usage
├── Top Up
└── Settings
```

### 2.2 Crear una nueva API Key

1. Click en **"API Keys"**
2. Click en el botón **"Create API Key"**
3. En "Key Name" poné un nombre descriptivo:
   
   ```
   Ejemplo: klikeo-produccion
   ```

4. En "Expiration" podés elegir:
   - **No expiration** (recomendado para producción)
   - 7 days / 30 days / 90 days (para testing)

5. Click en **"Create"**

### 2.3 ⚠️ IMPORTANTE: COPIAR LA KEY

**La key SOLO se muestra una vez.** No vas a poder verla de nuevo.

```
Tu API key se verá así:
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Copia y guarda en un lugar seguro.**

---

## Paso 3: Agregar crédito (opcional)

DeepSeek incluye **$2 USD gratuitos** para probar.

Para ver tu saldo:
- Click en **"Top Up"** en el menú lateral
- там，你会发现 tu balance actual

Si necesitás más:
- Seleccioná el monto (ej: $10, $50, $100)
- Agregá tu método de pago

---

## Paso 4: Configurar en Klikeo

### 4.1 Editar el archivo .env

Abrí el archivo `apps/api/.env` y agregá:

```bash
# DeepSeek API
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4.2 Reiniciar la API

Si tenés la API corriendo, reiniciá para que tome la nueva variable:

```bash
# Ctrl+C para detener
pnpm dev:api
```

---

## Probar la API

Podés hacer una prueba rápida con curl:

```bash
curl https://api.deepseek.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_API_KEY" \
  -d '{
    "model": "deepseek-chat",
    "messages": [{"role": "user", "content": "Hola, cómo estás?"}],
    "max_tokens": 100
  }'
```

---

## Notas de seguridad

✅ **Nunca compartas tu API key**  
✅ **No la subas a GitHub** (ya está en .gitignore)  
✅ **Si la perdés**, tenés que crear otra nueva  
✅ **Podés eliminar keys** desde el panel de DeepSeek  

---

## Solución de problemas

### "Invalid API Key"
- Verificá que copiaste correctamente la key
- Asegurate que no tenga espacios extra

### "Insufficient quota"
- Tu crédito se terminó
- Ve a "Top Up" para agregar más

### "Rate limit exceeded"
- Estás haciendo demasiadas peticiones
- Esperá un momento o usa un plan mayor

---

## Recursos

- **Documentación oficial**: https://platform.deepseek.com/docs
- **Precios**: https://platform.deepseek.com/pricing
- **Modelos disponibles**: https://platform.deepseek.com/docs/model-list

---

*Creado: Mayo 2026*
*Para Klikeo - Guía de integración DeepSeek*