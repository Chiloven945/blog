---
title: 可以給 VN 用的對話描述文件……？
description: 閒著沒事搞的東西，存這了（ 算是某種可以給 vn 用的對話 / 舞台描述文件？？
date: 2025-11-18T01:54:47+08:00
type: article
categories:
  - 雜物
tags: []
---

閒著沒事搞的東西，存這了（  
算是某種可以給 vn 用的對話 / 舞台描述文件？？

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

不用寫一堆角括號，就是有些情況下沒有 XML 好用就是了

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

這東西真的不適合……
