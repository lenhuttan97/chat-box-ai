# MUI + Tailwind Hybrid Pattern

## Nguyên tắc

**KHÔNG** chuyển đổi hoàn toàn từ MUI sang Tailwind. Thay vào đó, kết hợp cả hai theo nguyên tắc:

```
MUI = xương sống (skeleton)
Tailwind = da thịt (skin)
MUI = người định hình về theme, cấu trúc, màu sắc
```

## Vai trò mỗi công nghệ

| Layer | Công nghệ | Trách nhiệm |
|-------|-----------|------------|
| **Structure** | MUI (Box, Stack, Grid) | Layout, spacing, responsive breakpoints |
| **Theme** | MUI ThemeProvider | Colors, typography, spacing scale, dark mode |
| **Components** | MUI Components | Button, Menu, Modal, Drawer, v.v. |
| **Styling** | Tailwind | Fine-tune: animations, hovers, custom visuals |

## Ví dụ đúng

```tsx
// ✅ Đúng: MUI là layout, Tailwind là styling
<Box 
  className="relative p-4"  // MUI structure + Tailwind padding
>
  <Stack className="gap-2">  // MUI layout + Tailwind gap
    <Button 
      className="bg-emerald-500 hover:bg-emerald-400 transition-all"
      startIcon={<Icon />}
    >
      Submit
    </Button>
  </Stack>
</Box>
```

```tsx
// ✅ Đúng: MUI cho theme + dark mode tự động
<Box sx={{ bgcolor: 'background.paper' }}>
  {/* MUI tự động handle dark/light mode */}
  <Typography color="text.primary">Title</Typography>
</Box>
```

## Ví dụ sai

```tsx
// ❌ Sai: Chuyển toàn bộ MUI → Tailwind
<div className="flex flex-col gap-2 p-4">
  <button className="...">Button</button>  {/* Mất MUI features */}
</div>
```

```tsx
// ❌ Sai: Tailwind toàn bộ, mất theme
<div className="bg-gray-900 text-white">  {/* Không có dark mode */}
```

## Migration Checklist

Khi migrate hoặc tạo component mới:

- [ ] Sử dụng MUI `Box`, `Stack`, `Grid` cho layout
- [ ] Sử dụng MUI theme tokens (`colors.primary`, `spacing`)
- [ ] Giữ MUI components (Button, Menu, Modal) cho accessibility
- [ ] Thêm Tailwind cho animations, transitions, custom styles
- [ ] Đảm bảo dark mode hoạt động qua MUI theme

## Tailwind Config Integration

Tailwind sử dụng CSS variables từ MUI theme:

```js
// tailwind.config.js
colors: {
  accent: 'var(--accent-primary)',  // Từ MUI theme
  bg: {
    primary: 'var(--bg-primary)',   // Từ MUI theme
  }
}
```

## Override quy tắc này

Chỉ override khi:
- MUI không hỗ trợ feature cần thiết (VD: custom animations)
- Cần fine-tune performance cho complex animations
- Component thuần Tailwind đơn giản hơn (VD: landing page)