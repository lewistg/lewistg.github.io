---
layout: post
title:  "Manual Neovim Plugin Management"
date:  Fri Aug 23 20:14:00 MST 2024 
excerpt: 
    In Linux you can limit a process's resource consumption using a kernel feature called "cgroups."
    In this post we use a simple example to cover the basics of version 2 of this feature (cgroup v2).
categories: linux
---

Recently I installed [fzf-lua](https://github.com/ibhagwan/fzf-lua?tab=readme-ov-file), a popular plugin that integrates Neovim with fzf.
The installation instructions for this plugin gave snippets for installing the plugin via one of three popular plugin managers.
This is typical of most plugin installation instructions I've come across.
The tendency to push users toward plugin managers may leave the impression you can't install a plugin without one.
This is not the case.
You can get quite far with plain old git, and this post shows how.
More than just providing a recipe for using git, we'll take a slightly deeper dive into some of the hows and whys.

## XDG Base Directories

Prior to Neovim I used vim, which I configured using the standard `~/.vimrc` file.
When I picked up Neovim, I was confused by the move to `~/.config/nvim/init.vim`.
Why no `~/.nvimrc` file?

It turns out Neovim follows a modern standard from the X Desktop Group outlined in the [XDG Base Directory Specification](https://specifications.freedesktop.org/basedir-spec/latest/index.html) (see `:help base-directories`).
This specification prescribes a directory structure for programs to store various types of user-specific files.

Practically speaking, the directories described in the spec are a set of hidden directories in your home directory. For example,
`~/.config/$PROGRAM` is meant for a program's config files, which is how we get `~/.config/nvim/init.vim`.

The base directory spec also sets apart `~/.local/share/$PROGRAM` as a directory where user-specific "data files" can be stored.
This includes Neovim plugins.
Eventually we'll be cloning the plugins we'd like to install into a subdirectory of `~/.local/share/nvim`.

## Plugins and packages

Let's shift gears for a moment and talk about plugins and packages.

### Plugins

In the simplest sense, a "plugin" is just a "Vim script [or Lua] file that is loaded automatically when [Neovim] starts" (`:help plugin`).
The `plugin` help page goes on to suggest putting your plugins in the `~/.local/share/nvim/site/plugin` directory.

If you browse "plugins" on GitHub, however, you'll find repositories containing some subset of the following directory structure:
```
+
|
+-- plugin
|   |
|   +-- *.vim, *.lua files loaded on start
|
+-- autoload
|   |
|   +-- *.vim, *.lua files loaded lazily
|
+-- ftplugin
|   |
|   +-- *.vim, *.lua files loaded based upon file type
|
+-- doc
    |
    +-- *.txt plugin help files
```
To me the entire directory structure with it's multiple source files constitutes a "plugin."

### Packages

A "package" is "a directory that contains plugins" (`:help package`).
Note that "plugin" refers to our expanded, multi-directory definition of the term we just covered.

Packages have the following directory structure:

```
foo-package
|
+-- start
|   |
|   +-- plugin1
|   | 
|   +-- plugin2
|   |
|  ...
|   |
|   +-- pluginN
|
+-- opt
    |
    +-- optPlugin1
    |
    +-- optPlugin2
    |
   ...
    |
    +-- optPluginN
```

Upon startup, Neovim searches for packages and loads all of the plugins in the package's `start` directory. ("start" for startup plugins we can assume.)
The `opt` plugins can be optionally loaded later.

One of the most common places to put packages is in the `~/.local/share/nvim/site/pack` directory. (I wish I could offer some insight into why "site", but the base directory makes not mention of it.)

As an example, let's take a moment and make a simple package:

1. First let's make the package directory. We'll call it foo:
```
mkdir -p ~/.local/share/nvim/site/pack/foo
```
2. Next we'll add a directory for the startup plugins:
```
mkdir -p ~/.local/share/nvim/site/pack/foo/start
```
3. Now let's a simple `bar` plugin:
```
mkdir -p ~/.local/share/nvim/site/pack/foo/start/bar/plugin
echo "command Bar :echom 'Hello from bar '" > ~/.local/share/nvim/site/pack/foo/start/bar/plugin/bar.vim
```
4. Likewise let's add a `baz` plugin:
```
mkdir -p ~/.local/share/nvim/site/pack/foo/start/baz/plugin
echo "command Baz :echom 'Hello from baz '" > ~/.local/share/nvim/site/pack/foo/start/bar/plugin/baz.vim
```

Now, if you open up neovim and execute the command `:Bar` or `:Baz` you should see a friendly hello message.

## Managing plugins with git

Managing plugins with git essentially follows the same process outlined in our example.
First, we create a package for all of our plugins.
On my machine, the package is named `my-plugins`.
Next, we "install" plugins by cloning them into the package's `start` directory.
For example, here's my plugins one one my machines:
```
~/.local/share/nvim/site/pack/my-plugins
|
+-- start
    |
    +-- fzf-lua
    |
    +-- nvim-treesitter
    |
    +-- nvim-treesitter-scala
    |
    +-- vazel.nvim
    |
    +-- vim-fugitive
```
Each of the listed plugins were simply cloned from GitHub.

### Generating docs

One thing to note. 
If a plugin you clone has help pages, then you're probably going to need regenerate "help tags."
Help tags allow us to jump to a plugin's documentation through the `:help` command.
To regenerate the tags you can use the command `:helptags ALL`.
