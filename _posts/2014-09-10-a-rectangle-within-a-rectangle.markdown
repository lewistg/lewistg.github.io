---
layout: post
title:  "Snug Fitting Rectangles"
date:   2014-09-10 19:36:46
excerpt: Recently, I have been coming across the problem of scaling one rectangle to fit "snugly" within another rectangle. This post gives some formal reasoning behind one possible solution. 
categories: math 
---

### The problem

In 2D graphics, it is common to come across some variant of the following problem:

>Let \\(w_1, h_1\\) respectively be the width and height of box \\(B_1\\), and
>let \\(w_2, h_2\\) respectively be the width and height of box \\(B_2\\). Also, it is assumed that none of the dimensions are 0. Find
>a scale factor \\(a\\) such that either \\[a \cdot w_1 = w_2 \text{ and } a
>\cdot h_1 \leq h_2\\]
>or
>\\[a \cdot w_1 \leq w_2 \text{ and } a \cdot h_1 = h_2.\\]

Intuitively, you can think of this problem as finding the scale factor that scales \\(B_1\\) to fit snugly within \\(B_2\\) as illustrated in the following example.

#### *Example*

Here we have two boxes \\(B_1\\) and \\(B_2\\).

<img src="{{ site.url }}/assets/boxes.png" class="center" /> 

Finding the constant \\(a\\) that satisfies the above conditions, \\(B_1\\) can be scaled to fit snugly within \\(B_2\\) like so:

<img src="{{ site.url }}/assets/box_in_box.png" class="center" /> 

### Deducing \\(a\\)

The scale factor \\(a\\) can be quickly found by by comparing the aspect ratios of
\\(B_1\\) and \\(B_2\\). Either \\(\frac{w_1}{h_1} \geq \frac{w_2}{h_2}\\) or \\(\frac{w_1}{h_1} <
\frac{w_2}{h_2}\\). In each case, a short trail of implications can be followed leading to \\(a\\). 

#### *Case 1:* \\(\frac{w_1}{h_1} \geq \frac{w_2}{h_2}\\)

The inequality \\(\frac{w_1}{h_1} \geq \frac{w_2}{h_2}\\) may be rearranged
into \\(h_1 \cdot \frac{w_2}{w_1} \leq h_2\\). Noting that \\(w_1 \cdot
\frac{w_2}{w_1} = w_2\\), clearly \\(a = \frac{w_2}{w_1}\\).

#### *Case 2:* \\(\frac{w_1}{h_1} < \frac{w_2}{h_2}\\)

Rearranging \\(\frac{w_1}{h_1} < \frac{w_2}{h_2}\\) yields \\(w_1 \cdot
\frac{h_2}{h_1} < w_2\\), and note that \\(h_1 \cdot \frac{h_2}{h_1} = h_2\\).
Thus, \\(a = \frac{h_2}{h_1}\\).

### Conclusion

This brief post has illustrated how comparing aspect ratios can be used to
quickly scale one rectangle to fit inside another. It is not the most earth-shattering result but may be helpful when coding up certain graphical
programs. 

