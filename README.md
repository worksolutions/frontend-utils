# @worksolutions/utils

Утилиты для фронтенд приложений

---
### Установка

```bash
npm i @worksolutions/utils
```

### Demos

---

#### Decorators
###### provideRef

```typescript jsx
const ref1 = React.useRef<HTMLElement>();
function ref2(element: HTMLElement) {}

return <div ref={provideRef(ref1, ref2)} />
```

#### files
###### convertBytesToHumanReadableFormat
```typescript jsx
convertBytesToHumanReadableFormat(2048) // 2.0 кб
```

###### createFileInput
```typescript jsx
// createFileInput(multiply?: boolean, acceptTypes?: AcceptTypes[])
createFileInput(false, AcceptTypes.IMAGE)
```

###### convertFileToFileInterface
```typescript jsx
convertFileToFileInterface(instanceOfFile) // FileInterface
```

