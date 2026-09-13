---
title: A Dialogue Description File That Can Be Used for a VN...?
description: Something I tinkered with when I was bored, storing it here It’s basically some kind of dialogue/stage description file that could be used for a VN??
date: 2025-11-18T01:54:47+08:00
subtype: experiment
status: published
tags:
  - Misc
---

Something I tinkered with when I was bored, storing it here It’s basically some kind of
dialogue/stage description file that could be used for a VN??

### XML

XML is really handy 💀💀💀

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

No need to write a bunch of angle brackets, though in some cases it’s still not as handy as XML

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

This really isn’t suitable...

