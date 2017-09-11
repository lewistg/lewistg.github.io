---
layout: post
title:  "Vimscript: Functions"
date: Tues Sept 19 00:00:00 MST 2017
excerpt: Vimscript supports user-defined functions. These functions offer a way to manage complexity in plugin scripts--just like functions in other programming contexts. This post covers their basic syntax and how to structure them in plugin scripts.
categories: vimscript
---

Writing Vim plugins often calls for writing custom functions. Luckily,
vimscript lets us do this. Functions in vimscript are capable of most things
you would expect: they can operate on parameters, can produce side effects, and
can return values. Vimscript even supports writing higher-order functions. To
use them safely and effectively in our plugin scripts, however, we have to know
how to organize them. If we are not careful, for example, we can easily start
redefining other plugins' functions. In this post, we will tackle basic
vimscript function syntax and also vimscript's rudimentary support for writing
modular plugin code, which lets us safely limit a function's scope.

## Basic syntax

Here is the basic vimscript function syntax (see `:help function` and
`:help user-functions`):

```viml
function[!] {name}([arguments])
    {commands}
endfunction
```

The function's name, the `{name}`, must start with a capital letter (or an
`s:`--which we will get to in the next section). Vim's manual explains that the
capital letter restriction prevents confusion with built-in functions, which
start with lowercase letters.

The body of the function, the `{commands}`, are a sequence of "Ex commands."
These are the commands you enter in normal mode by first typing `:`--the manual
will sometimes even refer to them as "colon commands," and in this post we do too.
In a function body you can omit the colons.

When Vim loads a plugin script, any functions declared with the optional `!` will overwrite
(or rather redefine) any previous same-named function within scope. (More on
this in a moment.)

## Within the plugin context

Plugins extend Vim's functionality through custom
key-mappings and custom colon commands (among other things). The simplest
plugins are the `.vim` script files we place in the directory `/home/.vim/plugin`
(if you are on a Unix machine). When Vim loads, it looks in the
this directory and sources any `.vim` files it finds. When Vim
finishes sourcing our plugin files, any functions we defined that follow the
basic syntax given in the last section become attached to the global scope, and
they can be invoked using the `:call` command. (Of course, it is unlikely you
will call functions this way. It is more useful to call functions as part of
some custom key mapping or custom colon command.)

