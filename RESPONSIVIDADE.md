# 📱 **Guia de Responsividade - Axion Timesheet**

## 🎯 **Breakpoints Padrão**

```css
/* Mobile First - Sempre começar com mobile */
Base: 0px+     (mobile)
sm:  640px+    (tablet portrait)
md:  768px+    (tablet landscape) 
lg:  1024px+   (desktop pequeno)
xl:  1280px+   (desktop grande)
xs:  475px+    (mobile grande - customizado)
```

## 📐 **Layout Responsivo**

### **1. Container Principal**
```tsx
<main className="min-h-screen bg-background p-4 sm:p-6">
  {/* Padding 16px mobile, 24px tablet+ */}
</main>
```

### **2. Headers Responsivos**
```tsx
{/* Header Padrão */}
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
  <div className="min-w-0 flex-1">
    <h1 className="text-xl sm:text-2xl font-bold text-white truncate">Título</h1>
    <p className="text-sm sm:text-base text-gray-400 truncate">Subtítulo</p>
  </div>
  
  <button className="w-full sm:w-auto min-h-[44px] touch-manipulation">
    Botão
  </button>
</div>
```

### **3. Tabs Responsivas**
```tsx
{/* Tabs com scroll horizontal */}
<div className="border-b border-[#23232b] mb-4 sm:mb-6">
  <div className="flex space-x-4 sm:space-x-8 overflow-x-auto scrollbar-hide">
    <button className="flex items-center gap-2 py-3 px-2 sm:px-1 whitespace-nowrap flex-shrink-0">
      <Icon size={16} />
      <span className="hidden xs:inline sm:inline">Label</span>
    </button>
  </div>
</div>
```

### **4. Grids Responsivos**

#### **Cards de Métricas (4 colunas)**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
  {/* Cards */}
</div>
```

#### **Cards de Conteúdo (2-3 colunas)**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
  {/* Cards */}
</div>
```

#### **Formulários (2 colunas)**
```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
  {/* Campos */}
</div>
```

### **5. Filtros Responsivos**
```tsx
{/* Filtros Verticais no Mobile */}
<div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
  <Input className="w-full h-11" />
  <select className="w-full h-11" />
  <button className="w-full h-11 touch-manipulation">Filtros</button>
</div>
```

## 🎨 **Componentes Responsivos**

### **Botões Touch-Friendly**
```tsx
<button className="
  flex items-center justify-center gap-2 
  bg-[#23232b] border border-[#2a2a2a] text-white 
  font-medium px-4 py-2.5 rounded-xl 
  hover:bg-[#2a2a2a] hover:border-gray-600 
  transition-all duration-300 
  touch-manipulation min-h-[44px] 
  w-full sm:w-auto
">
  <Icon size={16} />
  <span>Texto</span>
</button>
```

### **Cards Responsivos**
```tsx
<Card className="bg-[#18181b] border border-[#23232b] hover:border-[#2a2a2a] transition-all">
  <CardContent className="p-4 sm:p-6">
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex-1 min-w-0">
        <h3 className="text-sm sm:text-base font-medium truncate">Título</h3>
        <p className="text-xs sm:text-sm text-gray-400 truncate">Descrição</p>
      </div>
    </div>
  </CardContent>
</Card>
```

### **Inputs Responsivos**
```tsx
<Input className="
  h-11 bg-[#23232b] border-[#23232b] text-white 
  rounded-xl focus:ring-blue-400 
  text-base w-full
" />
```

## 📝 **Regras de UX Mobile**

### **1. Touch Targets**
- **Mínimo 44px** de altura para botões
- `touch-manipulation` para melhor resposta
- Espaçamento adequado entre elementos

### **2. Textos Responsivos**
```tsx
{/* Tamanhos adaptativos */}
text-xs sm:text-sm     // 12px → 14px
text-sm sm:text-base   // 14px → 16px  
text-base sm:text-lg   // 16px → 18px
text-xl sm:text-2xl    // 20px → 24px
```

### **3. Espaçamentos**
```tsx
{/* Gaps e margins responsivos */}
gap-3 sm:gap-4         // 12px → 16px
mb-4 sm:mb-6          // 16px → 24px
p-4 sm:p-6            // 16px → 24px
space-y-3 sm:space-y-4 // 12px → 16px
```

### **4. Truncate e Overflow**
```tsx
{/* Textos longos */}
<p className="truncate">Texto longo</p>
<div className="min-w-0 flex-1">Content</div>
<div className="overflow-x-auto scrollbar-hide">Tabs</div>
```

## 🔧 **Classes Utilitárias Personalizadas**

### **Scroll Horizontal**
```css
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
```

### **Breakpoint XS (475px)**
```css
@media (min-width: 475px) {
  .xs\:inline { display: inline; }
}
```

## ✅ **Checklist de Responsividade**

Antes de criar uma nova tela, verificar:

- [ ] **Mobile First**: Design pensado primeiro para mobile
- [ ] **Touch Targets**: Botões com min 44px de altura
- [ ] **Grids Adaptativos**: grid-cols responsivos
- [ ] **Textos Escaláveis**: text-* responsivos  
- [ ] **Headers Flexíveis**: flex-col sm:flex-row
- [ ] **Filtros Verticais**: space-y no mobile
- [ ] **Tabs com Scroll**: overflow-x-auto
- [ ] **Truncate Textos**: Para evitar quebras
- [ ] **Gaps Responsivos**: gap-3 sm:gap-4
- [ ] **Padding Adaptativo**: p-4 sm:p-6

## 🎯 **Breakpoints por Tipo de Conteúdo**

| Tipo | Mobile | Tablet | Desktop |
|------|--------|--------|---------|
| Métricas | 1 col | 2 cols | 4 cols |
| Cards | 1 col | 2 cols | 3 cols |
| Formulários | 1 col | 1 col | 2 cols |
| Tabelas | Cards | Cards/Table | Table |
| Filtros | Vertical | Grid 2 | Grid 4 |

---

**📱 Todas as futuras telas devem seguir estes padrões para garantir consistência e excelente UX em todos os dispositivos!** 