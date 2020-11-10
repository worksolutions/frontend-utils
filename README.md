# @worksolutions/utils

Утилиты для фронтенд приложений

---
### Установка

```bash
npm i @worksolutions/utils
```

### Demos

---

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

