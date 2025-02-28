# [VS Code — Как установить любое расширение оффлайн. Скачать VSIX и установить.](https://bruzh.wordpress.com/2017/06/02/vs-code-%D0%BA%D0%B0%D0%BA-%D1%83%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%B8%D1%82%D1%8C-%D0%BB%D1%8E%D0%B1%D0%BE%D0%B5-%D1%80%D0%B0%D1%81%D1%88%D0%B8%D1%80%D0%B5%D0%BD%D0%B8%D0%B5-%D0%BE%D1%84%D1%84/)

## Шаблон для вставки URL

В данный шаблон нужно будет вставить вместо переменных нужные значения из `url` нужного расширения

```
${publisher} = ?
${extension_name} = ?
${version} = ?
```

```
https://${publisher}.gallery.vsassets.io/_apis/public/gallery/publisher/${publisher}/extension/${extension_name}/${version}/assetbyname/Microsoft.VisualStudio.Services.VSIXPackage
```

### Мой пример для скачивания — C# for Visual Studio Code (powered by OmniSharp).

```
https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp
${publisher} = ms-vscode
${extension_name} = csharp
${version} = 1.10.0
```

### Url измененный для скачивания.

```
http://ms-vscode.gallery.vsassets.io/_apis/public/gallery/publisher/ms-vscode/extension/csharp/1.10.0/assetbyname/Microsoft.VisualStudio.Services.VSIXPackage
```

### Устанавливаем расширение из файла

Далее переименовываем данный файл в расширение vsix. В моём случае получилось `Microsoft.VisualStudio.Services.VSIXPackage.vsix`

> У меня получилось установить просто перетащив файл в окно плагинов VSCode.

Далее открываем VsCode в этой папке
И запускаем установку следующей командой

```
code —install-extension  Microsoft.VisualStudio.Services.VSIXPackage.vsix
```

![alt text](https://bruzh.wordpress.com/wp-content/uploads/2017/06/2017-06-02-16_45_15-d__files_portable_essentialpim-pro_database_mypim_restored-epim-essentialpim-p3.png)

Success!!!

<hr>

## GitHub.copilot

### [GitHub.copilot-chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat)

```
https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp
${publisher} = GitHub
${extension_name} = copilot-chat
${version} = 0.25.2025022801
```

Получилась ссылка для скачивания:

```
https://GitHub.gallery.vsassets.io/_apis/public/gallery/publisher/GitHub/extension/copilot-chat/0.25.2025022801/assetbyname/Microsoft.VisualStudio.Services.VSIXPackage
```

### [GitHub.copilot](https://marketplace.visualstudio.com/items?itemName=)

```
https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp
${publisher} = GitHub
${extension_name} = copilot
${version} =  	1.276.1403
```

Получилась ссылка для скачивания:

```
https://GitHub.gallery.vsassets.io/_apis/public/gallery/publisher/GitHub/extension/copilot/1.276.1403/assetbyname/Microsoft.VisualStudio.Services.VSIXPackage
```

1.82.15

```
https://GitHub.gallery.vsassets.io/_apis/public/gallery/publisher/GitHub/extension/copilot/1.82.15/assetbyname/Microsoft.VisualStudio.Services.VSIXPackage
```
