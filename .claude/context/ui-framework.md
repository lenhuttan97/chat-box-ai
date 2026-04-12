# UI Framework Guidelines — AI Chatbox Project

## Tổng quan
Frontend sử dụng **kết hợp MUI và Tailwind CSS** theo nguyên tắc:
- **MUI là xương sống (framework)**: Quản lý theme, cấu trúc UI, component base, màu sắc chính
- **Tailwind là da thịt (styling layer)**: Tùy chỉnh fine-grained, hiệu ứng, positioning, animation

## Mục tiêu thiết kế
- Duy trì **theme nhất quán** thông qua MUI theme system
- Tận dụng **linh hoạt của Tailwind** cho hiệu ứng UI phức tạp
- Kết hợp **tốc độ phát triển MUI** với **kiểm soát chi tiết của Tailwind**

## Quy tắc áp dụng

### 1. MUI — Xương sống (Skeleton)
- Sử dụng MUI cho:
  - Theme configuration (`theme.ts`)
  - Layout components (Container, Grid, Box)
  - Form controls cơ bản (Button, TextField, Dialog)
  - State management components (Menu, Popover, Snackbar)
  - Responsive breakpoints

### 2. Tailwind — Da thịt (Skin)
- Sử dụng Tailwind cho:
  - Custom styling (glassmorphism, backdrop blur)
  - Animation và transition (custom)
  - Positioning (flexbox, grid)
  - Color utilities (text, background)
  - Responsive adjustments

### 3. Cách phối hợp
```tsx
// ✅ Đúng: Kết hợp MUI skeleton + Tailwind skin
<Box className="p-4 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg">
  <Typography className="text-gray-800 font-medium">
    Nội dung sử dụng MUI
  </Typography>
  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
    Nút dùng cả MUI + Tailwind
  </Button>
</Box>

// ❌ Sai: Hoặc dùng hoàn toàn MUI, hoặc hoàn toàn Tailwind
```

### 4. Theme Integration
- MUI theme vẫn là nguồn chính cho màu sắc và spacing
- Tailwind chỉ bổ sung hiệu ứng không có trong MUI
- Không hardcode màu sắc trong Tailwind class, nên dùng theme từ MUI

### 5. Component Structure
- Các component lớn: Dùng MUI layout + Tailwind styling
- Các component nhỏ: Có thể dùng Tailwind hoàn toàn nếu phù hợp
- Giữ lại MUI Provider và ThemeProvider ở cấp cao nhất

## Ví dụ thực tế
```tsx
// Header.tsx - Kết hợp MUI + Tailwind
<ThemeProvider theme={theme}>
  <AppBar position="static" className="bg-white/80 backdrop-blur-md">
    <Toolbar className="flex items-center justify-between px-4 py-3">
      <Box className="flex items-center gap-3">
        <Avatar className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500">
          <SmartToyIcon className="text-white" />
        </Avatar>
        <Typography variant="h6" className="font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          AI Chat
        </Typography>
      </Box>
      
      <Button 
        variant="contained" 
        className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-2 rounded-full"
      >
        Get Started
      </Button>
    </Toolbar>
  </AppBar>
</ThemeProvider>
```

## Lưu ý quan trọng
- Không loại bỏ MUI khỏi project - giữ lại như là nền tảng UI
- Tailwind là lớp bổ sung, không thay thế hoàn toàn MUI
- Duy trì theme nhất quán giữa các màn hình
- Chỉ sử dụng Tailwind cho hiệu ứng và styling nâng cao