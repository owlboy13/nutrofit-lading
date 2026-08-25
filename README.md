# NutroFit — IA Nutricional via WhatsApp

> SaaS B2B em produção que automatiza o acompanhamento nutricional de pacientes via WhatsApp com inteligência artificial.

Este repositório contém a **landing page** do NutroFit. O backend é privado e está em produção.

---

## O que é

Nutricionistas e nutrólogos contratam o NutroFit para automatizar o atendimento dos seus pacientes via WhatsApp. A IA responde dúvidas sobre dieta, analisa fotos de refeições, registra histórico e envia balanço diário — tudo integrado ao painel web do médico.

**Modelo de negócio:**

| Plano | Valor | Limite |
|-------|-------|--------|
| Básico | R$ 99/mês | 20 pacientes |
| Premium | R$ 199/mês | Ilimitado |
| White-label | R$ 299/mês + R$ 1.000 setup | Ilimitado + branding próprio |

---

## Stack do Backend

| Camada | Tecnologia |
|--------|-----------|
| Backend | Django 6 + Python 3.12 |
| Banco de dados | PostgreSQL (Railway) |
| Tarefas assíncronas | Celery + Redis |
| Tarefas agendadas | django-celery-beat |
| IA | OpenAI GPT (modelo configurável via env) |
| WhatsApp | Twilio WhatsApp Business API |
| Pagamentos | MercadoPago (assinatura recorrente + PIX) |
| Email | Resend via django-anymail |
| Deploy | Railway Pro |
| Segurança de borda | Cloudflare WAF |
| Arquivos estáticos | WhiteNoise |

---

## Arquitetura

O backend é organizado em apps Django com responsabilidades bem definidas:

```
nutrofit-backend/
├── accounts/       # User customizado (user_type: medico | super_admin)
├── medicos/        # PerfilMedico, ConfiguracaoClinica, context processors
├── pacientes/      # Paciente, planos de dieta, controle de IMC
├── ia/             # services.py (OpenAI), prompts.py, context_builder.py
├── whatsapp/       # Processamento de mensagens, roteamento Twilio, templates
├── pagamentos/     # Webhook MercadoPago, assinaturas, PIX, convites
├── checkin/        # Formulário público de check-in pré-sessão (white-label)
└── config/         # settings.py, urls.py, celery.py, middleware.py
```

---

## Funcionalidades principais

### IA via WhatsApp
- Responde dúvidas dos pacientes 24/7 com base no plano alimentar montado pelo médico
- Analisa fotos de refeições via visão computacional (OpenAI)
- Menu interativo: paciente envia "menu" e recebe opções numeradas
- Instruções personalizadas por médico — tom de comunicação, protocolos clínicos

### Automações com Celery
- **Balanço diário (22h):** resumo nutricional enviado para cada paciente via WhatsApp
- **Lembrete de inatividade (10h):** detecta pacientes sem interação há 48h e reengage automaticamente
- **Verificação de assinaturas (01h):** suspende automaticamente assinaturas vencidas
- **Alerta de custo OpenAI (segunda 09h):** monitora gastos de IA por email

### Pagamentos
- Fluxo completo: landing page → MercadoPago → webhook → Celery → conta criada automaticamente
- Suporte a assinatura recorrente (cartão) e PIX avulso
- Renovação antecipada preserva dias restantes da assinatura atual
- Webhook seguro: token secreto no path da URL + verificação secundária via API do MP

### Programa de indicação
- Médico indica colega informando CRM+UF no cadastro
- Básico indicado: +10% de desconto | Premium: +20% | Acumula até 100% (mês grátis)
- Desconto aplicado automaticamente no próximo PIX gerado

### White-label
- Clínica com branding próprio: logo, cor, nome da assistente, número Twilio dedicado
- Termo de consentimento LGPD enviado automaticamente no primeiro contato via WhatsApp
- Controle de período de uso da IA por paciente (3m / 6m / 12m / personalizado)
- Check-in pré-sessão: formulário público acessado via QR code, aprovação pelo médico no painel

### Segurança
- **Cloudflare WAF:** bloqueio de tráfego fora do BR, rate limiting, bot fight mode, bloqueio de scanners
- **Django Middleware:** segunda camada — bloqueia paths sensíveis (`.env`, `.php`, `.git`) com 403
- **PostgreSQL:** endpoint público removido — acesso apenas pela rede interna do Railway
- **2FA** na conta Railway

---

## Decisões técnicas relevantes

**Por que Celery?**
O processamento de mensagens WhatsApp precisa ser assíncrono — o webhook do Twilio exige resposta em menos de 5s, enquanto a chamada à OpenAI pode levar até 30s. Celery desacopla o recebimento do processamento, evitando timeouts.

**Roteamento de WhatsApp por clínica**
O campo `To` do webhook Twilio indica para qual número a mensagem foi enviada. O sistema usa esse campo para identificar a clínica (white-label) e filtrar o paciente correto, permitindo múltiplos números dedicados no mesmo backend.

**Webhook MercadoPago sem HMAC**
O Cloudflare substituía o header `X-Request-Id` usado no cálculo do HMAC, tornando a validação impossível. A segurança é garantida por token secreto no path da URL + verificação secundária consultando a API do MP diretamente.

**Altura do paciente em centímetros**
Campo migrado de metros para centímetros (migration com `RunPython`) para evitar overflow numérico em `NUMERIC(4,2)` — pacientes com ≥ 100cm causavam erro no PostgreSQL. A view normaliza a entrada automaticamente: aceita `1,75`, `1.75` ou `175`.

---

## Status

Em produção desde 2026 com clientes reais (nutricionistas e nutrólogos).

- Clientes ativos: 10+ médicos
- Pacientes atendidos: 1.000+
- Uptime: 99.9% (Railway Pro)
- White-label em produção: Belle Dose Care

---

## Sobre este repositório

Este repositório contém apenas a landing page estática (HTML + Tailwind CSS + JS vanilla), carregada via componentes dinâmicos.

**Desenvolvido por Anderson Luiz**  
Back-end Developer — Python | Django | Celery | PostgreSQL
