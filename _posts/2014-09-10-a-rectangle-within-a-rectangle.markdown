---
layout: post
title:  "Snug Fitting Rectangles"
date:   2014-09-10 19:36:46
excerpt: Recently, I have been coming across the problem of scaling one rectangle to fit "snugly" within another rectangle. This post gives some formal reasoning behind one solution. 
categories: general 
---

### The problem

In 2D graphics, it is common to come across some variant of the following problem:

>Let \\(w\_1, h\_1\\) respectively be the width and height of box \\(B\_1\\), and
>let \\(w\_2, h\_2\\) respectively be the width and height of box \\(B\_2\\). Also, it is assumed that none of the dimensions are 0. Find
>a scale factor \\(a\\) such that either \\[a \cdot w\_1 = w\_2 \text{ and } a
>\cdot h\_1 \leq h\_2\\]
>or
>\\[a \cdot w\_1 \leq w\_2 \text{ and } a \cdot h\_1 = h\_2.\\]

Intuitively, you can think of this problem as finding the scale factor that scales \\(B\_1\\) to fit snugly within \\(B\_2\\) as illustrated in the following example.

#### *Example*

Here we have two boxes \\(B\_1\\) and \\(B\_2\\).

<img src="{{ site.url }}/assets/boxes.png" class="center" /> 

Finding the constant \\(a\\) that satisfies the above conditions, \\(B\_1\\) can be scaled to fit snugly within \\(B\_2\\) like so:

<img src="{{ site.url }}/assets/box_in_box.png" class="center" /> 

### Deducing \\(a\\)

The scale factor \\(a\\) can be quickly found by by comparing the aspect ratios of
\\(B\_1\\) and \\(B\_2\\). Either \\(\frac{w\_1}{h\_1} \geq \frac{w\_2}{h\_2}\\) or \\(\frac{w\_1}{h\_1} <
\frac{w\_2}{h\_2}\\). In each case, a short trail of implications can be followed leading to \\(a\\). 

#### *Case 1:* \\(\frac{w\_1}{h\_1} \geq \frac{w\_2}{h\_2}\\)

The inequality \\(\frac{w\_1}{h\_1} \geq \frac{w\_2}{h\_2}\\) may be rearranged
into \\(h\_1 \cdot \frac{w\_2}{w\_1} \leq h\_2\\). Noting that \\(w\_1 \cdot
\frac{w\_2}{w\_1} = w\_2\\), clearly \\(a = \frac{w\_2}{w\_1}\\).

#### *Case 2:* \\(\frac{w\_1}{h\_1} < \frac{w\_2}{h\_2}\\)

Rearranging \\(\frac{w\_1}{h\_1} < \frac{w\_2}{h\_2}\\) yields \\(w\_1 \cdot
\frac{h\_2}{h\_1} < w\_2\\), and note that \\(h\_1 \cdot \frac{h\_2}{h\_1} = h\_2\\).
Thus, \\(a = \frac{h\_2}{h\_1}\\).

### Conclusion

This brief post has illustrated how comparing aspect ratios can be used to
quickly scale one rectangle to fit inside another. It is not the most earth-shattering result but may be helpful when coding up certain graphical
programs. 

