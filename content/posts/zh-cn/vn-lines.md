---
title: 可以给 VN 用的对话描述文件……？
description: 闲着没事搞的东西，存这了（ 算是某种可以给 vn 用的对话 / 舞台描述文件？？
date: 2025-11-18T01:54:47+08:00
type: article
categories:
  - 杂物
tags: []
---

闲着没事搞的东西，存这了（  
算是某种可以给 vn 用的对话 / 舞台描述文件？？

### XML

XML 是真的好用啊（（

```xml
<?xml version="1.0" encoding="UTF-8"?>
<stage id="game:stage1">
    <characters>
        <char id="a">A</char>
        <char id="b" type="1">game:b</char>
        <!-- Simplified-->
        <c type="2">C</c>
        <d>game:d</d>
    </characters>

    <!-- Components in <[component] [params...]>[value]</[component]> -->
    <sequence>
        <!-- line only <char>value</char> -->
        <a>test</a>

        <line id="b">test 1 2 3 4 57</line>
        <event id="game:trigger">123</event>
    </sequence>
</stage>
```

### YAML

不用写一堆尖括号，就是有些情况下没有 XML 好用就是了

```yaml
stage:
  id: "game:stage1"

  characters:
    # char: is deletable when no simplified form is used. Array / Map
    char:
      - id: "a"
        value: "A"
      - id: "b"
        value: "game:b"
        type: "1"
    # simplified form is limited to id and value only!
    c: "C"
    d: "game:d"

  sequence:
    # line only <character>: <value>
    - a: "test"

    # Full version
    - line:
        id: "b"
        value: "test 1 2 3 4 57"

    - event:
        id: "game:trigger"
        value: "123"

    # General simplified form, limited to id and value only!
    - line:
        b: "test"
    
    - event:
        game:trigger: "1234"
```

### JSON

这东西真的不适合……
