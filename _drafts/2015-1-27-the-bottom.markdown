---
layout: post
title:  "The Never Ending Bottom"
date:  Mon Feb 26 16:51:31 MST 2015 
excerpt: The "bottom" is a concept used to describe laziness in functional programming. Connecting this abstract idea to a few practical examples helps clarify its meaning.
categories: learning-fp 
---

Simply put, "bottom" is a generic name given to an expression that never finishes executing. For example, we might say, "An infinite loop evaluates to bottom." Symbolically, this can be expressed as follows:

\\(\frac{w_1}{h_1} \geq \frac{w_2}{h_2}\\)

The bottom is a useful idea for describing "strict" and "non-strict" functions.
Strict functions evaluate to bottom whenever they are given arguments that
evaluate to bottom; if this is not the case, then we say the function is
"non-strict". 

Scala makes the distinction between strict and non-strict functions explicit.
