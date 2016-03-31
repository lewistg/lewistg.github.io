---
layout: post
title:  "Logrithmic Exponentiation: SICP 1.16"
excerpt: Working my way through Structure and Interpretation of Computer Programs, I have decided to write about a few of the solutions to the exercises. Recently, I solved exercise 1.16, which tackles iterative exponentiation.
categories: general
---

This post describes a solution to Structure and Intepretation of Programs'
exercise 1.16 and how it relates to binary number
representations.

# The problem statement

Exercise 1.16's is stated as follows:

>Design a procedure that evolves an iterative exponentation process that uses successive squaring and uses a logarithmic number of steps, as does fast-expt.  (Hint: Using the observation that \\((b^{n/2})^2 = (b^2)^{n/2}\\), keep, along with the exponent \\(n\\) and base \\(b\\), an additional state variable \\(a\\), and define the state transformation in such a way that the product \\(ab^n\\) is unchanged from state to state. At the beginning of the process \\(a\\) is taken to be 1, and the answer is given by the value of \\(a\\) at the end of the process. In general, the technique of defining an invariant quantity that remains unchanged from state to state is a powerful way of to think about the design of iterative algorithms.)

It is worth noting  that at this point in the text, the authors, Abelson and Sussman, have already given
recursive solution, which can be found here. Our task is to provide an
equivalent iterative solution.

# The solution

Given the hint, we can modify the recursive solution's rule to be the following:
$$b^n = (b^2)^{n/2} \text{ when $n$ is even}$$
$$b^n = b \cdot b^{n-1} \text{ when $n$ is odd}$$
The book's recursive solution "stores" the factors it finally uses to calculate
$b^n$ in its deferred expressions. Our iterative solution must store them in
the state variable $a$, which we will treat as a running product. We use the
following rule for $a$:
$$a = b \cdot a \text{ when $n$ is odd}$$
We can translate these rules into the following procedure:
{% highlight lisp %}
(define (fast-exp b n)
  (define (fast-exp-iter b n a)
    (if (= n 0)
        a
        (if (is-odd? n)
            (fast-exp-iter (square b) (/ (- n 1) 2) (* b a))
            (fast-exp-iter (square b) (/ n 2) a))))
  (fast-exp-iter b n 1))
{% endhighlight %}

# Relationship to binary number representation

Each positive integer $x$ has a binary positional representation
$d\_kd\_{k-1}d\_{k-2}\ldots d\_{2}d\_{1}d\_{0}$, where $d\_i$ denotes the $i$th
binary digit. The base 10 value of $x$ can be recovered from this binary representation using the following summation:
$$\sum\limits\_{i = 1}^k 2^i \cdot d\_i$$

With that in mind, let $c\_jc\_{j-1}c\_{j-2}\ldots c\_{2}c\_{1}c\_{0}$ be the binary representation of the exponent $n$ in $b^n$. Notice the following relationship:
$$b^n = (b^{2^j\cdot c\_j})(b^{2^{j-1}\cdot c\_{j-1}})(b^{2^{j-2}\cdot c\_{j-2}})\cdots (b^{2^3 \cdot c\_{3}})(b^{2^2 \cdot c\_{2}})(b^{2^1 \cdot c\_{1}})$$

Or, for a concrete example,

$$5^{23} = (5^{2^4 \cdot 1})(5^{2^3 \cdot 0})(5^{2^2 \cdot 1})(5^{2^1 \cdot 1})(5^{2^0 \cdot 1})$$

Although it is not immediately obvious, one way to interpret `fast-exp` is that
it works by looping over the binary digits of $n$ (from least significant to
most significant) and multiplies the running total $a$ 


actually operates by checking the binary digits of $n$ and adds 

Although, not immediately obvious, 

Let $b\_0$ be the initial value passed to `fast-exp`. Notice that if
`fast-exp-iter` takes $k$ iterations to calculate the final answer, then the values
passed into `fast-exp-iter`'s `b` pararemter, in order, are $b\_0^1, b\_0^2, b\_0^4,
b\_0^8,\ldots,b\_0^{2^k}$. In general, if $b\_i$ denotes the value of
`fast-exp-iter`'s  parameter `b` on the $i$th iteration, then $b\_i =
b\_0^{2^i}$.
