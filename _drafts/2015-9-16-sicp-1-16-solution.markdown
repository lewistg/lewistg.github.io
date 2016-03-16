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

Given the problem statement's hint, we can note that not only does $b^n = (b^2)^{n/2}$ but more generally
$$b^n = (b^2)^{n/2} = (b^4)^{n/4} = (b^8)^{n/8} = (b^{16})^{n/16} = \cdots =
(b^{2^i})^{n/2^i} = \cdots$$
The left to right pattern in this chain of equalities suggest the following naive solution:
{% highlight lisp %}
(define (naive-fast-exp b n)
  (if (= n 1)
      b
      (naive-fast-exp (square b) (quotient n 2))))
{% endhighlight %}
Of course, we can note some major shortcomings in this naive solution, the most
obvious being it assumes the exponent is always divisible by 2. Nevertheless,
it does do some of what we want; it iteratively uses successive squaring to
progress towards an answer. In other words, it has the right form but, being
naive, is missing some key details. Let us try to improve upon it.

It is worth understanding the mechanics of _how_ `naive-fast-exp`'s assumption
`n` is always divisible by 2 leads to incorrect answers. We can do this by
tracing the execution of an example problem. Let us trace `(naive-fast-exp 5 23)`.

this bad assumption gets `naive-fast-exp`
off track, so we can fix it.

When $n$ is some odd number $2m + 1$, then note $b^{2m+1} = bb^{2m}$. Thus, whenever the exponent is odd, we can
factor out a $b$ to make the power even again for the next iteration. Of
course, we do not want to lose these factored out factors, so we keep track of
them from iteration to iteration using the extra state variable $a$, which is
allowed by the problem statement. When the exponent value is reduced to 1, and
therefore the loop is ready to terminate, we multiply the final value $b$ by
the extra factors stored in $a$ to obtain our final answer. Let us clarify with
the actual code:

{% highlight lisp %}
(define (is-odd? x)
  (= (modulo x 2) 1))

(define (fast-exp b n)
  (define (fast-exp-iter b n a)
    (if (= n 1)
        (* a b)
        (fast-exp-iter (square b) (floor (/ n 2)) (if (is-odd? n) (* a b) a))))
  (if (= n 0) 1 (fast-exp-iter b n 1)))
{% endhighlight %}

# Relationship to binary number representation

Although not immediately obvious, this algorithm has a strong relationship to the exponent's binary representation.

{% highlight lisp %}
(define (is-odd? x)
  (= (modulo x 2) 1))

(define (display-and-identity x f) (display x) (newline) f)

(define (fast-exp b n)
  (define (fast-exp-iter b n a)
    (if (= n 1)
        (display-and-identity 1 (* a b))
        (fast-exp-iter(square b)(floor (/ n 2))
                      (if (is-odd? n)
                          (display-and-identity 1 (* a b))
                          (display-and-identity 0 a)))))
  (if (= n 0) 1 (fast-exp-iter b n 1)))
{% endhighlight %}

Let us use a concrete example to see why this is. The following table traces
the state variable values for the expression `(fast-exp-iter 5 23 1)`.

<table class="center" cellpadding="5" style="width: 350px; margin-top: 20px; margin-bottom: 20px;">
	<thead>
	<tr>
		<td>Execution trace</td><td>State variables</td>
	</tr>
	</thead>
	<tr>
		<td>
{% highlight lisp %}
	(fast-exp-iter 5 23 1)
{% endhighlight %}
		</td>
		<td>
{% highlight lisp %}
b = 5^1
n = 23
a = 1
{% endhighlight %}
		</td>
	</tr>
	<tr>
		<td>
{% highlight lisp %}
	(fast-exp-iter 25 11 5)
{% endhighlight %}
		</td>
		<td>
{% highlight lisp %}
b = 5^2
n = 11
a = 5^1
{% endhighlight %}
		</td>
	</tr>
	<tr>
		<td>
{% highlight lisp %}
	(fast-exp-iter 125 5 125)
{% endhighlight %}
		</td>
		<td>
{% highlight lisp %}
b = 5^4
n = 5
a = (5^1)(5^2)
{% endhighlight %}
		</td>
	</tr>
	<tr>
		<td>
{% highlight lisp %}
	(fast-exp-iter 625 5 15625)
{% endhighlight %}
		</td>
		<td>
{% highlight lisp %}
b = 5^8
n = 2
a = (5^1)(5^2)(5^4)
{% endhighlight %}
		</td>
	</tr>
	<tr>
		<td>
{% highlight lisp %}
	(fast-exp-iter 152587890625 2 78125)
{% endhighlight %}
		</td>
		<td>
{% highlight lisp %}
b = 5^16
n = 1
a = (5^1)(5^2)(5^4)
{% endhighlight %}
		</td>
	</tr>
	<tr>
		<td>
{% highlight lisp %}
	(* 152587890625 78125)
{% endhighlight %}
		</td>
		<td>
{% highlight lisp %}
b = 5^16
n = 1
a = (5^1)(5^2)(5^4)
{% endhighlight %}
		</td>
	</tr>
</table>

The final result, obtained by multiplying the factored out factors stored in
`a` by the final `b`, is equal to the product `(5^1)(5^2)(5^4)(5^16)`. Notice
how each factor's exponent is a power of 2.
