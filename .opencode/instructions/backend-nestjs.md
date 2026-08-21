# Backend Rules (NestJS + Prisma)

## Module Structure
- Feature modules: `apps/backend/src/modules/<feature>/` — mỗi module có `*.module.ts`, `*.controller.ts`, `*.service.ts`, DTOs cùng thư mục
- Module mới phải đăng ký trong `app.module.ts`
- Controllers THIN: chỉ HTTP concerns (parse, validate, status code), delegate hết cho service. KHÔNG business logic trong controller, KHÔNG gọi PrismaService trực tiếp từ controller

## API Conventions
- Global prefix `api/v1` (`src/main.ts`: `setGlobalPrefix('api/v1')`) — mọi route mới tự động nằm dưới prefix này, KHÔNG tự thêm `/api/v1` vào `@Controller()`
- ValidationPipe global (`whitelist: true, transform: true`) — DTO dùng class-validator decorators (`@IsString`, `@IsOptional`...), không validate thủ công trong service
- REST verbs strict: POST create → 201, PATCH partial → 200, DELETE → 200/204

## Streaming (SSE)
- Chat streaming là SSE viết thủ công vào Express response trong `conversations.controller.ts` (`res.setHeader('Content-Type', 'text/event-stream')`, `res.write('data: ...\n\n')`)
- KHÔNG dùng `@Sse()` decorator — follow pattern hiện có khi touch streaming

## AI Providers
- Providers đăng ký trong `src/modules/ai/providers/ai-provider-factory.ts`: chỉ có **gemini** và **ollama** (README nhắc OpenAI nhưng KHÔNG tồn tại)
- Provider mới: implement interface `AIProvider` + đăng ký trong factory constructor; unknown name fallback về gemini
- Provider/model chọn per-conversation (`Conversation.provider`, default `gemini`)

## Query Discipline (N+1)
- KHÔNG gọi prisma query bên trong loop/stream/forEach — fetch batch trước (`findMany` với `where: { id: { in: [...] } }`), process sau
- Chỉ select/include những fields cần thiết, không lười `include: { ... }` sâu vô ích