If you have used other scripting languages, Vim's sourcing process should sound
familiar. In JavaScript, for example, when a browser loads a script file, any
functions (or variables) declared outside of another function scope get
attached to the global scope (i.e., the browser's `window` object). Also, like
vimscript, JavaScript's function names refer to the function declaration that
used the name last. For example, the following bit of valid JavaScript outputs
`Hola`.
```javascript
function sayHello() {
    console.log('Hello');
};

// Same name? Not a problem. Sayonara, previous definition.
function sayHello() {
    console.log('Hola');
};

sayHello(); // Outputs "Hola"
```

Another example is the Python REPL's `execfile` function, which sources a given
script, also with similar side effects to Vim's model.  Name
collisions among different scripts' functions is an obvious problem in this sourcing
process, but vimscript does provide a few mechanisms for dealing with it. 

### The `s:` scope annotation 

First, we can declare functions using the `s:` scope annotation. This limits a
function's scope to the file that declares it.  An `s:`-scoped function can be
used anywhere within the file but not without. For example, in the following
mini-plugin all functions have been marked with `s:` and are only available
within the `DoMyHw.vim` file. This is good since `s:gcd` in particular is so
generically named that some other script may define such a function and break
our plugin (or we there's).

```viml
" Contents of /home/.vim/plugin/DoMyHw.vim

function! s:solveGcdExpression()
    try
        " Note: cursor is at the end of the expression after marking limits
        call s:markExpressionLimits()
    catch
        echom "The cursor is not on a GCD expression"
        return
    endtry

    " `` moves cursor to the start of the expression
    normal v``y
    let l:expression = @"

    let [l:a, l:b] = matchlist(l:expression, s:EXP_BODY_PATTERN)[1:2]

    let l:answerString = " = " . s:gcd(l:a, l:b)

    " `` moves cursor to the end of the expression
    exec "normal ``a" . l:answerString . "\<ESC>"
endfunction

function! s:markExpressionLimits()
    let l:notOnExpression = "ERROR: Cursor not on a gcd expression"

    if (search(s:EXP_PREFIX_PATTERN, "sbc", line(".")) == 0)
        throw l:notOnExpression
    endif

    if (search(s:EXP_PATTERN, "se", line(".")) == 0)
        throw l:notOnExpression
    endif
endfunction

let s:EXP_PREFIX_PATTERN = '\(gcd(\|(\)'
let s:EXP_BODY_PATTERN = '\s*\(\d\+\)\s*,\s*\(\d\+\)\s*)'
let s:EXP_PATTERN = s:EXP_PREFIX_PATTERN . s:EXP_BODY_PATTERN

function! s:gcd(m, n)
    let [l:max, l:min] = sort([a:m, a:n], {a, b -> b - a})
    if l:min == 0
        return l:max
    else
        return s:gcd(l:min, l:max % l:min)
    endif
endfunction

" Public commands

command! SolveGcd :call s:solveGcdExpression()
nnoremap <Leader>sg :SolveGcd<CR>
```
In some sense `.vim` files act as modules where the file provides encapsulation
and where the global declarations are the module exports.

### Autoload scripts

The second mechanism for avoiding name collisions are "autoload" scripts. These
are scripts that we have placed in `/home/.vim/autoload`. Public functions in
autoload scripts have the syntax:

```viml
function[!] {filepath}#{name}([arguments])
    {commands}
endfunction
```

Notice we have the original function syntax with the addition of the `{filepath}#` prefix.
The `{filepath}` indicates the path to the script declaring the function
relative to the `/home/.vim/autoload` directory. The syntax for the path uses
`#` as directory separators instead of slashes. Also, we drop the script's
`.vim` extension in the file path.

When Vim encounters a function of this form, it finds and sources the file
`/home/.vim/autload{filepath}.vim`, replacing the `#`s in {filepath} with
`/`s. Thus, we avoid namespace collisions by having unique `{filepath}` prefixes.

These autload requirements functions are best understood by example. Below, is
the result of moving `s:gcd` to the autoload script `intmath.vim`.

```viml
" Contents of /home/.vim/autoload/intmath.vim

function! intmath#gcd(m, n)
    let [l:max, l:min] = sort([a:m, a:n], {a, b -> b - a})
    if l:min == 0
        return l:max
    else
        return intmath#gcd(l:min, l:max % l:min)
    endif
endfunction
```

This function is now called in the original `DoMyHw.vim` using the full name
`intmath#gcd`. (Note that `...` indicates sections of omitted code.)

```viml
" Contents of /home/.vim/plugin/DoMyHw.vim

function! s:solveGcdExpression()
    ...
    let l:answerString = " = " . intmath#gcd(l:a, l:b)
    ...
endfunction

...

" Public commands

command! SolveGcd :call s:solveGcdExpression()
nnoremap <Leader>sg :SolveGcd<CR>
```

Note that the relative path to `intmath.vim` under `/home/.vim/autoload` is simply
`intmath.vim`, so the function prefix is `intmath#`. If `intmath.vim` would
have been located at `/home/.vim/autoload/mymath/intfuncs.vim`, then our prefix
would have been `mymath#intfuncs#`, and we woud have called the function using
`mymath#intfuncs#gcd`.

This file-path-prefix scheme is roughly analogous to Java's package system
minus the use of import statements. Java package names correspond to a file
path.  Without import statements, we would have to refer to each function and
class in Java by its fully qualified package name. Thinking of autoload
script's in terms Java's package system, we can view Vim autoload scripts as
"packages," and we call functions from these packages using their fully
qualified name.

Vimscript functions are a good way to decompose plugin functionality. Like in
other scripting languages, sourcing vimscript presents some namespacing
issues, but hopefully this post has shown how vimscript's scoping and autoload
constructs help us modularize our code and keep the global namespace
unpolluted. At this point, it might be worth checking out the source code for
some nontrivial Vim plugins such as Tim Pope's git plugin
[fugitive](https://github.com/tpope/vim-fugitive) or Yosuke Kurami's TypeScript
plugin [tsuquyomi](https://github.com/Quramy/tsuquyomi) to see how this is done
at scale. Notice in particular how fugutive opts for a monolithic pugin file using
the `s:` annotation where tsuquyomi uses autoload scripts.
